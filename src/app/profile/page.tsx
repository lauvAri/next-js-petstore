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

// Define the type for user information
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
  // Simulate user information data
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

  // API call to display user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = Cookies.get("token"); // Get token from Cookie
        if (!token) {
          alert("Not logged in or token does not exist, please log in again.");
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
          console.log("Fetched user info:", data);
          setUserInfo(data); // Set the state with fetched data
        } else if (response.status === 401) {
          alert("Unauthorized or login has expired, please log in again.");
        } else {
          alert("Failed to fetch user information.");
          console.error("Error response:", await response.text());
        }
      } catch (error) {
        console.error("Request error:", error);
        alert("Network error, please try again later.");
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
              Profile
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeModule === "orders"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveModule("orders")}
            >
              Orders
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeModule === "logs"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveModule("logs")}
            >
              Logs
            </button>
          </div>
          <div>{renderModule()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
