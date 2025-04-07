// Profile.tsx
"use client";

import { useState, useEffect } from "react";
import { backendUrl } from "@/app/config";
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
  address1?: string;
  address2?: string;
  city?: string;
  zip?: string;
  country?: string;
  langPref?: string;
  favCategory?: string;
  mylistOpt?: boolean;
  bannerOpt?: boolean;
}

export default function Profile() {
  const [activeModule, setActiveModule] = useState("info");
  // 模拟用户信息数据
  const [userInfo, setUserInfo] = useState<UserInfo | null>({
    firstName: "张",
    lastName: "三",
    email: "zhangsan@example.com",
    phone: "13800138000",
    address1: "北京市海淀区",
    address2: "",
    city: "北京",
    zip: "100000",
    country: "中国",
    langPref: "zh_CN",
    favCategory: "CATS",
    mylistOpt: true,
    bannerOpt: false
  });
  // 模拟订单数据
  const [orders, setOrders] = useState([
    {
      id: "ORD20240101001",
      status: "已完成",
      date: "2024-01-01",
      total: 299.00,
      items: [
        {name: "猫粮", quantity: 2, price: 99.50},
        {name: "猫玩具", quantity: 1, price: 100.00}
      ]
    },
    {
      id: "ORD20240102002",
      status: "待发货",
      date: "2024-01-02",
      total: 149.90,
      items: [
        {name: "猫砂", quantity: 1, price: 149.90}
      ]
    },
    {
      id: "ORD20240103003",
      status: "运输中",
      date: "2024-01-03",
      total: 59.90,
      items: [
        {name: "猫咪零食", quantity: 2, price: 29.95}
      ]
    }
  ]);
  // 模拟日志数据
  const [logs, setLogs] = useState([
    {
      message: "登录系统",
      timestamp: "2024-01-01 08:30:00",
      type: "login"
    },
    {
      message: "修改个人信息",
      timestamp: "2024-01-01 09:15:00",
      type: "update"
    },
    {
      message: "提交订单 ORD20240101001",
      timestamp: "2024-01-01 10:00:00",
      type: "order",
      details: "购买了猫粮和猫玩具"
    }
  ]);

  // 模拟API调用 - 将在后期替换为实际API调用
  useEffect(() => {
    // 这里将来会实现真正的API调用
    // 目前使用模拟数据
    console.log("将来这里会调用API: GET", `${backendUrl}/api/v1/account/me`);
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
      <div className="flex flex-col items-center py-12 bg-gray-100 min-h-screen">
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
              个人信息
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeModule === "orders"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveModule("orders")}
            >
              我的订单
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeModule === "logs"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveModule("logs")}
            >
              活动日志
            </button>
          </div>
          <div>{renderModule()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}