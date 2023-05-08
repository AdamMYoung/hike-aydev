import { getCurrentUser } from "@/libs/session";
import Link from "next/link";
import { Button, Separator } from "ui";

export const Profile = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      {user.name ? <p className="whitespace-nowrap font-medium text-xl hidden md:block">Hi, {user.name}!</p> : null}

      <Separator orientation="vertical" />

      <Link href="/api/auth/signout">
        <Button className="whitespace-nowrap" variant="outline">
          Sign out
        </Button>
      </Link>
    </div>
  );
};
