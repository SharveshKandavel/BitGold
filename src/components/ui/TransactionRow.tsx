import { cn } from "../../lib/utils";

interface TransactionRowProps {
  date: string;
  purchaseAmount: number;
  goldAdded: number;
  status: "completed" | "pending" | "failed";
}

export function TransactionRow({ date, purchaseAmount, goldAdded, status }: TransactionRowProps) {
  const statusConfig = {
    completed: { color: "text-green-400", bg: "bg-green-500/20", label: "Completed" },
    pending: { color: "text-yellow-400", bg: "bg-yellow-500/20", label: "Pending" },
    failed: { color: "text-red-400", bg: "bg-red-500/20", label: "Failed" },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-4 bg-bitgold-800 rounded-lg border border-bitgold-700 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="font-medium text-bitgold-lightGold">${purchaseAmount.toFixed(2)}</div>
            <div className="text-sm text-subtle">{date}</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-bitgold-gold">+{goldAdded.toFixed(1)}mg</div>
            <div className="text-sm text-subtle">Gold Added</div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            config.bg,
            config.color
          )}>
            {config.label}
          </div>
        </div>
      </div>
    </div>
  );
}
