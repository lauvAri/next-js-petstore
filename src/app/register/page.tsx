"use client"

import { springBoot } from "../config";

export default function Register() {
    async function handleSubmit(e: any) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
            email: formData.get("email"),
            favouriteCategoryId: formData.get("favouriteCategoryId"),
        }

        if (data.password !== formData.get("repeat-password")) {
            window.alert("两次密码不一致");
            return;
        }
        const resp = await fetch(`${springBoot}/api/register`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (resp.ok) {
            window.alert("注册成功");
            window.location.href = "/login";
            return;
        } else {
            window.alert("注册失败");
        }
    }
    return (
        <div className="bg-linear-to-r/srgb from-indigo-500 to-teal-400
            h-screen w-screen flex flex-col justify-center items-center">
            <div className="flex justify-center items-center
            bg-white rounded-lg p-8 w-fit">
                <div>
                    <figure>
                        <img src="/images/signup-image.jpg" alt="sign in image" />
                    </figure>
                    <a href="/login"
                    className="underline">already have an account</a>
                </div>
                <div>
                    <form method="post"
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 bg-white p-4 
                        border-2 border-black rounded-md shadow-md w-70">
                        <div>
                            <label htmlFor="username">Username</label>
                            <br />
                            <input type="text" id="username" name="username" required
                                className="p-2 border-2 border-black rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <br />
                            <input type="email" id="email" name="email" required
                                className="p-2 border-2 border-black rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <br />
                            <input type="password" id="password" name="password" required
                                className="p-2 border-2 border-black rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="repeat-password">Repeat password</label>
                            <br />
                            <input type="password" id="repeat-password" name="repeat-password" required
                                className="p-2 border-2 border-black rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="favouriteCategoryId">favourite animals</label>
                            <br />
                            <select name="favouriteCategoryId" id="favouriteCategoryId"
                                className="p-2 border-2 border-black rounded-md" required
                                defaultValue="BIRDS">
                                <option value="BIRDS">birds</option>
                                <option value="CATS">cats</option>
                                <option value="DOGS">dogs</option>
                                <option value="FISH">fish</option>
                                <option value="REPTILES">reptiles</option>
                            </select>
                        </div>
                        <button type="submit"
                            className="bg-black text-white p-4 rounded-md
                            cursor-pointer"
                            >Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}