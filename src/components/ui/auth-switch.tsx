import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface AuthSwitchProps {
  isLogin: boolean;
  onToggle: (isLogin: boolean) => void;
}

export default function AuthSwitch({ isLogin, onToggle }: AuthSwitchProps) {
  return (
    <div className="relative flex w-full bg-slate-100/80 dark:bg-slate-900/50 p-1.5 rounded-xl backdrop-blur-sm shadow-inner border border-slate-200/50 dark:border-slate-800/50">
      <button
        type="button"
        onClick={() => onToggle(true)}
        className={cn(
          "relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors duration-300 rounded-lg",
          isLogin ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        )}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => onToggle(false)}
        className={cn(
          "relative z-10 flex-1 py-2.5 text-sm font-semibold transition-colors duration-300 rounded-lg",
          !isLogin ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        )}
      >
        Create Account
      </button>
      
      {/* Sliding Background Animation */}
      <motion.div
        className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50"
        initial={false}
        animate={{
          left: isLogin ? "6px" : "calc(50%)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  );
}
