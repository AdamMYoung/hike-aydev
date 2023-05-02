import { MapControls } from "@/templates";
import { Map, Pin, PinGroup } from "ui";

export default function Web() {
  return (
    <div className="h-full w-full relative ">
      <Map>
        <PinGroup>
          <Pin coordinates={[-0.549316, 54.175297]} />
        </PinGroup>
      </Map>
      <MapControls />
    </div>
  );
}
