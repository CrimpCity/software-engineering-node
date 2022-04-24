/**
 * @file Implements mongoose model to CRUD documents in the Follows collection
 */
import mongoose from 'mongoose';
import FollowsSchema from "./FollowsSchema";


const FollowsModel = mongoose.model('FollowsModel', FollowsSchema);
export default FollowsModel;