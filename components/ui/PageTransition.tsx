"use client";

import { motion } from "framer-motion";

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // "Unreal" smooth ease
                staggerChildren: 0.1
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
