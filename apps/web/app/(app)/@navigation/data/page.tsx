import { StravaLoginButton } from "@/components/organisms/strava-login-button";
import { getIsStravaLinked } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";
import { Button } from "ui";

const Data = async () => {
  const user = await getCurrentUser();
  const isStravaLinked = await getIsStravaLinked(user?.id);

  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">Data Management</h1>

      <div className="flex flex-col p-2 gap-2">
        <div className="flex flex-col gap-2 p-4 rounded-lg border bg-white">
          <h2 className="text-lg font-medium">Strava</h2>
          <p className="text-sm font-light">
            Connect your Strava account to automatically track peaks using your events from Strava.
          </p>
          <StravaLoginButton disabled>{isStravaLinked ? "Connected" : "N/A"}</StravaLoginButton>
        </div>
        {/* <div className="flex flex-col gap-2 p-4 rounded-lg border bg-white">
          <h2 className="text-lg font-medium">Upload GPX</h2>
          <p className="text-sm font-light">Upload a GPX route, and track any peaks found along the route.</p>
          <Button variant="outline">Upload GPX</Button>
        </div> */}
      </div>
    </div>
  );
};

export default Data;
