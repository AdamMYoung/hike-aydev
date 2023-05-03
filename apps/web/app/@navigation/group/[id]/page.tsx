import { prisma } from "@/libs/prisma";
import { PeakEntry } from "@/components/organisms";
import Link from "next/link";
import { Button, Separator, Label, Input, Checkbox } from "ui";

const PeakDetailNavigation = async ({ params: { id } }: { params: { id: string } }) => {
  const fellGroup = await prisma.fellGroup.findUnique({
    where: { id: parseInt(id) },
    include: {
      fells: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          height: true,
        },
      },
    },
  });

  return (
    <div className="py-4 space-y-4 h-full">
      <div className="px-4 space-y-4">
        <Link href="/">
          <Button>Back</Button>
        </Link>
        <PeakEntry src={fellGroup.imageUrl} title={fellGroup.name} />
      </div>

      <Separator />

      <div className="relative w-full space-y-4">
        <div className="sticky top-14 z-10 p-4 shadow bg-white space-y-4">
          <div className="grid w-full max-w-sm items-center gap-2  ">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Scafell Pike" />
          </div>

          <div className="flex w-full items-center gap-2">
            <Checkbox></Checkbox>
            <Label htmlFor="search">Hide completed</Label>
          </div>
        </div>

        <div className="px-4 py-2">
          {fellGroup.fells.map((fell) => (
            <div key={fell.id} className="flex group py-1 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Checkbox className="h-6 w-6 border-gray-400" />
                <label>
                  {fell.name} ({fell.height}m)
                </label>
              </div>
              <Link href={`/entry/${fell.id}`}>
                <Button className="font-light transition-opacity group-hover:opacity-100 md:opacity-20" variant="ghost">
                  View
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeakDetailNavigation;
