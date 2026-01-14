"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
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

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

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
        roles: ["officer", "viewer"],
      },
      {
        title: "Trend Analysis",
        href: "/forecast-accuracy/trend_analysis",
        icon: TrendingUp,
        roles: ["officer", "viewer"],
      },
      {
        title: "Plant Performance Detail",
        href: "/forecast-accuracy/plant_performance_detail",
        icon: FileText,
        roles: ["officer", "viewer"],
      },
    ],
  },
];

export function AppSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-between px-4 py-3">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold">Forecast Accuracy</p>

          {status === "loading" ? (
            <div className="space-y-1">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-3 w-40 bg-muted rounded" />
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
              {/* <p className="text-[11px] font-medium capitalize text-primary">
                {session?.user?.role}
              </p> */}
            </>
          )}
        </div>

        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {MENU.map((group) => {
            if (!group.roles.includes(role)) return null;

            const isGroupActive = group.children.some(
              (child) => pathname === child.href
            );

            return (
              <Collapsible
                key={group.title}
                defaultOpen={isGroupActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        isGroupActive && "bg-muted text-foreground"
                      )}
                    >
                      <group.icon className="h-4 w-4" />
                      <span>{group.title}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>

                <CollapsibleContent>
                  <SidebarMenu className="ml-6 mt-1 space-y-1">
                    {group.children.map((child) => {
                      const isActive = pathname === child.href;

                      return (
                        <SidebarMenuItem key={child.href}>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              isActive &&
                                "bg-accent text-accent-foreground font-medium"
                            )}
                          >
                            <Link href={child.href}>
                              <child.icon className="h-4 w-4" />
                              <span>{child.title}</span>
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
    </Sidebar>
  );
}
