import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// =========================
// Get ALL jobs  (Public / Company / Admin)
// =========================
// =========================
// Get ALL jobs (Public / Company / Admin)
// =========================
export const getJobs = async (req, res) => {
  try {
    // جيب كل الوظايف بدون فلترة visibility
    const jobs = await Job.find({ companyId: { $ne: null } })
      .populate({ path: "companyId", select: "-password" });

    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await JobApplication.countDocuments({ jobId: job._id });
        return { ...job.toObject(), applicants: applicantCount };
      })
    );

    res.json({ success: true, jobs: jobsWithApplicants });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch jobs." });
  }
};

// =========================
// Get a single job by ID
// =========================
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate({
      path: "companyId",
      select: "-password",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete a job (Admin / Company)
// =========================
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // الحذف النهائي من MongoDB باستخدام معرف الوظيفة
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found in database",
      });
    }

    res.json({
      success: true,
      message: "Job has been permanently deleted from MongoDB",
    });

  } catch (error) {
    console.error("Error deleting job:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while trying to delete the job",
    });
  }
};

