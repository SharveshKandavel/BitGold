import { useState } from "react";
import { TransactionRow } from "../components/ui/TransactionRow";
import { cn } from "../lib/utils";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock transaction data
  const transactions = [
    {
      date: "Jan 15, 2024",
      purchaseAmount: 4.37,
      goldAdded: 46.3,
      status: "completed" as const,
    },
    {
      date: "Jan 14, 2024",
      purchaseAmount: 12.89,
      goldAdded: 11.7,
      status: "completed" as const,
    },
    {
      date: "Jan 13, 2024",
      purchaseAmount: 8.45,
      goldAdded: 55.2,
      status: "completed" as const,
    },
    {
      date: "Jan 12, 2024",
      purchaseAmount: 23.67,
      goldAdded: 33.1,
      status: "pending" as const,
    },
    {
      date: "Jan 11, 2024",
      purchaseAmount: 15.23,
      goldAdded: 77.4,
      status: "completed" as const,
    },
    {
      date: "Jan 10, 2024",
      purchaseAmount: 6.78,
      goldAdded: 22.8,
      status: "failed" as const,
    },
  ];

  const filters = [
    { id: "all", label: "All Transactions" },
    { id: "month", label: "This Month" },
    { id: "completed", label: "Completed" },
    { id: "pending", label: "Pending" },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === "all") return true;
    if (activeFilter === "month") return transaction.date.includes("Jan");
    if (activeFilter === "completed") return transaction.status === "completed";
    if (activeFilter === "pending") return transaction.status === "pending";
    return true;
  });

  const totalInvested = filteredTransactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + Math.ceil(t.purchaseAmount) - t.purchaseAmount, 0);

  const totalGoldAdded = filteredTransactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.goldAdded, 0);

  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-title-lg mb-2">Transaction History</h1>
          <p className="text-subtle">View all your round-up investments and gold purchases</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-bitgold-gold">
            <div className="text-title-md text-bitgold-gold">${totalInvested.toFixed(2)}</div>
            <div className="text-sm text-subtle">Total Invested</div>
          </Card>
          <Card className="border-l-4 border-green-500">
            <div className="text-title-md text-green-500">{totalGoldAdded.toFixed(1)}mg</div>
            <div className="text-sm text-subtle">Gold Accumulated</div>
          </Card>
          <Card className="border-l-4 border-blue-500">
            <div className="text-title-md text-blue-500">{filteredTransactions.length}</div>
            <div className="text-sm text-subtle">Total Transactions</div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="bg-bitgold-800 rounded-container p-1 shadow-sm border border-bitgold-700 inline-flex">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "primary" : "secondary"}
              onClick={() => setActiveFilter(filter.id)}
              className="px-4 py-2 text-sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <TransactionRow key={index} {...transaction} />
            ))
          ) : (
            <Card className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <div className="text-title-sm mb-2">No transactions found</div>
              <div className="text-subtle">Try adjusting your filter or make your first purchase!</div>
            </Card>
          )}
        </div>

        {/* Export Options */}
        <Card>
          <h2 className="text-title-md mb-4">Export & Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="secondary" className="flex items-center justify-center gap-2">
              <span>📊</span>
              <span className="font-medium">Download CSV</span>
            </Button>
            <Button variant="secondary" className="flex items-center justify-center gap-2">
              <span>📄</span>
              <span className="font-medium">Tax Report</span>
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
