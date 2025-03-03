import { redirect } from "next/navigation"
import { springBoot } from "@/app/config"
export default async function LogOut() {
    const data = await fetch(`${springBoot}/api/logout`, {
        method: "GET",
        credentials: "include",// 确保携带cookie
    });
    const resp = await data.json();
    if (resp.ok) {
        redirect("/login")
    } else {
        redirect("/main")
    }
}