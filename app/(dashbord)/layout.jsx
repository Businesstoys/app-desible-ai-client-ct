'use client'
import PanelLayout from "@/components/layout/Layout";
import { CONSTANTS } from "@/constants";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
    const router = useRouter()
    const token = localStorage.getItem(CONSTANTS.TOKEN_KEY)
    if (!token) return router.push('/login')

    return <PanelLayout> {children}</PanelLayout>
}
