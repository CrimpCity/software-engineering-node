import Follows from "../models/follows/Follows";

/**
 * @file Declares API for Follows related data access object methods
 */
export default interface FollowsDaoI {
    findAllFollows(): Promise<Follows[]>;
    findAllFollowersByUser(uid: string): Promise<Follows[]>;
    findAllFollowingByUser(uid: string): Promise<Follows[]>;
    userFollowsUser(uid: string, followedByUserId: string): Promise<any>;
    userUnfollowsUser(uid: string, unfollowedByUserId: string): Promise<any>;
    deleteFollowsByID(fid: string): Promise<any>;
}