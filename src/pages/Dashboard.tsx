import React, { useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { Upload, Download, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useMarketDataStore } from '../store/useMarketDataStore';
import { StockTable } from '../components/StockTable';
import { PortfolioMetrics } from '../components/PortfolioMetrics';
import { AddStockForm } from '../components/AddStockForm';
import { AllocationChart } from '../components/AllocationChart';
import { InsightsPanel } from '../components/InsightsPanel';
import { RiskMetricsCard } from '../components/RiskMetricsCard';
import { HistoricalChart } from '../components/HistoricalChart';
import { Card } from '../components/ui/Card';
import { calculatePortfolioValue, getRebalancingSuggestions, calculateSharpeRatio, calculateVolatility, calculateMaxDrawdown } from '../utils/analytics';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { positions, fetchPositions, addPosition, loading: portfolioLoading } = usePortfolioStore();
  const { prices, fetchPrices, loading: pricesLoading } = useMarketDataStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) fetchPositions(user.id);
  }, [user, fetchPositions]);

  useEffect(() => {
    const symbols = positions.map(p => p.symbol);
    if (symbols.length > 0) fetchPrices(symbols);
  }, [positions, fetchPrices]);

  const { totalValue, totalCost, unrealizedGain, unrealizedGainPercent } = useMemo(
    () => calculatePortfolioValue(positions, prices),
    [positions, prices]
  );

  const suggestions = useMemo(
    () => getRebalancingSuggestions(positions, prices),
    [positions, prices]
  );

  const riskMetrics = useMemo(() => {
    const mockReturns = [0.012, -0.005, 0.021, -0.01, 0.03, 0.015, -0.008];
    const mockValues = [10000, 10120, 10070, 10280, 10177, 10482, 10640, 10555];
    return {
      volatility: calculateVolatility(mockReturns),
      sharpeRatio: calculateSharpeRatio(mockReturns),
      maxDrawdown: calculateMaxDrawdown(mockValues),
    };
  }, []);

  const handleExportCSV = () => {
    const csv = Papa.unparse(positions.map(p => ({
      Symbol: p.symbol,
      Shares: p.shares_owned,
      'Cost Per Share': p.cost_per_share,
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'quantfolio_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Portfolio exported!');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const newPositions = (results.data as any[]).map(row => ({
            user_id: user.id,
            symbol: row.Symbol || row.symbol,
            shares_owned: parseFloat(row.Shares || row.shares || row.shares_owned),
            cost_per_share: parseFloat(row['Cost Per Share'] || row.cost || row.cost_per_share),
          })).filter(p => p.symbol && !isNaN(p.shares_owned) && !isNaN(p.cost_per_share));
          for (const pos of newPositions) await addPosition(pos);
          toast.success(`Imported ${newPositions.length} positions`);
        } catch (err: any) {
          toast.error('Import failed: ' + err.message);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  if (portfolioLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading portfolio...</div>
      </div>
    );
  }

  const tableActions = (
    <div className="flex items-center gap-2">
      <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImportCSV} />
      <button onClick={() => fileInputRef.current?.click()} className="btn-ghost">
        <Upload size={13} /> Import
      </button>
      <button onClick={handleExportCSV} className="btn-ghost">
        <Download size={13} /> Export
      </button>
    </div>
  );

  return (
    <div className="px-4 md:px-6 py-6 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* ── LEFT COLUMN (8 cols) ── */}
        <div className="xl:col-span-8 space-y-5">
          <HistoricalChart />

          <Card
            title="Holdings"
            icon={<BarChart3 size={16} />}
            headerAction={tableActions}
            noPadding
            bodyClassName="p-4"
          >
            <StockTable positions={positions} prices={prices} />
          </Card>
        </div>

        {/* ── RIGHT COLUMN (4 cols) ── */}
        <div className="xl:col-span-4 space-y-5">
          <PortfolioMetrics
            totalValue={totalValue}
            totalCost={totalCost}
            unrealizedGain={unrealizedGain}
            unrealizedGainPercent={unrealizedGainPercent}
            isLoading={pricesLoading}
          />

          <RiskMetricsCard
            volatility={riskMetrics.volatility}
            sharpeRatio={riskMetrics.sharpeRatio}
            maxDrawdown={riskMetrics.maxDrawdown}
          />

          <AddStockForm />

          <AllocationChart positions={positions} prices={prices} />

          <InsightsPanel suggestions={suggestions} />
        </div>
      </div>
    </div>
  );
};
