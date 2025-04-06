import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { springBoot } from "@/app/config";

// 定义用户信息的类型
interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function UserInfoModule({
  userInfo,
  setUserInfo,
}: {
  userInfo: UserInfo | null; // 允许 userInfo 为 null
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState<UserInfo>({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
  });

  const handleEditSubmit = async () => {
    try {
      const resp = await fetch(`${springBoot}/api/v1/account/me/info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (resp.ok) {
        alert("信息修改成功！");
        setUserInfo(formData); // 确保传递的值符合 UserInfo 类型
        setShowEditForm(false);
      } else {
        alert("信息修改失败！");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  if (!userInfo) {
    return <p>加载中...</p>; // 当 userInfo 为 null 时显示加载状态
  }

  return (
    <Card>
      <CardContent>
        {!showEditForm ? (
          <>
            <p>
              <strong>姓名:</strong> {userInfo.firstName} {userInfo.lastName}
            </p>
            <p>
              <strong>邮箱:</strong> {userInfo.email}
            </p>
            <p>
              <strong>电话:</strong> {userInfo.phone}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowEditForm(true)}
            >
              修改信息
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="姓名"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="姓氏"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            <Input
              type="email"
              placeholder="邮箱"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="电话"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <div className="flex gap-4">
              <Button
                variant="default"
                onClick={handleEditSubmit}
              >
                提交
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditForm(false)}
              >
                取消
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}