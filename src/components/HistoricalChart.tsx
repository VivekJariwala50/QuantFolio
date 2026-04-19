import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Card } from './ui/Card';
import { format, subDays, isAfter } from 'date-fns';

type TimeFilter = '1W' | '1M' | '3M' | '1Y' | 'ALL';

interface ChartData {
  date: string;
  portfolio: number;
  benchmark: number;
}

const FILTERS: TimeFilter[] = ['1W', '1M', '3M', '1Y', 'ALL'];

export const HistoricalChart: React.FC = () => {
  const [filter, setFilter] = useState<TimeFilter>('1M');

  const rawData = useMemo(() => {
    const data: ChartData[] = [];
    const today = new Date();
    let portValue = 10000;
    let benchValue = 10000;
    for (let i = 365; i >= 0; i--) {
      const date = subDays(today, i);
      portValue = portValue * (1 + (Math.random() * 0.04 - 0.018));
      benchValue = benchValue * (1 + (Math.random() * 0.03 - 0.014));
      data.push({
        date: date.toISOString(),
        portfolio: Number(portValue.toFixed(2)),
        benchmark: Number(benchValue.toFixed(2)),
      });
    }
    return data;
  }, []);

  const filteredData = useMemo(() => {
    const today = new Date();
    const cutoff =
      filter === '1W' ? subDays(today, 7) :
      filter === '1M' ? subDays(today, 30) :
      filter === '3M' ? subDays(today, 90) :
      filter === '1Y' ? subDays(today, 365) :
      new Date('2000-01-01');
    return rawData
      .filter(d => isAfter(new Date(d.date), cutoff))
      .map(item => ({ ...item, formattedDate: format(new Date(item.date), 'MMM d') }));
  }, [rawData, filter]);

  const performance = useMemo(() => {
    if (filteredData.length < 2) return { portReturn: 0, benchReturn: 0 };
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    return {
      portReturn: ((last.portfolio - first.portfolio) / first.portfolio) * 100,
      benchReturn: ((last.benchmark - first.benchmark) / first.benchmark) * 100,
    };
  }, [filteredData]);

  const portColor = performance.portReturn >= 0 ? '#22C55E' : '#EF4444';

  const filterButtons = (
    <div
      className="flex rounded-lg overflow-hidden"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
    >
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            background: filter === f ? '#3B82F6' : 'transparent',
            color: filter === f ? 'white' : 'var(--text-muted)',
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );

  const subtitle = (
    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
      Portfolio{' '}
      <span style={{ color: portColor, fontWeight: 700, fontFamily: 'monospace' }}>
        {performance.portReturn >= 0 ? '+' : ''}{performance.portReturn.toFixed(2)}%
      </span>
      {'  ·  '}S&P 500{' '}
      <span style={{ color: '#9CA3AF', fontWeight: 700, fontFamily: 'monospace' }}>
        {performance.benchReturn >= 0 ? '+' : ''}{performance.benchReturn.toFixed(2)}%
      </span>
    </span>
  ) as any;

  return (
    <Card
      title="Portfolio Performance"
      subtitle={subtitle}
      headerAction={filterButtons}
    >
      <div style={{ height: 300, width: '100%', marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPort" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'ui-monospace' }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'ui-monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                color: 'var(--text-primary)',
                fontSize: '12px',
              }}
              itemStyle={{ color: 'var(--text-primary)', fontFamily: 'ui-monospace', fontWeight: 600 }}
              labelStyle={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '4px' }}
              formatter={(value: any, name?: string) => [
                `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                name === 'portfolio' ? 'Your Portfolio' : 'S&P 500',
              ]}
            />
            <Area
              type="monotone"
              dataKey="portfolio"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#gradPort)"
              activeDot={{ r: 4, strokeWidth: 0, fill: '#3B82F6' }}
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#6B7280"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};