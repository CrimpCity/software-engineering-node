/**
 * @file Declares API for BookmarkController related data access object methods
 */
import { Request, Response } from "express";


export default interface BookmarkControllerI {
    findAllBookmarks(req: Request, res: Response): void;
    findAllUsersThatBookmarkedTuit(req: Request, res: Response): void;
    findAllTuitsBookmarkedByUser(req: Request, res: Response): void;
    userUnBookmarkTuit(req: Request, res: Response): void;
    userBookmarksTuit(req: Request, res: Response): void;
    deleteBookmarkByID(req: Request, res: Response): void;
};