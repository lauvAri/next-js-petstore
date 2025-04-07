// UserInfoModule.tsx
import { useState } from "react";
import { backendUrl } from "@/app/config";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";

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

export default function UserInfoModule({
  userInfo,
  setUserInfo,
}: {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState<UserInfo>({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    address1: userInfo?.address1 || "",
    address2: userInfo?.address2 || "",
    city: userInfo?.city || "",
    zip: userInfo?.zip || "",
    country: userInfo?.country || "",
    langPref: userInfo?.langPref || "",
    favCategory: userInfo?.favCategory || "",
    mylistOpt: userInfo?.mylistOpt || false,
    bannerOpt: userInfo?.bannerOpt || false,
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  //信息更新提交
  const handleEditSubmit = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("未登录，请先登录");
        return;
      }
  
      const response = await fetch(`${backendUrl}/api/v1/account/me/info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        const updatedInfo = await response.json();
        setUserInfo(updatedInfo); // 更新本地显示数据
        setShowEditForm(false);
        alert("信息修改成功！");
      } else {
        const errorMsg = await response.text();
        console.error("修改失败", errorMsg);
        alert("信息修改失败：" + errorMsg);
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("信息修改失败，请稍后再试！");
    }
  };

  // 密码修改
  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("两次输入的新密码不一致！");
      return;
    }
  
    const currentToken = Cookies.get("token");
    if (!currentToken) {
      alert("未登录，请先登录");
      return;
    }
  
    try {
      // 第一步：POST oldPassword + newPassword（验证原密码）
      const postResp = await fetch(`${backendUrl}/api/v1/auth/resetPsw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });
  
      if (!postResp.ok) {
        const msg = await postResp.text();
        alert("原密码验证失败：" + msg);
        return;
      }
  
      // 第二步：PUT newPassword（正式修改）
      const tempToken = await postResp.text(); // 假设返回的是 token 字符串
  
      const putResp = await fetch(`${backendUrl}/api/v1/auth/resetPsw`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempToken}`
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword
        })
      });
  
      if (putResp.ok) {
        setShowPasswordForm(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        alert("密码修改成功！");
      } else {
        const msg = await putResp.text();
        alert("密码修改失败：" + msg);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("密码更新失败，请稍后再试！");
    }
  };
  

  if (!userInfo) {
    return <p>加载中...</p>;
  }

  return (
    <Card>
      <CardContent>
        {!showEditForm && !showPasswordForm ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">姓名</p>
                <p className="font-medium">{userInfo.firstName} {userInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">邮箱</p>
                <p className="font-medium">{userInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">电话</p>
                <p className="font-medium">{userInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">地址</p>
                <p className="font-medium">{userInfo.address1}</p>
                {userInfo.address2 && <p className="font-medium">{userInfo.address2}</p>}
              </div>
              <div>
                <p className="text-sm text-gray-500">城市</p>
                <p className="font-medium">{userInfo.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">邮编</p>
                <p className="font-medium">{userInfo.zip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">国家</p>
                <p className="font-medium">{userInfo.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">语言偏好</p>
                <p className="font-medium">{userInfo.langPref === "zh_CN" ? "中文" : userInfo.langPref}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">喜爱分类</p>
                <p className="font-medium">
                  {userInfo.favCategory === "FISH" ? "鱼类" : 
                   userInfo.favCategory === "DOGS" ? "狗类" : 
                   userInfo.favCategory === "CATS" ? "猫类" : 
                   userInfo.favCategory === "REPTILES" ? "爬行动物" : 
                   userInfo.favCategory === "BIRDS" ? "鸟类" : 
                   userInfo.favCategory}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">通知选项</p>
                <p className="font-medium">
                  {userInfo.mylistOpt ? "接收清单更新" : "不接收清单更新"}，
                  {userInfo.bannerOpt ? "显示横幅" : "不显示横幅"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setShowEditForm(true)}
              >
                修改个人信息
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
              >
                修改密码
              </Button>
            </div>
          </>
        ) : showEditForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">名字</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">姓氏</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">电话</Label>
              <Input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address1">地址1</Label>
              <Input
                id="address1"
                type="text"
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">地址2（可选）</Label>
              <Input
                id="address2"
                type="text"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">城市</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">邮编</Label>
              <Input
                id="zip"
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">国家</Label>
              <Input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="langPref">语言偏好</Label>
              <select 
                id="langPref"
                className="w-full p-2 border rounded"
                value={formData.langPref} 
                onChange={(e) => setFormData({ ...formData, langPref: e.target.value })}
              >
                <option value="">选择语言</option>
                <option value="zh_CN">中文</option>
                <option value="en_US">英文</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favCategory">喜爱分类</Label>
              <select 
                id="favCategory"
                className="w-full p-2 border rounded"
                value={formData.favCategory} 
                onChange={(e) => setFormData({ ...formData, favCategory: e.target.value })}
              >
                <option value="">选择分类</option>
                <option value="FISH">鱼类</option>
                <option value="DOGS">狗类</option>
                <option value="CATS">猫类</option>
                <option value="REPTILES">爬行动物</option>
                <option value="BIRDS">鸟类</option>
              </select>
            </div>
            <div className="col-span-2 space-y-4 mt-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="mylistOpt" 
                  checked={formData.mylistOpt}
                  onChange={(e) => setFormData({ ...formData, mylistOpt: e.target.checked })}
                />
                <Label htmlFor="mylistOpt">接收清单更新通知</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="bannerOpt" 
                  checked={formData.bannerOpt}
                  onChange={(e) => setFormData({ ...formData, bannerOpt: e.target.checked })}
                />
                <Label htmlFor="bannerOpt">显示banner</Label>
              </div>
            </div>
            <div className="col-span-2 flex gap-4 mt-4">
              <Button
                onClick={handleEditSubmit}
              >
                保存信息
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditForm(false)}
              >
                取消
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">当前密码</Label>
              <Input
                id="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={handlePasswordSubmit}
              >
                修改密码
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                  });
                }}
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