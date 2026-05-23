import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";

export const getPresignedUrl = async (req, res) => {
  try {
    
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName and fileType required" });
    }

    // allowed types only
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(fileType)) {
      return res.status(400).json({ error: "Only jpg, png, webp allowed" });
    }

    // unique key so files never overwrite each other
    const ext = fileName.split(".").pop();
    const key = `blogs/${uuidv4()}.${ext}`;

    // This says: “I want to put an object into this bucket at this key with this content type.”
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // presigned URL expires in 60 seconds
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    // this is the final public URL after upload
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.json({ presignedUrl, fileUrl });
  } catch (err) {
    console.error("Presign error:", err);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
};