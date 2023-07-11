"use client";

import { GearListDetailDTO } from "database";
import { useCallback, useEffect, useMemo, useRef, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import debounce from "lodash.debounce";
import { GearTableCategories } from "./gear-table-categories";
import { GearTableTitle } from "./gear-table-title";
import { updateGearList } from "@libs/actions";
import { GearTableGraph } from "./gear-table-graph";

type GearTableProps = {
  userId: string | null;
  gearList: GearListDetailDTO;
};

export const GearTable = ({ gearList, userId }: GearTableProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const prevData = useRef<GearListDetailDTO>();
  const methods = useForm<GearListDetailDTO>({ defaultValues: gearList, mode: "all", reValidateMode: "onChange" });

  const data = methods.watch();

  const onChange = useCallback(
    debounce((newData: GearListDetailDTO) => {
      startTransition(() => updateGearList(userId, newData));
    }, 2000),
    [userId]
  );

  useEffect(() => {
    if (JSON.stringify(prevData.current) !== JSON.stringify(data)) {
      onChange(data);
    }

    prevData.current = JSON.parse(JSON.stringify(data));
  }, [data]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col gap-2 p-6 h-full">
          <GearTableTitle />
          <div className="py-4">
            <GearTableGraph />
          </div>

          <div className="pt-4 relative h-full">
            <GearTableCategories />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
