/**
 * @file Implements DAO managing data storage of likes. 
 * Uses mongoose LikeModel to integrate with MongoDB
 */
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/likes/Like";

/**
 * @class LikeDao Implements Data Access Object managing data storage of Likes
 * @property {LikeDao} likeDao Private single instance of LikeDao
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    /**
     * Creates singleton DAO instance
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
     * Uses LikeModel to retrieve all like documents from likes collection
     * @returns Promise To be notified when the likes are retrieved from database
     */
    findAllLikes = async (): Promise<Like[]> => LikeModel.find();

    /**
     * Uses LikeModel to retrieve an array of Likes based on the given Tuit
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when likes are retrieved from the database
     */
    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({ tuit: tid })
            .populate("likedBy")
            .exec();

    /**
     * Uses LikeModel to retrieve an array of Likes based on the given User
     * @param {string} uid User's primary key
     * @returns Promise To be notified when likes are retrieved from the database
     */
    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({ likedBy: uid })
            .populate("tuit")
            .exec();

    /**
     * Inserts Like instance into the likes collection in the database 
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when the Like is inserted into the database
     */
    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({ tuit: tid, likedBy: uid });

    /**
     * Deletes Like instance from the likes collection in the database 
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when the Like is deleted from the database
     */
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({ tuit: tid, likedBy: uid });

    /**
     * Deletes Like instance from the likes collection in the database by ID
     * @param {string} lid Like's primary key
     * @returns Promise To be notified when the Like is deleted from the database
     */
    deleteLikeByID = async (lid: string): Promise<any> =>
        LikeModel.deleteOne({ _id: lid });
}