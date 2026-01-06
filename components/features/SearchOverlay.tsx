
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Link as LinkIcon, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

import { useUi } from "@/components/providers/UiProvider";

export function SearchOverlay() {
    const { isSearchOpen, closeSearch } = useUi();
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Reset query when closed
    useEffect(() => {
        if (!isSearchOpen) setQuery("");
    }, [isSearchOpen]);

    // Search Logic
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length > 1) {
                setIsSearching(true);
                try {
                    // Dynamic import to avoid server-action-in-client-component issues during build if not careful, 
                    // but standard import work in Next.js 14+. We'll use the one imported at top if possible, 
                    // but we need to import it first. 
                    // Let's add the import to the top of file first.
                    // For now assuming we add `import { searchLinks } from "@/app/actions";`
                    const links = await import("@/app/actions").then(mod => mod.searchLinks(query));

                    const mappedLinks = links.map(l => ({
                        type: "link",
                        title: l.title,
                        href: l.url,
                        meta: l.category
                    }));

                    setResults([
                        { type: "page", title: "My Vault", href: "/" },
                        ...mappedLinks
                    ]);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([{ type: "page", title: "My Vault", href: "/" }]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/60 backdrop-blur-sm"
                    onClick={closeSearch}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-lg bg-background rounded-xl shadow-2xl border border-border/40 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-4 py-3 border-b border-border/40">
                            <Search className="w-4 h-4 text-muted-foreground mr-3" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search your calm space..."
                                className="flex-1 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground/50"
                            />
                            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                ESC
                            </kbd>
                        </div>

                        <div className="p-2 max-h-[300px] overflow-y-auto">
                            {/* Results */}
                            {results.length > 0 ? (
                                <div className="space-y-1">
                                    {results.map((result, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                router.push(result.href);
                                                closeSearch();
                                            }}
                                            className="flex items-center w-full px-3 py-2 text-sm rounded-lg hover:bg-black/5 transition-colors text-left group"
                                        >
                                            {result.type === "doc" ? <FileText className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground" /> : <LinkIcon className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground" />}
                                            <span className="flex-1 text-muted-foreground group-hover:text-foreground">{result.title}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-6 text-center text-sm text-muted-foreground/60 italic font-serif">
                                    Nothing found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
