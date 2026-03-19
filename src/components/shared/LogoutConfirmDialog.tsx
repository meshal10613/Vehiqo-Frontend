"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { logoutUser } from "../../services/auth.services";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface LogoutConfirmDialogProps {
    trigger: React.ReactNode;
}

export default function LogoutConfirmDialog({
    trigger,
}: LogoutConfirmDialogProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const handleLogout = async () => {
        setIsPending(true);
        await logoutUser();
        router.refresh();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 max-w-sm">
                {/* Icon */}
                <div className="flex justify-center pt-2 pb-1">
                    <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center animate-in zoom-in-75 duration-300">
                        <motion.div
                            animate={{ x: [0, 4, 0, -4, 0] }}
                            transition={{
                                duration: 0.4,
                                delay: 2,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "easeInOut",
                            }}
                        >
                            <LogOut className="w-6 h-6 text-red-500" />
                        </motion.div>
                    </div>
                </div>

                <AlertDialogHeader className="text-center items-center">
                    <AlertDialogTitle className="text-lg font-semibold text-zinc-900">
                        Log out of Vehiqo?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-zinc-500">
                        You will be logged out from this device.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex-row gap-2 mt-2">
                    <AlertDialogCancel className="cursor-pointer flex-1 border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors duration-200 h-10">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        disabled={isPending}
                        className="cursor-pointer flex-1 bg-red-600 hover:bg-red-500 text-white transition-all duration-200 gap-2 disabled:opacity-70 h-10"
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Logging out...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4" />
                                Log out
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
