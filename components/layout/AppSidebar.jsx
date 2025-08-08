"use client"

import React from "react"
import { useSelector } from "react-redux"
import { Clock, Contact, LayoutDashboard, LogsIcon, History, User } from "lucide-react"


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
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Contact List",
      url: "/contact-list",
      icon: Contact,
    },
    {
      name: "Logs",
      url: "/",
      icon: LogsIcon,
    },
    {
      name: "Queued Calls",      
      url: "/queued-calls",      
      icon: Clock,
    },
    {
      name: "Schedule Calls",
      url: "/schedule-calls",
      icon: History ,
    },
    {
      name: "Human Callbacks",
      url: "/human-callbacks",
      icon: User,
    }
  ],
}

export function AppSidebar(props) {
  const { state } = useSidebar()
  const user = useSelector((state) => state.user)

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200" {...props}>
      <SidebarHeader className="border-b border-gray-200 h-16 flex items-center">
        <div
          className={
            "flex items-center justify-center h-full w-full " +
            (state === "expanded" ? "px-3" : "px-2")
          }
        >
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="logo" className="w-16" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <NavItem items={data.projects} />
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail className="bg-gray-50" />
    </Sidebar>
  )
}