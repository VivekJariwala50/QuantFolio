import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Position, StockPrice } from '../types';
import { Trash2 } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';

interface StockTableProps {
  positions: Position[];
  prices: Record<string, StockPrice>;
}

const gridTemplate = '16% 14% 15% 15% 18% 16% 6%';

const THStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-muted)',
  paddingTop: '12px',
  paddingBottom: '12px',
  paddingLeft: '16px',
  paddingRight: '16px',
  background: 'var(--bg-card)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  userSelect: 'none',
  borderBottom: '1px solid var(--border-color)',
};

export const StockTable: React.FC<StockTableProps> = ({ positions, prices }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { updatePosition, removePosition } = usePortfolioStore();

  const rowVirtualizer = useVirtualizer({
    count: positions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  if (positions.length === 0) {
    return (
      <div
        className="text-center py-14 rounded-xl text-sm font-medium"
        style={{
          color: 'var(--text-muted)',
          border: '2px dashed var(--border-color)',
          background: 'var(--bg-secondary)',
        }}
      >
        No positions yet. Add your first stock above ↑
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="overflow-auto rounded-xl w-full"
      style={{
        border: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        maxHeight: 480,
      }}
    >
      <div style={{ minWidth: 720 }}>

        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridTemplate,
          }}
        >
          <div style={THStyle}>Symbol</div>
          <div style={{ ...THStyle, textAlign: 'right' }}>Shares</div>
          <div style={{ ...THStyle, textAlign: 'right' }}>Avg Cost</div>
          <div style={{ ...THStyle, textAlign: 'right' }}>Price</div>
          <div style={{ ...THStyle, textAlign: 'right' }}>Market Value</div>
          <div style={{ ...THStyle, textAlign: 'right' }}>P&L</div>
          <div style={THStyle}></div>
        </div>

        {/* Virtual rows */}
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const pos = positions[virtualRow.index];
            const currentPrice = prices[pos.symbol]?.price || pos.cost_per_share;

            const marketValue = pos.shares_owned * currentPrice;
            const totalCost = pos.shares_owned * pos.cost_per_share;
            const pnl = marketValue - totalCost;
            const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

            const isPos = pnl >= 0;
            const pnlColor = isPos ? '#22C55E' : '#EF4444';

            const cellStyle: React.CSSProperties = {
              fontSize: '13px',
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--text-primary)',
            };

            const editInputStyle: React.CSSProperties = {
              background: 'transparent',
              border: '1px solid transparent',
              borderRadius: '6px',
              padding: '3px 6px',
              textAlign: 'right',
              fontSize: '13px',
              fontFamily: '"JetBrains Mono", monospace',
              color: 'var(--text-primary)',
              outline: 'none',
              width: '90px',
            };

            return (
              <div
                key={virtualRow.key}
                className="group"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'grid',
                  gridTemplateColumns: gridTemplate,
                  alignItems: 'center',
                  padding: '0 16px',
                  borderBottom: '1px solid var(--border-color)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Symbol */}
                <div>
                  <span
                    className="text-xs font-bold"
                    style={{
                      background: 'rgba(59,130,246,0.1)',
                      color: '#3B82F6',
                      border: '1px solid rgba(59,130,246,0.2)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                    }}
                  >
                    {pos.symbol}
                  </span>
                </div>

                {/* Shares */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <input
                    type="number"
                    value={pos.shares_owned}
                    style={editInputStyle}
                    onChange={(e) =>
                      updatePosition(pos.id, {
                        shares_owned: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                {/* Avg Cost */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <input
                    type="number"
                    value={pos.cost_per_share}
                    style={{ ...editInputStyle, width: '100px' }}
                    onChange={(e) =>
                      updatePosition(pos.id, {
                        cost_per_share: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                {/* Price */}
                <div style={{ textAlign: 'right', ...cellStyle, color: 'var(--text-secondary)' }}>
                  ${currentPrice.toFixed(2)}
                </div>

                {/* Market Value */}
                <div style={{ textAlign: 'right', ...cellStyle, fontWeight: 700 }}>
                  ${marketValue.toFixed(2)}
                </div>

                {/* P&L */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...cellStyle, color: pnlColor, fontWeight: 700 }}>
                    {isPos ? '+' : ''}${pnl.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '11px', color: pnlColor }}>
                    {isPos ? '+' : ''}
                    {pnlPct.toFixed(2)}%
                  </div>
                </div>

                {/* Delete */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => removePosition(pos.id)}
                    style={{
                      opacity: 0,
                      background: 'transparent',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                    }}
                    className="group-hover:!opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};