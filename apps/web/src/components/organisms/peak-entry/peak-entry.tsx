import Link from "next/link";
import { ElementProps, cn } from "ui";

type PeakEntryProps = ElementProps<"div"> & {
  src?: string;
  title: string;
};

const InternalPeakEntry = ({ className, src, title, children, ...rest }: PeakEntryProps) => {
  const _className = cn("flex flex-col  gap-2 text-left  transition-colors", className);

  return (
    <div className={_className} {...rest}>
      {src ? <img className="rounded-lg" alt="" src={src} /> : null}
      <div>
        <h2 className="text-2xl">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export const PeakEntry = ({ href, ...rest }: PeakEntryProps & { href?: string }) => {
  if (href) {
    return (
      <Link href={href}>
        <InternalPeakEntry className="hover:bg-gray-200 p-4" {...rest} />
      </Link>
    );
  }

  return <InternalPeakEntry {...rest} />;
};
