"use client"

import {
  ChevronsUpDown,
  LogOut,
  User,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export function NavUser({ user }) {
  const { isMobile, state } = useSidebar()
  const router = useRouter()

  // Create initials from user name for avatar fallback
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U'

  const handleOnClickLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                grid grid-cols-[auto_1fr_auto] items-center gap-2
                data-[state=open]:bg-sidebar-accent
                data-[state=open]:text-sidebar-accent-foreground
                hover:bg-gray-100 transition-colors duration-200
              "
            >
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {state === 'expanded' && (
                <div className="grid flex-1 gap-0.5 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{'Omkar R'}</span>
                  <span className="truncate text-xs text-gray-500">{'omkar.r@vitrin9.com'}</span>
                </div>
              )}

              <ChevronsUpDown className="size-4 text-gray-500" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-md border border-gray-200"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="grid grid-cols-[auto_1fr] items-center gap-3 p-3 text-left">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-0.5 text-left leading-tight">
                  <span className="font-semibold text-gray-900">{'Omkar R'}</span>
                  <span className="text-sm text-gray-500">{'omkar.r@vitrin9.com'}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 py-2.5 hover:bg-gray-50">
              <User className="size-4 text-gray-500" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleOnClickLogout}
              className="flex items-center gap-2 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}