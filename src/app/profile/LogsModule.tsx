"use client";

import { useEffect, useState } from "react";
import { backendUrl } from "@/app/config";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";

// 定义日志项的类型
interface LogItem {
  message: string;
  timestamp: string;
  type?: string;
  details?: string;
}

export default function LogsModule() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("未登录，请先登录！");
          setLoading(false);
          return;
        }

        const response = await fetch(`${backendUrl}/api/v1/account/me/myJournal`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const msg = await response.text();
          throw new Error(msg);
        }

        const data = await response.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message || "获取日志失败");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getLogTypeStyle = (type?: string) => {
    if (!type) return "";

    switch (type.toLowerCase()) {
      case "login":
      case "登录":
        return "border-l-4 border-blue-500";
      case "order":
      case "订单":
        return "border-l-4 border-green-500";
      case "update":
      case "更新":
        return "border-l-4 border-yellow-500";
      case "error":
      case "错误":
        return "border-l-4 border-red-500";
      default:
        return "";
    }
  };

  if (loading) return <p>日志加载中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!logs.length) return <p>暂无日志。</p>;

  return (
    <div className="space-y-4">
      {logs.map((log, index) => {
        let logType = log.type;
        if (!logType) {
          if (log.message.includes("登录")) logType = "login";
          else if (log.message.includes("订单")) logType = "order";
          else if (log.message.includes("修改")) logType = "update";
        }

        return (
          <Card key={index} className={getLogTypeStyle(logType)}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{log.message}</p>
                <p className="text-sm text-gray-500">{log.timestamp}</p>
                {log.details && (
                  <p className="text-sm mt-2 text-gray-600">{log.details}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
