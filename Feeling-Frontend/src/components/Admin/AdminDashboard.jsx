import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { socket } from "@/lib/socket";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminData, logout } = useAdminAuthStore();

  const [stats, setStats] = useState({
    totalImages: 0,
    totalVideos: 0,
    totalCategories: 0,
    unreadChats: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/dashboard/stats");
        setStats(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();

    socket.emit("admin-join-dashboard");

    const handleNewMessage = () => fetchStats();
    socket.on("dashboard:newMessage", handleNewMessage);

    return () => {
      socket.off("dashboard:newMessage", handleNewMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#111] text-white p-8">
      <div className="flex justify-between mb-10">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

        <button
          onClick={logout}
          className="bg-white text-black px-2 py-1 custom-xsm:h-8 rounded-md"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-400 mb-8">
        Welcome back {adminData?.name || "Admin"}
      </p>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Images" value={stats.totalImages} />
        <StatCard title="Videos" value={stats.totalVideos} />
        <StatCard title="Categories" value={stats.totalCategories} />
        <StatCard
          title="Unread Chats"
          value={stats.unreadChats}
          onClick={() => navigate("/admin/chat")}
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-6">
        <ActionCard title="Open Chat" onClick={() => navigate("/admin/chat")} />
        <ActionCard
          title="Manage Gallery"
          onClick={() => navigate("/admin/gallery")}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#1c1c1c] p-5 rounded-xl cursor-pointer hover:bg-[#262626]"
    >
      <p className="text-gray-400">{title}</p>
      <h2 className="text-2xl font-semibold">{value}</h2>
    </div>
  );
}

function ActionCard({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#1c1c1c] p-6 rounded-xl cursor-pointer hover:bg-[#262626]"
    >
      <h2 className="text-xl">{title}</h2>
    </div>
  );
}
