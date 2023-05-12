"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, ElementProps } from "ui";

const isHrefMatching = (href: string, pathname: string | null) => {
  if (!pathname) {
    return false;
  }

  if (href === "/") {
    return pathname === "/" || pathname.includes("/group");
  }

  return pathname === href;
};

export const NavigationLink = ({
  children,
  className,
  href,
  disabled,
  ...rest
}: ElementProps<typeof Link> & { disabled?: boolean }) => {
  const pathname = usePathname();
  const _className = cn(
    "text-md p-2 font-normal",
    isHrefMatching(href as string, pathname) && "font-semibold",
    disabled && "text-gray-400",
    className
  );

  return (
    <Link
      href={disabled ? "" : href}
      className={_className}
      aria-current={href === pathname ? "page" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
};
