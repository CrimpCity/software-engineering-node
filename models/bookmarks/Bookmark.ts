/**
 * @file Defines an interface for the bookmark model and schema
 */
import Tuit from "../tuits/Tuit";
import User from "../users/User";

/**
 * @interface Bookmark represents a Bookmark object which relate a specific user to a specific tuit.
 * @typedef Bookmark represents a bookmark relationship between a user and a tuit
 * @property {Tuit} tuit the tuit that the user wishes to bookmark
 * @property {User} bookmarkedBy the user who is bookmarking the tuit
 */
export default interface Bookmark {
    tuit: Tuit,
    bookmarkedBy: User
};