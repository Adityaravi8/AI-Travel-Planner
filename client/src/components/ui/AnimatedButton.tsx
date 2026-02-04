import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";
import Spinner from "./Spinner";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  fullWidth = false,
}: AnimatedButtonProps) {
  const baseStyles = clsx(
    "relative px-6 py-3 rounded-xl font-semibold",
    "transition-colors duration-200",
    "focus:outline-none focus:ring-4",
    fullWidth && "w-full",
    disabled && "cursor-not-allowed opacity-50"
  );

  const variantStyles = {
    primary: clsx(
      "text-white",
      "bg-gradient-to-r from-primary-500 to-primary-600",
      "shadow-lg shadow-primary-500/30",
      "focus:ring-primary-200",
      !disabled && "hover:shadow-xl hover:shadow-primary-500/40"
    ),
    secondary: clsx(
      "bg-white border-2 border-slate-200 text-slate-700",
      "focus:ring-slate-200",
      !disabled && "hover:border-primary-300 hover:text-primary-600"
    ),
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(baseStyles, variantStyles[variant], className)}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span className={clsx("flex items-center justify-center gap-2", loading && "opacity-0")}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size="sm" color={variant === "primary" ? "white" : "primary"} />
        </span>
      )}
    </motion.button>
  );
}
