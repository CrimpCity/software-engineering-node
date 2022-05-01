/**
 * @file Controller RESTful Web service API for likes resource
 */
import { Express, Request, Response } from "express";
import LikeDao from "../daos/LikeDao";
import TuitDao from "../daos/TuitDao";
import LikeControllerI from "../interfaces/LikeControllerI";

/**
 * @class LikeController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>GET /api/users/:uid/likes/:tid to retrieve the tuit liked by a user
 *     </li>
 *     <li>PUT /api/users/:uid/likes/:tid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user
 *     no londer likes a tuit</li>
 * </ul>
 * @property {LikeDao} likeDao Singleton DAO implementing likes CRUD operations
 * @property {LikeController} LikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class LikeController implements LikeControllerI {
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeController: LikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): LikeController => {
        if (LikeController.likeController === null) {
            LikeController.likeController = new LikeController();
            app.get("/api/users/:uid/likes", LikeController.likeController.findAllTuitsLikedByUser);
            app.get("/api/tuits/:tid/likes", LikeController.likeController.findAllUsersThatLikedTuit);
            app.get("/api/users/:uid/likes/:tid", LikeController.likeController.findUserLikesTuit);
            app.put("/api/users/:uid/likes/:tid", LikeController.likeController.userLikesTuit);
            app.delete("/api/users/:uid/likes/:tid", LikeController.likeController.userUnlikesTuit);
        }
        return LikeController.likeController;
    }

    private constructor() { }

    /**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
    findAllTuitsLikedByUser = (req: Request, res: Response) =>
        LikeController.likeDao.findAllTuitsLikedByUser(req.params.uid)
            .then(likes => res.json(likes));


    /**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
     findAllUsersThatLikedTuit = (req: Request, res: Response) =>
     LikeController.likeDao.findAllUsersThatLikedTuit(req.params.tid)
         .then(likes => res.json(likes));


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking
     * the tuit and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     */
     findUserLikesTuit(req: Request, res: Response) {
        const uid = req.params.uid;
        const tid = req.params.tid;

        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ? profile._id : uid;

        return LikeController.likeDao.findUserLikesTuit(userId, tid)
            .then(like => res.json(like));
    }


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including status
     * on whether liking the like was successful or not
     */
    userLikesTuit = async (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ? profile._id : uid;

        // get tuit to be liked or unliked
        let tuit = await LikeController.tuitDao.findTuitById(tid);
        // if the tuit does not exit then send fail status
        if (!tuit) { res.sendStatus(404); }

        // check whether it is currently liked or unliked
        const isLiked = await LikeController.likeDao.findUserLikesTuit(userId, tid);

        // user only has 1 like
        if (!isLiked) {
            // create the new like
            LikeController.likeDao.userLikesTuit(tid, userId);
            // get current number of likes
            const numLikes = tuit.stats.likes;
            // increment number of likes
            tuit.stats.likes = numLikes + 1;
        }
        if (isLiked) {
            // delete a like
            LikeController.likeDao.userUnlikesTuit(tid, userId);
            // get current number of likes
            const numLikes = tuit.stats.likes;
            // decrement number of likes but can't go negative
            tuit.stats.likes = Math.max(numLikes - 1, 0);
        }
        // update the stats including the likes of the tuit and send success response
        await LikeController.tuitDao.updateLikes(tid, tuit.stats);
        res.sendStatus(200);
    };


    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unliking
     * the tuit and the tuit being unliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the like was successful or not
     */
    userUnlikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));
};