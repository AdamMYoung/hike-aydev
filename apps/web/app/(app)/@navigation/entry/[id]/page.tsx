import { PeakEntry } from "@/components/organisms";
import Link from "next/link";
import { Button, Separator } from "ui";
import { getFellEntry } from "@/libs/requests";
import { notFound } from "next/navigation";

const EntryDetailNavigation = async ({ params: { id } }: { params: { id: string } }) => {
  const entry = await getFellEntry(id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="py-4 space-y-4 h-full">
      <div className="px-4 space-y-4">
        <Link href="/">
          <Button>Back</Button>
        </Link>
        <h2 className="text-xl font-medium">{entry.name}</h2>
      </div>

      <Separator />

      <div className="relative w-full space-y-4"></div>
    </div>
  );
};

export default EntryDetailNavigation;
