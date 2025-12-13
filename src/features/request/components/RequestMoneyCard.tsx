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
import { requestMoneySchema } from "@/lib/schema";
import { adjustAmount, checkValidWalletId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createRequest } from "../actions/createRequest";

interface RequestMoneyCardProps {
  isEmailVerified: boolean | undefined;
}

export const RequestMoneyCard = ({
  isEmailVerified,
}: RequestMoneyCardProps) => {
  const form = useForm<z.infer<typeof requestMoneySchema>>({
    resolver: zodResolver(requestMoneySchema),
    defaultValues: {
      amount: undefined,
      requestToAccount: "",
    },
  });

  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onSubmit = async (formData: z.infer<typeof requestMoneySchema>) => {
    try {
      if (!isEmailVerified) {
        toast.warning("Please verify your email first");
        form.reset();
        return;
      }

      setIsSubmittingForm(true);

      const validWalletId = checkValidWalletId(formData.requestToAccount);
      if (!validWalletId) {
        setErrorMsg("Invalid wallet ID entered");
        return;
      }

      const { success, msg } = await createRequest(
        adjustAmount(formData.amount, "DATABASE"),
        formData.requestToAccount
      );
      
      if (!success) {
        setErrorMsg(msg);
        return;
      }
      toast.success("Request successful");
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <Card className="lg:w-[50%] w-full text-center lg:text-left">
      <CardHeader>
        <CardTitle className="text-lg text-base-content">
          Request Money
        </CardTitle>
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
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            disabled={isSubmittingForm}
            name="requestToAccount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter wallet ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className="w-full flex justify-center">
            <Button
              disabled={false}
              className="text-[13.1px] lg:px-6 lg:text-sm w-full lg:w-fit"
              variant={"card"}
              size={"card"}
            >
              Request Money
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-red-500 text-sm text-center">
        {errorMsg && errorMsg}
      </div>
    </Card>
  );
};
