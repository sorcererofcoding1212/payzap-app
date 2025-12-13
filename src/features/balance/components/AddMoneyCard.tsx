"use client";

import { DottedSeperator } from "@/components/DottedSeperator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMoneySchema } from "@/lib/schema";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SUPPORTED_BANKS } from "@/lib/constants";
import { createOnRampTransaction } from "../actions/createOnRampTransaction";
import { useAccountStore } from "@/store/accountStore";
import { adjustAmount } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { PUBLIC_BANK_URL } from "@/config/config";

interface AddMoneyCardProps {
  isEmailVerified: boolean | undefined;
}

export const AddMoneyCard = ({ isEmailVerified }: AddMoneyCardProps) => {
  const form = useForm<z.infer<typeof addMoneySchema>>({
    defaultValues: {
      amount: undefined,
      bank: "",
    },
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const setPinVerified = useAccountStore((state) => state.setPinVerified);

  const onSubmit = async (values: z.infer<typeof addMoneySchema>) => {
    if (values.bank.length < 1 || !values.amount || values.amount < 50) {
      toast.error("Invalid inputs");
      return;
    }
    setIsSubmittingForm(true);
    if (!isEmailVerified) {
      toast.warning("Please verify your email first");
      setIsSubmittingForm(false);
      form.reset();
      return;
    }
    const amount = adjustAmount(Number(values.amount), "DATABASE");
    const response = await createOnRampTransaction(amount, values.bank);

    if (response.token) {
      window.open(
        `${PUBLIC_BANK_URL}/netbanking?token=${response.token}`,
        "_blank"
      );

      setPinVerified(false);
      setIsSubmittingForm(false);
      form.reset();
    } else if (!response.success) {
      toast.error("Internal server error");
      setIsSubmittingForm(false);
      form.reset();
    }
  };
  return (
    <Card className="lg:w-[50%] w-full text-center lg:text-left">
      <CardHeader>
        <CardTitle className="text-lg text-base-content">Add Money</CardTitle>
      </CardHeader>
      <div className="px-6">
        <DottedSeperator color="silver" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-6 mt-2 space-y-6"
        >
          <FormField
            disabled={isSubmittingForm}
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            disabled={isSubmittingForm}
            name="bank"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Bank</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-10 bg-base-100 md:h-11 rounded-md px-3 py-2 text-sm md:text-base disabled:cursor-not-allowed disabled:opacity-50 text-base-content">
                        <SelectValue placeholder="Select bank">
                          {field.value ? (
                            <div className="flex items-center gap-x-2 lg:gap-x-3">
                              <Image
                                src={
                                  SUPPORTED_BANKS.find(
                                    (b) => b.name === field.value
                                  )?.logo || ""
                                }
                                alt={field.value}
                                width={16}
                                className="object-contain"
                              />
                              <span>{field.value}</span>
                            </div>
                          ) : (
                            "Select bank"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-base-100 border-none">
                        {SUPPORTED_BANKS.map((bank) => (
                          <SelectItem
                            key={bank.name}
                            value={bank.name}
                            className="text-base-content"
                          >
                            <div className="flex gap-x-3 items-center">
                              <Image
                                src={bank.logo}
                                alt={bank.name}
                                width={16}
                                className="object-contain"
                              />
                              <div>{bank.name}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          ></FormField>
          <div className="w-full flex justify-center">
            <Button
              disabled={isSubmittingForm}
              className="text-[13.1px] lg:px-6 lg:text-sm w-full lg:w-fit"
              variant={"card"}
              size={"card"}
            >
              Add Money
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
