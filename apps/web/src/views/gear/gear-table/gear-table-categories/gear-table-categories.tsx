"use client";

import { GearListDetailDTO } from "database";
import { useFieldArray } from "react-hook-form";
import { Button } from "ui";
import { nanoid } from "nanoid";
import { GearTableEntries } from "../gear-table-entries";

export const GearTableCategories = () => {
  const { fields, append, remove } = useFieldArray<GearListDetailDTO>({ name: "categories" });

  return (
    <div className="flex flex-col">
      <div className="divide-y">
        {fields.map((field, index) => (
          <div key={field.id} className="py-2 group/category">
            <GearTableEntries categoryIndex={index} removeCategory={() => remove(index)} />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() =>
          append({
            name: "",
            id: nanoid(),
            items: [
              {
                name: "",
                description: "",
                id: nanoid(),
                itemId: nanoid(),
                quantity: 1,
                weight: 0,
                weightType: "BASE_WEIGHT",
              },
            ],
          })
        }
      >
        Add Category
      </Button>
    </div>
  );
};
