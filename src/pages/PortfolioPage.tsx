import { PortfolioCard } from "../components/ui/PortfolioCard";
import { MetricCard } from "../components/ui/MetricCard";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export function PortfolioPage() {
  // Mock data - in a real app, this would come from your backend
  const portfolioData = {
    totalGold: 0.243,
    currentValue: 23.15,
    totalInvested: 25.00,
  };

  const holdings = [
    { date: "2024-01-15", amount: 0.089, value: 8.45, type: "Round-up Investment" },
    { date: "2024-01-10", amount: 0.067, value: 6.32, type: "Round-up Investment" },
    { date: "2024-01-05", amount: 0.087, value: 8.38, type: "Round-up Investment" },
  ];

  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-title-lg mb-2">Portfolio Overview</h1>
          <p className="text-subtle">Track your gold investments and portfolio performance</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioCard {...portfolioData} />
          </div>
          <div className="space-y-4">
            <MetricCard
              title="30-Day Return"
              value="+$1.85"
              subtitle="7.4% gain"
              icon="📈"
              trend={{ value: 7.4, isPositive: true }}
            />
            <MetricCard
              title="Gold Price Avg"
              value="$94.12"
              subtitle="Your avg. cost"
              icon="💰"
            />
          </div>
        </div>

        {/* Growth Chart Placeholder */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-md">Portfolio Growth</h2>
            <div className="flex gap-2">
              <Button variant="secondary" className="px-3 py-1 text-sm">1M</Button>
              <Button variant="secondary" className="px-3 py-1 text-sm">3M</Button>
              <Button variant="secondary" className="px-3 py-1 text-sm">1Y</Button>
            </div>
          </div>
          <div className="h-64 bg-bitgold-700 rounded-lg border-2 border-dashed border-bitgold-gold flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-title-sm">Growth Chart</div>
              <div className="text-subtle">Portfolio performance visualization</div>
            </div>
          </div>
        </Card>

        {/* Holdings Breakdown */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-md">Recent Holdings</h2>
            <Button variant="secondary">
              Withdraw Gold
            </Button>
          </div>
          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-bitgold-800 rounded-lg">
                <div>
                  <div className="font-medium text-bitgold-lightGold">{holding.type}</div>
                  <div className="text-sm text-subtle">{holding.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-bitgold-gold">{holding.amount.toFixed(3)}g</div>
                  <div className="text-sm text-subtle">${holding.value.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Portfolio Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-bitgold-gold/10 to-bitgold-lightGold/10 border-bitgold-gold">
            <h3 className="text-title-sm mb-2">Boost Your Investment</h3>
            <p className="text-subtle mb-4">Make a one-time investment to accelerate your gold accumulation.</p>
            <Button className="w-full">
              Add Funds
            </Button>
          </Card>
          <Card>
            <h3 className="text-title-sm mb-2">Portfolio Settings</h3>
            <p className="text-subtle mb-4">Adjust your investment preferences and round-up settings.</p>
            <Button variant="secondary" className="w-full">
              Manage Settings
            </Button>
          </Card>
        </div>
      </div>
    </Container>
  );
}
