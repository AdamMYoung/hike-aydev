import Link from "next/link";
import { Button } from "ui";

import { getCurrentUser } from "@libs/session";

export const Profile = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link href="/login" passHref legacyBehavior>
        <Button className="my-auto">Login</Button>
      </Link>
    );
  }

  return null;
};
