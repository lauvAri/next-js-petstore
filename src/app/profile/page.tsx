// page.tsx
"use client";

import { useState, useEffect } from "react";
import { backendUrl } from "@/app/config";
import Cookies from "js-cookie";
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
    firstName: "X",
    lastName: "X",
    email: "xxx@example.com",
    phone: "xxxxxxxxx",
    address1: "xxxxxxx",
    address2: "",
    city: "xx",
    zip: "xxxxxx",
    country: "xx",
    langPref: "xx",
    favCategory: "xxx",
    mylistOpt: true,
    bannerOpt: false
  });

  //api调用  显示用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get("token"); // 从 Cookie 获取 token
        if (!token) {
          alert("未登录或token不存在，请重新登录");
          return;
        }
  
        const response = await fetch(`${backendUrl}/api/v1/account/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("获取的用户信息：", data);
          setUserInfo(data); // 设置到 state 中
        } else if (response.status === 401) {
          alert("未授权或登录已过期，请重新登录");
        } else {
          alert("获取用户信息失败");
          console.error("Error response:", await response.text());
        }
      } catch (error) {
        console.error("请求错误:", error);
        alert("网络错误，请稍后再试");
      }
    };
  
    fetchUserInfo();
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case "info":
        return <UserInfoModule userInfo={userInfo} setUserInfo={setUserInfo} />;
        case "orders":
          return <OrdersModule />;
      case "logs":
        return <LogsModule />; 
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