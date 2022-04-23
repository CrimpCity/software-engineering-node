import { Request, Response, Express } from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";


export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

    public static getInstance = (app: Express): BookmarkController => {
        if (BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.post('/users/:uid/bookmarks/:tid', BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete('/users/:uid/bookmarks/:tid', BookmarkController.bookmarkController.userUnbookmarksTuit);
            app.get('/users/:uid/bookmarks', BookmarkController.bookmarkController.findBookmarksByUser);
        }
        return BookmarkController.bookmarkController;
    }
    private constructor() { }


    async userBookmarksTuit(req: Request, res: Response) {
        return await BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
            .then(bookmark => res.json(bookmark));
    }

    async userUnbookmarksTuit(req: Request, res: Response) {
        return await BookmarkController.bookmarkDao.userUnbookmarksTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));
    }

    async findBookmarksByUser(req: Request, res: Response) {
        return await BookmarkController.bookmarkDao.findBookmarksByUser(req.params.uid)
            .then(bookmarks => res.json(bookmarks));
    }
}