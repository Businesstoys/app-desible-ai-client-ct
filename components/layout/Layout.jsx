// PanelLayout.jsx
"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";


export default function PanelLayout({ children, scroll = "container" }) {
  const rootClass =
    scroll === "page"
      ? "flex min-h-screen w-full" // allow body/window to scroll
      : "flex h-screen w-full overflow-hidden"; // lock frame to viewport

  const contentShellClass =
    scroll === "page"
      ? "flex flex-col w-full" // no forced overflow here
      : "flex flex-col w-full";

  // Header is typically h-16 (64px). Adjust if your Header height differs.
  const contentAreaClass =
    scroll === "page"
      ? "flex-1 bg-gray-100 overflow-visible" // let page handle scrolling
      : "flex-1 bg-gray-100 overflow-hidden";  // prevent page scroll

  return (
    <SidebarProvider>
      <div className={rootClass}>
        <AppSidebar />

        <div className={contentShellClass}>
          <Header />

          <div className={contentAreaClass}>
            {scroll === "page" ? (
              // PAGE SCROLL: no fixed height, so the document scrolls
              <SidebarInset className="min-h-[calc(100vh-64px)]">
                {children}
              </SidebarInset>
            ) : (
              // CONTAINER SCROLL: fixed height under header; only this area scrolls
              <div className="h-[calc(100vh-64px)] ">
                <SidebarInset className="min-w-0">{children}</SidebarInset>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}