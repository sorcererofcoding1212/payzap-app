import { ReactNode } from "react";

interface GraphWrapperProps {
  children: ReactNode;
}

export const GraphWrapper = ({ children }: GraphWrapperProps) => {
  return (
    <div className="w-full h-72 lg:h-86 ml-[-16px] [&_*]:outline-none [&_*]:focus:outline-none [&_*]:border-none [&_*]:focus:border-none text-xs lg:text-sm py-2">
      {children}
    </div>
  );
};
