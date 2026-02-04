import { Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const slideUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const cardHoverVariants: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const buttonTapVariants = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 },
};

export const chipVariants: Variants = {
  inactive: {
    scale: 1,
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    color: "#475569",
  },
  active: {
    scale: 1.05,
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
    color: "#ffffff",
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

export const bounceInVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

export const skeletonVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const inputFocusVariants: Variants = {
  initial: {
    borderColor: "#e2e8f0",
    boxShadow: "0 0 0 0 rgba(14, 165, 233, 0)",
  },
  focus: {
    borderColor: "#0ea5e9",
    boxShadow: "0 0 0 4px rgba(14, 165, 233, 0.1)",
    transition: {
      duration: 0.2,
    },
  },
};

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const stepperVariants: Variants = {
  inactive: {
    scale: 1,
    backgroundColor: "#e2e8f0",
  },
  active: {
    scale: 1.1,
    backgroundColor: "#0ea5e9",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  completed: {
    scale: 1,
    backgroundColor: "#22c55e",
  },
};
