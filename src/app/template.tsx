"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
