import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmark";


export default class BookmarkDao implements BookmarkDaoI {
    private static likeDao: BookmarkDao | null = null;
    public static getInstance = (): BookmarkDao => {
        if (BookmarkDao.likeDao === null) {
            BookmarkDao.likeDao = new BookmarkDao();
        }
        return BookmarkDao.likeDao;
    }
    private constructor() { }

    async findAllBookmarks(): Promise<Bookmark[]> {
        return await BookmarkModel.find();
    }

    async findAllUsersThatBookmarkedTuit(tid: string): Promise<Bookmark[]> {
        return await BookmarkModel
            .find({ tuit: tid })
            .populate("bookmarkedBy")
            .exec();
    }

    async findAllTuitsBookmarkedByUser(uid: string): Promise<Bookmark[]> {
        return await BookmarkModel
            .find({ bookmarkedBy: uid })
            .populate("tuit")
            .exec();
    }

    async userBookmarksTuit(uid: string, tid: string): Promise<any> {
        return await BookmarkModel.create({ tuit: tid, bookmarkedBy: uid });
    }

    async userUnBookmarkTuit(uid: string, tid: string): Promise<any> {
        return await BookmarkModel.deleteOne({ tuit: tid, bookmarkedBy: uid });
    }

    async deleteBookmarkByID(bid: string): Promise<any> {
        return await BookmarkModel.deleteOne({ _id: bid });
    }
}