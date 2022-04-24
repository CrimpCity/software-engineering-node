/**
 * @file Implements mongoose schema in the Follows collection
 */
import mongoose, { Schema } from "mongoose";
import Follow from "../../models/follows/Follows";

/**
 * @property {User} leader the user who is being followed
 * @property {User} follower the user who following
 */
const FollowSchema = new mongoose.Schema<Follow>({
    leader: { type: Schema.Types.ObjectId, ref: "FollowsModel" },
    follower: { type: Schema.Types.ObjectId, ref: "FollowsModel" }
}, { collection: "follows" });

export default FollowSchema;