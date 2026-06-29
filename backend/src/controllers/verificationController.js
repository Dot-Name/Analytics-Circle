import Certificate from "../models/Certificate.js";

/**
 * PUBLIC API LAYER: Public verification engine for employers or recruiters
 * Path: GET /api/v1/verify/:serialNumber
 * Access: PUBLIC (No authMiddleware needed)
 */
export const verifyCertificatePublicly = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    if (!serialNumber) {
      return res.status(400).json({ success: false, message: "Missing tracking serial key parameter." });
    }

    // Search the database for the generated serial number
    const certificate = await Certificate.findOne({ serialNumber: serialNumber.toUpperCase() });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Invalid Certificate: No matching validation record found in our system registry."
      });
    }

    // Return the clean verified data profile
    return res.status(200).json({
      success: true,
      verified: true,
      message: "Certificate authenticity status verified successfully.",
      data: {
        serialNumber: certificate.serialNumber,
        studentName: certificate.studentName,
        courseTitle: certificate.courseTitle,
        finalScorePercentage: `${certificate.finalQuizAverage}%`,
        issueDate: new Date(certificate.issuedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      }
    });

  } catch (error) {
    console.error("Public Verification Exception:", error);
    return res.status(500).json({ success: false, message: "Internal server error reading verification registries." });
  }
};