import { PinGroup, Pin, Map } from "ui";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full">
      <Map>
        <PinGroup>
          <Pin coordinates={[-0.549316, 54.175297]} />
        </PinGroup>
      </Map>
    </div>
  );
}
