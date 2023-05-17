import { TimelineCard } from "@/components/organisms/timeline-card";
import { getUserTimeline } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { notFound } from "next/navigation";
import { Separator } from "ui";

const Timeline = async () => {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const userEntries = await getUserTimeline(user?.id);

  const groupedEntries = userEntries.reduce(
    (prev, curr) => {
      const date = curr.date.toDateString();

      if (prev[date]) {
        return { ...prev, [date]: [...prev[date], curr] };
      }

      return { ...prev, [date]: [curr] };
    },
    {} as Record<
      string,
      {
        id: string;
        date: Date;
        camped: boolean;
        comments: string | null;
        fell: {
          id: number;
          name: string;
          lat: number;
          lng: number;
        };
      }[]
    >
  );

  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">Timeline</h1>
      <div className="flex flex-col gap-2 p-2">
        {userEntries.length > 0 ? (
          Object.entries(groupedEntries).map(([key, group]) => {
            return (
              <div key={key} className="p-1 border rounded bg-white">
                <h2 className="p-4 text-lg font-medium">{key}</h2>
                <div className="divide-y border-gray-50">
                  {group.map((e) => (
                    <TimelineCard key={e.id} logId={e.id} fell={e.fell} date={e.date} comments={e.comments} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Timeline</h2>
            <p className="text-sm font-light">Track your first peak to see it show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
