import { getMapUserTimeline } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { Suspense } from "react";
import { Pin, PinGroup, toOSMCoordinates, ZoomPoint } from "ui";

const MapEntries = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <ZoomPoint coordinates={toOSMCoordinates([-2.5478, 54.0039])} />;
  }

  const timeline = await getMapUserTimeline(user.id);

  return (
    <>
      <ZoomPoint coordinates={toOSMCoordinates([-2.5478, 54.0039])} />
      <PinGroup disableAnimation>
        {timeline.map(({ fell }) => {
          return <Pin key={fell.id} coordinates={[fell.lng, fell.lat]} iconSrc="/data/check-circle.svg" />;
        })}
      </PinGroup>
    </>
  );
};

const MapEntriesPlaceholder = () => {
  return null;
};

export default async function Home() {
  return (
    <Suspense fallback={<MapEntriesPlaceholder />}>
      {/* @ts-expect-error Server Component */}
      <MapEntries />
    </Suspense>
  );
}
