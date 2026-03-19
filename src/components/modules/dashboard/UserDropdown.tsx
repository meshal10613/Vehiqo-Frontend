import { Button } from "@/components/ui/button";
import { Key, LogOut, User } from "lucide-react";
import Link from "next/link";
import { IUser } from "../../../types/user.type";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import LogoutConfirmDialog from "../../shared/LogoutConfirmDialog";

interface UserDropdownProps {
    userInfo: IUser;
    onLogout?: () => void;
}

const UserDropdown = ({ userInfo, onLogout }: UserDropdownProps) => {
    const initials = userInfo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 shrink-0 cursor-pointer">
                    <AvatarImage
                        src={userInfo?.image || undefined}
                        alt={userInfo.name}
                    />
                    <AvatarFallback className="bg-[#FF5100]/10 text-[#FF5100] text-sm font-semibold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={"end"} className="w-fit">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage
                                src={userInfo?.image || undefined}
                                alt={userInfo.name}
                            />
                            <AvatarFallback className="bg-[#FF5100]/10 text-[#FF5100] text-sm font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">
                                {userInfo.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {userInfo.email}
                            </p>

                            <p className="text-xs text-primary capitalize">
                                {userInfo.role.toLowerCase().replace("_", " ")}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <Link
                        href={"/my-profile"}
                        className="flex items-center gap-2"
                    >
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Link
                        href={"/change-password"}
                        className="flex items-center gap-2"
                    >
                        <Key className="mr-2 h-4 w-4" />
                        Change Password
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <LogoutConfirmDialog
                    trigger={
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer text-red-600"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    }
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
