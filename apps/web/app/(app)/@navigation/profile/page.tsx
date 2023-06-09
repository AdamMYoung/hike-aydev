import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "ui";

import { DataEntryCard, DataEntryCardDescription, DataEntryCardTitle } from "@organisms/data-entry-card";

import { getCachedCurrentUser } from "@libs/cache";
import { SignOutButton } from "@views/layout/sign-out-button";

import { DeleteAccountButton } from "@views/layout/delete-account-button";

const ProfileContent = async () => {
  const user = await getCachedCurrentUser();

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* <DataEntryCard>
        <DataEntryCardTitle>Share</DataEntryCardTitle>
        <DataEntryCardDescription className="flex flex-col gap-4">
          <p className="text-sm font-light">Share your progress using the link below.</p>
          <input className="text-base border px-2.5 py-2 rounded" disabled value="https://hike.aydev.uk/dp123od" />
        </DataEntryCardDescription>
      </DataEntryCard> */}

      {/* <DataEntryCard>
        <DataEntryCardTitle>Profile Information</DataEntryCardTitle>
        <DataEntryCardDescription className="flex flex-col gap-4">
          <p className="text-sm font-light">
            Update your profile information to ensure we can reach you with important updates, notifications, and more.
          </p>
          <form>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="name">Name</Label>
                <input
                  name="name"
                  id="name"
                  className="text-base border px-2.5 py-2 rounded"
                  defaultValue={user.name ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <input
                  name="email"
                  id="email"
                  className="text-base border px-2.5 py-2 rounded"
                  defaultValue={user.email ?? ""}
                />
              </div>
            </div>
            <div className="flex">
              <Button type="submit" variant="outline" className="ml-auto mt-4">
                Save
              </Button>
            </div>
          </form>
        </DataEntryCardDescription>
      </DataEntryCard> */}

      {/* <DataEntryCard>
        <DataEntryCardTitle>Notifications</DataEntryCardTitle>
        <DataEntryCardDescription className="flex flex-col gap-4">
          <p className="text-sm font-light">
            Choose the types of notifications you would like to receive from us. We will never share your email address.
          </p>
          <form>
            <div className="flex items-center space-x-2">
              <Switch id="fell-notifications" />
              <Label htmlFor="fell-notifications">Fells Added</Label>
            </div>
          </form>
        </DataEntryCardDescription>
      </DataEntryCard> */}

      <DataEntryCard className="gap-4">
        <div className="flex flex-row items-center justify-center gap-2">
          <Avatar>
            <AvatarFallback>{user.name?.substring(0, 1)}</AvatarFallback>
            <AvatarImage src={user.image ?? ""} />
          </Avatar>
          <p className="whitespace-nowrap font-medium">{user.name}</p>
        </div>
        {/* @ts-expect-error Server Component */}
        <SignOutButton />
      </DataEntryCard>

      <DataEntryCard>
        <DataEntryCardTitle>Delete Profile</DataEntryCardTitle>
        <DataEntryCardDescription className="flex flex-col gap-4">
          <p className="text-sm font-light">
            Use the button below to delete your profile. This will remove all submitted data from the site.
          </p>
          <p>Note: This cannot be undone!</p>
          {/* @ts-expect-error Server Component */}
          <DeleteAccountButton userId={user.id} />
        </DataEntryCardDescription>
      </DataEntryCard>
    </div>
  );
};

const ProfileContentPlaceholder = () => {
  return <div className="flex flex-col gap-2 p-2"></div>;
};

const Profile = async () => {
  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow sticky bg-white z-10 top-0">Profile</h1>
      <Suspense fallback={<ProfileContentPlaceholder />}>
        {/* @ts-expect-error Server Component */}
        <ProfileContent />
      </Suspense>
    </div>
  );
};

export default Profile;
