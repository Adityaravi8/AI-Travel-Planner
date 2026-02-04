import { motion } from "framer-motion";
import { InputHTMLAttributes, useState } from "react";
import clsx from "clsx";

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AnimatedInput({
  label,
  error,
  className = "",
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = props.value !== undefined && props.value !== "";

  return (
    <motion.div
      className={clsx("relative", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.input
        {...props}
        className={clsx(
          "w-full px-4 py-3 pt-6 rounded-xl",
          "border-2 bg-white/50 backdrop-blur-sm",
          "transition-colors duration-200",
          "focus:outline-none peer",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100",
          "placeholder-transparent"
        )}
        placeholder={label}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
      />
      <motion.label
        className={clsx(
          "absolute left-4 transition-all duration-200 pointer-events-none",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
          "peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400",
          "peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-500",
          (isFocused || hasValue) && "!top-2 !text-xs",
          error ? "!text-red-500" : isFocused && "!text-primary-500"
        )}
        initial={false}
        animate={{
          y: isFocused || hasValue ? 0 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
          color: error ? "#ef4444" : isFocused ? "#0ea5e9" : "#94a3b8",
        }}
        style={{
          originX: 0,
          top: isFocused || hasValue ? "0.5rem" : "50%",
          transform: isFocused || hasValue ? "none" : "translateY(-50%)",
        }}
      >
        {label}
      </motion.label>
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-500"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
