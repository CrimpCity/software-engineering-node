/**
 * @file Defines an interface for the messages model and schema
 */
import User from "../users/User";

/**
 * @interface Message represents the communication between two users.
 * @typedef Message Represents an object that relates a message sender, receiver and message body
 * @property {User} sender the user who is sending the message
 * @property {User} receiver the user who is receiver the message
 * @property {String} message the body of the message
 * @property {Date} receipt the time stamp of when the message was sent
 */
export default interface Message {
    sender: User,
    receiver: User,
    message: String,
    receipt: Date
}