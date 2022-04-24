/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
import { Express, Request, Response } from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>
 *         GET "/api/bookmarks" to retrieve all of the bookmarks in the collection
 *     </li>
 *     <li>
 *         GET "/api/tuits/:tid/bookmarks" to retrieve all users that bookmarked the given tuit
 *     </li>
 *     <li>
 *         GET "/api/users/:uid/bookmarks" to retrieve all tuits that were bookmarked the given user
 *     </li>
 *     <li>
 *         POST "/api/users/:uid/bookmarks/:tid" to record that a user bookmarked a tuit
 *     </li>
 *     <li>
 *         DELETE "/api/users/:uid/bookmarks/:tid" to remove a tuit from a user's bookmarks
 *     </li>
 *     <li>
 *         DELETE "/api/bookmarks/:bid" to remove a bookmark from the collection in the database
 *     </li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {BookmarkController} BookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns BookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if (BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.get("/api/bookmarks", BookmarkController.bookmarkController.findAllBookmarks);
            app.get("/api/tuits/:tid/bookmarks", BookmarkController.bookmarkController.findAllUsersThatBookmarkedTuit);
            app.get("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.findAllTuitsBookmarkedByUser);
            app.post("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userUnBookmarkTuit);
            app.delete("/api/bookmarks/:bid", BookmarkController.bookmarkController.deleteBookmarkByID);
        }
        return BookmarkController.bookmarkController;
    }

    private constructor() { }

    /**
     * Retrieves all bookmarks from the database
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client
     */
    findAllBookmarks = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllBookmarks().then(bookmarks => res.json(bookmarks));

    /**
     * Retrieves all users that bookmarked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllUsersThatBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersThatBookmarkedTuit(req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Retrieves all bookmarked tuits by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user who bookmarked the tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     */
    findAllTuitsBookmarkedByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(req.params.uid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Records a new bookmark of the given tuit for the given user 
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmark that was inserted in the database
     */
    userBookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * Removes a bookmark of the given tuit for the given user 
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unbookmarking the tuit
     * and the tuit being unbookmarked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
     */
    userUnBookmarkTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnBookmarkTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    /**
     * Removes a bookmark from the database based on the bookmark's ID
    * @param {Request} req Represents request from client, including the
    * path parameters bid representing the bookmark object
    * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
    */
    deleteBookmarkByID = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.deleteBookmarkByID(req.params.bid)
            .then(status => res.send(status));
};