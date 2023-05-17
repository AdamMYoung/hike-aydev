import Link from "next/link";
import { ElementProps, cn } from "ui";

type PeakEntryProps = ElementProps<"div"> & {
  src?: string;
  title: string;
  href: string;
};

export const PeakEntry = ({ className, src, title, children, href, ...rest }: PeakEntryProps) => {
  const _className = cn(
    "flex flex-col text-left transition-colors border rounded bg-white hover:bg-gray-200 group",
    className
  );

  return (
    <Link href={href}>
      <div className={_className} {...rest}>
        {src ? (
          <img
            className="rounded-t-lg transition-[filter] [filter:brightness(0.8)] group-hover:[filter:brightness(0.7)]"
            alt=""
            src={src}
          />
        ) : null}
        <div className="p-2">
          <h2 className="text-xl font-medium">{title}</h2>
          {children}
        </div>
      </div>
    </Link>
  );
};
