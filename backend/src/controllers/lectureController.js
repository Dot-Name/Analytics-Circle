import { v2 as cloudinary } from "cloudinary";
import Lecture from "../models/Lecture.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Initialize Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// 🛠️ FIXES & HELPERS
// ==========================================

// 🌟 FIXED: Correctly extracts folder + public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  try {
    // Example: https://res.cloudinary.com/cloud_name/raw/upload/v12345678/course_resources/my_file_171931.zip
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    
    // Grabs everything after '/upload/vXXXXXX/' -> ['course_resources', 'my_file_171931.zip']
    const fileParts = parts.slice(uploadIndex + 2); 
    const fullPublicIdWithExtension = fileParts.join("/");
    
    // For raw files, Cloudinary needs the exact public_id string including its folder path.
    // If your frontend download process depends on the extension staying intact, 
    // keep or remove the extension match depending on how Cloudinary stored it.
    return fullPublicIdWithExtension; 
  } catch (error) {
    console.error("Error parsing public ID from URL:", error);
    return null;
  }
};

// Helper to safely parse string timestamps into raw seconds
const parseDurationToSeconds = (input) => {
  if (!input) return 0;
  if (!isNaN(input)) return Number(input);
  
  if (typeof input === "string" && input.includes(":")) {
    const segments = input.split(":").map(Number);
    
    if (segments.length === 2) {
      const [minutes, seconds] = segments;
      return (minutes * 60) + (seconds || 0);
    } 
    else if (segments.length === 3) {
      const [hours, minutes, seconds] = segments;
      return (hours * 3600) + (minutes * 60) + (seconds || 0);
    }
  }
  return 0;
};

// Helper to extract YouTube ID from raw URLs
const extractYoutubeId = (url) => {
  if (!url) return null;
  if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
    return url;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ==========================================
// 1. READ (ALL) - Get all lectures
// ==========================================
const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({}).sort({ createdAt: 1 });
    
    return res.status(200).json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (error) {
    console.error("Error inside getAllLectures:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to retrieve curriculum catalog."
    });
  }
};

// ==========================================
// 2. READ (SINGLE) - Get one lecture by ID
// ==========================================
const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: `No lecture found with ID: ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: lecture
    });
  } catch (error) {
    console.error("Error inside getLectureById:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Failed to retrieve lecture."
    });
  }
};

// ==========================================
// 3. CREATE LECTURE + ZIP UPLOAD
// ==========================================
const createLecture = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      moduleName, 
      youtubeUrl, 
      youtubeId, 
      duration, 
      sectionId, 
      courseId, 
      isPreview 
    } = req.body;
    
    let zipResourceUrl = null;
    const incomingVideoInput = youtubeId || youtubeUrl;

    if (!title || !moduleName || !incomingVideoInput || !sectionId || !courseId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields." 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sectionId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payload Error."
      });
    }

    const extractedId = extractYoutubeId(incomingVideoInput);
    if (!extractedId) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Invalid YouTube parameter."
      });
    }

    if (req.file) {
      const uploadPromise = () => {
        return new Promise((resolve, reject) => {
          const cleanCustomName = req.file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
          
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              folder: "course_resources",
              public_id: `${cleanCustomName}_${Date.now()}`, 
              filename_override: req.file.originalname,
              use_filename: true
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
      };

      const cloudinaryResult = await uploadPromise();
      zipResourceUrl = cloudinaryResult.secure_url;
    }

    const newLecture = await Lecture.create({
      title,
      description,
      moduleName,
      youtubeId: extractedId,
      duration: parseDurationToSeconds(duration),
      courseId,   
      sectionId,  
      zipResourceUrl,
      isPreview: isPreview === 'true' || isPreview === true
    });

    return res.status(201).json({ 
      success: true, 
      message: "Lecture successfully persisted.",
      data: newLecture 
    });

  } catch (error) {
    console.error("Cloudinary Create Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// ==========================================
// 4. UPDATE LECTURE + CONDITIONAL REPLACEMENT
// ==========================================
const updateLecture = async (req, res) => {
  try {
    const currentLecture = await Lecture.findById(req.params.id);
    if (!currentLecture) {
      return res.status(404).json({ success: false, message: "Lecture not found." });
    }

    let updateData = { ...req.body };
    const incomingVideoInput = updateData.youtubeId || updateData.youtubeUrl;

    if (incomingVideoInput) {
      const JoinId = extractYoutubeId(incomingVideoInput);
      if (!JoinId) {
        return res.status(400).json({ success: false, message: "Invalid YouTube configuration." });
      }
      updateData.youtubeId = JoinId;
      delete updateData.youtubeUrl;
    }

    if (updateData.duration !== undefined) {
      updateData.duration = parseDurationToSeconds(updateData.duration);
    }

    if (updateData.isPreview !== undefined) {
      updateData.isPreview = updateData.isPreview === 'true' || updateData.isPreview === true;
    }

    if (req.file) {
      if (currentLecture.zipResourceUrl) {
        const oldPublicId = getPublicIdFromUrl(currentLecture.zipResourceUrl);
        if (oldPublicId) {
          // 🌟 Clean up old file with type set to 'raw'
          await cloudinary.uploader.destroy(oldPublicId, { resource_type: "raw" });
        }
      }

      const uploadPromise = () => {
        return new Promise((resolve, reject) => {
          const cleanCustomName = req.file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
          
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              resource_type: "raw", 
              folder: "course_resources",
              public_id: `${cleanCustomName}_${Date.now()}`,
              filename_override: req.file.originalname,
              use_filename: true
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
      };

      const cloudinaryResult = await uploadPromise();
      updateData.zipResourceUrl = cloudinaryResult.secure_url;
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { returnDocument: 'after', runValidators: true }
    );

    return res.status(200).json({ 
      success: true, 
      data: updatedLecture 
    });

  } catch (error) {
    console.error("Cloudinary Update Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==========================================
// 5. DELETE LECTURE + PURGE FILE FROM CLOUD
// ==========================================
const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found." });
    }

    // 🌟 Check if there's a stored file track url
    if (lecture.zipResourceUrl) {
      const publicId = getPublicIdFromUrl(lecture.zipResourceUrl);
      
      if (publicId) {
        console.log(`Attempting to destroy Cloudinary asset: ${publicId}`);
        // Destroys the raw zip file out of Cloudinary safely
        const cloudinaryDeletionResult = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
        console.log("Cloudinary response:", cloudinaryDeletionResult);
      }
    }

    // Clear database reference completely
    await Lecture.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Lecture and associated zip resource removed." });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return res.status(500).json({ success: false, message: "Server Error: Unable to clean cloud assets completely." });
  }
};

// ==========================================
// 6. READ (FILTERED) - Get lectures by sectionId query parameter
// ==========================================
const getLecturesBySection = async (req, res) => {
  try {
    const { sectionId } = req.query;

    let filter = {};
    if (sectionId) {
      filter = { sectionId: sectionId };
    }

    const lectures = await Lecture.find(filter).sort({ createdAt: 1 }).lean();
    
    return res.status(200).json({
      success: true,
      count: lectures.length,
      data: lectures 
    });
  } catch (error) {
    console.error("Error inside getLecturesBySection:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export { 
  getLecturesBySection,
  getAllLectures, 
  getLectureById, 
  createLecture, 
  updateLecture, 
  deleteLecture 
};