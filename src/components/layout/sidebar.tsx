"use client";

import { useState } from "react";
import { LayoutDashboard, FileText, Users, Box, ShoppingCart, BarChart3, Settings, ChevronDown, PlusSquare, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`relative ${isExpanded ? "w-64" : "w-[72px]"} bg-[#0453B8] h-screen flex flex-col transition-all duration-300 ease-in-out shrink-0 z-50`}>
      <div className="flex-1 flex flex-col hide-scrollbar overflow-y-auto overflow-x-hidden">
        {/* Logo Area */}
        <div className={`p-6 pb-2 flex items-center ${isExpanded ? "justify-start" : "justify-center px-0"}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white shrink-0">
          <path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H7C7.55228 21 8 20.5523 8 20V4C8 3.44772 7.55228 3 7 3H4Z" fill="currentColor"/>
          <path d="M9 12.5L19 4.5C19.5 4.1 20.2 4.4 20.2 5V8.5L13 12.5L20.2 16.5V20C20.2 20.6 19.5 20.9 19 20.5L9 12.5Z" fill="currentColor"/>
        </svg>
      </div>

        <nav className={`flex-1 py-4 space-y-1 ${isExpanded ? "px-4" : "px-2"}`}>
          <Link href="/" className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors`}>
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="truncate">Dashboard</span>}
          </Link>

          {/* Sales (Active Dropdown) */}
          <div className="relative pt-2 pb-1">
            {/* Active Glowing Highlight */}
            <div className="absolute left-[-16px] top-4 w-1 h-8 bg-blue-300 rounded-r-md shadow-[0_0_12px_rgba(147,197,253,0.8)]" />
            
            <Link href="#" className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium text-white bg-transparent rounded-md`}>
              <PlusSquare className="w-5 h-5 shrink-0" />
              {isExpanded && (
                <>
                  <span className="truncate">Sales</span>
                  <ChevronDown className="w-4 h-4 ml-auto opacity-70 shrink-0" />
                </>
              )}
            </Link>
            
            {isExpanded && (
              <div className="pl-11 pr-2 py-1 space-y-1">
                <Link href="/sales-orders" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1a66c4] rounded-md truncate">
                  Orders
                </Link>
                <Link href="#" className="flex items-center px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors truncate">
                  Quotations
                </Link>
                <Link href="#" className="flex items-center px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-colors truncate">
                  Invoices
                </Link>
              </div>
            )}
          </div>

          <Link href="#" className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors`}>
            <Users className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="truncate">Customers</span>}
          </Link>
          <Link href="#" className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors`}>
            <Box className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="truncate">Products</span>}
          </Link>
          <Link href="#" className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors`}>
            <ShoppingCart className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="truncate">Inventory</span>}
          </Link>
          <Link href="#" className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors`}>
            <FileText className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="truncate">Reports</span>}
          </Link>
          <Link href="#" className={`flex items-center ${isExpanded ? "gap-3 px-3" : "justify-center px-0"} py-2.5 text-sm font-medium text-white/80 rounded-md hover:text-white hover:bg-white/10 transition-colors`}>
            <Settings className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="truncate">Settings</span>}
          </Link>
        </nav>

        {/* User Profile */}
        <div className={`p-6 mt-auto ${isExpanded ? "" : "px-0 flex justify-center"}`}>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 shrink-0 bg-white text-[#0453B8] rounded-md flex items-center justify-center font-bold text-sm">
              JD
            </div>
            {isExpanded && (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">Jayesh D.</span>
                  <span className="text-xs text-blue-200/80 truncate">Admin</span>
                </div>
                <ChevronDown className="w-4 h-4 text-white/70 ml-auto shrink-0" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-sm shadow-sm flex items-center justify-center z-50 text-slate-500 hover:text-slate-700"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
