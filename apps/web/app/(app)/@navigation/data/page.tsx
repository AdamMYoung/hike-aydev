import { Suspense } from "react";
import { Skeleton } from "ui";

import { getCurrentUser } from "@/libs/session";
import { StravaLoginButton } from "@/views/auth/strava-login-button";
import { SyncStravaHistoryCard } from "@/views/data/sync-strava-history-card";
import { UploadGpxCard } from "@/views/data/upload-gpx-card";
import { DataEntryCard, DataEntryCardDescription, DataEntryCardTitle } from "@/components/organisms";
import { getUserStravaLinkStatus, getUserTimeouts } from "database";

const DataCards = async () => {
  const user = await getCurrentUser();
  const isStravaLinked = await getUserStravaLinkStatus(user?.id);
  const timeouts = await getUserTimeouts(user?.id);

  const isStravaSyncTimedOut = !!timeouts.find(
    (timeout) => timeout.event === "GET_STRAVA_HISTORY" && timeout.expires.getTime() > Date.now()
  );

  return (
    <div className="flex flex-col p-2 gap-2">
      {isStravaLinked ? (
        <>
          <DataEntryCard>
            <DataEntryCardTitle>Strava</DataEntryCardTitle>
            <DataEntryCardDescription>
              Connect your Strava account to automatically track peaks using your events from Strava.
            </DataEntryCardDescription>
            <StravaLoginButton disabled>{"Connected"}</StravaLoginButton>
          </DataEntryCard>

          <SyncStravaHistoryCard disabled={isStravaSyncTimedOut} />
        </>
      ) : null}

      <UploadGpxCard />
    </div>
  );
};

const DataCardsPlaceholder = () => {
  return (
    <div className="flex flex-col p-2 gap-2">
      {new Array(2).fill("").map((_, index) => (
        <div key={index} className="flex flex-col gap-2 p-2 text-left border rounded-lg bg-white">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      ))}
    </div>
  );
};

const Data = async () => {
  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">Data Management</h1>

      <Suspense fallback={<DataCardsPlaceholder />}>
        {/* @ts-expect-error Server Component */}
        <DataCards />
      </Suspense>
    </div>
  );
};

export default Data;
