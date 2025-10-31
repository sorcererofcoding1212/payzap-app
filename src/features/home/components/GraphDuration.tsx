import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Duration } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";

interface DurationValue {
  duration: Duration;
  value: string;
}

interface GraphDurationProps {
  durationValue: Duration;
  setDurationValue: Dispatch<SetStateAction<Duration>>;
}

export const GraphDuration = ({
  durationValue,
  setDurationValue,
}: GraphDurationProps) => {
  const [radioValues, setRadioValues] = useState<DurationValue[]>([
    { duration: "DAY", value: "Daily" },
    { duration: "WEEK", value: "Weekly" },
    { duration: "MONTH", value: "Monthly" },
  ]);

  return (
    <RadioGroup
      value={durationValue}
      onValueChange={(value: Duration) => setDurationValue(value)}
      className="flex w-full items-center justify-center h-6 ml-[16px]"
    >
      {radioValues.map((val) => (
        <div
          key={val.value}
          className="flex items-center space-x-2 text-purple-400"
        >
          <RadioGroupItem
            className="bg-base-content lg:hover:cursor-pointer size-2 focus:bg-purple-400"
            value={val.duration}
            id={val.duration}
          />
          <Label
            htmlFor={val.duration}
            className="text-base-content text-xs lg:text-sm"
          >
            {val.value}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
