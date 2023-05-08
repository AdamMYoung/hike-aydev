import { getMapUserTimeline } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { notFound } from "next/navigation";
import { PinGroup, Pin, toOSMCoordinates, ZoomPoint } from "ui";

type GroupProps = {
  params: { id: string };
  searchParams: {
    hideComplete: string;
    hideIncomplete: string;
    searchTerm: string;
  };
};

export default async function Timeline({}: GroupProps) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
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