interface HomePageSubheadingProps {
  subheading: string;
}

export const HomePageSubheading = ({ subheading }: HomePageSubheadingProps) => {
  return (
    <div className="mt-4 lg:mt-8 w-[90%] lg:w-[70%] text-base-content font-medium text-base lg:text-xl">
      {subheading}
    </div>
  );
};
