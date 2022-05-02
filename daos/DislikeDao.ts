/**
 * @file Implements DAO managing data storage of dislikes. 
 * Uses mongoose DislikeModel to integrate with MongoDB
 */
import Dislike from "../models/dislikes/Dislike";
import DislikeDaoI from "../interfaces/DislikeDaoI";
import DislikeModel from "../mongoose/dislikes/DislikeModel";

/**
 * @class DislikeDao implements a data access object that manages all dislikes data
 * @property {DislikeDao} dislikeDao is a private instance of dislikes DAO 
 * using the singleton pattern
 */
export default class DislikeDao implements DislikeDaoI {
    private static dislikeDao: DislikeDao | null = null;
    /**
     * Creates a single instance of the DislikeDao
     * @returns DislikeDao
     */
    public static getInstance = (): DislikeDao => {
        if (DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }
    private constructor() { }

    /**
     * Calls on DislikeModel to retrieve all users that disliked tuits
     * @param tid {string} disliked tiut 
     */
    findAllUsersThatDislikedTuit = async (tid: string): Promise<Dislike[]> =>
        DislikeModel.find({ tuit: tid }).populate("dislikedBy").exec();

    /**
     * Calls on DislikeModel to retrieve all disliked tuits for a user
     * @param uid {string} primary key of user who's tuits are to be retrieved
     */
    findAllTuitsDislikedByUser = (uid: string): Promise<Dislike[]> =>
        DislikeModel.find({ dislikedBy: uid }).populate({
            path: "tuit",
            populate: {
                path: "postedBy"
            }
        }).exec();

    /**
     * Calls on DislikeModel to create an new dislike for a user and tuit
     * @param uid {string} user primary key
     * @param tid {string} tiut to be disliked
     */
    userDislikesTuit = async (tid: string, uid: string): Promise<any> =>
        DislikeModel.create({ tuit: tid, dislikedBy: uid });

    /**
      * Calls on DislikeModel to delete an existing dislike for a user and tuit
      * @param uid {string} user primary key
      * @param tid {string} tiut to be disliked
      */
    userUnDislikesTuit = async (tid: string, uid: string): Promise<any> =>
        DislikeModel.deleteOne({ tuit: tid, dislikedBy: uid });

    /**
     * Calls on DislikeModel to retrieve a particular disliked tuit instance
     * @param uid {string} primary key of user who's tuits are to be retrieved
     * @param tid {string} disliked tiut to be found
     */
    findUserDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({ tuit: tid, dislikedBy: uid });

    /**
     * Calls on DislikeModel to count the number of disliked tuit instances
     * @param uid {string} primary key of user who's tuits are to be retrieved
     * @param tid {string} disliked tiut to be found
     */
    countDislikes = async (tid: string): Promise<any> => DislikeModel.count({ tuit: tid });
}