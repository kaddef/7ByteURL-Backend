import mongoose from "mongoose"

async function connectDB() {
    const dbURI = process.env.dbURI
    try {
        await mongoose.connect(dbURI);
        console.log("Connected Database");
    } catch (error) {
        console.log(`Cannot connect to the database: ${error}`)
    }
}

export default connectDB;