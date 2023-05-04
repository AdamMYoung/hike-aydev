import { getFellGroup } from "@/libs/requests";
import { notFound } from "next/navigation";
import { PinGroup, Pin, Map } from "ui";

export default async function Group({ params: { id } }: { params: { id: string } }) {
  const fellGroup = await getFellGroup(id);

  if (!fellGroup) {
    notFound();
  }

  return (
    <PinGroup>
      {fellGroup.fells.map((fell) => (
        <Pin key={fell.id} coordinates={[fell.lng, fell.lat]} iconSrc="/data/cross-circle.svg" />
      ))}
    </PinGroup>
  );
}
