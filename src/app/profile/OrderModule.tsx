"use client";

import { useEffect, useState } from "react";
import { backendUrl } from "@/app/config";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 定义订单项的类型
interface OrderItem {
  id: string;
  status: string;
  date?: string;
  total?: number;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersModule() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 拉取订单数据
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("未登录，请先登录！");
          setLoading(false);
          return;
        }

        const response = await fetch(`${backendUrl}/api/v1/account/me/myOrders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const msg = await response.text();
          throw new Error(msg);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "获取订单失败");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 获取订单状态的样式
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "已完成":
      case "completed":
        return "text-green-600 bg-green-100 px-2 py-1 rounded";
      case "待发货":
      case "pending":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded";
      case "运输中":
      case "shipping":
        return "text-blue-600 bg-blue-100 px-2 py-1 rounded";
      case "已取消":
      case "cancelled":
        return "text-red-600 bg-red-100 px-2 py-1 rounded";
      default:
        return "text-gray-600 bg-gray-100 px-2 py-1 rounded";
    }
  };

  if (loading) return <p>订单加载中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!orders.length) return <p>暂无订单。</p>;

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">订单号: {order.id}</h3>
                  {order.date && (
                    <p className="text-sm text-gray-500">日期: {order.date}</p>
                  )}
                </div>
                <span className={getStatusStyle(order.status)}>
                  {order.status}
                </span>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">订单商品</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>¥{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.total && (
                <div className="flex justify-between font-bold mt-2">
                  <span>总计</span>
                  <span>¥{order.total.toFixed(2)}</span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button>查看详情</Button>
                {["待发货", "pending"].includes(order.status.toLowerCase()) && (
                  <Button variant="outline">取消订单</Button>
                )}
                {["已完成", "completed"].includes(order.status.toLowerCase()) && (
                  <Button variant="outline">申请退货</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
