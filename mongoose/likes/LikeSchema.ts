import mongoose, { Schema } from "mongoose";
import Like from "../../models/likes/Like";


const LikeSchema = new mongoose.Schema<Like>({
    tuit: { type: Schema.Types.ObjectId, ref: "TuitModel" },
    // likedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
    // This needs to be a string because of "me"
    likedBy: { type: String },
}, { collection: "likes" });
export default LikeSchema;