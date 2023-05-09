import { StravaLoginButton } from "@/components/organisms/strava-login-button";
import { getIsStravaLinked } from "@/libs/requests";
import { getCurrentUser } from "@/libs/session";

const Integrations = async () => {
  const user = await getCurrentUser();
  const isStravaLinked = await getIsStravaLinked(user?.id);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Strava</h2>
        <p className="text-sm font-light">
          Connect your Strava account to automatically track peaks using your events from Strava.
        </p>
        <StravaLoginButton disabled={isStravaLinked}>
          {isStravaLinked ? "Connected" : "Connect Strava"}
        </StravaLoginButton>
      </div>
    </div>
  );
};

export default Integrations;
