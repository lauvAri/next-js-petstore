import { Card, CardContent } from "@/components/ui/card";

// 定义日志项的类型
interface LogItem {
  message: string;
  timestamp: string;
}

export default function LogsModule({ logs }: { logs: LogItem[] }) {
  if (!logs.length) return <p>暂无日志。</p>;

  return (
    <div className="grid gap-4">
      {logs.map((log, index) => (
        <Card key={index}>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p className="font-medium">{log.message}</p>
              <p className="text-sm text-gray-500">{log.timestamp}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}