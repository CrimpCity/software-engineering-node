/**
 * @file Defines an interface for the follows model and schema
 */
import User from "../users/User";

/**
 * @interface Follow represents the relationship between the current user and another user who follows them.
 * @typedef Follow Represents a one to many relationship between the user and their followers
 * @property {user} user the current user
 * @property {user} followedBy the array of users who follow the user
 */
export default interface Follow {
    user: User,
    followedBy: User
};