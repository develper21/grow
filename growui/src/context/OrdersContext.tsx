import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MandateRecord, OrderRecord } from '@/types/orders';
import { fetchMandates, fetchOrders, toggleMandate } from '@/lib/ordersApi';
import { useNotification } from '@/context/NotificationContext';

interface OrdersContextValue {
  orders: OrderRecord[];
  mandates: MandateRecord[];
  ordersLoading: boolean;
  mandatesLoading: boolean;
  refreshOrders: () => Promise<void>;
  refreshMandates: () => Promise<void>;
  registerOrder: (order: OrderRecord) => void;
  toggleMandateStatus: (id: string) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const { notify } = useNotification();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [mandates, setMandates] = useState<MandateRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [mandatesLoading, setMandatesLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const refreshMandates = useCallback(async () => {
    setMandatesLoading(true);
    try {
      const data = await fetchMandates();
      setMandates(data);
    } catch (error) {
      console.error('Failed to load mandates', error);
    } finally {
      setMandatesLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
    refreshMandates();
  }, [refreshOrders, refreshMandates]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshOrders]);

  const registerOrder = useCallback((order: OrderRecord) => {
    setOrders((prev) => {
      if (prev.some((existing) => existing.id === order.id)) {
        return prev;
      }
      return [order, ...prev];
    });
  }, []);

  const toggleMandateStatus = useCallback(
    async (id: string) => {
      try {
        const updated = await toggleMandate(id);
        setMandates((prev) => prev.map((mandate) => (mandate.id === updated.id ? updated : mandate)));
        notify(`Mandate ${updated.status === 'active' ? 'activated' : 'paused'} successfully.`, 'success');
      } catch (error) {
        console.error('Failed to toggle mandate', error);
        notify('Failed to update mandate. Please try again.', 'error');
        throw error;
      }
    },
    [notify]
  );

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      mandates,
      ordersLoading,
      mandatesLoading,
      refreshOrders,
      refreshMandates,
      registerOrder,
      toggleMandateStatus,
    }),
    [orders, mandates, ordersLoading, mandatesLoading, refreshOrders, refreshMandates, registerOrder, toggleMandateStatus]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
