/**
 * @file Controller RESTful Web service API for follows resource
 */
import { Request, Response, Express } from "express";
import FollowsDao from "../daos/FollowsDao";
import FollowsControllerI from "../interfaces/FollowsControllerI";

/**
 * @class BookmarkController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
* <ul>
*     <li>
*         GET "/api/follows" to retrieve all of the follows in the collection
*     </li>
*     <li>
*         GET "/api/users/:uid/followers" to retrieve all users that the given user follows
*     </li>
*     <li>
*         GET "/api/users/:uid/following" to retrieve all other users who follow the given user
*     </li>
*     <li>
*         POST "/api/users/:uid/follows/:uidToFollow" to record that a user followers another user
*     </li>
*     <li>
*         DELETE "/api/users/:uid/follows/:uidToUnfollow" to remove a follower from a user's followers list
*     </li>
*     <li>
*         DELETE "/api/users/:fid/follows" to remove a follow from the collection in the database
*     </li>
* </ul>
 * @property {FollowsDao} followsDao Singleton DAO implementing follows CRUD operations
 * @property {FollowsController} FollowsController Singleton controller implementing RESTful Web service API
 */
export default class FollowsController implements FollowsControllerI {
    private static followsController: FollowsController | null = null;
    private static followsDao: FollowsDao = FollowsDao.getInstance();
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns FollowsController
     */
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

    /**
     * Retrieves all follows from the database
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client
     */
    findAllFollows = (req: Request, res: Response) =>
        FollowsController.followsDao.findAllFollows().then(follows => res.json(follows));

    /**
     * Retrieves all users that follow the given user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user who has followers to be retrieved
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllFollowersByUser = (req: Request, res: Response) =>
        FollowsController.followsDao.findAllFollowersByUser(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * Retrieves the given user's following from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user who has a following
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllFollowingByUser = (req: Request, res: Response) =>
        FollowsController.followsDao.findAllFollowingByUser(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * Records a new follow relationship between the user and the user to be followed
     * @param {Request} req Represents request from client, including the
     * path parameters uid and uidToFollow representing the user that is following
     * the other user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new follow that was inserted in the database
     */
    userFollowsUser = (req: Request, res: Response) =>
        FollowsController.followsDao.userFollowsUser(req.params.uid, req.params.uidToFollow)
            .then(follows => res.json(follows));

    /**
     * Removes a follow of the given user and the user to be unfollowed 
     * @param {Request} req Represents request from client, including the
     * path parameters uid and uidToUnfollow representing the user that is unfollowing
     * the other user
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    userUnfollowsUser = (req: Request, res: Response) =>
        FollowsController.followsDao.userUnfollowsUser(req.params.uid, req.params.uidToUnfollow)
            .then(follows => res.json(follows));

    /**
     * Removes a follow from the database based on the follow's ID
    * @param {Request} req Represents request from client, including the
    * path parameters fid representing the follow object
    * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
    */
    deleteFollowsByID = (req: Request, res: Response) =>
        FollowsController.followsDao.deleteFollowsByID(req.params.fid)
            .then(status => res.send(status));
}
