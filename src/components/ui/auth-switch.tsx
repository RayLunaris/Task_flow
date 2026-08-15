import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface AuthSwitchProps {
 isLogin: boolean;
 onToggle: (isLogin: boolean) => void;
}

export default function AuthSwitch({ isLogin, onToggle }: AuthSwitchProps) {
 return (
 <div className="relative flex w-full bg-[#FAFAF9] dark:bg-[#1A1A1A] p-1.5 rounded-md border border-[#E2E8F0] dark:border-[#333333]">
 <button
 type="button"
 onClick={() => onToggle(true)}
 className={cn(
 "relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-300 rounded-md",
 isLogin ? "text-[#1E293B] dark:text-[#E4E4E7]" : "text-[#71717A] hover:text-[#1E293B] dark:hover:text-[#E4E4E7]"
 )}
 >
 Masuk
 </button>
 <button
 type="button"
 onClick={() => onToggle(false)}
 className={cn(
 "relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-300 rounded-md",
 !isLogin ? "text-[#1E293B] dark:text-[#E4E4E7]" : "text-[#71717A] hover:text-[#1E293B] dark:hover:text-[#E4E4E7]"
 )}
 >
 Buat Akun
 </button>
 
 {/* Sliding Background Animation */}
 <motion.div
 className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#FFFFFF] dark:bg-[#242424] rounded-md shadow-sm border border-[#E2E8F0] dark:border-[#333333]"
 initial={false}
 animate={{
 left: isLogin ? "6px" : "calc(50%)",
 }}
 transition={{ type: "spring", stiffness: 400, damping: 30 }}
 />
 </div>
 );
}
