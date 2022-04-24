/**
 * @file Implements DAO managing data storage of Courses. 
 * Uses mongoose CourseModel to integrate with MongoDB
 */
import CourseDaoI from "../interfaces/CourseDao";
import CourseModel from "../mongoose/courses/CourseModel";
import Course from "../mongoose/courses/Course";
import SectionDao from "./SectionDao";
import mongoose from "mongoose";

/**
 * @class CourseDao Implements Data Access Object managing data storage of Courses
 * @property {CourseDao} courseDao Private single instance of CourseDao
 */
export default class CourseDao implements CourseDaoI {
    static courseDao: CourseDao = new CourseDao();
    sectionDao: SectionDao = SectionDao.getInstance();

    /**
     * @returns CourseDao
     */
    static getInstance(): CourseDao { return this.courseDao; }
    private constructor() { }

    /**
     * @returns Promise
     */
    async findAllCourses(): Promise<Course[]> {
        return await CourseModel.find();
    }

    /**
     * @param  {any} cid
     * @returns Promise
     */
    async findCourseById(cid: any): Promise<any> {
        return await CourseModel.findById(cid);
    }

    /**
     * @param  {Course} course
     * @returns Promise
     */
    async createCourse(course: Course): Promise<Course> {
        return await CourseModel.create(course);
    }

    /**
     * @param  {string} cid
     * @returns Promise
     */
    async deleteCourse(cid: string): Promise<any> {
        return await CourseModel.deleteOne({ _id: cid });
    }

    /**
     * @param  {string} title
     * @returns Promise
     */
    async deleteCourseByTitle(title: string): Promise<any> {
        return await CourseModel.deleteOne({ title: title });
    }

    /**
     * @param  {string} cid
     * @param  {Course} course
     * @returns Promise
     */
    async updateCourse(cid: string, course: Course): Promise<any> {
        return await CourseModel.updateOne(
            { _id: cid },
            { $set: course });
    }

    /**
     * @returns Promise
     */
    async findAllCoursesDeep(): Promise<Course[]> {
        return await CourseModel
            .find()
            .populate("sections")
            .exec();
    }

    /**
     * @param  {string} cid
     * @returns Promise
     */
    async findCourseByIdDeep(cid: string): Promise<any> {
        return await CourseModel
            .findById(cid)
            .populate("sections")
            .exec();
    }

    /**
     * @param  {string} cid
     * @param  {string} sid
     * @returns Promise
     */
    async addSectionToCourse(cid: string, sid: string): Promise<any> {
        const section = await this.sectionDao.findSectionById(sid);
        await this.sectionDao
            .updateSection(sid, {
                ...section,
                course: new mongoose.Types.ObjectId(cid)
            });
        const course = await this.findCourseById(cid);
        return CourseModel.updateOne(
            { _id: cid },
            { $push: { sections: new mongoose.Types.ObjectId(sid) } });
    }

    /**
     * @param  {string} cid
     * @param  {string} sid
     * @returns Promise
     */
    removeSectionFromCourse(cid: string, sid: string): Promise<any> {
        return Promise.resolve(undefined);
    }
}