import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Successful: "bg-green-100 text-green-700 border-green-200",
    Failed: "bg-red-100 text-red-700 border-red-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Refunded: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[status] || styles.Pending
      )}
    >
      {status}
    </span>
  );
}