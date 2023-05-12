"use client";

import { Loader } from "lucide-react";
import { ChangeEventHandler, useEffect, useRef } from "react";
import { Button, useToast } from "ui";

import { DataEntryCard, DataEntryCardDescription, DataEntryCardTitle } from "@organisms/data-entry-card";
import { useUploadGPX } from "@/hooks/use-upload-gpx";

export const UploadGpxCard = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { trigger, isMutating, data } = useUploadGPX();

  useEffect(() => {
    if (data) {
      toast({
        title: "Upload Successful!",
        className: "bg-green-200 border-gray-500",
        description: `GPX file uploaded. Found ${data.total} fells along the route, ${
          data.inserted === 0 ? "but all were already tracked." : `and tracked ${data.inserted} new entries.`
        }`,
      });
    }
  }, [isMutating, data, toast]);

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
