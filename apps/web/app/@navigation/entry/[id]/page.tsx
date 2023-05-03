import { PeakEntry } from "@/organisms";
import Link from "next/link";
import { ElementProps, Button, Separator, Label, Input, Checkbox } from "ui";

const EntryDetailNavigation = () => {
  return (
    <div className="py-4 space-y-4 h-full">
      <div className="px-4 space-y-4">
        <Link href="/">
          <Button>Back</Button>
        </Link>
        <PeakEntry
          src="https://images.unsplash.com/photo-1632910508004-dea023f29b94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
          title="Wainwrights"
          completedCount={4}
          totalCount={214}
        />
      </div>

      <Separator />

      <div className="relative w-full space-y-4"></div>
    </div>
  );
};

export default EntryDetailNavigation;
