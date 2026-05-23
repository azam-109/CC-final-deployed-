import dotenv from "dotenv";
dotenv.config();
import { S3Client } from "@aws-sdk/client-s3";

//debugging AWS credentials loading in Vercel — remove this in production!
// console.log("hello i m  back 2 ");

// console.log({
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_KEY,
// });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export default s3;