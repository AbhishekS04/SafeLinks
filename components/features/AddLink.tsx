"use client";

import { useState, useRef, useEffect } from "react";
import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CustomSelect, Option } from "../ui/custom-select";
import { addLink, fetchMetadata } from "@/app/actions";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function AddLink() {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [metadata, setMetadata] = useState<{ title: string } | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [step, setStep] = useState<"url" | "details">("url");

    const [category, setCategory] = useState("General");
    const router = useRouter(); // Import useRouter

    const categoryOptions: Option[] = [
        { label: "General", value: "General" },
        { label: "UI Library", value: "UI Library" },
        { label: "Tool", value: "Tool" },
        { label: "Article", value: "Article" },
        { label: "Inspiration", value: "Inspiration" },
    ];

    // Server Action State
    const [state, formAction, isPending] = useActionState(addLink, { message: "", success: false });

    // Handle success
    useEffect(() => {
        if (state.success) {
            setIsOpen(false);
            setStep("url");
            // Small delay to allow animation to complete before refresh
            setTimeout(() => {
                router.refresh();
            }, 300);
        }
    }, [state.success, router]);

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsFetching(true);
        // Fetch metadata
        const meta = await fetchMetadata(url);
        if (meta?.title) {
            setMetadata({ title: meta.title });
        }
        setIsFetching(false);
        setStep("details");
    };

    return (
        <div className="w-full mb-12">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="group flex items-center gap-3 w-full p-4 rounded-xl border border-dashed border-border/60 hover:border-accent/40 hover:bg-white/5 transition-all duration-300"
                                >
                                    <div className="p-2 rounded-full bg-border/30 group-hover:bg-accent/10 transition-colors">
                                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                                    </div>
                                    <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                                        Capture a new link...
                                    </span>
                                </motion.button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(true)}
                                className="group flex items-center gap-3 w-full p-4 rounded-xl border border-dashed border-border/60 hover:border-accent/40 hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="p-2 rounded-full bg-border/30 group-hover:bg-accent/10 transition-colors">
                                    <Plus className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                                </div>
                                <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                                    Capture a new link...
                                </span>
                            </motion.button>
                        </SignedIn>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-xl border border-border bg-[#181818]/95 backdrop-blur-xl p-6 shadow-2xl relative z-10"
                    >
                        <form action={formAction}>
                            <div className="space-y-4">
                                {/* Step 1: URL Input */}
                                <div className={step === "details" ? "hidden" : "block"}>
                                    <div className="flex gap-2">
                                        <Input
                                            autoFocus
                                            name="url"
                                            placeholder="Paste a URL here..."
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="font-mono text-xs"
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleUrlSubmit}
                                            disabled={!url || isFetching}
                                        >
                                            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>

                                {/* Step 2: Details */}
                                {step === "details" && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <input type="hidden" name="url" value={url} />

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</label>
                                            <Input
                                                name="title"
                                                defaultValue={metadata?.title || ""}
                                                placeholder="Link Title"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                                    Italic Keyword <Sparkles className="w-3 h-3 text-accent" />
                                                </label>
                                                <Input
                                                    name="italicKeyword"
                                                    placeholder="e.g. 'Inspiring'"
                                                    className="font-serif italic text-accent"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Context</label>
                                                <Input
                                                    name="contextNote"
                                                    placeholder="Why I saved this..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <CustomSelect
                                                label="Category"
                                                name="category"
                                                options={categoryOptions}
                                                value={category}
                                                onChange={setCategory}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => { setIsOpen(false); setStep("url"); }}>Cancel</Button>
                                            <Button type="submit" size="sm">Save to Vault</Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
