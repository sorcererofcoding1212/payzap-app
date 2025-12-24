import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "../lib/utils";

interface InteractiveScrollAreaProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export const InteractiveScrollArea = ({
  className,
  children,
  onClick,
}: InteractiveScrollAreaProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      setShowIndicator(scrollTop + clientHeight < scrollHeight - 5);
    };

    checkScroll();
    viewport.addEventListener("scroll", checkScroll);
    return () => viewport.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative w-full overflow-hidden", className)}
    >
      <ScrollAreaPrimitive.Viewport ref={viewportRef} className="w-full h-full">
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="w-[6px] rounded-full"
      >
        <ScrollAreaPrimitive.Thumb className="bg-base-300 rounded-full" />
      </ScrollAreaPrimitive.Scrollbar>

      {showIndicator && (
        <div className="absolute bottom-4 left-1/2 p-2 bg-base-content/60 lg:cursor-pointer rounded-full -translate-x-1/2 animate-bounce">
          <ChevronDown onClick={onClick} className="text-base-content" />
        </div>
      )}
    </ScrollAreaPrimitive.Root>
  );
};
