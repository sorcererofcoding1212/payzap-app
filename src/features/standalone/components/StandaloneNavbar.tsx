import { DashboardButton } from "./DashboardButton";

export const StandaloneNavbar = () => {
  return (
    <nav className="flex items-center w-full justify-between h-14.5 lg:h-16 border-b border-base-300 shadow-xs bg-base-100">
      <div className="italic font-bold text-base-content px-3 md:px-4 text-lg md:text-xl">
        Payzap
      </div>
      <DashboardButton />
    </nav>
  );
};
