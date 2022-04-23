/**
 * @file Implements mongoose schema for Follows
 */
import mongoose from "mongoose";
import { Schema } from "mongoose";
import Follow from "../../models/follows/Follows";

/**
 * @typedef Follow Represents a user followed by other users
 * @property {ObjectId} user the current user
 * @property {ObjectId} followedBy the array of users who follow the user
 */
const FollowSchema = new mongoose.Schema<Follow>({
    user: { type: Schema.Types.ObjectId, ref: "FollowsModel" },
    followedBy: { type: Schema.Types.ObjectId, ref: "FollowsModel" }
}, { collection: "follows" });


export default FollowSchema;