"use client";

import { useRouter } from "next/navigation";
import { Button, ElementProps } from "ui";

export const SignOutButton = ({ children, ...rest }: ElementProps<typeof Button>) => {
  const { push } = useRouter();

  const handleClick = async () => {
    push("/api/auth/signout");
  };

  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};
