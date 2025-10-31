interface GraphEmptyDataProps {
  text: string;
}

export const GraphEmptyData = ({ text }: GraphEmptyDataProps) => {
  return (
    <div className="text-base-content flex ml-[32px] justify-center items-center pb-10 text-[15px] lg:text-lg h-full font-semibold">
      {text}
    </div>
  );
};
