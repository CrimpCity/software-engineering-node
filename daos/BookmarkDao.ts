import Bookmark from "../models/bookmarks/Bookmark";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import BookmarkDaoI from "../interfaces/BookmarkDaoI";


export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;

    public static getInstance = (): BookmarkDao => {
        if (BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {
    };

    userBookmarksTuit = (uid: string, tid: string): Promise<any> =>
        BookmarkModel.create({ tuit: tid, bookmarkedBy: uid });

    userUnbookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.deleteOne({ tuit: tid, bookmarkedBy: uid });


    findBookmarksByUser = (uid: string): Promise<Bookmark[]> =>
        BookmarkModel.find({ bookmarkedBy: uid }).populate("tuit").exec();
}