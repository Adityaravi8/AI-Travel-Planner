import { motion } from "framer-motion";
import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

function Skeleton({ className = "", variant = "text", width, height }: SkeletonProps) {
  const variantStyles = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <motion.div
      className={clsx("shimmer bg-slate-200", variantStyles[variant], className)}
      style={{ width, height }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-soft p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
        <Skeleton width="75%" height={16} />
      </div>
    </motion.div>
  );
}

export function SkeletonItineraryDay({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-soft p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between">
        <Skeleton width={100} height={28} className="rounded-lg" />
        <Skeleton width={80} height={24} className="rounded-full" />
      </div>
      <div className="space-y-4 mt-4">
        {["morning", "afternoon", "evening"].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton width="30%" height={14} />
              <Skeleton width="90%" height={18} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SkeletonItinerary({ days = 3 }: { days?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: days }).map((_, i) => (
        <SkeletonItineraryDay key={i} index={i} />
      ))}
    </div>
  );
}

export default Skeleton;
