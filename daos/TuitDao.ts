import Tuit from '../models/tuits/Tuit';
import TuitModel from '../mongoose/tuits/TuitModel';
import TuitDaoI from '../interfaces/TuitDaoI';


export default class TuitDao implements TuitDaoI {
    private static tuitDao: TuitDao | null = null;
    public static getInstance = (): TuitDao => {
        if (TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }
    private constructor() { }


    async findAllTuits(): Promise<Tuit[]> {
        return TuitModel.find().populate("postedBy");
    }

    async findAllTuitsByUser(uid: string): Promise<Tuit[]> {
        return TuitModel.find({ postedBy: uid }).populate("postedBy");
    }

    async findTuitById(tid: string): Promise<any> {
        return TuitModel.findById(tid).populate("postedBy");
    }

    async createTuitByUser(uid: string, tuit: Tuit): Promise<Tuit> {
        return await TuitModel.create({ ...tuit, postedBy: uid });
    }

    async deleteTuit(tid: string): Promise<any> {
        return TuitModel.deleteOne({ _id: tid });
    }

    async updateTuit(tid: string, tuit: Tuit): Promise<any> {
        return TuitModel.updateOne({ _id: tid }, { $set: tuit });
    }

    async updateLikes(tid: string, newStats: any): Promise<any> {
        return TuitModel.updateOne({ _id: tid }, { $set: { stats: newStats } });
    }
}