"use client";

import { useState, useEffect } from "react";
import { springBoot } from "@/app/config";
import { redirect } from "next/navigation";
import Header from "@/app/common/header";
import Footer from "@/app/common/footer";
import UserInfoModule from "./UserInfoModule";
import OrdersModule from "./OrderModule";
import LogsModule from "./LogsModule";

// 定义用户信息的类型
interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function Profile() {
  const [activeModule, setActiveModule] = useState("info");
  const [userInfo, setUserInfo] = useState<UserInfo | null>({
    firstName: "张",
    lastName: "三",
    email: "zhangsan@example.com",
    phone: "13800138000"
  }); // 添加模拟用户数据
  const [orders, setOrders] = useState([
    {
      id: "ORD20240101001",
      status: "已完成"
    },
    {
      id: "ORD20240102002",
      status: "待发货"
    },
    {
      id: "ORD20240103003",
      status: "运输中"
    }
  ]);
  const [logs, setLogs] = useState([
    {
      message: "登录系统",
      timestamp: "2024-01-01 08:30:00"
    },
    {
      message: "修改个人信息",
      timestamp: "2024-01-01 09:15:00"
    },
    {
      message: "提交订单 ORD20240101001",
      timestamp: "2024-01-01 10:00:00"
    }
  ]);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const resp = await fetch(`${springBoot}/api/v1/account/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (resp.ok) {
          const data = await resp.json();
          setUserInfo(data);
        } else {
          redirect("/login");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    fetchUserInfo();
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case "info":
        return <UserInfoModule userInfo={userInfo} setUserInfo={setUserInfo} />;
      case "orders":
        return <OrdersModule orders={orders} />;
      case "logs":
        return <LogsModule logs={logs} />;
      default:
        return <UserInfoModule userInfo={userInfo} setUserInfo={setUserInfo} />;
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center py-12 bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-md w-full max-w-4xl">
          <div className="flex justify-center gap-4 mb-8">
            <button
              className={`px-4 py-2 rounded ${
                activeModule === "info"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveModule("info")}
            >
              infomation
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeModule === "orders"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveModule("orders")}
            >
              Order
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeModule === "logs"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveModule("logs")}
            >
              log
            </button>
          </div>
          <div>{renderModule()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}