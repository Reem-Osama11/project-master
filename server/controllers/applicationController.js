import JobApplication from "../models/JobApplication.js";

// ==========================
// 🟢 1. تغيير حالة الطلب (Accept / Reject)
// ==========================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    // نجيب الطلب
    const application = await JobApplication.findById(applicationId);

    if (!application) {
      return res.json({
        success: false,
        message: "Application not found",
      });
    }

    // نغير الحالة
    application.status = status;

    await application.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      application,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================
// 🟢 2. Apply for Job (NEW 🔥)
// ==========================
export const applyForJob = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userImage,
      jobId,
      companyId,
      resume,

      // 🔥 AI DATA
      atsScore,
      missingSkills,
      aiAnalysis

    } = req.body;

    // 🧠 تأكدي إن المستخدم مقدمش قبل كدا
    const existingApplication = await JobApplication.findOne({
      userId,
      jobId,
    });

    if (existingApplication) {
      return res.json({
        success: false,
        message: "You already applied for this job",
      });
    }

    // 🔥 إنشاء الطلب
    const application = new JobApplication({
      userId,
      userName,
      userEmail,
      userImage,
      jobId,
      companyId,
      resume,
      atsScore,
      missingSkills,
      aiAnalysis,
    });

    await application.save();

    console.log("✅ SAVED APPLICATION:", application);

    res.json({
      success: true,
      message: "Application submitted successfully",
    });

  } catch (error) {
    console.log("❌ APPLY ERROR:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};