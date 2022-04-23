import { Request, Response } from "express";


export default interface BookmarkControllerI {
    userBookmarksTuit(req: Request, res: Response): void;
    userUnbookmarksTuit(req: Request, res: Response): void;
    findBookmarksByUser(req: Request, res: Response): void;
}