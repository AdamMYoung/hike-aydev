import { getCurrentUser } from "@/libs/session";
import { notFound } from "next/navigation";

const Timeline = async () => {
  const user = await getCurrentUser();

  return <div className="p-4 space-y-4 h-full">Timeline</div>;
};

export default Timeline;
