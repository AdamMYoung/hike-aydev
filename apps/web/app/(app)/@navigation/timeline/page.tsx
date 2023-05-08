import { TimelineCard } from "@/components/organisms/timeline-card";
import { getUserTimeline } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { notFound } from "next/navigation";

const Timeline = async () => {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const userEntries = await getUserTimeline(user.id);

  return (
    <div className="p-4 divide-y">
      {userEntries.map((e) => {
        return <TimelineCard key={e.id} logId={e.id} name={e.fell.name} date={e.date} comments={e.comments} />;
      })}
    </div>
  );
};

export default Timeline;
