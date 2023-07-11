"use client";

import { GearListDetailDTO } from "database";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
} from "ui";
import { nanoid } from "nanoid";
import { Grip, Plus, Trash } from "lucide-react";
import { useMemo } from "react";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import { useReadOnly } from "@/context/read-only-context";

type GearTableEntriesProps = {
  removeCategory: () => void;
  categoryIndex: number;
};

export const GearTableEntries = ({ categoryIndex, removeCategory }: GearTableEntriesProps) => {
  const { isReadOnly } = useReadOnly();
  const { register, watch } = useFormContext<GearListDetailDTO>();
  const { fields, append, remove, move } = useFieldArray<GearListDetailDTO, `categories.${number}.items`>({
    name: `categories.${categoryIndex}.items`,
  });

  const data = watch();

  const totalWeight = useMemo(() => {
    return data.categories[categoryIndex].items.reduce((prev, curr) => {
      return prev + curr.weight * curr.quantity;
    }, 0);
  }, [data, categoryIndex]);

  const measurementType = useMemo(() => {
    return "g";
  }, []);

  const handleOnDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    if (destination) {
      move(source.index, destination.index);
    }
  };

  return (
    <div className="flex flex-col mb-4 gap-2">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <table className="text-sm table-auto">
          <thead>
            <tr>
              <th />
              <th colSpan={2}>
                <Input
                  readOnly={isReadOnly}
                  className="text-lg font-semibold py-0 h-auto border-transparent transition-colors hover:border-muted-foreground focus:border-muted-foreground"
                  placeholder="My Category"
                  {...register(`categories.${categoryIndex}.name`)}
                />
              </th>

              <th></th>
              <th>Weight</th>
              <th>Quantity</th>
              <th>
                {!isReadOnly ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="opacity-0 px-2 h-8 group-hover/category:opacity-100 transition-opacity"
                      >
                        <Trash className="text-gray-400 w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete category?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button onClick={removeCategory}>Yes, delete category</Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </th>
            </tr>
          </thead>
          <Droppable droppableId={`category-${categoryIndex}`}>
            {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps} className="divide-y">
                {fields.map((field, index) => (
                  <Draggable draggableId={field.id} index={index} isDragDisabled={isReadOnly} key={field.id}>
                    {(provided) => (
                      <tr className="group" ref={provided.innerRef} {...provided.draggableProps}>
                        <td>
                          {!isReadOnly ? (
                            <div {...provided.dragHandleProps}>
                              <Grip className="opacity-10 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ) : null}
                        </td>
                        <td>
                          <Input
                            readOnly={isReadOnly}
                            className="rounded-none border-transparent border-dashed hover:border-gray-500 h-auto py-0"
                            placeholder="Name"
                            {...register(`categories.${categoryIndex}.items.${index}.name`)}
                          />
                        </td>
                        <td>
                          <Input
                            readOnly={isReadOnly}
                            className="rounded-none border-transparent border-dashed hover:border-gray-500 h-auto py-0"
                            placeholder="Description"
                            {...register(`categories.${categoryIndex}.items.${index}.description`)}
                          />
                        </td>
                        <td>
                          <div className="hidden gap-1 px-2 self-center py-auto transition-opacity opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
                            <Button className="p-0 w-6 h-6" variant="outline" />
                            <Button className="p-0 w-6 h-6" variant="outline" />
                            <Button className="p-0 w-6 h-6" variant="outline" />
                            <Button className="p-0 w-6 h-6" variant="outline" />
                          </div>
                        </td>
                        <td className="w-20">
                          <div className="flex items-baseline gap-0">
                            <Input
                              readOnly={isReadOnly}
                              type="number"
                              className="rounded-none appearance-none text-right border-transparent border-dashed hover:border-gray-500 h-auto p-0"
                              {...register(`categories.${categoryIndex}.items.${index}.weight`, {
                                valueAsNumber: true,
                              })}
                            />
                            <p>{measurementType}</p>
                          </div>
                        </td>
                        <td className="w-20">
                          <Input
                            readOnly={isReadOnly}
                            type="number"
                            className="rounded-none appearance-none text-right border-transparent border-dashed hover:border-gray-500 h-auto p-0"
                            {...register(`categories.${categoryIndex}.items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="px-2">
                          {!isReadOnly ? (
                            <Button
                              variant="ghost"
                              className="opacity-0 px-2 h-8 group-hover:opacity-100 transition-opacity"
                              onClick={() => remove(index)}
                            >
                              <Trash className="text-gray-400 w-4 h-4" />
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
          <tfoot>
            <tr>
              <th />
              <th colSpan={3}>
                {!isReadOnly ? (
                  <div className="flex gap-2">
                    <Button
                      className="flex gap-2 py-1 px-2 h-auto"
                      variant="ghost"
                      onClick={() =>
                        append({
                          name: "",
                          id: nanoid(),
                          itemId: nanoid(),
                          description: "",
                          quantity: 1,
                          weight: 0,
                          order: -1,
                          weightType: "BASE_WEIGHT",
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      New Item
                    </Button>
                    {/* 
                  <Button
                    className="flex gap-2 py-1 px-2 h-auto"
                    variant="ghost"
                    onClick={() =>
                      append({
                        name: "",
                        id: nanoid(),
                        itemId: nanoid(),
                        description: "",
                        quantity: 1,
                        weight: 0,
                        order: -1,
                        weightType: "BASE_WEIGHT",
                      })
                    }
                  >
                    <Download className="h-4 w-4" />
                    Existing Item
                  </Button> */}
                  </div>
                ) : null}
              </th>

              <th className="text-right">
                {totalWeight}
                {measurementType}
              </th>
              <th></th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </DragDropContext>
    </div>
  );
};
