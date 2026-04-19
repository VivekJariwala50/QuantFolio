import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import type { Position, StockPrice } from '../types';
import { Card } from './ui/Card';

interface AllocationChartProps {
  positions: Position[];
  prices: Record<string, StockPrice>;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#F97316'];

export const AllocationChart: React.FC<AllocationChartProps> = ({ positions, prices }) => {
  const data = useMemo(() => {
    return positions
      .map(pos => {
        const currentPrice = prices[pos.symbol]?.price || pos.cost_per_share;
        const value = currentPrice * pos.shares_owned;
        return { name: pos.symbol, value: parseFloat(value.toFixed(2)) };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [positions, prices]);

  if (data.length === 0) {
    return (
      <Card title="Allocation" icon={<PieChartIcon size={16} />}>
        <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Add positions to see allocation
        </div>
      </Card>
    );
  }

  return (
    <Card title="Allocation" icon={<PieChartIcon size={16} />}>
      <div className="h-56 w-full -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="46%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Value']}
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'ui-monospace',
              }}
              itemStyle={{ color: 'var(--text-primary)' }}
              labelStyle={{ color: 'var(--text-secondary)', fontWeight: 600 }}
            />
            <Legend
              verticalAlign="bottom"
              height={32}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};