
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Link as LinkIcon, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { getSafeHostname } from "@/lib/url";

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
                        meta: l.category,
                        hostname: getSafeHostname(l.url)
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
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/40 backdrop-blur-sm"
                    onClick={closeSearch}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ duration: 0.2, ease: "circOut" }}
                        className="w-full max-w-lg bg-black/60 backdrop-blur-3xl rounded-2xl shadow-2xl shadow-black/50 border border-white/5 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center px-5 py-4">
                            <Search className="w-4 h-4 text-muted-foreground mr-3" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search your calm space..."
                                className="flex-1 bg-transparent outline-none text-base text-white placeholder:text-muted-foreground/40 font-light"
                            />
                            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[9px] font-medium text-muted-foreground">
                                ESC
                            </kbd>
                        </div>

                        <div className="p-2 max-h-[300px] overflow-y-auto">
                            {/* Results */}
                            {results.length > 0 ? (
                                <div className="space-y-0.5">
                                    {results.map((result, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                router.push(result.href);
                                                closeSearch();
                                            }}
                                            className="flex items-center w-full px-4 py-3 text-sm rounded-xl hover:bg-white/5 transition-colors text-left group"
                                        >
                                            {result.type === "doc" ? <FileText className="w-4 h-4 mr-3 text-muted-foreground/60 group-hover:text-foreground/80" /> : <LinkIcon className="w-4 h-4 mr-3 text-muted-foreground/60 group-hover:text-foreground/80" />}
                                            <span className="flex-1 text-muted-foreground group-hover:text-foreground/90 font-light">{result.title}</span>
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
