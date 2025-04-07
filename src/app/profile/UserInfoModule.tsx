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
        alert("Not logged in, please log in first");
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
        alert("😊Information modified successfully!");
      } else {
        const errorMsg = await response.text();
        console.error("Modification failed", errorMsg);
        alert("😔Information modified failed" + errorMsg);
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("😔Information modification failed, please try again later!");
    }
  };

  // 密码修改
  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("The new passwords entered twice are inconsistent!");
      return;
    }
  
    const currentToken = Cookies.get("token");
    if (!currentToken) {
      alert("Not logged in, please log in first");
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
        alert("Original password verification failed:" + msg);
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
        alert("Password changed successfully!");
      } else {
        const msg = await putResp.text();
        alert("Password modification failed:" + msg);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Password update failed, please try again later!");
    }
  };
  

  if (!userInfo) {
    return <p>loading...</p>;
  }

  return (
    <Card>
      <CardContent>
        {!showEditForm && !showPasswordForm ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{userInfo.firstName} {userInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mail</p>
                <p className="font-medium">{userInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{userInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{userInfo.address1}</p>
                {userInfo.address2 && <p className="font-medium">{userInfo.address2}</p>}
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{userInfo.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Post code</p>
                <p className="font-medium">{userInfo.zip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{userInfo.country}</p>
              </div>
              <div>
               <p className="text-sm text-gray-500">Language preference</p>
               <p className="font-medium">{userInfo.langPref === "zh_CN" ? "Chinese" : userInfo.langPref}</p>
              </div>
              <div>
               <p className="text-sm text-gray-500">Favorite categories</p>
               <p className="font-medium">
               {userInfo.favCategory === "FISH" ? "Fish" : 
                userInfo.favCategory === "DOGS" ? "Dogs" : 
                userInfo.favCategory === "CATS" ? "Cats" : 
                userInfo.favCategory === "REPTILES" ? "Reptiles" : 
                userInfo.favCategory === "BIRDS" ? "Birds" : 
                userInfo.favCategory}
              </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Notification options</p>
                <p className="font-medium">
                {userInfo.mylistOpt ? "Receive list updates" : "Do not receive list updates"},
                {userInfo.bannerOpt ? "Show banners" : "Do not show banners"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setShowEditForm(true)}
              >
                Modify personal information
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordForm(true)}
              >
                Change password
              </Button>
            </div>
          </>
        ) : showEditForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">firstName</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">lastName</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">phone</Label>
              <Input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address1">address1</Label>
              <Input
                id="address1"
                type="text"
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">address2</Label>
              <Input
                id="address2"
                type="text"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">city</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">zip</Label>
              <Input
                id="zip"
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">country</Label>
              <Input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="langPref">langPref</Label>
              <select 
                id="langPref"
                className="w-full p-2 border rounded"
                value={formData.langPref} 
                onChange={(e) => setFormData({ ...formData, langPref: e.target.value })}
              >
                <option value="">choose language</option>
                <option value="zh_CN">zh_CN</option>
                <option value="en_US">en_US</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favCategory">favCategory</Label>
              <select 
                id="favCategory"
                className="w-full p-2 border rounded"
                value={formData.favCategory} 
                onChange={(e) => setFormData({ ...formData, favCategory: e.target.value })}
              >
                <option value="">choose Category</option>
                <option value="FISH">FISH</option>
                <option value="DOGS">DOGS</option>
                <option value="CATS">CATS</option>
                <option value="REPTILES">REPTILES</option>
                <option value="BIRDS">BIRDS</option>
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
                <Label htmlFor="mylistOpt">mylistOpt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="bannerOpt" 
                  checked={formData.bannerOpt}
                  onChange={(e) => setFormData({ ...formData, bannerOpt: e.target.checked })}
                />
                <Label htmlFor="bannerOpt">bannerOpt</Label>
              </div>
            </div>
            <div className="col-span-2 flex gap-4 mt-4">
              <Button
                onClick={handleEditSubmit}
              >
                save information
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditForm(false)}
              >
                cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">current password</Label>
              <Input
                id="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">new password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">confirm password</Label>
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
                change password
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
                cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}