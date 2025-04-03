"use client"

import { springBoot } from "@/app/config";
import { useRouter } from "next/navigation";
export default function LogIn() {
    const router = useRouter();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
        }
        const resp = await fetch(`${springBoot}/api/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'  // 确保携带Cookie
        })
        if (resp.ok) {
            router.push('/main');
            return;
        } else {
             window.alert("用户名或密码错误");
        }

    }
    return (
        <div className="bg-linear-to-r/srgb from-indigo-500 to-teal-400
            h-screen w-screen flex flex-col justify-center items-center">
            <div className="flex justify-center items-center
            bg-white rounded-lg p-8 w-fit">
                <div>
                    <figure>
                        <img src="/images/signin-image.jpg" alt="sign in image" />
                    </figure>
                    <a href="/register"
                    className="underline">create an account</a>
                </div>
                <div>
                    <form method="post"
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 bg-white p-4 
                        border-2 border-black rounded-md shadow-md w-70">
                        <div>
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" required
                                className="p-2 border-2 border-black rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" required
                                className="p-2 border-2 border-black rounded-md"/>
                        </div>
                        <button type="submit"
                            className="bg-black text-white p-4 rounded-md
                            cursor-pointer"
                            >Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}