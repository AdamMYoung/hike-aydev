import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Separator, Skeleton } from "ui";

import { TimelineCard } from "@views/timeline/timeline-card";
import { getCachedCurrentUser, getCachedUserTimelineById } from "@libs/cache";
import { ViewRouteButton } from "@views/timeline/view-route-button";
import { DeleteTimelineEntryButton } from "@views/timeline/delete-timeline-entry-button";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const TimelineEntries = async () => {
  const user = await getCachedCurrentUser();

  if (!user) {
    notFound();
  }

  const userEntries = await getCachedUserTimelineById(user.id);

  return (
    <div className="flex flex-col gap-2 p-2">
      {userEntries.length > 0 ? (
        userEntries.map((group) => {
          return (
            <div key={group.id} className="group/delete p-1 border rounded-lg bg-background">
              <div className="p-4 flex items-center justify-between gap-2">
                <h2 className="text-lg font-medium">{dayjs(new Date(group.start)).format("Do MMMM, YYYY")}</h2>
                <DeleteTimelineEntryButton userId={user.id} start={new Date(group.start)} />
              </div>
              <div className="divide-y border-muted">
                {group.entries.map((e) => (
                  <TimelineCard key={e.id} logId={e.id} fell={e.fell} comments={e.comments} />
                ))}
              </div>
              <Separator />
              <div className="p-4 flex flex-col gap-2">
                <p className="text-xs">
                  Source: <b>{group.source === "STRAVA" ? "Strava" : "Manual"}</b>
                </p>
                {group.polyline ? <ViewRouteButton polyline={group.polyline} /> : null}
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
          <div key={index} className="p-4 flex flex-col gap-4 border rounded-lg bg-background">
            <Skeleton className="w-48 h-10" />
            <div className="divide-y flex flex-col gap-4 border-muted">
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
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-background z-10 top-0">Your Timeline</h1>
      <Suspense fallback={<TimelineEntriesPlaceholder />}>
        {/* @ts-expect-error Server Component */}
        <TimelineEntries />
      </Suspense>
    </div>
  );
};

export default Timeline;
