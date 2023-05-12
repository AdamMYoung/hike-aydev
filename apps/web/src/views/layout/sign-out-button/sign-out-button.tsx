import Link from "next/link";
import { Button, cn, ElementProps } from "ui";

import { getCurrentUser } from "@libs/session";

export const SignOutButton = async ({ className, ...rest }: ElementProps<typeof Button>) => {
  const _className = cn("whitespace-nowrap ", className);
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <Link legacyBehavior href="/api/auth/signout">
      <Button className={className} variant="outline" {...rest}>
        Sign out
      </Button>
    </Link>
  );
};
