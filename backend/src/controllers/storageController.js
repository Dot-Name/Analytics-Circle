import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "../config/r2Config.js";
import { Lecture } from "../models/Lecture.js";
import Resource from "../models/Resource.js";

/**
 * GENERATE PRESIGNED URL: Requests a safe direct-upload slot from R2
 * Admin Only
 */
export const getPresignedUploadUrl = async (req, res) => {
  try {
    const { filename, fileType, folder } = req.body; // folder can be "videos" or "resources"

    if (!filename || !fileType || !folder) {
      return res.status(400).json({ success: false, message: "Filename, fileType, and folder target are required." });
    }

    const cleanFolder = folder === "videos" ? "videos" : "resources";
    const uniqueFileKey = `${cleanFolder}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFileKey,
      ContentType: fileType,
    });

    // Generate a secure upload window that expires in 15 minutes (900 seconds)
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
    const finalPublicUrl = `${process.env.R2_PUBLIC_CUSTOM_DOMAIN}/${uniqueFileKey}`;

    return res.status(200).json({
      success: true,
      uploadUrl,
      fileKey: uniqueFileKey,
      fileUrl: finalPublicUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ATTACH RESOURCE ZIP: Registers a downloadable asset link to a module section
 * Admin Only
 */
export const createSectionResource = async (req, res) => {
  try {
    const { title, courseId, sectionId, fileUrl, fileKey, fileSize } = req.body;

    if (!title || !courseId || !sectionId || !fileUrl || !fileKey) {
      return res.status(400).json({ success: false, message: "Missing required resource registration parameters." });
    }

    const resource = await Resource.create({
      title,
      courseId,
      sectionId,
      fileUrl,
      fileKey,
      fileSize: fileSize || 0
    });

    return res.status(201).json({ success: true, data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE RESOURCE ZIP: Deletes file from Cloudflare R2 and drops it from the database
 * Admin Only
 */
export const deleteSectionResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await Resource.findById(resourceId);

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource asset not found." });
    }

    // 1. Purge the raw file from your Cloudflare R2 Storage Bucket
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: resource.fileKey,
    });
    await r2Client.send(deleteCommand);

    // 2. Drop the database tracking entry
    await Resource.findByIdAndDelete(resourceId);

    return res.status(200).json({ success: true, message: "Resource zip removed from storage and database completely." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};