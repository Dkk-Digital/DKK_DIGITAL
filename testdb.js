import { MongoClient } from "mongodb";

// const uri = "mongodb+srv://dkk:QCGlHkD4OTjNBvf9@cluster0.vsiwcma.mongodb.net/?serverSelectionTimeoutMS=5000";
// const uri = "mongodb://dkk:QCGlHkD4OTjNBvf9@ac-m1hjr35-shard-00-00.cgopvxr.mongodb.net:27017,ac-m1hjr35-shard-00-01.cgopvxr.mongodb.net:27017,ac-m1hjr35-shard-00-02.cgopvxr.mongodb.net:27017/cluster0?authSource=admin&retryWrites=true&w=majority&ssl=true";
const uri = "mongodb+srv://DKK_db_user:JtBVh7TOGWOJ67wk@dkk0cluster.pxsjump.mongodb.net/?appName=Dkk0cluster";
const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected!");
  } catch (e) {
    console.error("FAILED:", e);
  } finally {
    await client.close();
  }
}

run();