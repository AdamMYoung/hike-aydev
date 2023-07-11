"use client";

import { GearListDetailDTO } from "database";
import { useFieldArray } from "react-hook-form";
import { Button } from "ui";
import { nanoid } from "nanoid";
import { GearTableEntries } from "../gear-table-entries";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { Grip } from "lucide-react";

export const GearTableCategories = () => {
  const { fields, append, move, remove } = useFieldArray<GearListDetailDTO>({ name: "categories" });

  const handleOnDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    if (destination) {
      move(source.index, destination.index);
    }
  };

  return (
    <div className="flex flex-col">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {fields.map((field, index) => (
                <Draggable draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[auto_1fr] group/category bg-background"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div>
                        <div {...provided.dragHandleProps}>
                          <Grip className="mt-3 opacity-10 group-hover/category:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="py-2">
                        <GearTableEntries categoryIndex={index} removeCategory={() => remove(index)} />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        variant="outline"
        onClick={() =>
          append({
            name: "",
            id: nanoid(),
            order: -1,
            items: [
              {
                name: "",
                description: "",
                id: nanoid(),
                itemId: nanoid(),
                quantity: 1,
                weight: 0,
                order: -1,
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
