import { getFellGroup } from "@/libs/requests";
import { PinGroup, Pin, Map } from "ui";

export default async function Group({ params: { id } }: { params: { id: string } }) {
  const fellGroup = await getFellGroup(id);

  return (
    <div className="flex flex-col w-full h-full">
      <Map>
        <PinGroup>
          {fellGroup.fells.map((fell) => (
            <Pin key={fell.id} coordinates={[fell.lng, fell.lat]} iconSrc="/data/cross-circle.svg" />
          ))}
        </PinGroup>
      </Map>
    </div>
  );
}
