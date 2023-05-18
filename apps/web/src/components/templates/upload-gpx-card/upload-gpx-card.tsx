"use client";

import useSWRMutation from "swr/mutation";
import { DataEntryCard, DataEntryCardTitle, DataEntryCardDescription } from "@/components/organisms";
import { ChangeEventHandler, useEffect, useRef } from "react";

import { Button, useToast } from "ui";
import { Loader } from "lucide-react";

const uploadFile = async (url: string, { arg }: { arg: FormData }) => {
  const res = await fetch(url, {
    method: "POST",
    body: arg,
  });

  return res.json();
};

export const UploadGpxCard = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { trigger, data, isMutating } = useSWRMutation<{ completed: number; total: number }, unknown, string, FormData>(
    "/api/activities/manual",
    uploadFile
  );

  useEffect(() => {
    if (data) {
      toast({
        title: "Upload Successful!",
        className: "bg-green-200 border-gray-500",
        description: `Found ${data.total} total fells, ${data.completed} new fells marked as complete.`,
      });
    }
  }, [data]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append(file.name, file);

      trigger(formData);
      inputRef.current!.value = "";
    }
  };

  return (
    <DataEntryCard>
      <DataEntryCardTitle>Upload GPX</DataEntryCardTitle>
      <DataEntryCardDescription>
        Upload a GPX route, and track any peaks found along the route.
      </DataEntryCardDescription>
      <Button disabled={isMutating} onClick={handleClick} variant="outline">
        {isMutating ? <Loader className="animate-spin" /> : "Upload GPX"}
      </Button>
      <input type="file" accept=".gpx" ref={inputRef} onChange={handleInputUpload} className="hidden" />
    </DataEntryCard>
  );
};
