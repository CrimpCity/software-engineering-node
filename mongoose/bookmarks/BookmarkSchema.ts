/**
 * @file Implements mongoose schema in the Bookmarks collection
 */
import mongoose, { Schema } from "mongoose";
import Bookmark from "../../models/bookmarks/Bookmark";

/**
 * @property {Tuit} tuit the tuit that the user wishes to bookmark
 * @property {User} bookmarkedBy the user who is bookmarking the tuit
 */
const BookmarkSchema = new mongoose.Schema<Bookmark>({
    tuit: { type: Schema.Types.ObjectId, ref: "TuitModel" },
    bookmarkedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
}, { collection: "bookmarks" });

export default BookmarkSchema;