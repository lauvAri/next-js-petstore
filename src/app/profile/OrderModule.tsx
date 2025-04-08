"use client";

import { useEffect, useState } from "react";
import { backendUrl } from "@/app/config";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define the type for the order item
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
  const [order, setOrderData] = useState({
    orderId: "",
    reason: "",
    description: "",
    image:""
  });

  // Fetch order data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("Not logged in. Please log in first.");
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
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Get order status style
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100 px-2 py-1 rounded";
      case "pending":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded";
      case "shipping":
        return "text-blue-600 bg-blue-100 px-2 py-1 rounded";
      case "cancelled":
        return "text-red-600 bg-red-100 px-2 py-1 rounded";
      default:
        return "text-gray-600 bg-gray-100 px-2 py-1 rounded";
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!orders.length) return <p>No orders available.</p>;

  // 退货申请
  const handleCancelSubmit = async () => {
  
    const currentToken = Cookies.get("token");
    if (!currentToken) {
      alert("Not logged in, please log in first");
      return;
    }
  
    try {
      const postResp = await fetch(`${backendUrl}/api/v1/account/myOrders/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          orderId: order.orderId,
          reason: order.reason,
          description: order.description,
          image: order.image
        })
      });
  
      if (!postResp.ok) {
        const msg = await postResp.text();
        alert("Return request failed:" + msg);
        return;
      }
    } catch (error) {
      console.error("Return request failed:", error);
      alert("Return request failed, please try again later!");
    }
  };

  return (
    <div className="grid gap-4">
      {orders.map((orderItem) => (
        <Card key={orderItem.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">Order ID: {orderItem.id}</h3>
                  {orderItem.date && (
                    <p className="text-sm text-gray-500">Date: {orderItem.date}</p>
                  )}
                </div>
                <span className={getStatusStyle(orderItem.status)}>
                  {orderItem.status}
                </span>
              </div>

              {orderItem.items?.length && orderItem.items.length > 0 && (
              <div className="mt-4">
              <h4 className="font-medium mb-2">Order Items</h4>
                 <div className="space-y-2">
                   {orderItem.items.map((item, index) => (
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
              {orderItem.total && (
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>¥{orderItem.total.toFixed(2)}</span>
                </div>
              )}
  
              <div className="flex gap-2 mt-4">
                <Button>View Details</Button>
  
                {orderItem.status.toLowerCase() === "pending" && (
                  <Button variant="outline">Cancel Order</Button>
                )}
  
                {orderItem.status.toLowerCase() === "completed" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setOrderData({
                          ...order,
                          orderId: orderItem.id,
                        })
                      }
                    >
                      Request Return
                    </Button>
  
                    {order.orderId === orderItem.id && (
                      <div className="grid gap-2 mt-4 p-4 border rounded-md bg-gray-50">
                        <Input
                          placeholder="Return Reason"
                          value={order.reason}
                          onChange={(e) =>
                            setOrderData({ ...order, reason: e.target.value })
                          }
                        />
                        <textarea
                          placeholder="Return Description"
                          value={order.description}
                          onChange={(e) =>
                            setOrderData({ ...order, description: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Image URL (optional)"
                          value={order.image}
                          onChange={(e) =>
                            setOrderData({ ...order, image: e.target.value })
                          }
                        />
                        <Button onClick={handleCancelSubmit}>Submit Return Request</Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
