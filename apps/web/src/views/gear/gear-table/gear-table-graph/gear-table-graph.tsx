"use client";

import { GearListDetailDTO } from "database";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const graphColors = ["#003f5c", "#2f4b7c", "#665191", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background text-foreground px-4 rounded border border-foreground">
        <p className="label">{`${payload[0].name} : ${payload[0].value}g`}</p>
      </div>
    );
  }

  return null;
};

export const GearTableGraph = () => {
  const { watch } = useFormContext<GearListDetailDTO>();

  const data = watch();

  const totalWeight = useMemo(() => {
    return data.categories.reduce((prev, curr) => {
      const sum = curr.items.reduce((prev, curr) => {
        return prev + curr.weight * curr.quantity;
      }, 0);

      return prev + sum;
    }, 0);
  }, [data]);

  const calculatedCategories = useMemo(() => {
    return data.categories.map((category) => {
      const sum = category.items.reduce((prev, curr) => {
        return prev + curr.weight * curr.quantity;
      }, 0);

      return { ...category, sum };
    });
  }, [data]);

  const categoriesToRender = useMemo(() => {
    return calculatedCategories.filter((category) => category.sum !== 0);
  }, [calculatedCategories]);

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <table>
        <tbody className="pb-2">
          {payload.map((entry, index) => {
            return (
              <tr className="text-sm gap-4" key={index}>
                <td className="flex items-center gap-2 pr-2 pb-2">
                  <div className="w-4 h-4" style={{ backgroundColor: entry.color }} />
                  {entry.value}
                </td>
                <td className="text-right pb-2">{entry.payload.sum}g</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="text-sm font-semibold border-t">
            <td className="py-2">Total</td>
            <td className="py-2 ">{totalWeight}g</td>
          </tr>
        </tfoot>
      </table>
    );
  };

  return (
    <div className="mx-auto w-full">
      <PieChart width={500} height={300}>
        <Pie data={categoriesToRender} dataKey="sum" nameKey="name">
          {categoriesToRender.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={graphColors[index % graphColors.length]} />
          ))}
        </Pie>

        {/* @ts-ignore */}
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </div>
  );
};
