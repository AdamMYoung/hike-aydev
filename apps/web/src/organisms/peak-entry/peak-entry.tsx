import { ElementProps, cn } from "ui";

type PeakEntryProps = Omit<ElementProps<"button">, "children"> & {
  src: string;
  title: string;
  completedCount: number;
  totalCount: number;
};

export const PeakEntry = ({ className, src, title, completedCount, totalCount, onClick, ...rest }: PeakEntryProps) => {
  const _className = cn(
    "flex flex-col  gap-2 text-left  transition-colors",
    onClick && "hover:bg-gray-200 p-4",
    className
  );

  return (
    <button className={_className} onClick={onClick} {...rest}>
      <img className="rounded-lg" alt="" src={src} />
      <div>
        <h2 className="text-2xl">{title}</h2>
        <p className="text-sm text-gray-500">{`${completedCount}/${totalCount} complete`}</p>
      </div>
    </button>
  );
};
