import mongoose from "mongoose";

const config = useRuntimeConfig();
export default defineNitroPlugin(() => {
    mongoose.connect(config.MONGO_URI, { dbName: 'portfolio' });
})