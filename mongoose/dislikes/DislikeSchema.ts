import mongoose, { Schema } from "mongoose";
import Dislike from "../../models/dislikes/Dislike";


const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: { type: Schema.Types.ObjectId, ref: "TuitModel" },
    // dislikedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
    // This needs to be a string because of "me"
    dislikedBy: { type: String },
}, { collection: "dislikes" });
export default DislikeSchema;