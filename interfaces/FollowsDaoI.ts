/**
 * @file Declares API for Follows related data access object methods
 */
import Follows from "../models/follows/Follows";


export default interface FollowsDaoI {
    findAllFollows(): Promise<Follows[]>;
    findAllFollowersByUser(uid: string): Promise<Follows[]>;
    findAllFollowingByUser(uid: string): Promise<Follows[]>;
    userFollowsUser(uid: string, uidToFollow: string): Promise<any>;
    userUnfollowsUser(uid: string, uidToUnfollow: string): Promise<any>;
    deleteFollowsByID(fid: string): Promise<any>;
}