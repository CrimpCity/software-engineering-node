/**
 * @file Implements DAO managing data storage of likes. 
 * Uses mongoose LikeModel to integrate with MongoDB
 */
import Like from "../models/likes/Like";
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";

/**
 * @class LikeDao implements a data access object that manages all likes data
 * @property {LikeDao} likeDao is a private instance of likes DAO 
 * using the singleton pattern
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    /**
     * Creates a single instance of the LikeDao
     * @returns LikeDao
     */
    public static getInstance = (): LikeDao => {
        if (LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }
    private constructor() { }

    /**
     * Calls on LikeModel to retrieve all users that liked tuits
     * @param tid {string} liked tiut 
     */
    findAllUsersThatLikedTuit = (tid: string): Promise<Like[]> =>
        LikeModel.find({ tuit: tid }).populate("likedBy").exec();

    /**
     * Calls on LikeModel to retrieve all liked tuits for a user
     * @param uid {string} primary key of user who's tuits are to be retrieved
     */
    findAllTuitsLikedByUser = (uid: string): Promise<Like[]> =>
        LikeModel.find({ likedBy: uid }).populate({
            path: "tuit",
            populate: {
                path: "postedBy"
            }
        }).exec();

    /**
     * Calls on LikeModel to create an new like for a user and tuit
     * @param uid {string} user primary key
     * @param tid {string} tiut to be liked
     */
    userLikesTuit = (tid: string, uid: string): Promise<any> =>
        LikeModel.create({ tuit: tid, likedBy: uid });

    /**
      * Calls on LikeModel to delete an existing like for a user and tuit
      * @param uid {string} user primary key
      * @param tid {string} tiut to be liked
      */
    userUnlikesTuit = async (tid: string, uid: string): Promise<any> =>
        LikeModel.deleteOne({ tuit: tid, likedBy: uid });

    /**
     * Calls on LikeModel to retrieve a particular liked tuit instance
     * @param uid {string} primary key of user who's tuits are to be retrieved
     * @param tid {string} liked tiut to be found
     */
    findUserLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.findOne({ tuit: tid, likedBy: uid });

    /**
     * Calls on LikeModel to count the number of liked tuit instances
     * @param uid {string} primary key of user who's tuits are to be retrieved
     * @param tid {string} liked tiut to be found
     */
    countLikes = async (tid: string): Promise<any> => LikeModel.count({ tuit: tid });
}