/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import TuitModel from "../mongoose/tuits/TuitModel";
import Tuit from "../models/tuits/Tuit";
import TuitDaoI from "../interfaces/TuitDaoI";

/**
 * @class UserDao Implements Data Access Object managing data storage
 * of Users
 * @property {UserDao} userDao Private single instance of UserDao
 */
export default class TuitDao implements TuitDaoI {
    private static tuitDao: TuitDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns TuitDao
     */
    public static getInstance = (): TuitDao => {
        if (TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }
    private constructor() { }

    /**
     * Uses TuitModel to retrieve all tuits documents from tuits collection
     * @returns Promise To be notified when the tuits are retrieved from database
     */
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find()
            .populate("postedBy")
            .exec();

    /**
     * Uses TuitModel to retrieve an array of Tuits based on the given User
     * @param {string} uid User's primary key
     * @returns Promise To be notified when tuits are retrieved from the database
     */
    findAllTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({ postedBy: uid })
            .populate("postedBy")
            .exec();

    /**
     * Uses TuitModel to retrieve an array of Tuits based on the given ID
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when tuits are retrieved from the database
     */
    findTuitById = async (tid: string): Promise<any> =>
        TuitModel.findById(tid)
            .populate("postedBy")
            .exec();

    /**
     * Inserts Tuit instance into the tuits collection in the database 
     * @param {string} uid User's primary key
     * @param {Tuit} tuit The Tuit object to be added to the collection
     * @returns Promise To be notified when the Tuit is inserted into the database
     */
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({ ...tuit, postedBy: uid });

    /**
     * Updates the Tuit instance in the tuits collection in the database 
     * @param {string} tid Tuit's primary key
     * @param {Tuit} tuit The Tuit object to be added to the collection
     * @returns Promise To be notified when the Tuit is updated in the database
     */
    updateTuit = async (tid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            { _id: tid },
            { $set: tuit });

    /**
     * Deletes Tuit instance from the tuits collection in the database by ID
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when the Tuit is deleted from the database
     */
    deleteTuit = async (tid: string): Promise<any> =>
        TuitModel.deleteOne({ _id: tid });
}