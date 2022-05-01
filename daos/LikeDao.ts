import Like from "../models/likes/Like";
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";


export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }
    private constructor() { }

    findAllUsersThatLikedTuit = (tid: string): Promise<Like[]> =>
        LikeModel.find({ tuit: tid }).populate("likedBy").exec();


    findAllTuitsLikedByUser = (uid: string): Promise<Like[]> =>
        LikeModel.find({ likedBy: uid }).populate({
            path: "tuit",
            populate: {
                path: "postedBy"
            }
        }).exec();


    userLikesTuit = (tid: string, uid: string): Promise<any> =>
        LikeModel.create({ tuit: tid, likedBy: uid });

    userUnlikesTuit = async (tid: string, uid: string): Promise<any> =>
        LikeModel.deleteOne({ tuit: tid, likedBy: uid });

    findUserLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({ tuit: tid, likedBy: uid });

    countLikes = async (tid: string): Promise<any> => LikeModel.count({ tuit: tid });
}