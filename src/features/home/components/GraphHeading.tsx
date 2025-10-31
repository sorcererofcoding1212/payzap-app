interface GraphHeading {
  heading: string;
}

export const GraphHeading = ({ heading }: GraphHeading) => {
  return (
    <div
      className="text-base-content my-2 lg:my-0 text-center lg:text-lg w-full font-semibold py-1 lg:py-2
     text-base"
    >
      {heading}
    </div>
  );
};
