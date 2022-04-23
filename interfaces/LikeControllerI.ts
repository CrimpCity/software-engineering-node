import { Request, Response } from "express";

export default interface LikeControllerI {
    findAllLikes(req: Request, res: Response): void;
    findAllUsersThatLikedTuit(req: Request, res: Response): void;
    findAllTuitsLikedByUser(req: Request, res: Response): void;
    userLikesTuit(req: Request, res: Response): void;
    userUnlikesTuit(req: Request, res: Response): void;
    deleteLikeByID(req: Request, res: Response): void;
};