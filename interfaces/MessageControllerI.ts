import { Request, Response } from "express";

export default interface MessageControllerI {
    findAllMessages(req: Request, res: Response): void;
    findAllMessagesOutbox(req: Request, res: Response): void;
    findAllMessagesInbox(req: Request, res: Response): void;
    sendMessage(req: Request, res: Response): void;
    deleteMessageByID(req: Request, res: Response): void;
}