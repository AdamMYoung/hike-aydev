import Link from "next/link";
import { ElementProps, cn } from "ui";

type PeakEntryProps = Omit<ElementProps<"div">, "children"> & {
  src: string;
  title: string;
  completedCount: number;
  totalCount: number;
};

const InternalPeakEntry = ({ className, src, title, completedCount, totalCount, ...rest }: PeakEntryProps) => {
  const _className = cn("flex flex-col  gap-2 text-left  transition-colors", className);

  return (
    <div className={_className} {...rest}>
      <img className="rounded-lg" alt="" src={src} />
      <div>
        <h2 className="text-2xl">{title}</h2>
        <p className="text-sm text-gray-500">{`${completedCount}/${totalCount} complete`}</p>
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
