import { motion } from "framer-motion";
import clsx from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "accent";
  className?: string;
}

export default function Spinner({ size = "md", color = "primary", className = "" }: SpinnerProps) {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorStyles = {
    primary: "border-primary-200 border-t-primary-500",
    white: "border-white/30 border-t-white",
    accent: "border-accent-200 border-t-accent-500",
  };

  return (
    <motion.div
      className={clsx(
        "rounded-full",
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
