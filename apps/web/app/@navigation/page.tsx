import { PeakEntry } from "@/organisms";

const PeaksNavigation = () => {
  return (
    <div className="py-2 space-y-4 h-full">
      {new Array(20).fill("").map((_, index) => (
        <PeakEntry
          key={index}
          href={`/group/${index}`}
          src="https://images.unsplash.com/photo-1632910508004-dea023f29b94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
          title="Wainwrights"
          completedCount={4}
          totalCount={214}
        />
      ))}
    </div>
  );
};

export default PeaksNavigation;
