import { useEffect, useState } from "react";
import { getGroupedExpenses } from "../actions/getGroupedExpenses";
import { toast } from "sonner";
import { ComponentLoader } from "@/components/ComponentLoader";
import { GraphEmptyData } from "./GraphEmptyData";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ExpenseDataProps {
  type: string;
  amount: number;
  [key: string]: string | number;
}

const COLORS = ["#f87171", "#fb923c", "#60a5fa", "#a78bfa"];

export const GroupedTransactionGraph = () => {
  const [groupedExpenses, setGroupedExpenses] = useState<ExpenseDataProps[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGroupedExpenses = async () => {
    try {
      setLoading(true);
      const groupedResponse = await getGroupedExpenses();
      if (groupedResponse.data.length > 0) {
        setGroupedExpenses(groupedResponse.data);
      }
    } catch {
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedExpenses();
  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow border text-xs">
          <span className="font-medium">{payload[0].payload.type}</span>
          <span className="font-medium">{" : "}</span>
          <span
            className="font-medium"
            style={{ color: payload[0].payload.fill }}
          >
            ₹{payload[0].payload.amount}
          </span>
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

  if (groupedExpenses.length === 0) {
    return <GraphEmptyData text="No Expenses Data" />;
  }

  return (
    <div className="h-64 lg:h-80 ml-[32px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={groupedExpenses}
            dataKey="amount"
            nameKey="type"
            outerRadius="80%"
            innerRadius="50%"
          >
            {groupedExpenses.map((_, index) => (
              <Cell
                className="cursor-pointer"
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
