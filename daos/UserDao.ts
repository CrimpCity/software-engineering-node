/**
 * @file Implements DAO managing data storage of users. Uses mongoose UserModel
 * to integrate with MongoDB
 */
import User from '../models/users/User';
import UserModel from '../mongoose/users/UserModel';
import UserDaoI from '../interfaces/UserDaoI';

/**
 * @class UserDao implements a data access object that manages all user data
 * @property {UserDao} userDao is a private instance of user DAO using the singleton pattern
 */
export default class UserDao implements UserDaoI {
    private static userDao: UserDao | null = null;
    /**
     * Creates a single instance of the UserDao
     * @returns UserDao
     */
    public static getInstance = (): UserDao => {
        if (UserDao.userDao === null) {
            UserDao.userDao = new UserDao();
        }
        return UserDao.userDao;
    }
    private constructor() { }

    /**
     * Calls on UserModel to retrieve all users
     */
    async findAllUsers(): Promise<User[]> {
        return UserModel.find();
    }

    /**
     * Calls on UserModel to retrieve a particular user instance
     * @param uid {string} primary key of user to be retrieved
     */
    async findUserById(uid: string): Promise<any> {
        return UserModel.findById(uid);
    }

    /**
     * Calls on UserModel to create a new instance of a user
     * @param user {User} User to be added to the database
     */
    async createUser(user: User): Promise<User> {
        return await UserModel.create(user);
    }
    /**
     * Calls on UserModel to delete an instance of a user
     * @param uid {string} primary key ot user to be deleted
     */
    async deleteUser(uid: string): Promise<any> {
        return UserModel.deleteOne({ _id: uid });
    }

    /**
     * Calls on UserModel to update an existing user with a new user object
     * @param uid {string} user primary key
     * @param user {User} user to replace the exiting user
     */
    async updateUser(uid: string, user: User): Promise<any> {
        return UserModel.updateOne({ _id: uid }, { $set: user });
    }

    /**
     * Calls on UserModel to delete all user instances
     */
    async deleteAllUsers(): Promise<any> {
        return UserModel.deleteMany({});
    }

    /**
     * Calls on Usermodel to find a user of the given username and password
     * @param username {string} username
     * @param password {string} password
     */
    async findUserByCredentials(username: string, password: string): Promise<any> {
        return UserModel.findOne({ username: username, password: password });
    }
    /**
     * Calls on UserModel to find a user of the given username
     * @param username {string} username
     */
    async findUserByUsername(username: string): Promise<any> {
        return UserModel.findOne({ username: username });
    }

    /**
     * @param  {string} username
     * @returns Promise
     */
    async deleteUsersByUsername(username: string): Promise<any> {
        return UserModel.deleteMany({ username });
    }
}