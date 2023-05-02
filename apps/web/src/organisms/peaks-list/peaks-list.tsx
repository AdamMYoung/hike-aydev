import { VisibilityToggle } from "@/atoms";
import { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent, cn } from "ui";

type PeaksListProps = React.PropsWithChildren & {
  title: string;
};

export const PeaksList = ({ children, title }: PeaksListProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Collapsible disabled={!isVisible}>
      <div className="p-2 px-4 flex justify-between w-full items-center">
        <CollapsibleTrigger className="text-lg gap-4 disabled:text-gray-400">{title}</CollapsibleTrigger>
        <VisibilityToggle onClick={() => setIsVisible((visible) => !visible)} isVisible={isVisible} />
      </div>
      <CollapsibleContent className={cn("pb-2", !isVisible && "hidden")}>{children}</CollapsibleContent>
    </Collapsible>
  );
};
