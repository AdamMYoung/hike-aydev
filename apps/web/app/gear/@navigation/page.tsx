import { getCachedCurrentUser, getCachedUserGearLists } from "@libs/cache";
import { PeakEntry } from "@organisms/peak-entry";
import { notFound } from "next/navigation";
import { Button, Separator } from "ui";

const GearNavigation = async () => {
  const user = await getCachedCurrentUser();

  if (!user) {
    notFound();
  }

  const lists = await getCachedUserGearLists(user.id!);

  return (
    <div>
      <h1 className="text-2xl font-medium py-4 text-center shadow dark:shadow-muted sticky  bg-background z-10 top-0">
        Your Gear
      </h1>

      <div className="flex flex-col gap-2 p-2">
        <h2 className="text-xl font-medium px-2 pt-1">Lists</h2>
        <Separator />

        <div className="flex flex-col text-left gap-2 rounded-lg px-2 bg-background">
          {lists.map((list) => (
            <PeakEntry key={list.id} href={`/gear/${list.id}`} title={list.name}></PeakEntry>
          ))}
          {lists.length === 0 ? (
            <p className="text-sm">No lists found, create a new list using the button below.</p>
          ) : null}
          <Separator />
          <Button>Create List</Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <h2 className="text-xl font-medium px-2 pt-1">Gear</h2>
        <Separator />
        <div className="flex flex-col text-left gap-2 rounded-lg px-2 bg-background">
          <p className="text-sm">Nothing added yet, add some gear to a list to see it here.</p>
        </div>
      </div>
    </div>
  );
};

export default GearNavigation;
