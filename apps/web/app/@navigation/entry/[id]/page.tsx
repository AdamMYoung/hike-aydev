import { prisma } from "@/libs/prisma";
import { PeakEntry } from "@/components/organisms";
import Link from "next/link";
import { Button, Separator } from "ui";
import { getFellEntry } from "@/libs/requests";

export const preload = (id: string) => {
  void getFellEntry(id);
};

const EntryDetailNavigation = async ({ params: { id } }: { params: { id: string } }) => {
  preload(id);
  const entry = await getFellEntry(id);

  return (
    <div className="py-4 space-y-4 h-full">
      <div className="px-4 space-y-4">
        <Link href="/">
          <Button>Back</Button>
        </Link>
        <PeakEntry src={entry.imageUrl} title={entry.name} />
      </div>

      <Separator />

      <div className="relative w-full space-y-4"></div>
    </div>
  );
};

export default EntryDetailNavigation;
