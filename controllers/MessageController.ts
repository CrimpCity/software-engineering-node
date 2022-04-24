import { Express, Request, Response } from "express";
import MessageDao from "../daos/MessageDao";
import MessageControllerI from "../interfaces/MessageControllerI";
import Message from "../models/messages/Message";


export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;

    public static getInstance = (app: Express): MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.get("/api/users/messages/inbox", MessageController.messageController.findAllMessages);
            app.get("/api/users/:uidSender/messages/outbox", MessageController.messageController.findAllMessagesOutbox);
            app.get("/api/users/:uidReceiver/messages/inbox", MessageController.messageController.findAllMessagesInbox);
            app.post("/api/users/:uidSender/messages/:uidReceiver", MessageController.messageController.sendMessage);
            app.delete("/api/users/messages/:mid", MessageController.messageController.deleteMessageByID);
        }
        return MessageController.messageController;
    }

    private constructor() { }

    findAllMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessages()
            .then(messages => res.json(messages));

    findAllMessagesOutbox = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesOutbox(req.params.uidSender)
            .then(messages => res.json(messages));

    findAllMessagesInbox = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesInbox(req.params.uidReceiver)
            .then(messages => res.json(messages));

    sendMessage = (req: Request, res: Response) => {
        return MessageController.messageDao.sendMessage(
            req.params.uidSender, req.params.uidReceiver, req.body)
            .then((message: Message) => res.json(message));
    };

    deleteMessageByID = (req: Request, res: Response) =>
        MessageController.messageDao.deleteMessageByID(req.params.mid)
            .then(status => res.send(status));
}