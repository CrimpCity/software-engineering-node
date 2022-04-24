/**
 * @file Implements mongoose schema for Follows
 */
import mongoose from "mongoose";
import { Schema } from "mongoose";
import Follow from "../../models/follows/Follows";

/**
 * @typedef Follow Represents a user followed by other users
 * @property {ObjectId} leader the user who is being followed
 * @property {ObjectId} follower the user who following
 */
const FollowSchema = new mongoose.Schema<Follow>({
    leader: { type: Schema.Types.ObjectId, ref: "FollowsModel" },
    follower: { type: Schema.Types.ObjectId, ref: "FollowsModel" }
}, { collection: "follows" });


export default FollowSchema;