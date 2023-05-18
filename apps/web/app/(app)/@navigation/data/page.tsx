import { DataEntryCard, DataEntryCardDescription, DataEntryCardTitle } from "@/components";
import { StravaLoginButton } from "@/components/organisms/strava-login-button";
import { getIsStravaLinked } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { UploadGpxCard } from "@templates/upload-gpx-card";

const Data = async () => {
  const user = await getCurrentUser();
  const isStravaLinked = await getIsStravaLinked(user?.id);

  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">Data Management</h1>

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
    </div>
  );
};

export default Data;
