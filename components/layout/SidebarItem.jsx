"use client"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({ items }) {
    const { state } = useSidebar();
    const pathname = usePathname();

    return (
        <SidebarGroup
            className={`group-data-[collapsible=icon]:${
                state === 'expanded' ? "hidden" : "flex"
            }`}
        >
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname === item.url;
                    
                    return (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild>
                                <Link
                                    href={item.url}
                                    className={`flex items-center justify-start w-full h-12 px-4 rounded-md transition-colors duration-200 ${
                                        isActive 
                                            ? "bg-[#F3F4F5]" 
                                            : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    <item.icon 
                                        className={isActive ? "text-primary" : "text-gray-500"} 
                                        size={20} 
                                    />
                                    {state === 'expanded' && (
                                        <span className={`ml-2 text-[14px] font-medium leading-normal tracking-[-0.28px] ${
                                            isActive ? "text-primary" : "text-textCustomDark"
                                        }`}>
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}