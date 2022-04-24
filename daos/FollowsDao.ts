/**
 * @file Implements DAO managing data storage of followers. 
 * Uses mongoose FollowsModel to integrate with MongoDB
 */
import FollowsDaoI from "../interfaces/FollowsDaoI";
import FollowsModel from "../mongoose/follows/FollowsModel";
import Follows from "../models/follows/Follows";

/**
 * @class FollowsDao Implements Data Access Object managing data storage of Follows
 * @property {FollowsDao} followsDao Private single instance of FollowsDao
 */
export default class FollowsDao implements FollowsDaoI {
    private static followsDao: FollowsDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns FollowsDao
     */
    public static getInstance = (): FollowsDao => {
        if (FollowsDao.followsDao === null) {
            FollowsDao.followsDao = new FollowsDao();
        }
        return FollowsDao.followsDao;
    }
    private constructor() { }

    /**
     * Uses FollowsModel to retrieve all follows documents from follows collection
     * @returns Promise To be notified when the follows are retrieved from database
     */
    async findAllFollows(): Promise<Follows[]> {
        return await FollowsModel.find();
    }

    /**
     * Uses FollowsModel to retrieve an array of Follows based on the given User's followers
     * @param  {string} uid User's primary key
     * @returns Promise Promise To be notified when the follows are retrieved from database
     */
    async findAllFollowersByUser(uid: string): Promise<Follows[]> {
        return await FollowsModel.find({ leader: uid }).exec();
    }
    /**
     * Uses FollowsModel to retrieve an array of Follows based who is following the User
     * @param  {string}  uid User's primary key
     * @returns Promise Promise To be notified when the follows are retrieved from database
     */
    async findAllFollowingByUser(uid: string): Promise<Follows[]> {
        return await FollowsModel.find({ follower: uid }).exec();
    }

    /**
     * Inserts Follows instance into the follows collection in the database 
     * @param {string} uid User's primary key
     * @param {string} uidToFollow The primary key of the User's who will be followed
     * @returns Promise To be notified when the Follows is inserted into the database
     */
    async userFollowsUser(uid: string, uidToFollow: string): Promise<any> {
        return await FollowsModel.create({ leader: uidToFollow, follower: uid });
    }

    /**
     * Deletes Follows instance from the follows collection in the database 
     * @param {string} uid User's primary key
     * @param {string} uidToUnfollow The primary key of the User's who will be unfollowed
     * @returns Promise To be notified when the Follows is deleted from the database
     */
    async userUnfollowsUser(uid: string, uidToUnfollow: string): Promise<any> {
        return await FollowsModel.deleteOne({ leader: uidToUnfollow, follower: uid });
    }

    /**
     * Deletes Follows instance from the follows collection in the database by ID
     * @param {string} fid Follows's primary key
     * @returns Promise To be notified when the Follows is deleted from the database
     */
    async deleteFollowsByID(fid: string): Promise<any> {
        return await FollowsModel.deleteOne({ _id: fid });
    }
}