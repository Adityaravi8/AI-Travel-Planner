import { motion } from "framer-motion";
import clsx from "clsx";
import { Check, MapPin, Heart, Calendar } from "lucide-react";

interface Step {
  id: number;
  label: string;
  icon: typeof MapPin;
}

const steps: Step[] = [
  { id: 1, label: "Trip Details", icon: MapPin },
  { id: 2, label: "Preferences", icon: Heart },
  { id: 3, label: "Itinerary", icon: Calendar },
];

interface ProgressStepperProps {
  currentStep: number;
}

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={clsx(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center",
                  "border-2 transition-colors duration-300",
                  isCompleted && "bg-success-500 border-success-500",
                  isActive && "bg-primary-500 border-primary-500 shadow-glow",
                  !isCompleted && !isActive && "bg-white border-slate-200"
                )}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                ) : (
                  <Icon
                    className={clsx(
                      "w-5 h-5 md:w-6 md:h-6",
                      isActive ? "text-white" : "text-slate-400"
                    )}
                  />
                )}
              </motion.div>
              <motion.span
                className={clsx(
                  "mt-2 text-xs md:text-sm font-medium hidden sm:block",
                  isActive && "text-primary-600",
                  isCompleted && "text-success-600",
                  !isActive && !isCompleted && "text-slate-400"
                )}
                animate={{
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {step.label}
              </motion.span>
            </div>

            {index < steps.length - 1 && (
              <div className="w-8 md:w-16 lg:w-24 h-0.5 mx-2 md:mx-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-200" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-success-500 to-primary-500"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: isCompleted ? 1 : 0,
                  }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
