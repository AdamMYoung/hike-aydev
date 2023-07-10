import { getCachedCurrentUser, getCachedUserGearItems, getCachedUserGearLists } from "@libs/cache";
import { PeakEntry } from "@organisms/peak-entry";
import { DeleteListButton } from "@views/gear/delete-list-button";
import { NewListButton } from "@views/gear/new-list-button";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Separator } from "ui";

const GearNavigation = async () => {
  const user = await getCachedCurrentUser();

  if (!user) {
    notFound();
  }

  const lists = await getCachedUserGearLists(user.id!);
  const items = await getCachedUserGearItems(user.id!);

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
            <div key={list.id} className="group flex gap-2 items-center justify-between">
              <Link href={`/gear/${list.id}`} className="text-lg w-full hover:underline">
                {list.name}
              </Link>

              <div className="flex gap-2 items-center opacity-10 group-hover:opacity-100 transition-opacity">
                <DeleteListButton listName={list.name} userId={user.id} listId={list.id} />
              </div>
            </div>
          ))}
          {lists.length === 0 ? (
            <p className="text-sm">No lists found, create a new list using the button below.</p>
          ) : null}
          <Separator />
          <NewListButton userId={user.id} />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <h2 className="text-xl font-medium px-2 pt-1">Gear</h2>
        <Separator />
        <div className="flex flex-col text-left divide-y rounded-lg px-2 bg-background">
          {items.length === 0 ? (
            <p className="text-sm">Nothing added yet, add some gear to a list to see it here.</p>
          ) : null}
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col gap-1 py-2">
              <div className="flex gap-2  items-center justify-between">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm">{item.weight}g</p>
              </div>
              <p className="text-xs">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GearNavigation;
