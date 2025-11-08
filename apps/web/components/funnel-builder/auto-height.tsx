import React from "react";
import { motion } from "framer-motion";

interface AutoHeightProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const AutoHeight = ({ isVisible, children }: AutoHeightProps) => {
  return (
    <motion.div
      initial={false}
      animate={{ height: isVisible ? "auto" : 0, opacity: isVisible ? 1 : 0 }}
      transition={{ height: { duration: 0.25 }, opacity: { duration: 0.15 } }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
};
