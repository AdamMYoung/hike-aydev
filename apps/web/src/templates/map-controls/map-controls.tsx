import { PeaksList, PeaksListItem } from "@/organisms";
import { useState } from "react";
import { Button, cn } from "ui";

export const MapControls = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 left-4 bottom-4 flex flex-col gap-4  md:left-2/3 max-w-xl ml-auto pointer-events-none">
      <div className="ml-auto">
        <Button className="pointer-events-auto" onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? "Close" : "Menu"}
        </Button>
      </div>
      <div className={cn("bg-white rounded pointer-events-auto", !isOpen && "hidden")}>
        <h2 className="p-4 text-lg  font-semibold">Peaks, Fells, and POIs </h2>
        <hr />
        <div className="divide-y max-h-[400px] overflow-y-auto">
          <PeaksList title="Wainwrights (0/214)">
            <PeaksListItem id="1">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="2">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="3">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="4">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="5">Lorem ipsum</PeaksListItem>
          </PeaksList>
          <PeaksList title="Wainwrights (0/214)">
            <PeaksListItem id="1">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="2">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="3">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="4">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="5">Lorem ipsum</PeaksListItem>
          </PeaksList>
          <PeaksList title="Wainwrights (0/214)">
            <PeaksListItem id="1">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="2">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="3">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="4">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="5">Lorem ipsum</PeaksListItem>
          </PeaksList>
          <PeaksList title="Wainwrights (0/214)">
            <PeaksListItem id="1">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="2">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="3">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="4">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="5">Lorem ipsum</PeaksListItem>
          </PeaksList>
          <PeaksList title="Wainwrights (0/214)">
            <PeaksListItem id="1">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="2">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="3">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="4">Lorem ipsum</PeaksListItem>
            <PeaksListItem id="5">Lorem ipsum</PeaksListItem>
          </PeaksList>
        </div>
      </div>
    </div>
  );
};
