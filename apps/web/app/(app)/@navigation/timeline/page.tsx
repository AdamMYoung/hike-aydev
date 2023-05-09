import { TimelineCard } from "@/components/organisms/timeline-card";
import { getUserTimeline } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { notFound } from "next/navigation";

const Timeline = async () => {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const userEntries = await getUserTimeline(user?.id);

  return (
    <div className="py-4 divide-y">
      {userEntries.length > 0 ? (
        userEntries.map((e) => {
          return <TimelineCard key={e.id} logId={e.id} name={e.fell.name} date={e.date} comments={e.comments} />;
        })
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Timeline</h2>
          <p className="text-sm font-light">Track your first peak to see it show up here.</p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
