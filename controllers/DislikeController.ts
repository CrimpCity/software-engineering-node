/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import { Express, Request, Response } from "express";
import DislikeDao from "../daos/DislikeDao";
import TuitDao from "../daos/TuitDao";
import DislikeControllerI from "../interfaces/DislikeControllerI";



export default class DislikeController implements DislikeControllerI {
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeController: DislikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): DislikeController => {
        if (DislikeController.likeController === null) {
            DislikeController.likeController = new DislikeController();
            app.get("/api/users/:uid/dislikes", DislikeController.likeController.findAllTuitsDislikedByUser);
            app.get("/api/tuits/:tid/dislikes", DislikeController.likeController.findAllUsersThatDislikedTuit);
            app.get("/api/users/:uid/dislikes/:tid", DislikeController.likeController.findUserDislikesTuit);
            app.put("/api/users/:uid/dislikes/:tid", DislikeController.likeController.userDislikesTuit);
            app.delete("/api/users/:uid/dislikes/:tid", DislikeController.likeController.userUnDislikesTuit);
        }
        return DislikeController.likeController;
    }

    private constructor() { }

    findAllTuitsDislikedByUser = (req: Request, res: Response) =>
        DislikeController.dislikeDao.findAllTuitsDislikedByUser(req.params.uid)
            .then(dislikes => res.json(dislikes));


    findAllUsersThatDislikedTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.findAllUsersThatDislikedTuit(req.params.tid)
            .then(dislikes => res.json(dislikes));

    findUserDislikesTuit(req: Request, res: Response) {
        const uid = req.params.uid;
        const tid = req.params.tid;

        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ? profile._id : uid;

        return DislikeController.dislikeDao.findUserDislikesTuit(userId, tid)
            .then(dislike => res.json(dislike));
    }

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

    userUnDislikesTuit = (req: Request, res: Response) =>
        DislikeController.dislikeDao.userUnDislikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

}