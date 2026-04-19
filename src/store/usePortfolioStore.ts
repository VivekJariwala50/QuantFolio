import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';
import type { Position } from '../types';

interface PortfolioState {
  positions: Position[];
  loading: boolean;
  error: string | null;
  fetchPositions: (userId: string) => Promise<void>;
  addPosition: (position: Omit<Position, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePosition: (id: string, updates: Partial<Position>) => Promise<void>;
  removePosition: (id: string) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  positions: [],
  loading: false,
  error: null,

  fetchPositions: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ positions: data as Position[], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addPosition: async (position) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('positions')
        .insert([position])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        positions: [...state.positions, data as Position],
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updatePosition: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        positions: state.positions.map(p => p.id === id ? data as Position : p)
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  removePosition: async (id) => {
    try {
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        positions: state.positions.filter(p => p.id !== id)
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  }
}));
