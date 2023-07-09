"use client";

import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Button, useToast } from "ui";

import { DataEntryCard, DataEntryCardDescription, DataEntryCardTitle } from "@organisms/data-entry-card";
import { useSyncStravaHistory } from "@/hooks/use-sync-strava-history";

type SyncStravaHistoryCardProps = {
  disabled?: boolean;
};

export const SyncStravaHistoryCard = ({ disabled }: SyncStravaHistoryCardProps) => {
  const { toast } = useToast();
  const { trigger, isMutating, data } = useSyncStravaHistory();

  useEffect(() => {
    if (isMutating) {
      toast({
        title: "Strava data syncing...",
        className: "bg-green-200 border-gray-500",
        description: `This process can take a while, check back for updates!`,
      });
    }
  }, [isMutating, data, toast]);

  return (
    <DataEntryCard>
      <DataEntryCardTitle>Sync Strava History</DataEntryCardTitle>
      <DataEntryCardDescription>
        Pull all hiking events from Strava, and sync them with hike.aydev.uk. (Note: This process can take a while).
      </DataEntryCardDescription>
      <Button disabled={isMutating || disabled} onClick={() => trigger()} variant="outline">
        {isMutating ? <Loader className="animate-spin" /> : "Sync History"}
      </Button>
    </DataEntryCard>
  );
};
