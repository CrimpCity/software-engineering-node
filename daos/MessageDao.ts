/**
 * @file Implements DAO managing data storage of messages. 
 * Uses mongoose MessageModel to integrate with MongoDB
 */
import MessageDaoI from "../interfaces/MessageDaoI";
import MessageModel from "../mongoose/messages/MessageModel";
import Message from "../models/messages/Message";

/**
 * @class MessageDao Implements Data Access Object managing data storage of Messages
 * @property {MessageDao} messageDao Private single instance of MessageDao
 */
export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns MessageDao
     */
    public static getInstance = (): MessageDao => {
        if (MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }

    private constructor() { }

    /**
     * Uses MessageModel to retrieve all messages documents from messages collection
     * @returns Promise To be notified when the messages are retrieved from database
     */
    async findAllMessages(): Promise<Message[]> {
        return await MessageModel.find();
    }

    /**
     * Uses MessageModel to retrieve an array of Messages based on the given User
     * @param {string} uidSender Message sender's primary key
     * @returns Promise To be notified when messages are retrieved from the database
     */
    async findAllMessagesOutbox(uidSender: string): Promise<Message[]> {
        return await MessageModel.find({ sender: uidSender }).exec();
    }

    /**
     * Uses MessageModel to retrieve an array of Messages based on the given User
     * @param {string} uidReceiver Message receiver's primary key
     * @returns Promise To be notified when messages are retrieved from the database
     */
    async findAllMessagesInbox(uidReceiver: string): Promise<Message[]> {
        return await MessageModel.find({ receiver: uidReceiver }).exec();
    }

    /**
     * Inserts Message instance into the messages collection in the database 
     * @param {string} uidSender Message sender's primary key
     * @param {string} uidReceiver Message receiver's primary key
     * @param {Message} message Message to be sent
     * @returns Promise To be notified when the Message is inserted into the database
     */
    async sendMessage(uidSender: string, uidReceiver: string, message: Message): Promise<Message> {
        return await MessageModel.create({ ...message, sender: uidSender, receiver: uidReceiver });
    }

    /**
     * Deletes Message instance from the messages collection in the database by ID
     * @param {string} mid Message's primary key
     * @returns Promise To be notified when the Message is deleted from the database
     */
    async deleteMessageByID(mid: string): Promise<any> {
        return await MessageModel.deleteOne({ _id: mid });
    }
}
