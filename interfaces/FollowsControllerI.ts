/**
 * @file Declares API for FollowsController related data access object methods
 */
import { Request, Response } from "express";


export default interface FollowsControllerI {
    findAllFollows(req: Request, res: Response): void;
    findAllFollowersByUser(req: Request, res: Response): void;
    findAllFollowingByUser(req: Request, res: Response): void;
    userFollowsUser(req: Request, res: Response): void;
    userUnfollowsUser(req: Request, res: Response): void;
    deleteFollowsByID(req: Request, res: Response): void;
}