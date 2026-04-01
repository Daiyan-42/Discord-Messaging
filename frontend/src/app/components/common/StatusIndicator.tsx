interface StatusIndicatorProps {
  status?: "online" | "offline" | "away" | "dnd";
  size?: "sm" | "md" | "lg";
}

export function StatusIndicator({ status = "offline", size = "sm" }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const colors = {
    online: "bg-green-500",
    offline: "bg-gray-500",
    away: "bg-yellow-500",
    dnd: "bg-red-500",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colors[status]} rounded-full border-2 border-[#0f172a]`}
    />
  );
}
