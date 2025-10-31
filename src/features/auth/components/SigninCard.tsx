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
import { loginSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthenticate } from "@/hooks/useAuthenticate";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

export const SigninCard = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { authenticate, error, loading } = useAuthenticate();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const res = await authenticate(values);

    if (res?.ok) {
      toast.success("Logged in");
      router.push("/");
    }
  };
  return (
    <Card className="w-[95%] h-full md:w-[487px]">
      <CardHeader className="flex justify-center items-center p-1 text-center">
        <CardTitle className="text-2xl text-base-content">
          Welcome Back
        </CardTitle>
      </CardHeader>
      <div className="px-4 md:px-7">
        <DottedSeperator color="silver" />
      </div>
      <CardContent className="px-4 md:px-7 py-1 md:py-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="Enter your password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} variant={"primary"} className="w-full">
              Login
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
          disabled={loading}
          variant={"secondary"}
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
        <Button
          onClick={() => {
            signIn("github");
          }}
          disabled={loading}
          variant={"secondary"}
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
      <div className="px-4 md:px-7">
        <DottedSeperator color="silver" />
      </div>
      <CardFooter className="px-4 md:px-7 flex flex-col gap-y-2 md:gap-y-3 items-center justify-center">
        <p className="text-sm md:text-base text-base-content">
          Don&apos;t have an account?
          <Link href={"/signup"}>
            <span className="text-blue-700 hover:underline hover:underline-offset-1">
              &nbsp;Sign Up
            </span>
          </Link>
        </p>
        <p className="text-red-600 text-sm md:text-base">{error}</p>
      </CardFooter>
    </Card>
  );
};
