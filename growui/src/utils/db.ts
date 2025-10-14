import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in env");

declare global {
  var mongooseConnection: typeof mongoose | undefined;
}

const cached = (global as any).mongooseConnection;

if (!cached) {
  (global as any).mongooseConnection = mongoose;
}

export async function connect() {
  if (mongoose.connection.readyState >= 1) return mongoose;
  await mongoose.connect(MONGODB_URI);
  return mongoose;
}
