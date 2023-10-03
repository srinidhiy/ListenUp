"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image";

export default function Welcome() {
    const router = useRouter();
    return (
        <div>
            <div>
                <h1 className="head-text">Track what albums you listen to.</h1>
                <h1 className="head-text">Share with your friends.</h1>
                <div className="flex" >
                    <Button className="mt-5 user-card_btn" onClick = {() => router.push("/sign-up")}>
                        Sign Up Now!
                    </Button>
                    <Button className="mt-5 ml-3 user-card_btn" onClick = {() => router.push("/sign-in")}>
                        Login
                    </Button>
                </div>
            </div>
            <div className="flex mt-10">
                <Image
                    className="rounded-lg"
                    src="/assets/phone_screenshot.jpg"
                    alt="Phone Screenshot"
                    height={500}
                    width={250}
                />
                <Image
                    className="rounded-lg ml-5"
                    src="/assets/album_screenshot.png"
                    alt="Album Screenshot"
                    height={500}
                    width={700}
                />
            </div>
        </div>
    )
    
}