"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Layers } from "lucide-react";
import { cn } from "../../lib/utils";

export interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    name?: string;
}

export function CustomSelect({ options, value, onChange, label, name }: CustomSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div ref={containerRef} className="relative z-50">
            {name && <input type="hidden" name={name} value={value} />}

            {/* Trigger Pill */}
            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-white/5 hover:bg-white/10 transition-all backdrop-blur-3xl",
                    isOpen && "border-accent/50 bg-accent/10"
                )}
            >
                <Layers className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground/90">
                    {selectedOption?.label || "Select Category"}
                </span>
                <ChevronRight
                    className={cn(
                        "w-3 h-3 text-muted-foreground/60 transition-transform duration-300",
                        isOpen && "rotate-90"
                    )}
                />
            </motion.button>

            {/* Unique Floating Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 12, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -5, scale: 0.98, filter: "blur(8px)" }}
                        transition={{ duration: 0.2, ease: "circOut" }}
                        className="absolute left-0 w-[240px] p-2 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-[60px] shadow-2xl shadow-black/80"
                    >
                        <div className="space-y-1">
                            {options.map((option) => (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                                        value === option.value
                                            ? "bg-white/10 text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    )}
                                    whileHover={{ x: 4 }}
                                >
                                    <span className="text-sm font-medium">{option.label}</span>
                                    {value === option.value && (
                                        <motion.div
                                            layoutId="check"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <Check className="w-3 h-3 text-accent" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
