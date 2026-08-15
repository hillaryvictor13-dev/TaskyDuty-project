import mongoose from "mongoose"
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);
type ConnectionState = {
  isConnected: boolean
}

let connection: ConnectionState = { isConnected: false }

const connectOptions = {
  dbName: "TaskDutyDb",
  serverSelectionTimeoutMS: 45000,
  socketTimeoutMS: 5000,
  family: 4,
  maxPoolSize: 50,
  minPoolSize: 1,
}

const connectToDb = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("MongoDB is already connected")
    return
  }

  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error("Please ensure that your MongoDB connection string is set")
    }

    const res = await mongoose.connect(mongoUri, connectOptions)
    connection.isConnected = res.connections[0].readyState === 1

    if (connection.isConnected) {
      console.log("MongoDB connected successfully")
    }

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected")
      connection.isConnected = false
    })

    process.on("SIGINT", async () => {
      await mongoose.connection.close()
      console.log("MongoDB connection closed due to app termination")
      process.exit(0)
    })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    connection.isConnected = false
    const errorMessage = (error as Error).message || "Unknown error"
    throw new Error(`Failed to connect to MongoDB: ${errorMessage}`)
  }
}

export default connectToDb
