"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  TrendingUp,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

type UserRole = "officer" | "viewer";

const MENU = [
  {
    title: "Forecast Accuracy",
    icon: LayoutDashboard,
    roles: ["officer", "viewer"],
    children: [
      {
        title: "Executive Summary",
        href: "/forecast-accuracy/executive_summary",
        icon: BarChart3,
      },
      {
        title: "Trend Analysis",
        href: "/forecast-accuracy/trend_analysis",
        icon: TrendingUp,
      },
      {
        title: "Plant Performance Detail",
        href: "/forecast-accuracy/plant_performance_detail",
        icon: FileText,
      },
    ],
  },
];

export function AppSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sidebar
      collapsible="icon"
      className="
        border-r
        transition-all duration-300
        data-[collapsible=icon]:w-[56px]
        data-[collapsible=icon]:min-w-[56px]
      "
    >
      {/* ================= HEADER ================= */}
      <SidebarHeader className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold truncate group-data-[collapsible=icon]:hidden">
          Forecast Accuracy
        </span>
        <SidebarTrigger />
      </SidebarHeader>

      {/* ================= MENU ================= */}
      <SidebarContent>
        <SidebarMenu>
          {MENU.map((group) => {
            if (!group.roles.includes(role)) return null;

            const isActiveGroup = group.children.some(
              (child) => pathname === child.href
            );

            return (
              <Collapsible
                key={group.title}
                defaultOpen={isActiveGroup}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "flex items-center gap-2",
                        "group-data-[collapsible=icon]:justify-center",
                        isActiveGroup && "bg-muted"
                      )}
                    >
                      <group.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {group.title}
                      </span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>

                <CollapsibleContent>
                  <SidebarMenu className="ml-6 mt-1 space-y-1 group-data-[collapsible=icon]:ml-0">
                    {group.children.map((child) => {
                      const isActive = pathname === child.href;

                      return (
                        <SidebarMenuItem key={child.href}>
                          <SidebarMenuButton
                            asChild
                            tooltip={child.title}
                            className={cn(
                              "flex items-center gap-2",
                              "group-data-[collapsible=icon]:justify-center",
                              isActive &&
                                "bg-accent text-accent-foreground font-medium"
                            )}
                          >
                            <Link href={child.href}>
                              <child.icon className="h-4 w-4 shrink-0" />
                              <span className="truncate group-data-[collapsible=icon]:hidden">
                                {child.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* ================= USER PROFILE ================= */}
      <SidebarFooter className="p-3">
        <Separator className="mb-3 group-data-[collapsible=icon]:hidden" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex w-full items-center gap-3 rounded-md p-2
                hover:bg-muted transition
                group-data-[collapsible=icon]:justify-center
              "
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {session?.user?.name?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-left truncate group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium truncate">
                  {session?.user?.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </span>
                <span className="text-[11px] capitalize text-primary">
                  {session?.user?.role}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-red-600"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
