/**
 * @file Implements DAO managing data storage of sections. 
 * Uses mongoose SectionModel to integrate with MongoDB
 */
import SectionDaoI from "../interfaces/SectionDao";
import Section from "../mongoose/sections/Section";
import SectionModel from "../mongoose/sections/SectionModel";

/**
 * @class SectionDao Implements Data Access Object managing data storage of Sections
 * @property {SectionDao} instance Private single instance of SectionDao
 */
export default class SectionDao implements SectionDaoI {
    static instance: SectionDao = new SectionDao();
    private constructor() { }
    /**
     * Creates singleton DAO instance
     * @returns SectionDao
     */
    static getInstance(): SectionDao {
        return this.instance;
    }

    /**
     * @param  {string} cid
     * @param  {Section} section
     * @returns Promise
     */
    async createSectionForCourse(cid: string, section: Section): Promise<Section> {
        return await SectionModel.create({ ...section, course: cid });
    }

    /**
     * @param  {string} sid
     * @returns Promise
     */
    async deleteSection(sid: string): Promise<any> {
        return await SectionModel.remove({ _id: sid });
    }

    /**
     * @param  {string} sid
     * @returns Promise
     */
    async findSectionById(sid: string): Promise<any> {
        return await SectionModel.findById(sid);
    }

    /**
     * @param  {string} sid
     * @returns Promise
     */
    async findSectionByIdDeep(sid: string): Promise<any> {
        return await SectionModel
            .findById(sid)
            .populate("course")
            .exec();
    }

    /**
     * @returns Promise
     */
    async findAllSections(): Promise<Section[]> {
        return await SectionModel.find();
    }

    /**
     * @returns Promise
     */
    async findAllSectionsDeep(): Promise<Section[]> {
        return await SectionModel
            .find()
            .populate("course")
            .exec();
    }

    /**
     * @param  {string} cid
     * @returns Promise
     */
    async findAllSectionsForCourse(cid: string): Promise<Section[]> {
        return await SectionModel.find({ course: cid });
    }

    /**
     * @param  {string} cid
     * @returns Promise
     */
    async findAllSectionsForCourseDeep(cid: string): Promise<Section[]> {
        return await SectionModel
            .find({ course: cid })
            .populate("course")
            .exec();
    }

    /**
     * @param  {string} sid
     * @param  {Section} section
     * @returns Promise
     */
    async updateSection(sid: string, section: Section): Promise<any> {
        return await SectionModel.updateOne(
            { _id: sid },
            { $set: section });
    }
}