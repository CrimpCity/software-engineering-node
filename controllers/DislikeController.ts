/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import { Express, Request, Response } from "express";
import DislikeDao from "../daos/DislikeDao";
import TuitDao from "../daos/TuitDao";
import DislikeControllerI from "../interfaces/DislikeControllerI";


/**
 * @class DislikeController Implements RESTful Web service API for dislikes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/dislikes to retrieve all the tuits disliked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/dislikes to retrieve all users that disliked a tuit
 *     </li>
 *     <li>GET /api/users/:uid/dislikes/:tid to retrieve the tuit disliked by a user
 *     </li>
 *     <li>PUT /api/users/:uid/dislikes/:tid to record that a user dislikes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user no londer 
 *         dislikes a tuit</li>
 * </ul>
 * @property {DislikeDao} DislikeDao Singleton DAO implementing dislikes CRUD operations
 * @property {DislikeController} DislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class DislikeController implements DislikeControllerI {
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static dislikeController: DislikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): DislikeController => {
        if (DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
            app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
            app.get("/api/tuits/:tid/dislikes", DislikeController.dislikeController.findAllUsersThatDislikedTuit);
            app.get("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.findUserDislikesTuit);
            app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userDislikesTuit);
            app.delete("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userUnDislikesTuit);
        }
        return DislikeController.dislikeController;
    }

    private constructor() { }

    /**
     * Retrieves all tuits disliked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user who disliked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were disliked
     */
    findAllTuitsDislikedByUser = (req: Request, res: Response) =>
        DislikeController.dislikeDao.findAllTuitsDislikedByUser(req.params.uid)
            .then(dislikes => res.json(dislikes));

    /**
     * Retrieves all users that disliked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the disliked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatDislikedTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.findAllUsersThatDislikedTuit(req.params.tid)
            .then(dislikes => res.json(dislikes));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is disliking
     * the tuit and the tuit being disliked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were disliked
     */
    findUserDislikesTuit(req: Request, res: Response) {
        const uid = req.params.uid;
        const tid = req.params.tid;

        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ? profile._id : uid;

        return DislikeController.dislikeDao.findUserDislikesTuit(userId, tid)
            .then(dislike => res.json(dislike));
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is disliking the tuit
     * and the tuit being disliked
     * @param {Response} res Represents response to client, including status
     * on whether disliking the dislike was successful or not
     */
    userDislikesTuit = async (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ? profile._id : uid;

        // get tuit to be disliked or unDisliked
        let tuit = await DislikeController.tuitDao.findTuitById(tid);
        // if the tuit does not exit then send fail status
        if (!tuit) { res.sendStatus(404); }

        // check whether it is currently disliked or unDisliked
        const isDisliked = await DislikeController.dislikeDao.findUserDislikesTuit(userId, tid);

        // user only has 1 dislike
        if (!isDisliked) {
            // create the new dislike
            DislikeController.dislikeDao.userDislikesTuit(tid, userId);
            // get current number of dislikes
            const numDislikes = tuit.stats.dislikes;
            // increment number of dislikes
            tuit.stats.dislikes = numDislikes + 1;
        }
        if (isDisliked) {
            // delete a dislike
            DislikeController.dislikeDao.userUnDislikesTuit(tid, userId);
            // get current number of dislikes
            const numDislikes = tuit.stats.dislikes;
            // decrement number of dislikes but can't go negative
            tuit.stats.dislikes = Math.max(numDislikes - 1, 0);
        }
        // update the stats including the dislikes of the tuit and send success response
        await DislikeController.tuitDao.updateLikes(tid, tuit.stats);
        res.sendStatus(200);
    };

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is undisliking
     * the tuit and the tuit being undisliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the dislike was successful or not
     */
    userUnDislikesTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.userUnDislikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

}