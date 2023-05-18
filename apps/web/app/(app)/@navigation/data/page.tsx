import { DataEntryCard, DataEntryCardDescription, DataEntryCardTitle } from "@/components";
import { StravaLoginButton } from "@/components/organisms/strava-login-button";
import { getIsStravaLinked } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { UploadGpxCard } from "@templates/upload-gpx-card";
import { Suspense } from "react";
import { Skeleton } from "ui";

const DataCards = async () => {
  const user = await getCurrentUser();
  const isStravaLinked = await getIsStravaLinked(user?.id);

  return (
    <div className="flex flex-col p-2 gap-2">
      <DataEntryCard>
        <DataEntryCardTitle>Strava</DataEntryCardTitle>
        <DataEntryCardDescription>
          Connect your Strava account to automatically track peaks using your events from Strava.
        </DataEntryCardDescription>
        <StravaLoginButton disabled>{isStravaLinked ? "Connected" : "N/A"}</StravaLoginButton>
      </DataEntryCard>

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
