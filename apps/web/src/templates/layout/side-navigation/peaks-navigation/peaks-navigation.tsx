import { PeakEntry } from "@/organisms";
import { useState } from "react";
import { Button, Checkbox, ElementProps, Input, Label, Separator } from "ui";

type PeaksDetailProps = Omit<ElementProps<"div">, "children"> & {
  onBackClick: () => void;
};

const PeaksDetail = ({ onBackClick, className, ...rest }: PeaksDetailProps) => {
  return (
    <div className=" py-2 space-y-4 h-full" {...rest}>
      <div className="px-4 space-y-4">
        <Button onClick={onBackClick}>Back</Button>
        <PeakEntry
          src="https://images.unsplash.com/photo-1632910508004-dea023f29b94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
          title="Wainwrights"
          completedCount={4}
          totalCount={214}
        />
      </div>

      <Separator />

      <div className="relative w-full space-y-4">
        <div className="sticky top-14 z-10 p-4 shadow bg-white space-y-4">
          <div className="grid w-full max-w-sm items-center gap-2  ">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Scafell Pike" />
          </div>

          <div className="flex w-full items-center gap-2">
            <Checkbox></Checkbox>
            <Label htmlFor="search">Hide completed</Label>
          </div>
        </div>

        <div className="px-4 py-2">
          {new Array(214).fill("").map((_, index) => (
            <div key={index} className="flex group py-1 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Checkbox className="h-6 w-6 border-gray-400" />
                <label>Lorem Ipsum (768m)</label>
              </div>
              <Button className="font-light transition-opacity group-hover:opacity-100 md:opacity-20" variant="ghost">
                View
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PeaksNavigation = () => {
  const [selectedPeak, setSelectedPeak] = useState<number | null>(null);

  if (selectedPeak !== null) {
    return <PeaksDetail onBackClick={() => setSelectedPeak(null)} />;
  }

  return (
    <>
      {new Array(20).fill("").map((_, index) => (
        <PeakEntry
          onClick={() => setSelectedPeak(index)}
          key={index}
          src="https://images.unsplash.com/photo-1632910508004-dea023f29b94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
          title="Wainwrights"
          completedCount={4}
          totalCount={214}
        />
      ))}
    </>
  );
};
