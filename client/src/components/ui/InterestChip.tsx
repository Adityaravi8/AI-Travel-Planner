import { motion } from "framer-motion";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface InterestChipProps {
  label: string;
  icon?: LucideIcon;
  selected: boolean;
  onClick: () => void;
  color?: "primary" | "accent" | "success";
}

const colorMap = {
  primary: {
    active: "bg-primary-500 border-primary-500 text-white shadow-primary-500/30",
    inactive: "bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600",
  },
  accent: {
    active: "bg-accent-500 border-accent-500 text-white shadow-accent-500/30",
    inactive: "bg-white border-slate-200 text-slate-600 hover:border-accent-300 hover:text-accent-600",
  },
  success: {
    active: "bg-success-500 border-success-500 text-white shadow-success-500/30",
    inactive: "bg-white border-slate-200 text-slate-600 hover:border-success-300 hover:text-success-600",
  },
};

export default function InterestChip({
  label,
  icon: Icon,
  selected,
  onClick,
  color = "primary",
}: InterestChipProps) {
  const colors = colorMap[color];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={clsx(
        "px-4 py-2 rounded-full text-sm font-medium",
        "border-2 transition-colors duration-200",
        "flex items-center gap-2",
        selected ? colors.active : colors.inactive,
        selected && "shadow-md"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: selected ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      {Icon && (
        <motion.span
          animate={{ rotate: selected ? 360 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon size={16} />
        </motion.span>
      )}
      {label}
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  );
}
