import Image from "next/image";
import Link from "next/link";
import { cn, ElementProps } from "ui";

type PeakEntryProps = ElementProps<"div"> & {
  title: string;
  href: string;
};

export const PeakEntry = ({ className, title, children, href, ...rest }: PeakEntryProps) => {
  const _className = cn(
    "flex flex-col rounded text-left transition-colors bg-background hover:bg-border group",
    className
  );

  return (
    <Link href={href}>
      <div className={_className} {...rest}>
        <div className="p-2">
          <h2 className="text-xl font-medium">{title}</h2>
          {children}
        </div>
      </div>
    </Link>
  );
};
