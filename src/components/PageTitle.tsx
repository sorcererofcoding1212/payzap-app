import { Poppins as P } from "next/font/google";

const Poppins = P({
  subsets: ["latin"],
  weight: ["600"],
});

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div
      className={`${Poppins.className} lg:text-4xl text-2xl font-semibold text-center lg:text-left text-base-content`}
    >
      {title}
    </div>
  );
};
