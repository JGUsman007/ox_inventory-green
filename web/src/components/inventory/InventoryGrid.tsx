import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory, InventoryType } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import { slice } from 'lodash';
import InventoryControl from './InventoryControl';
const PAGE_SIZE = 35;


const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);
  const hotbar = inventory.items.slice(0,5)
  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);
  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div>
          <div className="inventory-grid-header-wrapper">
            <p>{inventory.label}</p>
            {inventory.maxWeight && (
              <p>
                {weight / 1000}/{inventory.maxWeight / 1000}kg
              </p>
            )}
          </div>

        </div>

        <div className="hot-inventory-grid-container" ref={containerRef}>
          <>
            {hotbar.map((item, index) => (
              inventory.type == 'player'
              ? <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
              : undefined
            ))}
          </>
        </div>

        {inventory.type == 'player'
        ? <div className="inventory-grid-container" ref={containerRef}>
          <>
            {inventory.items.slice(5, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}

          </>
        </div>

        : <div className={
          inventory.type == 'crafting' || inventory.type == 'shop'
          ? "shop-inventory-grid-container"
          : "inventory-grid-container"
        } ref={containerRef}>
        <>
          {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}

        </>
      </div>
        }
      </div>
    </>
  );
};

export default InventoryGrid;
