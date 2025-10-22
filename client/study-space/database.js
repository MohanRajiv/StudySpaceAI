const { Mongoose, default: mongoose } = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
    global.mongoose = cached;
}

export const connectToDB = async () => {
    if (cached.conn) return cached.conn;

    cached.promise = 
    cached.promise || mongoose.connect(MONGODB_URI,{
        dbName: "clerkauthv5",
        bufferCommands: false,
        connectTimeoutMS: 300000,
    });

    cached.conn = await cached.promise;

    return cached.conn;
}
  


