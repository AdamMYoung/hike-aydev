import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage, Button, buttonVariants, cn } from "ui";

import { getCurrentUser } from "@libs/session";

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
    <div className="flex gap-4 items-center">
      <Link href="/profile" className={cn("flex gap-2  items-center", buttonVariants({ variant: "ghost" }), "py-6")}>
        <Avatar>
          <AvatarFallback>{user.name?.substring(0, 1)}</AvatarFallback>
          <AvatarImage src={user.image ?? ""} />
        </Avatar>
        <p className="whitespace-nowrap font-medium hidden md:block">{user.name}</p>
      </Link>
    </div>
  );
};
