import { poppins } from "@/fonts/poppins";
import { cn } from "@/lib/utils";

interface HomePageHeadingProps {
  heading: string;
}

export const HomePageHeading = ({ heading }: HomePageHeadingProps) => {
  return (
    <div
      className={cn(
        "text-base-content mb-1 lg:mb-3 text-3xl lg:text-6xl",
        poppins.className
      )}
    >
      {heading}
    </div>
  );
};
