import { getCurrentUser } from "@/libs/session";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage, Button } from "ui";

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
      <div className=" flex gap-2 items-center">
        <Avatar>
          <AvatarFallback>{user.name?.substring(0, 1)}</AvatarFallback>
          <AvatarImage src={user.image ?? ""} />
        </Avatar>
        <p className="whitespace-nowrap font-medium hidden md:block">{user.name}</p>
      </div>

      <Link legacyBehavior href="/api/auth/signout">
        <Button className="whitespace-nowrap hidden md:block" variant="outline">
          Sign out
        </Button>
      </Link>
    </div>
  );
};
