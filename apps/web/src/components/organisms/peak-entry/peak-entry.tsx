import Link from "next/link";
import { ElementProps, cn } from "ui";

type PeakEntryProps = ElementProps<"div"> & {
  src?: string;
  title: string;
  href: string;
};

export const PeakEntry = ({ className, src, title, children, href, ...rest }: PeakEntryProps) => {
  const _className = cn("flex flex-col gap-2 text-left transition-colors hover:bg-gray-200", className);

  return (
    <Link href={href}>
      <div className={_className} {...rest}>
        {src ? <img className="rounded-lg" alt="" src={src} /> : null}
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          {children}
        </div>
      </div>
    </Link>
  );
};
