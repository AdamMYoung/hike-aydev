import { getMapUserTimeline } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { Pin, PinGroup, toOSMCoordinates, ZoomPoint } from "ui";

export default async function Home() {
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
}
