import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 定义订单项的类型
interface OrderItem {
  id: string;
  status: string;
}

export default function OrdersModule({ orders }: { orders: OrderItem[] }) {
  if (!orders.length) return <p>暂无订单。</p>;

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p>
                <strong>订单号:</strong> {order.id}
              </p>
              <p>
                <strong>状态:</strong> {order.status}
              </p>
              <Button variant="default" className="mt-2">
                申请退货
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}