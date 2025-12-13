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
import { transferMoneySchema } from "@/lib/schema";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTransfer } from "../actions/createTransfer";
import { adjustAmount, checkValidWalletId } from "@/lib/utils";
import { toast } from "sonner";
import { createOffRampTransaction } from "../actions/createOffRampTransaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { PinModal } from "@/components/PinModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { SUPPORTED_BANKS } from "@/lib/constants";
import { CreatePinModal } from "@/components/CreatePinModal";
import { checkAccountPinExists } from "@/actions/checkAccountPinExists";

interface TransferMoneyCardProps {
  isEmailVerified: boolean | undefined;
}

type Variant = "Wallet" | "Bank";

export const TransferMoneyCard = ({
  isEmailVerified,
}: TransferMoneyCardProps) => {
  const form = useForm<z.infer<typeof transferMoneySchema>>({
    resolver: zodResolver(transferMoneySchema),
    defaultValues: {
      amount: undefined,
      transferAccount: "",
    },
  });

  const [variant, setVariant] = useState<Variant>("Wallet");

  const toggleVariant = useCallback(() => {
    form.reset();
    setErrorMsg("");
    if (variant === "Bank") {
      setVariant("Wallet");
    } else {
      setVariant("Bank");
    }
  }, [variant, form]);

  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");

  const [transferData, setTransferData] = useState<z.infer<
    typeof transferMoneySchema
  > | null>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openCreatePinModal, setOpenCreatePinModal] = useState<boolean>(false);

  const onInitialSubmit = async (
    values: z.infer<typeof transferMoneySchema>
  ) => {
    if (!isEmailVerified) {
      toast.warning("Please verify your email first");
      form.reset();
      return;
    }
    const { msg, success } = await checkAccountPinExists();
    if (!success) {
      toast.error(msg);
      setOpenCreatePinModal(true);
      return;
    }
    if (variant === "Wallet") {
      const validWalletId = checkValidWalletId(values.transferAccount);
      if (!validWalletId) {
        setErrorMsg("Invalid wallet ID entered");
        return;
      }
    }
    setErrorMsg("");
    setTransferData({
      amount: values.amount,
      transferAccount: values.transferAccount,
      bank: values.bank,
    });

    setOpenModal(true);
  };

  const handleTransfer = async (
    formData: z.infer<typeof transferMoneySchema>
  ) => {
    if (!formData) {
      setErrorMsg("Invalid inputs provided");
      return;
    }

    setErrorMsg("");
    setIsSubmittingForm(true);

    if (variant === "Wallet") {
      const { success, msg } = await createTransfer(
        adjustAmount(Number(formData.amount), "DATABASE"),
        formData.transferAccount
      );

      if (!success) {
        setErrorMsg(msg);
        setIsSubmittingForm(false);
        form.reset();
        return;
      }

      setErrorMsg("");
      form.reset();
      toast.success(msg);
    } else {
      if (!formData.bank) {
        toast.error("Please select the bank");
        return;
      }
      const { success, msg } = await createOffRampTransaction(
        adjustAmount(Number(formData.amount), "DATABASE"),
        formData.transferAccount,
        formData.bank
      );

      if (!success) {
        toast.error(msg);
        setIsSubmittingForm(false);
        form.reset();
        return;
      }

      setErrorMsg("");
      form.reset();
      toast.success(msg);
    }

    setIsSubmittingForm(false);
  };

  return (
    <Card className="lg:w-[50%] w-full text-center lg:text-left">
      <CardHeader>
        <CardTitle className="text-lg text-base-content">
          {variant === "Bank" ? "Bank Transfer" : "Wallet Transfer"}
        </CardTitle>
      </CardHeader>
      <div className="px-6">
        <DottedSeperator color="silver" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onInitialSubmit)}
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
            name="transferAccount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {variant === "Bank" ? "Account Number" : "Wallet ID"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      variant === "Bank"
                        ? "Recipient's account number"
                        : "Recipient's wallet ID"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          {variant === "Bank" && (
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
          )}
          <div className="w-full flex justify-center">
            <Button
              disabled={isSubmittingForm}
              className="text-[13.1px] lg:px-6 lg:text-sm w-full lg:w-fit"
              variant={"card"}
              size={"card"}
            >
              Transfer Money
            </Button>
          </div>
        </form>
      </Form>
      <div className="px-6 space-y-3 lg:space-y-4">
        <div className="flex gap-x-2 items-center">
          <DottedSeperator color="silver" />
          <div className="text-base-content">Or</div>
          <DottedSeperator color="silver" />
        </div>
        <div className="w-full flex justify-center">
          <Button
            onClick={toggleVariant}
            disabled={isSubmittingForm}
            className="text-[13.1px] lg:px-6 lg:text-sm w-full lg:w-fit"
            variant={"teritary"}
            size={"card"}
          >
            {variant === "Bank" ? "Wallet Transfer" : "Bank Transfer"}
          </Button>
        </div>
        <div className="text-red-500 text-sm text-center">
          {errorMsg && errorMsg}
        </div>
      </div>
      <PinModal
        open={openModal}
        setOpen={setOpenModal}
        onSuccess={() => {
          if (!transferData) return;
          handleTransfer(transferData);
        }}
      />
      <CreatePinModal
        open={openCreatePinModal}
        setOpen={setOpenCreatePinModal}
      />
    </Card>
  );
};
