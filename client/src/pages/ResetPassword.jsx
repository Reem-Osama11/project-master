import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // 👈 مهم

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    if (!password) {
      toast.error("Please enter password");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:5001/api/company/reset-password/${token}`,
        { password }
      );

      if (data.success) {
        toast.success("Password updated ✅");

        // 🔥 redirect بعد 1.5 ثانية
        setTimeout(() => {
          navigate("/"); // أو "/login" حسب عندك
        }, 1500);

      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;