import Message from "../models/messages/Message";

/**
 * @file Declares API for Message related data access object methods
 */
export default interface MessageDaoI {
    findAllMessages(): Promise<Message[]>;
    // findAllMessagesOutbox(uidSender: string): Promise<Message[]>;
    // findAllMessagesInbox(uidReceiver: string): Promise<Message[]>;
    // sendMessage(uidSender: string, uidReceiver: string, message: Message): Promise<Message>;
    // deleteMessageByID(mid: string): Promise<any>;
}
