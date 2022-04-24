import { Request, Response, Express } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import FollowsDao from "../daos/FollowsDao";

import FollowsControllerI from "../interfaces/FollowsControllerI";


export default class FollowsController implements FollowsControllerI {
    private static followsController: FollowsController | null = null;
    private static followsDao: FollowsDao = FollowsDao.getInstance();

    public static getInstance = (app: Express): FollowsController => {
        if (FollowsController.followsController == null) {
            FollowsController.followsController = new FollowsController();
            app.get('/api/follows', FollowsController.followsController.findAllFollows);
            app.get('/api/users/:uid/followers', FollowsController.followsController.findAllFollowersByUser);
            app.get('/api/users/:uid/following', FollowsController.followsController.findAllFollowingByUser);
            app.post('/api/users/:uid/follows/:uidToFollow', FollowsController.followsController.userFollowsUser);
            app.delete('/api/users/:uid/follows/:uidToUnfollow', FollowsController.followsController.userUnfollowsUser);
            app.delete('/api/users/:fid/follows', FollowsController.followsController.deleteFollowsByID);
        }
        return FollowsController.followsController;
    }
    private constructor() { }

    findAllFollows = (req: Request, res: Response) =>
        FollowsController.followsDao.findAllFollows().then(follows => res.json(follows));

    findAllFollowersByUser = (req: Request, res: Response) =>
        FollowsController.followsDao.findAllFollowersByUser(req.params.uid).then(follows => res.json(follows));

    findAllFollowingByUser = (req: Request, res: Response) =>
        FollowsController.followsDao.findAllFollowingByUser(req.params.uid).then(follows => res.json(follows));

    userFollowsUser = (req: Request, res: Response) =>
        FollowsController.followsDao.userFollowsUser(req.params.uid, req.params.uidToFollow)
            .then(follows => res.json(follows));

    userUnfollowsUser = (req: Request, res: Response) =>
        FollowsController.followsDao.userUnfollowsUser(req.params.uid, req.params.uidToUnfollow)
            .then(follows => res.json(follows));


    deleteFollowsByID = (req: Request, res: Response) =>
        FollowsController.followsDao.deleteFollowsByID(req.params.fid)
            .then(status => res.send(status));
}
