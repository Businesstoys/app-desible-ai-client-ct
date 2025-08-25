'use client'
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCookie } from "cookies-next" 

import PanelLayout from "@/components/layout/Layout"
import { CONSTANTS } from "@/constants"


export default function Layout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname?.startsWith('/dashboard')

  useEffect(() => {
    const token = getCookie(CONSTANTS.TOKEN_KEY)
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <PanelLayout scroll={isDashboard ? "page" : "container"}>
      {children}
    </PanelLayout>
  )
}
