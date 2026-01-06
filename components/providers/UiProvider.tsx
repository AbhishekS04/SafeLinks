"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

interface UiContextType {
    isSearchOpen: boolean;
    toggleSearch: () => void;
    openSearch: () => void;
    closeSearch: () => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export function UiProvider({ children }: { children: ReactNode }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleSearch = useCallback(() => setIsSearchOpen((prev) => !prev), []);
    const openSearch = useCallback(() => setIsSearchOpen(true), []);
    const closeSearch = useCallback(() => setIsSearchOpen(false), []);

    // Handle Keyboard shortcut globally in the provider
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle with '/' key if not typing in an input
            if (e.key === "/" && !isSearchOpen) {
                // Check if active element is input or textarea, unless it's the body
                const activeTag = document.activeElement?.tagName.toLowerCase();
                if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
                    return;
                }
                e.preventDefault();
                openSearch();
            }
            if (e.key === "Escape") {
                closeSearch();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSearchOpen, openSearch, closeSearch]);

    return (
        <UiContext.Provider value={{ isSearchOpen, toggleSearch, openSearch, closeSearch }}>
            {children}
        </UiContext.Provider>
    );
}

export function useUi() {
    const context = useContext(UiContext);
    if (context === undefined) {
        throw new Error("useUi must be used within a UiProvider");
    }
    return context;
}
