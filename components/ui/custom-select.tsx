"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "./button"; // Using button's cn

export interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    name?: string;
}

export function CustomSelect({ options, value, onChange, label, placeholder = "Select...", name }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative space-y-1">
            {label && (
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    {label}
                </label>
            )}

            {/* Hidden input for form submission if name is provided */}
            {name && <input type="hidden" name={name} value={value} />}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-lg border border-border/40 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/20",
                    isOpen && "border-accent/50 ring-2 ring-accent/20 bg-white/10",
                    !value && "text-muted-foreground"
                )}
            >
                <span className={cn("truncate font-medium", !value ? "text-muted-foreground/50" : "text-foreground")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground/70 transition-transform duration-200", isOpen && "rotate-180 text-foreground")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close on click outside */}
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-xl border border-border/40 bg-[#1e1e1e] shadow-2xl ring-1 ring-black/5"
                        >
                            <div className="p-1.5 space-y-0.5">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "relative flex w-full cursor-default select-none items-center rounded-lg py-2.5 pl-3 pr-8 text-sm outline-none transition-colors",
                                            "hover:bg-white/5",
                                            value === option.value ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {value === option.value && (
                                            <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
                                                <Check className="h-4 w-4" />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
