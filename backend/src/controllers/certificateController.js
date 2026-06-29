import PDFDocument from "pdfkit";
import StudentProgress from "../models/StudentProgress.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Certificate from "../models/Certificate.js"; // 👈 1. IMPORT THE NEW MODEL

/**
 * STUDENT ACCESS LAYER: Validates eligibility metrics and generates custom vector PDF certificates
 * Path: GET /api/v1/certificates/download/:courseId
 */
export const downloadCourseCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const verifiedStudentId = req.userId || (req.user && req.user.id) || (req.user && req.user._id);

    // 1. Fetch Student Progress Aggregates Matrix
    const progress = await StudentProgress.findOne({ studentId: verifiedStudentId, courseId });
    
    if (!progress || !progress.aggregates?.isEligibleForCertificate) {
      return res.status(400).json({
        success: false,
        message: "Compliance Violation: You are not eligible for a certificate yet. Ensure you clear 100% video completion and maintain a minimum average score of 65% across all quizzes."
      });
    }

    // 2. Resolve Course Title and User Metadata safely
    const courseObj = await Course.findById(courseId);
    const studentObj = await User.findById(verifiedStudentId);

    const studentName = studentObj ? studentObj.fullName : "Verified Student";
    const courseTitle = courseObj ? courseObj.title : "Master Course Track";
    const runningQuizScore = progress.aggregates.courseTotalQuizScorePercentage || 0;
    
    // Format timestamp parameters into readable localized calendar dates
    const completionDate = new Date(progress.aggregates.lastAccessedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // 3. Generate Unique Cryptographic Verification Hash Sequence
    const verificationSerial = `CERT-${verifiedStudentId.toString().slice(-6).toUpperCase()}-${courseId.toString().slice(-6).toUpperCase()}`;

    // =========================================================
    // ⚙️ 2. NEW: DATABASE PERSISTENCE GUARD LAYER
    // =========================================================
    // Check if this certificate is already logged in the DB. If not, write it now.
    const existingCertificate = await Certificate.findOne({ serialNumber: verificationSerial });
    
    if (!existingCertificate) {
      console.log(`[CERTIFICATE PERSISTENCE] Generating database entry for tracking serial: ${verificationSerial}`);
      await Certificate.create({
        serialNumber: verificationSerial,
        studentId: verifiedStudentId,
        studentName: studentName,
        courseId: courseId,
        courseTitle: courseTitle,
        finalQuizAverage: runningQuizScore,
        issuedAt: progress.aggregates.lastAccessedAt || new Date()
      });
    }

    // 4. Initialize PDF Document Canvas configured to Landscape Orientation
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });

    // Set HTTP streaming configurations headers to pass the file smoothly to browsers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Certificate-${courseId}.pdf`);
    doc.pipe(res);

    // ==========================================
    // 🎨 VECTOR DRAWING ENGINE (THE VISUAL TEMPLATE)
    // ==========================================

    // A. Draw Outer Certificate Navy Border Background Frame Blocks
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FDFDFD");
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(4).stroke("#0F172A"); // Slate Border
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(1).stroke("#94A3B8"); // Thin Inner Accent

    // B. Draw Abstract Geometric Ribbon Top Left Corners
    doc.moveTo(0, 0).lineTo(120, 0).lineTo(0, 120).fill("#1E3A8A"); // Deep Corporate Blue
    doc.moveTo(0, 0).lineTo(60, 0).lineTo(0, 60).fill("#3B82F6");   // Light Pop Accent Blue

    // C. Certificate Header Title Text
    doc.fillColor("#1E3A8A")
       .font("Helvetica-Bold")
       .fontSize(42)
       .text("CERTIFICATE OF COMPLETION", 0, 100, { align: "center" });

    doc.fillColor("#475569")
       .font("Helvetica")
       .fontSize(16)
       .text("THIS SPECIFIC MILESTONE ACCOMPLISHMENT IS PROUDLY PRESENTED TO", 0, 170, { align: "center" });

    // D. Dynamic Injection of Student Name Element
    doc.fillColor("#0F172A")
       .font("Helvetica-Bold")
       .fontSize(32)
       .text(studentName.toUpperCase(), 0, 220, { align: "center" });

    // Subtle underline rule beneath student name
    doc.moveTo(doc.page.width / 2 - 180, 260).lineTo(doc.page.width / 2 + 180, 260).lineWidth(2).stroke("#3B82F6");

    // E. Context Content Text Body
    doc.fillColor("#475569")
       .font("Helvetica")
       .fontSize(16)
       .text("for successfully mastering all structural syllabus configurations for the course:", 0, 280, { align: "center" });

    // F. Dynamic Injection of Course Title Element
    doc.fillColor("#1E3A8A")
       .font("Helvetica-Bold")
       .fontSize(24)
       .text(`"${courseTitle}"`, 50, 320, { align: "center", width: doc.page.width - 100 });

    // G. Dynamic Metrics Row Container Block (Scores & Timestamps)
    doc.moveTo(50, 420).lineTo(doc.page.width - 50, 420).lineWidth(1).stroke("#E2E8F0");

    // Left Column: Date of Completion
    doc.fillColor("#64748B").font("Helvetica").fontSize(11).text("DATE OF COMPLETION", 80, 440);
    doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(14).text(completionDate, 80, 460);

    // Center Column: Core Performance Evaluation Matrix Grade
    doc.fillColor("#64748B").font("Helvetica").fontSize(11).text("EVALUATION MARKS SCORE", doc.page.width / 2 - 80, 440, { align: "center", width: 160 });
    doc.fillColor("#10B981").font("Helvetica-Bold").fontSize(16).text(`${runningQuizScore}%`, doc.page.width / 2 - 80, 460, { align: "center", width: 160 }); 

    // Right Column: Dynamic Academic Authorized Signature Placeholder
    doc.fillColor("#64748B").font("Helvetica").fontSize(11).text("AUTHORIZED ISSUING BODY", doc.page.width - 260, 440, { align: "right", width: 180 });
    doc.fillColor("#0F172A").font("Helvetica-Oblique").fontSize(15).text("Backend Academy Verification", doc.page.width - 260, 460, { align: "right", width: 180 });

    doc.moveTo(50, 500).lineTo(doc.page.width - 50, 500).lineWidth(1).stroke("#E2E8F0");

    // H. Footer Trust Badges and Security Serial Tracking Details
    doc.fillColor("#94A3B8")
       .font("Helvetica")
       .fontSize(10)
       .text(`Verification Hash Serial Code: ${verificationSerial}`, 0, 530, { align: "center" });

    // Finalize execution stream to flush buffer memory
    doc.end();

  } catch (error) {
    console.error("Certificate Generation System Failure Exception:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Critical internal error generating PDF binary canvas." });
    }
  }
};