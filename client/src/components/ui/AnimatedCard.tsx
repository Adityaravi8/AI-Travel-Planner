import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
};

export default function AnimatedCard({
  children,
  className = "",
  delay = 0,
  hover = true,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={clsx(
        "bg-white rounded-2xl shadow-soft p-6",
        "transition-colors duration-300",
        hover && "cursor-pointer",
        className
      )}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={hover ? "hover" : undefined}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
