import { motion } from "motion/react";

interface UnreadBadgeProps {
  count: number;
  isPing?: boolean;
}

export function UnreadBadge({ count, isPing = false }: UnreadBadgeProps) {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-semibold ${
        isPing
          ? "bg-red-500 text-white"
          : "bg-gray-500 text-white"
      }`}
    >
      {count > 99 ? "99+" : count}
    </motion.div>
  );
}
