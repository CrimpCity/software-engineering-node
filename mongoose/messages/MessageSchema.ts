/**
 * @file Implements mongoose schema for Messages
 */
import mongoose from "mongoose";
import { Schema } from "mongoose";
import Message from "../../models/messages/Message";

/**
 * @typedef Message represents the communication between two users
 * @property {User} sender the user who is sending the message
 * @property {User} receiver the user who is receiver the message
 * @property {String} message the body of the message
 * @property {Date} receipt the time stamp of when the message was sent
 */
const MessageSchema = new mongoose.Schema<Message>({
    sender: { type: Schema.Types.ObjectId, ref: "UserModel" },
    receiver: { type: Schema.Types.ObjectId, ref: "UserModel" },
    message: { type: String },
    receipt: { type: Date }
}, { collection: "messages" });


export default MessageSchema;