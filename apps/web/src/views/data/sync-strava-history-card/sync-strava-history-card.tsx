"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, useToast } from "ui";

import { DataEntryCard, DataEntryCardDescription, DataEntryCardTitle } from "@organisms/data-entry-card";
import { useSyncStravaHistory } from "@/hooks/use-sync-strava-history";

type SyncStravaHistoryCardProps = {
  disabled?: boolean;
};

export const SyncStravaHistoryCard = ({ disabled }: SyncStravaHistoryCardProps) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { trigger, isMutating, data } = useSyncStravaHistory();

  useEffect(() => {
    if (data) {
      setIsSubmitted(true);
      toast({
        title: "History sync request sent!",
        className: "bg-green-200 border-gray-500",
        description: `This process can take a while, check back later for updates.`,
      });
    }
  }, [isMutating, data, toast]);

  return (
    <DataEntryCard>
      <DataEntryCardTitle>Sync Strava History</DataEntryCardTitle>
      <DataEntryCardDescription>
        Pull all hiking events from Strava, and sync them with hike.aydev.uk. (Note: This process can take a while with
        many activities, and as such is limited to once a day.)
      </DataEntryCardDescription>
      <Button disabled={isMutating || disabled || isSubmitted} onClick={() => trigger()} variant="outline">
        {isMutating ? (
          <Loader className="animate-spin" />
        ) : disabled || isSubmitted ? (
          "Sync performed recently, try again later"
        ) : (
          "Sync History"
        )}
      </Button>
    </DataEntryCard>
  );
};
