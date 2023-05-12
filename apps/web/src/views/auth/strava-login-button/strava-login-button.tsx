"use client";

import { Loader } from 'lucide-react';
import { signIn } from 'next-auth/react';
import React from 'react';
import { BsStrava } from 'react-icons/bs';
import { Button, cn, ElementProps } from 'ui';

export const StravaLoginButton = ({ disabled, className, children, ...rest }: ElementProps<typeof Button>) => {
  const [isStravaLoading, setIsStravaLoading] = React.useState<boolean>(false);

  const _className = cn("", className);

  return (
    <Button
      className={_className}
      variant="outline"
      disabled={isStravaLoading || disabled}
      onClick={() => {
        setIsStravaLoading(true);
        signIn("strava");
      }}
      {...rest}
    >
      {isStravaLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <BsStrava className="mr-2 h-4 w-4" />}{" "}
      {children}
    </Button>
  );
};
