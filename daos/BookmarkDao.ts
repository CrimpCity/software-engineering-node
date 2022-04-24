/**
 * @file Implements DAO managing data storage of bookmarks. 
 * Uses mongoose UserModel to integrate with MongoDB
 */
import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage of Bookmarks
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns UserDao
     */
    public static getInstance = (): BookmarkDao => {
        if (BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() { }

    /**
     * Uses BookmarkModel to retrieve all bookmarks documents from bookmarks collection
     * @returns Promise To be notified when the bookmarks are retrieved from database
     */
    async findAllBookmarks(): Promise<Bookmark[]> {
        return await BookmarkModel.find();
    }

    /**
     * Uses BookmarkModel to retrieve an array of Bookmarks based on the given Tuit
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when bookmarks are retrieved from the database
     */
    async findAllUsersThatBookmarkedTuit(tid: string): Promise<Bookmark[]> {
        return await BookmarkModel
            .find({ tuit: tid })
            .populate("bookmarkedBy")
            .exec();
    }

    /**
     * Uses BookmarkModel to retrieve an array of Bookmarks based on the given User
     * @param {string} uid User's primary key
     * @returns Promise To be notified when bookmarks are retrieved from the database
     */
    async findAllTuitsBookmarkedByUser(uid: string): Promise<Bookmark[]> {
        return await BookmarkModel
            .find({ bookmarkedBy: uid })
            .populate("tuit")
            .exec();
    }

    /**
     * Inserts Bookmark instance into the bookmarks collection in the database 
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when the Bookmark is inserted into the database
     */
    async userBookmarksTuit(uid: string, tid: string): Promise<any> {
        return await BookmarkModel.create({ tuit: tid, bookmarkedBy: uid });
    }

    /**
     * Deletes Bookmark instance from the bookmarks collection in the database 
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when the Bookmark is deleted into the database
     */
    async userUnBookmarkTuit(uid: string, tid: string): Promise<any> {
        return await BookmarkModel.deleteOne({ tuit: tid, bookmarkedBy: uid });
    }

    /**
     * Deletes Bookmark instance from the bookmarks collection in the database by ID
     * @param {string} bid Bookmark's primary key
     * @returns Promise To be notified when the Bookmark is deleted into the database
     */
    async deleteBookmarkByID(bid: string): Promise<any> {
        return await BookmarkModel.deleteOne({ _id: bid });
    }
}