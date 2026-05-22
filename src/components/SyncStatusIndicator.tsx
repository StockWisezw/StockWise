import React, { useState, useEffect } from 'react';
import { usePOSStore } from '../store/posStore';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, PopoverHeader, PopoverTitle, PopoverDescription } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';

export function SyncStatusIndicator() {
  const { offlineQueue } = usePOSStore();
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const pendingCount = offlineQueue.length;

  let triggerContent = null;

  if (pendingCount === 0 && isOnline) {
    triggerContent = (
      <div className="flex items-center text-emerald-600 dark:text-emerald-400 group cursor-pointer hover:opacity-80 transition-opacity" title="All synced to cloud">
        <Cloud className="w-4 h-4 mr-1.5" />
        <span className="text-xs font-medium hidden sm:inline-block">Synced</span>
      </div>
    );
  } else if (!isOnline) {
    triggerContent = (
      <div className="flex items-center text-amber-500 group cursor-pointer hover:opacity-80 transition-opacity" title={`${pendingCount} pending offline`}>
        <CloudOff className="w-4 h-4 mr-1.5" />
        <span className="text-xs font-medium hidden sm:inline-block">
          Offline {pendingCount > 0 && `(${pendingCount})`}
        </span>
      </div>
    );
  } else {
    triggerContent = (
      <div className="flex items-center text-blue-500 group cursor-pointer hover:opacity-80 transition-opacity" title={`Syncing ${pendingCount} items`}>
        <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
        <span className="text-xs font-medium hidden sm:inline-block">Syncing {pendingCount} actions...</span>
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger className="bg-transparent border-none p-0 flex items-center justify-center outline-none">
        {triggerContent}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <PopoverHeader>
            <PopoverTitle>Sync Status</PopoverTitle>
            <PopoverDescription>
              {pendingCount === 0 
                ? "All transactions are synced with the cloud." 
                : `${pendingCount} transaction${pendingCount !== 1 ? 's' : ''} waiting to form link.`}
            </PopoverDescription>
          </PopoverHeader>
        </div>
        
        {pendingCount > 0 ? (
          <ScrollArea className="h-64 h-max-[300px]">
            <div className="p-2 space-y-1">
              {offlineQueue.map((sale) => (
                <div key={sale.id} className="text-sm p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex justify-between items-start transition-colors">
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{sale.receiptNumber}</span>
                    <span className="text-xs text-zinc-500">{new Date(sale.timestamp).toLocaleString()}</span>
                    <span className="text-xs text-zinc-500 truncate mt-1">
                       {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}: {sale.items.map(i => i.product.name).join(', ')}
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap ml-4">${sale.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-6 text-center text-sm text-zinc-500 flex flex-col items-center">
            <Cloud className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p>You're all caught up!</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
