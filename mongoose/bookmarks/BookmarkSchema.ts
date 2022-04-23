/**
 * @file Implements mongoose schema for Bookmarks
 */
import mongoose from "mongoose";
import { Schema } from "mongoose";
import Bookmark from "../../models/bookmarks/Bookmark";

/**
 * @typedef Bookmark Represents a tuit bookmarked by a user
 * @property {ObjectId} tuit represents the tuit that is being bookmarked
 * @property {ObjectId} bookmarkedBy represents the user that is bookmarking the tuit
 */
const BookmarkSchema = new mongoose.Schema<Bookmark>({
    tuit: { type: Schema.Types.ObjectId, ref: "TuitModel" },
    bookmarkedBy: { type: Schema.Types.ObjectId, ref: "UserModel" }
}, { collection: "bookmarks" });


export default BookmarkSchema;