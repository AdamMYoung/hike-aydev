"use client";

import { GearListDetailDTO } from "database";
import { useCallback, useEffect, useMemo, useRef, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import { GearTableCategories } from "./gear-table-categories";
import { GearTableTitle } from "./gear-table-title";
import { updateGearList } from "@libs/actions";
import { GearTableGraph } from "./gear-table-graph";
import { DragDropContext } from "react-beautiful-dnd";
import { useIsClient } from "@/hooks/use-is-client";
import { useReadOnly } from "@/context/read-only-context";
import { GearShareInput } from "../gear-share-input";
import { cn } from "ui";

type GearTableProps = {
  userId?: string | null;
  gearList: GearListDetailDTO;
};

export const GearTable = ({ gearList, userId }: GearTableProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const isClient = useIsClient();
  const { isReadOnly } = useReadOnly();
  const prevData = useRef<GearListDetailDTO>();
  const methods = useForm<GearListDetailDTO>({ defaultValues: gearList, mode: "all", reValidateMode: "onChange" });

  const data = methods.watch();

  const onChange = useCallback(
    debounce((newData: GearListDetailDTO) => {
      if (userId) {
        startTransition(() => updateGearList(userId, newData));
      }
    }, 2000),
    [userId]
  );

  useEffect(() => {
    if (!isReadOnly && userId) {
      const compOldData = JSON.stringify(prevData.current);
      const compNewData = JSON.stringify(data);

      if (prevData.current && compOldData !== compNewData) {
        onChange(data);
      }

      prevData.current = JSON.parse(compNewData);
    }
  }, [data, isReadOnly, onChange, userId]);

  if (!isClient) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col gap-2 p-6 h-full">
          <GearTableTitle />
          <div className={cn("py-4 flex flex-col", !isReadOnly && "mx-auto")}>
            <GearTableGraph />
            {!isReadOnly ? <GearShareInput gearListId={gearList.id} /> : null}
          </div>

          <div className="pt-4 relative h-full">
            <GearTableCategories />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
