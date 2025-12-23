"use client";

import { DottedSeperator } from "@/components/DottedSeperator";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { registerSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { userRegister } from "../actions/userRegister";
import { toast } from "sonner";
import { useAuthenticate } from "@/hooks/useAuthenticate";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

export const SignupCard = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  const { authenticate, error } = useAuthenticate();

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsSigningUp(true);
    const { data, msg, success } = await userRegister(values);

    if (!success) {
      toast.error(msg);
      setIsSigningUp(false);
      form.resetField("email");
      form.resetField("password");
      return;
    }

    if (data) {
      toast.success("User registered");

      if (!data.password) {
        return;
      }

      const res = await authenticate({
        email: data.email,
        password: values.password,
      });

      setIsSigningUp(false);

      if (res?.ok) {
        router.push("/dashboard");
      }
    }
  };
  return (
    <Card className="w-[95%] h-full md:w-[487px]">
      <CardHeader className="flex justify-center items-center p-1 text-center">
        <CardTitle className="text-2xl text-base-content">
          Create Account
        </CardTitle>
      </CardHeader>
      <div className="px-4 md:px-7">
        <DottedSeperator color="silver" />
      </div>
      <CardContent className="px-4 md:px-7 py-1 md:py-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      required
                      {...field}
                      placeholder="Enter your name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      required
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      required
                      minLength={8}
                      {...field}
                      placeholder="Create a password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isSigningUp}
              variant={"primary"}
              className="w-full"
            >
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-4 md:px-7">
        <DottedSeperator color="silver" />
      </div>
      <CardContent className="px-4 md:px-7 py-1 md:py-2 flex flex-col gap-y-4">
        <Button
          onClick={() => {
            signIn("google");
          }}
          disabled={isSigningUp}
          variant={"secondary"}
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Sign up with Google
        </Button>
        <Button
          onClick={() => {
            signIn("github");
          }}
          disabled={isSigningUp}
          variant={"secondary"}
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Sign up with Github
        </Button>
      </CardContent>
      <div className="px-4 md:px-7">
        <DottedSeperator color="silver" />
      </div>
      <CardFooter className="px-4 md:px-7 flex flex-col gap-y-2 md:gap-y-3 text-sm md:text-base items-center justify-center">
        <p className="text-sm md:text-base text-base-content">
          Already have an account?
          <Link href={"/signin"}>
            <span className="text-blue-700 hover:underline hover:underline-offset-1">
              &nbsp;Login
            </span>
          </Link>
        </p>
        <p className="text-red-600 text-sm md:text-base">{error}</p>
      </CardFooter>
    </Card>
  );
};
