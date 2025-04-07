// LogsModule.tsx
import { Card, CardContent } from "@/components/ui/card";

// 定义日志项的类型
interface LogItem {
  message: string;
  timestamp: string;
  type?: string;
  details?: string;
}

export default function LogsModule({ logs }: { logs: LogItem[] }) {
  // 获取日志类型的样式
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

  if (!logs.length) {
    return <p>暂无日志。</p>;
  }

  return (
    <div className="space-y-4">
      {logs.map((log, index) => {
        // 提取日志类型
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