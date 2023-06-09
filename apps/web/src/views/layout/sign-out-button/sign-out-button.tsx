import Link from "next/link";
import { Button, cn, ElementProps } from "ui";

import { getCurrentUser } from "@libs/session";

export const SignOutButton = async ({ className, ...rest }: ElementProps<typeof Button>) => {
  const _className = cn("whitespace-nowrap h-auto", className);
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <Link legacyBehavior href="/api/auth/signout">
      <Button className={_className} {...rest}>
        Sign out
      </Button>
    </Link>
  );
};
