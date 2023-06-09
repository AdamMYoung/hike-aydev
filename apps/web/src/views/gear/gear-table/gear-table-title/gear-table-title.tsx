"use client";

import { useReadOnly } from "@/context/read-only-context";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { GearListDetailDTO } from "database";
import { useFormContext } from "react-hook-form";
import { cn, ElementProps, Input } from "ui";

export const GearTableTitle = ({ className, ...rest }: ElementProps<typeof Input>) => {
  const isMobile = useIsMobile();
  const { isReadOnly } = useReadOnly();
  const { register } = useFormContext<GearListDetailDTO>();

  const _className = cn(
    "text-2xl h-auto py-0 font-semibold border-transparent transition-colors hover:border-muted-foreground focus:border-muted-foreground",
    isMobile && "text-center",
    className
  );

  return <Input readOnly={isReadOnly} className={_className} {...rest} {...register("name")} />;
};
