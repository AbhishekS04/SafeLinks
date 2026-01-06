"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowDown, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteLink } from "@/app/actions";

interface LinkType {
    id: string;
    url: string;
    title: string;
    category: string | null;
    italicKeyword: string | null;
    contextNote: string | null;
    createdAt: Date;
}

interface LinkVaultProps {
    links: LinkType[];
}

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
};

export function LinkVault({ links }: LinkVaultProps) {
    const [visibleCount, setVisibleCount] = useState(10); // increased from 5
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const visibleLinks = links.slice(0, visibleCount);
    const hasMore = visibleCount < links.length;

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        startTransition(async () => {
            await deleteLink(id);
        });
    };

    // Group links by category
    const groupedLinks = visibleLinks.reduce((acc, link) => {
        const category = link.category || "General";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(link);
        return acc;
    }, {} as Record<string, LinkType[]>);

    // Fixed category order
    const categoryOrder = ["UI Library", "Inspiration", "General", "Article"];

    // Sort categories based on fixed order, putting others at the end
    const sortedCategories = Object.entries(groupedLinks).sort(([a], [b]) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="space-y-12 pb-24">
            <AnimatePresence mode="popLayout">
                {sortedCategories.map(([category, linksInCategory]) => (
                    <motion.section
                        key={category}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        variants={container}
                        className="space-y-6"
                    >
                        <h2 className="text-xs font-bold text-[#D97757] uppercase tracking-widest pl-1">
                            {category}
                        </h2>

                        <div className="space-y-6">
                            {linksInCategory.map((link) => (
                                <motion.div
                                    layout
                                    key={link.id}
                                    variants={item}
                                    className="group relative pl-4 border-l border-border/40 hover:border-foreground/40 transition-colors py-0.5"
                                >
                                    <div className="space-y-0.5">
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-base font-medium text-foreground/80 hover:text-foreground transition-colors truncate pr-8 uppercase tracking-wide"
                                        >
                                            {link.title}
                                        </a>

                                        <div className="flex items-center gap-3 text-sm text-muted-foreground/60">
                                            <span className="truncate max-w-[200px] hover:text-foreground/80 transition-colors">
                                                {new URL(link.url).hostname}
                                            </span>

                                            {link.italicKeyword && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-border" />
                                                    <span className="font-serif italic text-muted-foreground hover:text-accent transition-colors">
                                                        {link.italicKeyword}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete Action - Absolute Positioned */}
                                    <button
                                        onClick={(e) => handleDelete(link.id, e)}
                                        disabled={isPending}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-red-500/10 rounded-full text-muted-foreground hover:text-red-500 disabled:opacity-50"
                                        title="Delete Link"
                                    >
                                        {isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                ))}
            </AnimatePresence>

            {hasMore && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center pt-8"
                >
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 10)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-transparent hover:border-border/60 hover:bg-white/5"
                    >
                        <ArrowDown className="w-4 h-4" />
                        Show More
                    </button>
                </motion.div>
            )}
        </div>
    );
}
