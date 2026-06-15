// import { useEffect, useState, useMemo, useContext } from "react";
// import { AppContext } from "../context/AppContext";

// const AdminManageUsers = () => {
//   const { backendUrl } = useContext(AppContext);

//   const [applications, setApplications] = useState([]);
//   const [activeTab, setActiveTab] = useState("Job Seekers");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);

//   const loadApplications = async () => {
//     try {
//       if (!backendUrl) return;

//       const adminToken = import.meta.env.VITE_ADMIN_TOKEN;

//       const res = await fetch(
//         `${backendUrl}/api/applications/admin-all`,
//         {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         console.error("API Error:", data);
//         return;
//       }

//       setApplications(data.applications || []);
//     } catch (err) {
//       console.error("Fetch applications error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadApplications();
//   }, [backendUrl]);

//   const users = useMemo(() => {
//     const map = {};

//     applications.forEach((app) => {
//       if (!app.userId) return;

//       const userId = app.userId._id;

//       if (!map[userId]) {
//         map[userId] = {
//           _id: userId,
//           name: app.userName || "N/A",
//           email: app.userEmail || "N/A",
//           role: "user",
//           applicationsCount: 0,
//         };
//       }

//       map[userId].applicationsCount += 1;
//     });

//     return Object.values(map);
//   }, [applications]);

//   const stats = useMemo(() => {
//     return {
//       totalUsers: users.length,
//       totalCompanies: new Set(
//         applications
//           .filter((a) => a.companyId)
//           .map((a) => a.companyId)
//       ).size,
//       totalApplications: applications.length,
//       totalJobs: 0,
//       companyJobs: 0,
//     };
//   }, [applications, users]);

//   const filteredData = useMemo(() => {
//     return users.filter((user) => {
//       const matchesTab =
//         activeTab === "Job Seekers"
//           ? user.role === "user"
//           : user.role === "company";

//       const matchesSearch =
//         user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchQuery.toLowerCase());

//       return matchesTab && matchesSearch;
//     });
//   }, [users, activeTab, searchQuery]);

//   if (loading) return <p className="p-8">Loading...</p>;

//   return (
//     <div className="p-8 bg-white min-h-screen">
//    {/* ✅ HEADER بنفس ستايل الناف بار */}
//   <div className="mb-4 sm:mb-6">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Users Management</h2>
//         <p className="text-sm sm:text-base text-gray-600">Manage job seekers and companies registered on the platform</p>
//       </div>


//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
//         <StatCard title="Total Users" count={stats.totalUsers} icon="👤" />
//         <StatCard title="Total Companies" count={stats.totalCompanies} icon="🏢" />
//         <StatCard title="Total Applications" count={stats.totalApplications} icon="📄" />
//         <StatCard title="Total Jobs" count={stats.totalJobs} icon="💼" />
//         <StatCard title="Company Jobs" count={stats.companyJobs} icon="🏬" />
//       </div>

//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full max-w-md px-4 py-2 border rounded-md"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab("Job Seekers")}
//           className={`px-6 py-2 rounded-md ${
//             activeTab === "Job Seekers"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-100"
//           }`}
//         >
//           Job Seekers
//         </button>

//         <button
//           onClick={() => setActiveTab("Companies")}
//           className={`px-6 py-2 rounded-md ${
//             activeTab === "Companies"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-100"
//           }`}
//         >
//           Companies
//         </button>
//       </div>

//       {/* ✅ TABLE FIXED VERSION */}
//       {/* ✅ TABLE FIXED VERSION */}
// <div className="overflow-x-auto border rounded-lg">
//   <table className="w-full table-fixed border-collapse text-left">
    
//     <colgroup>
//       <col className="w-16" />
//       <col className="w-1/4" />
//       <col className="w-1/3" />
//       <col className="w-32" />
//     </colgroup>

//     <thead className="bg-gray-50 text-xs uppercase">
//       <tr>
//         <th className="px-6 py-3 font-semibold align-middle">#</th>
//         <th className="px-6 py-3 font-semibold align-middle">Name</th>
//         <th className="px-6 py-3 font-semibold align-middle">Email</th>
//         <th className="px-6 py-3 font-semibold text-right align-middle">
//           Applications
//         </th>
//       </tr>
//     </thead>

//     <tbody>
//       {filteredData.length === 0 ? (
//         <tr>
//           <td
//             colSpan="4"
//             className="py-10 text-center text-gray-400"
//           >
//             No data found
//           </td>
//         </tr>
//       ) : (
//         filteredData.map((user, index) => (
//           <tr key={user._id} className="border-t hover:bg-gray-50">
//             <td className="px-6 py-3 align-middle">
//               {index + 1}
//             </td>

//             <td className="px-6 py-3 align-middle font-medium">
//               {user.name}
//             </td>

//             <td className="px-6 py-3 align-middle truncate">
//               {user.email}
//             </td>

//             <td className="px-6 py-3 text-right align-middle">
//               {user.applicationsCount}
//             </td>
//           </tr>
//         ))
//       )}
//     </tbody>

//   </table>
// </div>

//     </div>
//   );
// };

// const StatCard = ({ title, count, icon }) => (
//   <div className="border p-5 rounded-xl shadow-sm bg-white">
//     <div className="flex justify-between items-center">
//       <div>
//         <p className="text-xs text-gray-500 font-semibold">
//           {title}
//         </p>
//         <p className="text-2xl font-bold">{count}</p>
//       </div>
//       <span className="text-2xl">{icon}</span>
//     </div>
//   </div>
// );

// export default AdminManageUsers;
import { useEffect, useState, useMemo, useContext } from "react";
import { AppContext } from "../context/AppContext";

const AdminManageUsers = () => {
  const { backendUrl } = useContext(AppContext);

  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeTab, setActiveTab] = useState("Job Seekers");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      if (!backendUrl) return;

      const adminToken = import.meta.env.VITE_ADMIN_TOKEN;

      const res = await fetch(
        `${backendUrl}/api/applications/admin-all`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data);
        return;
      }

      setApplications(data.applications || []);
    } catch (err) {
      console.error("Fetch applications error:", err);
    } finally {
      setLoading(false);
    }
  };
const deleteCompany = async (id) => {
    // إظهار رسالة تأكيد قبل الحذف
    if (window.confirm("Are you sure you want to delete this company? All their jobs will be removed too.")) {
      try {
        const adminToken = import.meta.env.VITE_ADMIN_TOKEN;

        const res = await fetch(`${backendUrl}/api/company/admin-delete/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await res.json();

        if (res.ok) {
          alert("Company deleted successfully");
          // تحديث القائمة فوراً بعد الحذف عشان تختفي من الجدول
          loadCompanies(); 
        } else {
          alert(data.message || "Failed to delete company");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("An error occurred while deleting");
      }
    }
  };
  const loadCompanies = async () => {
    try {
      if (!backendUrl) return;
      const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
      const res = await fetch(`${backendUrl}/api/company/admin-all`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error("Fetch companies error:", err);
    }
  };

  useEffect(() => {
    loadApplications();
    loadCompanies();
  }, [backendUrl]);

  const users = useMemo(() => {
    const map = {};

    applications.forEach((app) => {
      if (!app.userId) return;

      const userId = app.userId._id;

      if (!map[userId]) {
        map[userId] = {
          _id: userId,
          name: app.userName || "N/A",
          email: app.userEmail || "N/A",
          role: "user",
          applicationsCount: 0,
        };
      }

      map[userId].applicationsCount += 1;
    });

    return Object.values(map);
  }, [applications]);

 const stats = useMemo(() => {
    // 1. حساب إجمالي الوظائف (جمع الـ jobsPosted لكل الشركات)
    const totalJobsCount = companies.reduce((acc, company) => {
      return acc + (Number(company.jobsPosted) || 0);
    }, 0);

    // 2. حساب عدد الشركات التي لديها وظائف (الشركات النشطة)
    const activeCompaniesCount = companies.filter(
      (company) => (company.jobsPosted || 0) > 0
    ).length;

    return {
      totalUsers: users.length,
      totalCompanies: companies.length,
      totalApplications: applications.length,
      totalJobs: totalJobsCount,       // هيظهر إجمالي كل الوظائف (مثلاً 4)
      companyJobs: activeCompaniesCount // هيظهر عدد الشركات اللي منزلة وظائف (مثلاً 1)
    };
  }, [applications, users, companies]);

  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchQuery]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  if (loading) return <p className="p-8">Loading...</p>;
console.log(companies)
  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Users Management</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage job seekers and companies registered on the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Users" count={stats.totalUsers} icon="👤" />
        <StatCard title="Total Companies" count={stats.totalCompanies} icon="🏢" />
        <StatCard title="Total Applications" count={stats.totalApplications} icon="📄" />
        <StatCard title="Total Jobs" count={stats.totalJobs} icon="💼" />
        <StatCard title="Company Jobs" count={stats.companyJobs} icon="🏬" />
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md px-4 py-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("Job Seekers")}
          className={`px-6 py-2 rounded-md ${
            activeTab === "Job Seekers" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Job Seekers
        </button>

        <button
          onClick={() => setActiveTab("Companies")}
          className={`px-6 py-2 rounded-md ${
            activeTab === "Companies" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Companies
        </button>
      </div>

      {/* Job Seekers Table */}
      {activeTab === "Job Seekers" && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-16" />
              <col className="w-1/4" />
              <col className="w-1/3" />
              <col className="w-32" />
            </colgroup>
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold align-middle">#</th>
                <th className="px-6 py-3 font-semibold align-middle">Name</th>
                <th className="px-6 py-3 font-semibold align-middle">Email</th>
                <th className="px-6 py-3 font-semibold text-right align-middle">Applications</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">No data found</td>
                </tr>
              ) : (
                filteredData.map((user, index) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 align-middle">{index + 1}</td>
                    <td className="px-6 py-3 align-middle font-medium">{user.name}</td>
                    <td className="px-6 py-3 align-middle truncate">{user.email}</td>
                    <td className="px-6 py-3 text-right align-middle">{user.applicationsCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Companies Table */}
      {activeTab === "Companies" && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">#</th>
                <th className="px-6 py-3 font-semibold">Company Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold text-right">Jobs Posted</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-400">No companies found</td>
                </tr>
              ) : (
                filteredCompanies.map((company, index) => (
                  <tr key={company._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img src={company.image} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-xs text-gray-400">Company</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{company.email}</td>
                    <td className="px-6 py-3 text-right">
<span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
  {company.jobsPosted ?? 0}
</span>                   </td>
                    <td className="px-6 py-3 text-right">
                     <button 
  onClick={() => deleteCompany(company._id)} // نمرر الـ id بتاع الشركة هنا
  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 ml-auto"
>
  🗑️ Delete
</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, count, icon }) => (
  <div className="border p-5 rounded-xl shadow-sm bg-white">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500 font-semibold">{title}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

export default AdminManageUsers;