"use client";

import Link from "next/link";
import React from "react";
import {
  cn,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "ui";

type DesktopLinksProps = {
  isUserAuthenticated?: boolean;
};

export const DesktopLinks = ({ isUserAuthenticated }: DesktopLinksProps) => {
  return (
    <NavigationMenu className="hidden md:flex z-20">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tracking</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {isUserAuthenticated ? (
                <ListItem title="Your Timeline" href="/timeline">
                  View all your tracked fells and peaks, organized by date.
                </ListItem>
              ) : null}
              <ListItem title="All Groups" href="/">
                All possible groups available to track on hike.aydev.
              </ListItem>
              <ListItem title="Wainwrights" href="/group/1">
                The 214 peaks in the Lake District, as discovered by Alfred Wainwright.
              </ListItem>
              <ListItem title="Munros" href="/group/2">
                The 282 mountains and hills in the Scottish Highlands, named after Sir Hugh T Munro.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Gear</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              <ListItem title="Your Gear" href="/gear">
                Every piece of gear you&apos;ve logged in your lists, along with usage statistics.
              </ListItem>
              <ListItem title="Your Lists" href="/gear/lists">
                View all your lists, and control active lists here.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {isUserAuthenticated ? (
          <NavigationMenuItem>
            <Link href="/profile" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Profile</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ) : null}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
