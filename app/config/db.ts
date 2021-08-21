import {ConnectionOptions} from 'mongoose'

/**
 * Set Mongo URI
 * @type {string}
 */
export const MONGO_URI = `mongodb://${process.env.MONGO_USERNAME}:${encodeURIComponent(process.env.MONGO_PASSWORD as string)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

export const MONGO_OPTIONS: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};