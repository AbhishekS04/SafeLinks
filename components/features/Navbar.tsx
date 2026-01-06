
"use client";

import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Link as LinkIcon, Search } from "lucide-react";
import { useUi } from "@/components/providers/UiProvider";

export function Navbar() {
    const { openSearch } = useUi();
    return (
        <header className="flex items-center justify-between pb-8 pt-4 w-full">
            <div className="flex items-center gap-2 group cursor-default">
                <span className="text-lg font-medium font-serif italic tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
                    SafeLinks
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={openSearch}
                    className="p-2 rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors"
                >
                    <Search className="w-4 h-4" />
                </button>

                <SignedIn>
                    <div className="h-4 w-[1px] bg-border/60" />
                    <UserButton
                        userProfileMode="modal"
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8 rounded-full ring-2 ring-white shadow-sm"
                            }
                        }}
                    />
                </SignedIn>
            </div>
        </header>
    );
}
