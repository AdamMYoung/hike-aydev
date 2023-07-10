import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage, Separator } from "ui";

import { DataEntryCard, DataEntryCardDescription, DataEntryCardTitle } from "@organisms/data-entry-card";

import { getCachedCurrentUser, getCachedUserStravaLinkStatus } from "@libs/cache";
import { SignOutButton } from "@views/layout/sign-out-button";

import { DeleteAccountButton } from "@views/layout/delete-account-button";
import { StravaLoginButton } from "@views/auth/strava-login-button";
import { SyncStravaHistoryCard } from "@views/data/sync-strava-history-card";
import { UploadGpxCard } from "@views/data/upload-gpx-card";

const ProfileContent = async () => {
  const user = await getCachedCurrentUser();

  if (!user) {
    notFound();
  }

  const isStravaLinked = await getCachedUserStravaLinkStatus(user?.id);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="gap-4 flex justify-between">
        <div className="flex flex-row items-center justify-center gap-2">
          <Avatar>
            <AvatarFallback>{user.name?.substring(0, 1)}</AvatarFallback>
            <AvatarImage src={user.image ?? ""} />
          </Avatar>
          <p className="whitespace-nowrap font-medium">{user.name}</p>
        </div>
        {/* @ts-expect-error Server Component */}
        <SignOutButton />
      </div>

      <Separator />

      {isStravaLinked ? (
        <>
          <DataEntryCard>
            <DataEntryCardTitle>Strava</DataEntryCardTitle>
            <DataEntryCardDescription>
              Connect your Strava account to automatically track peaks using your events from Strava.
            </DataEntryCardDescription>
            <StravaLoginButton disabled>{"Connected"}</StravaLoginButton>
          </DataEntryCard>

          <SyncStravaHistoryCard />
        </>
      ) : null}

      <UploadGpxCard />

      <Separator />

      <div>
        {/* @ts-expect-error Server Component */}
        <DeleteAccountButton userId={user.id} />
      </div>
    </div>
  );
};

const ProfileContentPlaceholder = () => {
  return <div className="flex flex-col gap-2 p-2"></div>;
};

const Profile = async () => {
  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow dark:shadow-muted sticky  bg-background z-10 top-0">
        Profile
      </h1>
      <Suspense fallback={<ProfileContentPlaceholder />}>
        {/* @ts-expect-error Server Component */}
        <ProfileContent />
      </Suspense>
    </div>
  );
};

export default Profile;
