import FollowsDaoI from "../interfaces/FollowsDaoI";
import FollowsModel from "../mongoose/follows/FollowsModel";
import Follows from "../models/follows/Follows";

export default class FollowsDao implements FollowsDaoI {
    private static followsDao: FollowsDao | null = null;
    public static getInstance = (): FollowsDao => {
        if (FollowsDao.followsDao === null) {
            FollowsDao.followsDao = new FollowsDao();
        }
        return FollowsDao.followsDao;
    }
    private constructor() { }

    async findAllFollows(): Promise<Follows[]> {
        return await FollowsModel.find();
    }

    async findAllFollowersByUser(uid: string): Promise<Follows[]> {
        return await FollowsModel.find({ leader: uid }).exec();
    }

    async findAllFollowingByUser(uid: string): Promise<Follows[]> {
        return await FollowsModel.find({ follower: uid }).exec();
    }

    async userFollowsUser(uid: string, uidToFollow: string): Promise<any> {
        return await FollowsModel.create({ leader: uidToFollow, follower: uid });
    }

    async userUnfollowsUser(uid: string, uidToUnfollow: string): Promise<any> {
        return await FollowsModel.deleteOne({ leader: uidToUnfollow, follower: uid });
    }

    async deleteFollowsByID(fid: string): Promise<any> {
        return await FollowsModel.deleteOne({ _id: fid });
    }
}