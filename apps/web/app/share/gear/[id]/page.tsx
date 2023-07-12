import { ReadOnlyProvider } from "@/context/read-only-context";
import { getCachedCurrentUser, getCachedUserGearList } from "@libs/cache";
import { GearTable } from "@views/gear/gear-table";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ScrollArea, Skeleton } from "ui";

type GearListProps = {
  params: { id: string };
};

const GearListContent = async ({ params }: GearListProps) => {
  const gearList = await getCachedUserGearList(params.id);

  return (
    <div className="py-4 h-full relative">
      <div className="absolute md:container top-0 left-0 right-0 bottom-0">
        <ScrollArea className="h-full">
          <ReadOnlyProvider isReadOnly>
            <GearTable gearList={gearList} />
          </ReadOnlyProvider>
        </ScrollArea>
      </div>
    </div>
  );
};

const GearListPlaceholder = () => {
  return (
    <div className="py-4 md:container md:mx-auto">
      <Skeleton className="w-full h-12" />
    </div>
  );
};

export default async function GearList(props) {
  return (
    <Suspense fallback={<GearListPlaceholder />}>
      {/* @ts-expect-error Server Component */}
      <GearListContent {...props} />
    </Suspense>
  );
}
