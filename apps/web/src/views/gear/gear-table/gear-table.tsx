"use client";

import { GearListDetailDTO } from "database";
import { useCallback, useEffect, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Separator } from "ui";
import debounce from "lodash.debounce";
import { GearTableCategories } from "./gear-table-categories";
import { GearTableTitle } from "./gear-table-title";
import { updateGearList } from "@libs/actions";

type GearTableProps = {
  userId: string | null;
  gearList: GearListDetailDTO;
};

export const GearTable = ({ gearList, userId }: GearTableProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const methods = useForm<GearListDetailDTO>({ defaultValues: gearList, mode: "all", reValidateMode: "onChange" });

  const data = methods.watch();

  const onChange = useCallback(
    debounce((data: GearListDetailDTO) => {
      startTransition(() => updateGearList(userId, data));
    }, 3000),
    [userId]
  );

  useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col gap-2 pt-6 h-full">
          <GearTableTitle />

          <div className="pt-4 relative h-full">
            <GearTableCategories />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
