"use client";

import React from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

export default function PanelLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <div className="flex-1 overflow-auto">
            <SidebarInset>{children}</SidebarInset>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}