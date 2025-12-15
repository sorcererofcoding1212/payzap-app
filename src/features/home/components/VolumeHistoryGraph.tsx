"use client";

import { useEffect, useState } from "react";
import { getSortedTransactions } from "../actions/getSortedTransactions";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GraphEmptyData } from "./GraphEmptyData";
import { ComponentLoader } from "@/components/ComponentLoader";
import { toast } from "sonner";

interface VolumeDataProps {
  date: string;
  income: number;
  expense: number;
}

export const VolumeHistoryGraph = () => {
  const [volumeData, setVolumeData] = useState<VolumeDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVolumeHistory = async () => {
    try {
      setLoading(true);
      const response = await getSortedTransactions();
      if (response.data.length > 0) {
        setVolumeData(
          response.data.map((item: any) => ({
            date: item.date,
            income: item.income,
            expense: item.expense,
          }))
        );
      }
    } catch {
      console.log("Some error occured");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumeHistory();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow border text-xs">
          <p className="font-semibold">{label}</p>
          <p style={{ color: "green" }}>Income: {payload[0].value}</p>
          <p style={{ color: "red" }}>Expense: {payload[1].value}</p>
          <p className="font-semibold text-purple-500">
            Total: {payload[0].value + payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center pb-10 ml-[16px]">
        <ComponentLoader />
      </div>
    );
  }

  if (volumeData.length === 0) {
    return <GraphEmptyData text="No Volume Data" />;
  }

  return (
    <div className="h-64 lg:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={volumeData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" stackId="a" fill="#4ade80" />
          <Bar dataKey="expense" stackId="a" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
