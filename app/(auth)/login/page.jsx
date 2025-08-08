"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import { msalInstance } from "@/lib/msalConfig";
import api from "@/store/api";

import { CONSTANTS } from "@/constants";
import { Separator } from "@/components/ui/separator";
import MicrosoftButton from "@/components/ui/microsoft-button";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast";
import { useLoginMutation } from "@/store";

export default function Page() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch()
    
    const [login] = useLoginMutation()


    useEffect(() => {
        localStorage.removeItem("msal.interaction.status")
        msalInstance.initialize().then(console.log)
        setCookie(CONSTANTS.TOKEN_KEY, "")
        dispatch(api.util.resetApiState())
    }, []);

    const handleMicrosoftLogin = async () => {
        setLoading(true)
        try {
            const loginResponse = await msalInstance.loginPopup({
                scopes: ["openid", "profile", "email"],
            });

            const token = loginResponse.idToken;
            debugger
            const response = await login({ token }).unwrap()
            if (response?.status === 'success') {
                setCookie(CONSTANTS.TOKEN_KEY, response?.data?.token)
                showSuccessToast(_,'Loging Successfullly')
                router.push("/dashboard")
            }
        } catch (error) {
            showErrorToast("Failed", {
                description: error?.message,
            })
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-md p-8 border border-border">
                {/* Logo */}
                <div className="text-center mb-2">
                    <div className="flex items-center justify-center mb-4">
                        <img src="/logo.png" className="w-[283.111px] h-[56px]" />
                    </div>
                </div>

                <div className="text-center mb-6">
                    {/* <h1 className="text-textDark text-center text-[30px] font-semibold leading-relaxed tracking-normal">
                        Empower Your Calls with AI
                    </h1> */}
                    <p className="text-base text-gray-500 leading-relaxed tracking-normal">
                        Sign in to streamline your calling experience and access real-time analytics.
                    </p>
                </div>

                <Separator className="my-8 bg-[#E5E5E5]" />
            
                <MicrosoftButton onClick={handleMicrosoftLogin} loading={loading} />
            </div>
        </div>
    );
}