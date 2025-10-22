'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  CaseSensitive,
  LayoutDashboard,
  Settings,
  PanelLeft,
} from 'lucide-react';
import { Icons } from './icons';
import { Button } from './ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const links = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/analysis-tools',
    label: 'Analysis Tools',
    icon: CaseSensitive,
  },
];

const bottomLinks = [
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export function Nav() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <PanelLeft className="size-5" />
            </Button>
          <Icons.Logo className="size-6 text-accent" />
          <h1 className="text-lg font-semibold font-headline">CyberSentinel AI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='p-2'>
        <SidebarMenu>
            {bottomLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === link.href}
                      tooltip={link.label}
                    >
                      <Link href={link.href}>
                        <link.icon />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
