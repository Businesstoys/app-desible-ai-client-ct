"use client"

import React from "react"
import { useSelector } from "react-redux"
import { Clock, LayoutDashboard, LogsIcon, History } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavItem } from "./SidebarItem"
import { NavUser } from "./NavUser"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { name: "Logs", url: "/", icon: LogsIcon },
    { name: "Queued Calls", url: "/queued-calls", icon: Clock },
    { name: "Schedule Calls", url: "/schedule-calls", icon: History },
  ],
}

export function AppSidebar(props) {
  const { state } = useSidebar()
  const user = useSelector((s) => s.user)
  console.log({ user  })
  const isExpanded = state === "expanded"

  return (
    <Sidebar
      collapsible="icon"
      className="bg-white border-r border-gray-200 transition-[width,background-color,border-color] duration-300 ease-in-out"
      {...props}
    >
      <SidebarHeader className="border-b border-gray-200 h-16 flex items-center">
        <div
          className={
            "flex items-center justify-center h-full w-full " +
            (state === "expanded" ? "px-3" : "px-0")
          }
        >
  
          <div className="relative flex items-center justify-center w-48 h-8">
            <img
              src="/logo.png"
              alt="logo"
              className={
                "absolute  w-auto transition-all duration-300 ease-in-out " +
                (isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none")
              }
            />
            <img
              src="/ct-small.png"
              alt="logo compact"
              className={
                "absolute h-6 w-auto transition-all duration-300 ease-in-out " +
                (isExpanded ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100")
              }
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent
        className={
          "py-4 transition-opacity duration-200 " +
          (isExpanded ? "opacity-100" : "opacity-95")
        }
      >
        <NavItem items={data.projects} />
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail className="bg-gray-50" />
    </Sidebar>
  )
}