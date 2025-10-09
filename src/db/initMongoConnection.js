import dotenv from 'dotenv';
import mongoose  from 'mongoose';
dotenv.config();
export default async function initMongoConnection () {
    try {
        const user = process.env.MONGODB_USER;
        const password = process.env.MONGODB_PASSWORD;
        const url = process.env.MONGODB_URL;
        const dbName = process.env.MONGODB_DB;
       await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority`);
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
     }
}