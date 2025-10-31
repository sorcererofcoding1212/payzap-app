import { useState } from "react";
import { signIn } from "next-auth/react";

export const useAuthenticate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    }
    setLoading(false);
    return res;
  };

  return { authenticate, loading, error };
};
