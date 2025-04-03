import Icon from "@mdi/react";
import { mdiCart, mdiPaw } from '@mdi/js';
import { SearchDialog } from '@/app/main/searchDialog';
import Link from "next/link";
export default function Header() { 
    return (
        <div className="bg-black flex justify-between items-center h-fit">
            <div className="ml-12">
                <Link href="/main"><Icon className="text-white" path={ mdiPaw} size={5}></Icon></Link>
            </div>
            <div className="flex gap-4 text-white">
                <Link href="/cart"><Icon path={ mdiCart} size={1}></Icon></Link>
                {isSignIn()}
            </div>
            <div className="mr-12">
                <SearchDialog />
            </div>
        </div>
    )
}

function isSignIn() {
    if (true) {
        return (
            <>
                <Link href="/logout">Sign Out</Link>
                <Link href="/profile">My Profile</Link>
            </>
        )
    }
    return (
        <Link href="/login">Sign In</Link>
    )
}