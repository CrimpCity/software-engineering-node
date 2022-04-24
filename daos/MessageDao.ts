import MessageDaoI from "../interfaces/MessageDaoI";
import MessageModel from "../mongoose/messages/MessageModel";
import Message from "../models/messages/Message";

export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;
    public static getInstance = (): MessageDao => {
        if (MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }

    private constructor() { }

    async findAllMessages(): Promise<Message[]> {
        return await MessageModel.find();
    }

    async findAllMessagesOutbox(uidSender: string): Promise<Message[]> {
        return await MessageModel.find({ sender: uidSender }).exec();
    }

    async findAllMessagesInbox(uidReceiver: string): Promise<Message[]> {
        return await MessageModel.find({ receiver: uidReceiver }).exec();
    }

    async sendMessage(uidSender: string, uidReceiver: string, message: Message): Promise<Message> {
        return await MessageModel.create({ ...message, sender: uidSender, receiver: uidReceiver });
    }

    async deleteMessageByID(mid: string): Promise<any> {
        return await MessageModel.deleteOne({ _id: mid });
    }
}
