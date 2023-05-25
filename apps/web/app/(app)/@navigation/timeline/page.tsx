import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "ui";

import { getCurrentUser } from "@/libs/session";
import { TimelineCard } from "@/views/timeline/timeline-card";
import { getUserTimelineById } from "database";

const TimelineEntries = async () => {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const userEntries = await getUserTimelineById(user?.id);

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
        fell: { id: number; name: string; lat: number; lng: number };
      }[]
    >
  );

  return (
    <div className="flex flex-col gap-2 p-2">
      {userEntries.length > 0 ? (
        Object.entries(groupedEntries).map(([key, group]) => {
          return (
            <div key={key} className="p-1 border rounded-lg bg-white">
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
  );
};

const TimelineEntriesPlaceholder = () => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {new Array(5).fill("").map((_, index) => {
        return (
          <div key={index} className="p-4 flex flex-col gap-4 border rounded-lg bg-white">
            <Skeleton className="w-48 h-10" />
            <div className="divide-y flex flex-col gap-4 border-gray-50">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Timeline = async () => {
  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">Timeline</h1>
      <Suspense fallback={<TimelineEntriesPlaceholder />}>
        {/* @ts-expect-error Server Component */}
        <TimelineEntries />
      </Suspense>
    </div>
  );
};

export default Timeline;
