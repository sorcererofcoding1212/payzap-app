import { Avatar, AvatarFallback } from "./ui/avatar";

interface UserAvatarProps {
  name: string;
}

export const UserAvatar = ({ name }: UserAvatarProps) => {
  return (
    <Avatar
      role="button"
      className="size-9 lg:size-9 cursor-pointer active:scale-90 transition-all"
    >
      <AvatarFallback className="bg-green-900 font-medium text-white text-base lg:text-sm">
        {name.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
