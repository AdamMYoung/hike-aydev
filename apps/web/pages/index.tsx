import { MapControls } from "@/templates";
import { Map, Pin, PinGroup } from "ui";

export default function Web() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4">Filters</div>
      <Map>
        <PinGroup>
          <Pin coordinates={[-0.549316, 54.175297]} />
        </PinGroup>
      </Map>
    </div>
  );
}
