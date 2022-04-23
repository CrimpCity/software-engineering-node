import { Express, Request, Response } from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";


export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

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

    findAllBookmarks = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllBookmarks().then(bookmarks => res.json(bookmarks));

    findAllUsersThatBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersThatBookmarkedTuit(req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    findAllTuitsBookmarkedByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(req.params.uid)
            .then(bookmarks => res.json(bookmarks));


    userBookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
            .then(bookmarks => res.json(bookmarks));


    userUnBookmarkTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnBookmarkTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));


    deleteBookmarkByID = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.deleteBookmarkByID(req.params.bid)
            .then(status => res.send(status));
};