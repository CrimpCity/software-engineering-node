/**
 * @file Defines an interface for the follows model and schema
 */
import User from "../users/User";

/**
 * @interface Follow represents the relationship between the current user and another user who follows them.
 * @typedef Follow represents a one to many relationship between the user and their followers
 * @property {User} leader the user who is being followed
 * @property {User} follower the user who following
 */
export default interface Follow {
    leader: User,
    follower: User
};