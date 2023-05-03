import { VisibilityToggle } from "@/atoms";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent, cn } from "ui";

type PeaksListProps = React.PropsWithChildren & {
  title: string;
};

export const PeaksList = ({ children, title }: PeaksListProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Collapsible disabled={!isVisible}>
      <div className="p-2 flex justify-between w-full items-center group">
        <CollapsibleTrigger className="text-lg gap-4 disabled:text-gray-400">{title}</CollapsibleTrigger>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Settings className="text-gray-500" />
        </button>
      </div>
      <CollapsibleContent className={cn("pb-2", !isVisible && "hidden")}>{children}</CollapsibleContent>
    </Collapsible>
  );
};
