import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @file Declares API for Bookmarks related data access object methods
 */
export default interface BookmarkDaoI {
    findAllBookmarks(): Promise<Bookmark[]>;
    findAllUsersThatBookmarkedTuit(tid: string): Promise<Bookmark[]>;
    findAllTuitsBookmarkedByUser(uid: string): Promise<Bookmark[]>;
    userUnBookmarkTuit(uid: string, tid: string): Promise<any>;
    userBookmarksTuit(uid: string, tid: string): Promise<Bookmark>;
    deleteBookmarkByID(bid: string): Promise<any>;
};