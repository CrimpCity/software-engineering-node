/**
 * @file Controller RESTful Web service API for messages resource
 */
import { Express, Request, Response } from "express";
import MessageDao from "../daos/MessageDao";
import MessageControllerI from "../interfaces/MessageControllerI";
import Message from "../models/messages/Message";

/**
 * @class MessageController Implements RESTful Web service API for message resource.
 * Defines the following HTTP endpoints:
* <ul>
*     <li>
*         GET "/api/users/messages/inbox" to retrieve all of the messages in the collection
*     </li>
*     <li>
*         GET "/api/users/:uidSender/messages/outbox" to retrieve a list of messages a user has sent
*     </li>
*     <li>
*         GET "/api/users/:uidReceiver/messages/inbox" to retrieve a list of messages a user has received
*     </li>
*     <li>
*         POST "/api/users/:uidSender/messages/:uidReceiver" to record that a user sent another user a new message
*     </li>
*     <li>
*         DELETE "/api/users/messages/:mid" to remove a message from the collection in the database
*     </li>
* </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing messages CRUD operations
 * @property {MessageController} MessageController Singleton controller implementing RESTful Web service API
 */
export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service API
     * @returns MessageController
     */
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

    /**
     * Retrieves all messages from the database
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client
     */
    findAllMessages = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessages()
            .then(messages => res.json(messages));

    /**
     * Retrieves an array of messages the user has sent from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uidSender representing the user who sent messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesOutbox = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesOutbox(req.params.uidSender)
            .then(messages => res.json(messages));

    /**
     * Retrieves from the database an array of messages the user has received from other users
     * @param {Request} req Represents request from client, including the path
     * parameter uidReceiver representing the user who has received messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesInbox = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesInbox(req.params.uidReceiver)
            .then(messages => res.json(messages));

    /**
     * Records a new message between the sender and the receiving user
     * @param {Request} req Represents request from client, including the
     * path parameters uidSender and uidReceiver representing the user that is sending
     * the message and the user who is receiving the message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new message that is inserted in the database
     */
    sendMessage = (req: Request, res: Response) => {
        return MessageController.messageDao.sendMessage(
            req.params.uidSender, req.params.uidReceiver, req.body)
            .then((message: Message) => res.json(message));
    };

    /**
     * Removes a message from the database based on the message's ID
    * @param {Request} req Represents request from client, including the
    * path parameters mid representing the message object
    * @param {Response} res Represents response to client, including status
     * on whether deleting the message was successful or not
    */
    deleteMessageByID = (req: Request, res: Response) =>
        MessageController.messageDao.deleteMessageByID(req.params.mid)
            .then(status => res.send(status));
}