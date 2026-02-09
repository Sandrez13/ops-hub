import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, DollarSign, Users, Gift, Coffee, TrendingUp, TrendingDown, Plus, FileText, Home, UserCog, Edit, X, RefreshCw, Download, Moon, Sun, Sparkles, Check, Package, Star, AlertTriangle, Zap, Target, Award, Trash2, Search, ChevronLeft, ChevronRight, Bell, Filter, MessageSquare, Cake, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Cloud, CloudOff } from 'lucide-react';
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rvfrcyihfrqnundqdccs.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZnJjeWloZnJxbnVuZHFkY2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2ODk0NzQsImV4cCI6MjA4NTI2NTQ3NH0.D_1-6C285w7UIOEEpr3p5mFju-AfRAH4_IxhZT1K9ys';
const supabase = createClient(supabaseUrl, supabaseKey);

const COLORS = ['#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#84CC16'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const eventTypes = [{ name: 'TGIT', icon: '🍻', color: '#F59E0B' }, { name: 'Monthly Outing', icon: '🎳', color: '#06B6D4' }, { name: 'Birthday', icon: '🎂', color: '#EC4899' }, { name: 'Holiday', icon: '🎄', color: '#10B981' }, { name: 'Spontaneous', icon: '✨', color: '#8B5CF6' }];
const categories = ['Snacks & Beverages', 'Event Catering', 'Birthday', 'Office Enhancement', 'Consumables', 'Swag & Goodies', 'Decorations', 'Holiday', 'Kids & Family', 'Other'];

const DEFAULT_RATES = { EUR: 4.9770, USD: 4.5800, GBP: 5.8730, CHF: 5.5565 };

// Database helpers
const db = {
  async load(table) {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async insert(table, item) {
    const { id, created_at, ...rest } = item;
    const { data, error } = await supabase.from(table).insert(rest).select().single();
    if (error) throw error;
    return data;
  },
  async update(table, id, item) {
    const { id: _id, created_at, ...rest } = item;
    const { data, error } = await supabase.from(table).update(rest).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  }
};

// ─── Auth Wrapper ───
function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-500/30">
            <Sparkles className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">OPS Hub</h1>
          <p className="text-gray-400">Alchemy Bucharest • Office Operations</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white text-center mb-2">Welcome</h2>
          <p className="text-gray-400 text-center text-sm mb-8">Sign in with your Alchemy account to continue</p>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          <button
            onClick={signIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-2xl font-semibold transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            )}
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
        <p className="text-center text-gray-600 text-xs mt-6">Protected workspace • Authorized personnel only</p>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-violet-500" />
      </div>
    );
  }

  if (!session) return <LoginPage />;
  return <OPSHub session={session} />;
}function OPSHub({ session }) {
  const [tab, setTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [dark, setDark] = useState(() => {
    try { const saved = localStorage.getItem('ops-hub-dark-mode'); return saved !== null ? JSON.parse(saved) : true; } catch { return true; }
  });
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editVendor, setEditVendor] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [bnrDate, setBnrDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showBudgetAlert, setShowBudgetAlert] = useState(true);

  useEffect(() => {
    try { localStorage.setItem('ops-hub-dark-mode', JSON.stringify(dark)); } catch {}
  }, [dark]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setSyncError(null);
      try {
        const [eventsData, expensesData, vendorsData, inventoryData, birthdaysData] = await Promise.all([
          db.load('ops_events'), db.load('ops_expenses'), db.load('ops_vendors'), db.load('ops_inventory'), db.load('ops_birthdays')
        ]);
        setEvents(eventsData); setExpenses(expensesData); setVendors(vendorsData); setInventory(inventoryData); setBirthdays(birthdaysData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setSyncError('Failed to connect to database');
      }
      setLoading(false);
    };
    loadAllData();
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const proxies = [
        (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
      ];
      const bnrUrl = 'https://www.bnr.ro/nbrfxrates.xml';
      let xml = null;
      for (const proxy of proxies) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          const r = await fetch(proxy(bnrUrl), { signal: controller.signal });
          clearTimeout(timeout);
          if (r.ok) { xml = await r.text(); break; }
        } catch { continue; }
      }
      if (xml) {
        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        const pubDate = doc.querySelector('PublishingDate')?.textContent;
        if (pubDate) setBnrDate(pubDate);
        const nr = {};
        doc.querySelectorAll('Rate').forEach(x => {
          const curr = x.getAttribute('currency'), mult = parseFloat(x.getAttribute('multiplier')) || 1;
          if (['EUR','USD','GBP','CHF'].includes(curr)) nr[curr] = parseFloat(x.textContent) / mult;
        });
        if (Object.keys(nr).length > 0) setRates(prev => ({ ...prev, ...nr }));
      }
    } catch (e) { console.warn('BNR rates fetch failed, using defaults:', e); }
  };

  const toRON = (a, c) => c === 'RON' ? a : a * (rates[c] || 1);
  const budgetUSD = 5000;
  const monthExp = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear; });
  const spentRON = monthExp.reduce((s, e) => s + toRON(e.amount, e.currency), 0);
  const spentUSD = rates.USD > 0 ? spentRON / rates.USD : 0;
  const pct = budgetUSD > 0 ? (spentUSD / budgetUSD) * 100 : 0;
  const completed = events.filter(e => e.status === 'completed');
  const upcoming = events.filter(e => e.status === 'upcoming');
  const attendees = completed.reduce((s, e) => s + (e.attendees || 0), 0);
  const lowStock = inventory.filter(i => i.stock <= i.min);
  const budgetWarning = pct >= 80;

  const byCategory = categories.map(cat => ({ name: cat, value: monthExp.filter(e => e.category === cat).reduce((s, e) => s + toRON(e.amount, e.currency), 0) })).filter(x => x.value > 0);

  const trend = (() => {
    const result = [];
    for (let i = 4; i >= 0; i--) {
      let m = selectedMonth - i, y = selectedYear;
      if (m < 0) { m += 12; y--; }
      const mExp = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === m && d.getFullYear() === y; });
      result.push({ m: MONTHS[m].slice(0, 3), v: Math.round(mExp.reduce((s, e) => s + toRON(e.amount, e.currency), 0)) });
    }
    return result;
  })();
  const prevMonthTotal = trend.length >= 2 ? trend[trend.length - 2].v : 0;
  const change = prevMonthTotal > 0 ? ((spentRON - prevMonthTotal) / prevMonthTotal * 100).toFixed(1) : '0.0';
  const costPerPerson = attendees > 0 ? (completed.reduce((s, e) => s + (e.actual || 0), 0) / attendees).toFixed(0) : 0;

const upcomingBirthdays = birthdays.filter(b => { const parts = b.date?.split('-'); if (!parts || parts.length < 2) return false; const m = parseInt(parts[0]); const d = parseInt(parts[1]); if (m !== selectedMonth + 1) return false; const today = new Date(); if (selectedMonth < today.getMonth()) return false; if (selectedMonth === today.getMonth() && d <= today.getDate()) return false; return true; }).sort((a, b) => a.date.localeCompare(b.date));

  const filteredEvents = events.filter(e => { const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()); const matchType = filterType === 'all' || e.type === filterType; return matchSearch && matchType; });
  const filteredExpenses = expenses.filter(e => { const matchSearch = e.item.toLowerCase().includes(searchTerm.toLowerCase()) || (e.vendor || '').toLowerCase().includes(searchTerm.toLowerCase()); const matchCat = filterType === 'all' || e.category === filterType; return matchSearch && matchCat; });

  const c = (d, l) => dark ? d : l;const deleteItem = async (type, id) => {
    setSyncing(true); setSyncError(null);
    try {
      const tableMap = { event: 'ops_events', expense: 'ops_expenses', vendor: 'ops_vendors', inventory: 'ops_inventory', birthday: 'ops_birthdays' };
      await db.delete(tableMap[type], id);
      if (type === 'event') setEvents(prev => prev.filter(e => e.id !== id));
      else if (type === 'expense') setExpenses(prev => prev.filter(e => e.id !== id));
      else if (type === 'vendor') setVendors(prev => prev.filter(v => v.id !== id));
      else if (type === 'inventory') setInventory(prev => prev.filter(i => i.id !== id));
      else if (type === 'birthday') setBirthdays(prev => prev.filter(b => b.id !== id));
    } catch (err) { console.error('Delete failed:', err); setSyncError('Failed to delete item'); }
    setSyncing(false); setDeleteConfirm(null);
  };

  const updateInventoryStock = async (id, newStock) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    setSyncError(null);
    try {
      const updated = await db.update('ops_inventory', id, { ...item, stock: newStock });
      setInventory(prev => prev.map(i => i.id === id ? updated : i));
    } catch (err) { console.error('Update failed:', err); setSyncError('Failed to update stock'); }
  };

  const toggleVendorFavorite = async (id) => {
    const vendor = vendors.find(v => v.id === id);
    if (!vendor) return;
    setSyncError(null);
    try {
      const updated = await db.update('ops_vendors', id, { ...vendor, favorite: !vendor.favorite });
      setVendors(prev => prev.map(v => v.id === id ? updated : v));
    } catch (err) { console.error('Update failed:', err); setSyncError('Failed to update vendor'); }
  };

  const Nav = ({ icon: I, label: l, t, badge: b }) => (
    <button onClick={() => { setTab(t); setSearchTerm(''); setFilterType('all'); }} className={`group w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${tab === t ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25' : c('text-gray-400 hover:bg-white/5 hover:text-white', 'text-gray-600 hover:bg-gray-100')}`}>
      <span className="flex items-center gap-3"><I size={20} className={tab === t ? '' : 'group-hover:scale-110 transition-transform'}/>{l}</span>
      {b > 0 && <span className="px-2.5 py-1 text-xs rounded-full bg-red-500 text-white font-medium animate-pulse">{b}</span>}
    </button>
  );

  const Stat = ({ icon: I, label: l, value: v, sub: s, gradient: g }) => (
    <div className={`relative overflow-hidden rounded-2xl p-5 ${c('bg-gray-800/80 border border-gray-700/50', 'bg-white border border-gray-200 shadow-sm')}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${g}`}/>
      <div className="relative flex justify-between">
        <div><p className={`text-sm font-medium ${c('text-gray-400', 'text-gray-500')}`}>{l}</p><span className="text-3xl font-bold">{v}</span>{s && <p className={`text-sm mt-1 ${c('text-gray-500', 'text-gray-400')}`}>{s}</p>}</div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${g}`}><I size={24} className="text-white"/></div>
      </div>
    </div>
  );

  const Modal = ({ title: t, children: ch, onClose: cl }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={cl}>
      <div className={`rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl ${c('bg-gray-900 border border-gray-800', 'bg-white')}`} onClick={e => e.stopPropagation()}><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">{t}</h3><button onClick={cl} className={`p-2 rounded-xl transition-colors ${c('hover:bg-gray-800', 'hover:bg-gray-100')}`}><X size={20}/></button></div>{ch}</div>
    </div>
  );

  const DeleteModal = () => (
    <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
      <div className="space-y-4">
        <p className={c('text-gray-300', 'text-gray-600')}>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className={`flex-1 py-3 rounded-xl font-medium ${c('bg-gray-800 hover:bg-gray-700', 'bg-gray-100 hover:bg-gray-200')}`}>Cancel</button>
          <button onClick={() => deleteItem(deleteConfirm.type, deleteConfirm.id)} disabled={syncing} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2">{syncing && <Loader2 size={16} className="animate-spin"/>}Delete</button>
        </div>
      </div>
    </Modal>
  );

  const Input = ({ label: l, ...p }) => <div><label className={`text-sm font-medium ${c('text-gray-400', 'text-gray-600')}`}>{l}</label><input {...p} className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-violet-500 transition-colors ${c('bg-gray-800 border-gray-700 text-white', 'bg-gray-50 border-gray-200 text-gray-900')}`}/></div>;
  const Sel = ({ label: l, opts: o, ...p }) => <div><label className={`text-sm font-medium ${c('text-gray-400', 'text-gray-600')}`}>{l}</label><select {...p} className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-violet-500 transition-colors ${c('bg-gray-800 border-gray-700 text-white', 'bg-gray-50 border-gray-200 text-gray-900')}`}>{o.map(x => <option key={x} value={x}>{x}</option>)}</select></div>;
  const TextArea = ({ label: l, ...p }) => <div><label className={`text-sm font-medium ${c('text-gray-400', 'text-gray-600')}`}>{l}</label><textarea {...p} rows={2} className={`w-full mt-1.5 px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-violet-500 transition-colors resize-none ${c('bg-gray-800 border-gray-700 text-white', 'bg-gray-50 border-gray-200 text-gray-900')}`}/></div>;

  const MonthSelector = () => (
    <div className="flex items-center gap-2">
      <button onClick={() => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); } else setSelectedMonth(m => m - 1); }} className={`p-2 rounded-xl ${c('hover:bg-gray-800', 'hover:bg-gray-100')}`}><ChevronLeft size={20}/></button>
      <div className={`px-4 py-2 rounded-xl min-w-[160px] text-center font-medium ${c('bg-gray-800', 'bg-gray-100')}`}>{MONTHS[selectedMonth]} {selectedYear}</div>
      <button onClick={() => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); } else setSelectedMonth(m => m + 1); }} className={`p-2 rounded-xl ${c('hover:bg-gray-800', 'hover:bg-gray-100')}`}><ChevronRight size={20}/></button>
    </div>
  );

  const SearchBar = ({ placeholder: p, filters: f }) => (
    <div className="flex gap-2 flex-wrap">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl flex-1 min-w-[200px] ${c('bg-gray-800 border border-gray-700', 'bg-white border border-gray-200')}`}>
        <Search size={18} className={c('text-gray-500', 'text-gray-400')}/>
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={p} className={`bg-transparent outline-none flex-1 ${c('text-white placeholder-gray-500', 'text-gray-900 placeholder-gray-400')}`}/>
        {searchTerm && <button onClick={() => setSearchTerm('')} className="text-gray-500 hover:text-gray-300"><X size={16}/></button>}
      </div>
      {f && <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`px-4 py-2 rounded-xl ${c('bg-gray-800 border border-gray-700 text-white', 'bg-white border border-gray-200 text-gray-900')}`}>
        <option value="all">All Types</option>
        {f.map(x => <option key={x} value={x}>{x}</option>)}
      </select>}
    </div>
  );const ExpenseModal = () => {
    const [f, sF] = useState(editItem || { item: '', category: categories[0], amount: '', currency: 'RON', vendor: '', date: new Date().toISOString().split('T')[0], notes: '', invoice_url: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const save = async () => {
      if (!f.item || !f.amount) return;
      setSaving(true); setError(null);
      try {
        const data = { ...f, amount: parseFloat(f.amount) };
        if (editItem) { const updated = await db.update('ops_expenses', editItem.id, data); setExpenses(prev => prev.map(e => e.id === editItem.id ? updated : e)); }
        else { const inserted = await db.insert('ops_expenses', data); setExpenses(prev => [inserted, ...prev]); }
        setModal(null); setEditItem(null);
      } catch (err) { console.error('Save failed:', err); setError('Failed to save expense.'); }
      setSaving(false);
    };
    const eq = f.currency !== 'RON' && f.amount ? `≈ ${toRON(parseFloat(f.amount)||0, f.currency).toFixed(2)} RON` : '';
    return <Modal title={editItem ? 'Edit Expense' : 'Add Expense'} onClose={() => { setModal(null); setEditItem(null); }}>
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"><AlertCircle size={16} className="text-red-400"/><p className="text-sm text-red-400">{error}</p></div>}
        <Input label="Item" value={f.item} onChange={e => sF({...f, item: e.target.value})} placeholder="Description"/>
        <Sel label="Category" value={f.category} onChange={e => sF({...f, category: e.target.value})} opts={categories}/>
        <div className="flex gap-3"><div className="flex-1"><Input label="Amount" type="number" value={f.amount} onChange={e => sF({...f, amount: e.target.value})}/>{eq && <p className="text-xs text-violet-400 mt-1 font-medium">{eq}</p>}</div><div className="w-28"><Sel label="Currency" value={f.currency} onChange={e => sF({...f, currency: e.target.value})} opts={['RON','USD','EUR','GBP','CHF']}/></div></div>
        <Sel label="Vendor" value={f.vendor || ''} onChange={e => sF({...f, vendor: e.target.value})} opts={['', ...vendors.map(v => v.name)]}/>
        <Input label="Date" type="date" value={f.date} onChange={e => sF({...f, date: e.target.value})}/>
        <div>
          <label className={`text-sm font-medium ${c('text-gray-400', 'text-gray-600')}`}>Invoice Link (optional)</label>
          <div className={`flex mt-1.5 rounded-xl border-2 overflow-hidden ${c('bg-gray-800 border-gray-700', 'bg-gray-50 border-gray-200')}`}>
            <div className={`px-3 flex items-center ${c('bg-gray-700', 'bg-gray-200')}`}><FileText size={16} className={c('text-gray-400', 'text-gray-500')}/></div>
            <input value={f.invoice_url || ''} onChange={e => sF({...f, invoice_url: e.target.value})} placeholder="Paste Google Drive, Dropbox link..." className={`flex-1 px-3 py-3 bg-transparent outline-none ${c('text-white', 'text-gray-900')}`}/>
          </div>
          <p className={`text-xs mt-1 ${c('text-gray-500', 'text-gray-400')}`}>Link to invoice stored in Drive, Dropbox, etc.</p>
        </div>
        <TextArea label="Notes (optional)" value={f.notes || ''} onChange={e => sF({...f, notes: e.target.value})} placeholder="Any additional details..."/>
        <button onClick={save} disabled={saving || !f.item || !f.amount} className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
          {saving && <Loader2 size={18} className="animate-spin"/>}{editItem ? 'Update' : 'Add'} Expense
        </button>
      </div>
    </Modal>;
  };

  const EventModal = () => {
    const [f, sF] = useState(editItem || { name: '', type: 'TGIT', date: '', budget: '', notes: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const save = async () => {
      if (!f.name || !f.date) return;
      setSaving(true); setError(null);
      try {
        const data = { ...f, budget: parseFloat(f.budget) || 0, status: editItem?.status || 'upcoming', actual: editItem?.actual ?? null, attendees: editItem?.attendees ?? null };
        if (editItem) { const updated = await db.update('ops_events', editItem.id, data); setEvents(prev => prev.map(e => e.id === editItem.id ? updated : e)); }
        else { const inserted = await db.insert('ops_events', data); setEvents(prev => [inserted, ...prev]); }
        setModal(null); setEditItem(null);
      } catch (err) { console.error('Save failed:', err); setError('Failed to save event.'); }
      setSaving(false);
    };
    return <Modal title={editItem ? 'Edit Event' : 'New Event'} onClose={() => { setModal(null); setEditItem(null); }}>
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"><AlertCircle size={16} className="text-red-400"/><p className="text-sm text-red-400">{error}</p></div>}
        <Input label="Event Name" value={f.name} onChange={e => sF({...f, name: e.target.value})} placeholder="e.g., Team Building"/>
        <Sel label="Type" value={f.type} onChange={e => sF({...f, type: e.target.value})} opts={eventTypes.map(t => t.name)}/>
        <Input label="Date" type="date" value={f.date} onChange={e => sF({...f, date: e.target.value})}/>
        <Input label="Budget (RON)" type="number" value={f.budget} onChange={e => sF({...f, budget: e.target.value})} placeholder="0"/>
        <TextArea label="Notes (optional)" value={f.notes || ''} onChange={e => sF({...f, notes: e.target.value})} placeholder="Reminders, details..."/>
        <button onClick={save} disabled={saving || !f.name || !f.date} className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
          {saving && <Loader2 size={18} className="animate-spin"/>}{editItem ? 'Update' : 'Create'} Event
        </button>
      </div>
    </Modal>;
  };

  const CompleteModal = () => {
    const [cost, setCost] = useState(editItem?.budget?.toString() || '');
    const [att, setAtt] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const save = async () => {
      setSaving(true); setError(null);
      try {
        const updated = await db.update('ops_events', editItem.id, { ...editItem, status: 'completed', actual: parseFloat(cost) || 0, attendees: parseInt(att) || 0 });
        setEvents(prev => prev.map(e => e.id === editItem.id ? updated : e));
        setModal(null); setEditItem(null);
      } catch (err) { console.error('Complete failed:', err); setError('Failed to complete event.'); }
      setSaving(false);
    };
    return <Modal title="Complete Event" onClose={() => { setModal(null); setEditItem(null); }}>
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"><AlertCircle size={16} className="text-red-400"/><p className="text-sm text-red-400">{error}</p></div>}
        <div className={`p-4 rounded-xl ${c('bg-violet-500/10 border border-violet-500/20', 'bg-violet-50')}`}><p className="font-medium">{editItem?.name}</p><p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{editItem?.date}</p></div>
        <Input label="Actual Cost (RON)" type="number" value={cost} onChange={e => setCost(e.target.value)}/>
        <Input label="Number of Attendees" type="number" value={att} onChange={e => setAtt(e.target.value)}/>
        <button onClick={save} disabled={saving} className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin"/> : <Check size={18}/>}Mark Complete
        </button>
      </div>
    </Modal>;
  };

  const ConverterModal = () => {
    const [amt, setAmt] = useState('');
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('RON');
    const conv = () => { if (!amt) return 0; const v = parseFloat(amt); const inR = from === 'RON' ? v : v * (rates[from] || 1); return to === 'RON' ? inR : inR / (rates[to] || 1); };
    return <Modal title="Currency Converter" onClose={() => setModal(null)}>
      <div className="space-y-4">
        <div className={`p-3 rounded-xl text-sm ${c('bg-gray-800', 'bg-gray-100')}`}><div className="flex items-center gap-2"><Zap size={14} className="text-amber-400"/><span className={c('text-gray-400', 'text-gray-500')}>BNR rates from {bnrDate || 'defaults'}</span></div></div>
        <div className="flex gap-2"><input type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="Amount" className={`flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-violet-500 ${c('bg-gray-800 border-gray-700 text-white', 'bg-gray-50 border-gray-200 text-gray-900')}`}/><select value={from} onChange={e => setFrom(e.target.value)} className={`px-3 rounded-xl border-2 ${c('bg-gray-800 border-gray-700 text-white', 'bg-gray-50 border-gray-200 text-gray-900')}`}>{['RON','EUR','USD','GBP','CHF'].map(x => <option key={x}>{x}</option>)}</select></div>
        <div className="flex justify-center"><button onClick={() => { setFrom(to); setTo(from); }} className={`p-3 rounded-full transition-all hover:scale-110 ${c('bg-gray-800', 'bg-gray-100')}`}><RefreshCw size={18}/></button></div>
        <div className="flex gap-2"><div className={`flex-1 px-4 py-3 rounded-xl border-2 text-xl font-bold ${c('bg-gray-950 border-gray-800', 'bg-gray-100 border-gray-200')}`}>{conv().toFixed(2)}</div><select value={to} onChange={e => setTo(e.target.value)} className={`px-3 rounded-xl border-2 ${c('bg-gray-800 border-gray-700 text-white', 'bg-gray-50 border-gray-200 text-gray-900')}`}>{['RON','EUR','USD','GBP','CHF'].map(x => <option key={x}>{x}</option>)}</select></div>
        <div className={`p-4 rounded-xl ${c('bg-gray-800/50', 'bg-gray-50')}`}><p className="text-sm font-semibold mb-3">Live BNR Rates</p><div className="grid grid-cols-2 gap-2 text-sm">{Object.entries(rates).map(([k,v]) => <div key={k} className={`flex justify-between p-2 rounded-lg ${c('bg-gray-900', 'bg-white')}`}><span className={c('text-gray-400', 'text-gray-500')}>1 {k}</span><span className="font-semibold">{v.toFixed(4)} RON</span></div>)}</div></div>
      </div>
    </Modal>;
  };

  const VendorModal = () => {
    const [f, sF] = useState(editVendor || { name: '', category: '', contact: '', phone: '', email: '', favorite: false });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const save = async () => {
      if (!f.name) return;
      setSaving(true); setError(null);
      try {
        if (editVendor) { const updated = await db.update('ops_vendors', editVendor.id, f); setVendors(prev => prev.map(v => v.id === editVendor.id ? updated : v)); }
        else { const inserted = await db.insert('ops_vendors', f); setVendors(prev => [inserted, ...prev]); }
        setModal(null); setEditVendor(null);
      } catch (err) { console.error('Save failed:', err); setError('Failed to save vendor.'); }
      setSaving(false);
    };
    return <Modal title={editVendor ? 'Edit Vendor' : 'Add Vendor'} onClose={() => { setModal(null); setEditVendor(null); }}>
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"><AlertCircle size={16} className="text-red-400"/><p className="text-sm text-red-400">{error}</p></div>}
        <Input label="Vendor Name" value={f.name} onChange={e => sF({...f, name: e.target.value})} placeholder="e.g., Mesopotamia"/>
        <Sel label="Category" value={f.category} onChange={e => sF({...f, category: e.target.value})} opts={['', 'Catering', 'Bakery', 'Supplies', 'Office', 'Beverages', 'Various', 'Other']}/>
        <Input label="Contact Person (POC)" value={f.contact} onChange={e => sF({...f, contact: e.target.value})} placeholder="e.g., Maria"/>
        <Input label="Phone" value={f.phone} onChange={e => sF({...f, phone: e.target.value})} placeholder="+40 xxx xxx xxx"/>
        <Input label="Email" value={f.email} onChange={e => sF({...f, email: e.target.value})} placeholder="contact@vendor.ro"/>
        <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors ${c('hover:bg-gray-800/50', 'hover:bg-gray-50')}`}><input type="checkbox" checked={f.favorite} onChange={e => sF({...f, favorite: e.target.checked})} className="w-5 h-5 rounded accent-violet-500"/><span>Mark as favorite</span></label>
        <button onClick={save} disabled={saving || !f.name} className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
          {saving && <Loader2 size={18} className="animate-spin"/>}{editVendor ? 'Update' : 'Add'} Vendor
        </button>
      </div>
    </Modal>;
  };

  const InventoryModal = () => {
    const [f, sF] = useState(editItem || { name: '', category: '', stock: '', unit: 'pcs', min: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const save = async () => {
      if (!f.name) return;
      setSaving(true); setError(null);
      try {
        const data = { ...f, stock: parseInt(f.stock) || 0, min: parseInt(f.min) || 0 };
        if (editItem) { const updated = await db.update('ops_inventory', editItem.id, data); setInventory(prev => prev.map(i => i.id === editItem.id ? updated : i)); }
        else { const inserted = await db.insert('ops_inventory', data); setInventory(prev => [inserted, ...prev]); }
        setModal(null); setEditItem(null);
      } catch (err) { console.error('Save failed:', err); setError('Failed to save item.'); }
      setSaving(false);
    };
    return <Modal title={editItem ? 'Edit Item' : 'Add Inventory Item'} onClose={() => { setModal(null); setEditItem(null); }}>
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"><AlertCircle size={16} className="text-red-400"/><p className="text-sm text-red-400">{error}</p></div>}
        <Input label="Item Name" value={f.name} onChange={e => sF({...f, name: e.target.value})} placeholder="e.g., Coffee Beans"/>
        <Sel label="Category" value={f.category} onChange={e => sF({...f, category: e.target.value})} opts={['', 'Beverages', 'Bathroom', 'Office', 'Kitchen', 'Other']}/>
        <div className="flex gap-3"><Input label="Current Stock" type="number" value={f.stock} onChange={e => sF({...f, stock: e.target.value})}/><div className="w-28"><Sel label="Unit" value={f.unit} onChange={e => sF({...f, unit: e.target.value})} opts={['pcs', 'kg', 'bottles', 'boxes', 'packs']}/></div></div>
        <Input label="Minimum Stock (alert threshold)" type="number" value={f.min} onChange={e => sF({...f, min: e.target.value})}/>
        <button onClick={save} disabled={saving || !f.name} className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
          {saving && <Loader2 size={18} className="animate-spin"/>}{editItem ? 'Update' : 'Add'} Item
        </button>
      </div>
    </Modal>;
  };

  const BirthdayModal = () => {
    const [f, sF] = useState(editItem || { name: '', date: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const save = async () => {
      if (!f.name || !f.date) return;
      setSaving(true); setError(null);
      try {
        if (editItem) { const updated = await db.update('ops_birthdays', editItem.id, f); setBirthdays(prev => prev.map(b => b.id === editItem.id ? updated : b)); }
        else { const inserted = await db.insert('ops_birthdays', f); setBirthdays(prev => [inserted, ...prev]); }
        setModal(null); setEditItem(null);
      } catch (err) { console.error('Save failed:', err); setError('Failed to save birthday.'); }
      setSaving(false);
    };
    return <Modal title={editItem ? 'Edit Birthday' : 'Add Birthday'} onClose={() => { setModal(null); setEditItem(null); }}>
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"><AlertCircle size={16} className="text-red-400"/><p className="text-sm text-red-400">{error}</p></div>}
        <Input label="Employee Name" value={f.name} onChange={e => sF({...f, name: e.target.value})} placeholder="e.g., Maria Popescu"/>
        <Input label="Birthday (MM-DD)" value={f.date} onChange={e => sF({...f, date: e.target.value})} placeholder="02-14"/>
        <button onClick={save} disabled={saving || !f.name || !f.date} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
          {saving && <Loader2 size={18} className="animate-spin"/>}{editItem ? 'Update' : 'Add'} Birthday
        </button>
      </div>
    </Modal>;
  };

  const ImportBirthdaysModal = () => {
    const fileInputRef = useRef(null);
    const [importing, setImporting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

const handleFile = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null); setPreview(null); setImporting(true);
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (json.length === 0) { setError('The spreadsheet appears to be empty'); setImporting(false); return; }

        const mapped = [];

        for (const row of json) {
          const values = Object.values(row);

          // Column A = month, Column B = day, Column C = first name, Column D = last name
          const monthRaw = values[0];
          const dayRaw = values[1];
          const firstName = String(values[2] || '').trim();
          const lastName = String(values[3] || '').trim();

          const fullName = `${firstName} ${lastName}`.trim();

          // Skip empty rows or header rows
          if (!fullName || fullName.toLowerCase().includes('name') || fullName.toLowerCase().includes('month')) continue;

          const month = parseInt(monthRaw);
          const day = parseInt(dayRaw);

          if (!month || !day || isNaN(month) || isNaN(day)) continue;

          const dateFormatted = String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
          mapped.push({ name: fullName, date: dateFormatted });
        }

        if (mapped.length === 0) { setError('Could not parse any birthday data. Make sure you have Month, Day, First Name, Last Name columns.'); setImporting(false); return; }
        setPreview(mapped);
      } catch (err) { console.error('File parse error:', err); setError("Failed to read file. Please make sure it's a valid Excel file (.xlsx)"); }
      setImporting(false);
    };
    const confirmImport = async () => {
      if (!preview) return;
      setSaving(true); setError(null);
      try {
        const toInsert = preview.map(b => ({ name: b.name, date: b.date }));
        const { data: inserted, error: insertError } = await supabase.from('ops_birthdays').insert(toInsert).select();
        if (insertError) throw insertError;
        setBirthdays(prev => [...(inserted || []), ...prev]);
        setSuccess(true);
        setTimeout(() => { setModal(null); }, 1500);
      } catch (err) { console.error('Import failed:', err); setError('Failed to import birthdays.'); }
      setSaving(false);
    };

    return <Modal title="Import Birthdays from Excel" onClose={() => setModal(null)}>
      <div className="space-y-4">
        {!preview && !success && (<>
          <div className={`p-4 rounded-xl ${c('bg-gray-800', 'bg-gray-100')}`}>
            <p className="text-sm font-medium mb-2">Your Excel format:</p>
            <div className={`text-xs space-y-1 ${c('text-gray-400', 'text-gray-500')}`}>
              <p>• Column 1: <strong>Date of Birth - Month</strong></p><p>• Column 2: <strong>Date of Birth</strong> (day)</p>
              <p>• Column 3: <strong>First and Middle Name</strong></p><p>• Column 4: <strong>Last Name</strong></p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFile} className="hidden"/>
          <button onClick={() => fileInputRef.current?.click()} disabled={importing} className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 transition-colors ${c('border-gray-700 hover:border-violet-500 hover:bg-violet-500/10', 'border-gray-300 hover:border-violet-500 hover:bg-violet-50')}`}>
            {importing ? <Loader2 size={24} className="animate-spin text-violet-400"/> : <FileSpreadsheet size={24} className="text-violet-400"/>}
            <span className="font-medium">{importing ? 'Reading file...' : 'Click to upload Excel file'}</span>
            <span className={`text-xs ${c('text-gray-500', 'text-gray-400')}`}>.xlsx or .xls</span>
          </button>
          {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-start gap-2"><AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0"/><p className="text-sm text-red-400">{error}</p></div>}
        </>)}
        {preview && !success && (<>
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-400"/><p className="text-sm text-emerald-400">Found {preview.length} birthdays to import</p></div>
          <div className={`max-h-60 overflow-y-auto rounded-xl border ${c('border-gray-700', 'border-gray-200')}`}>
            <table className="w-full text-sm"><thead className={c('bg-gray-800', 'bg-gray-100')}><tr><th className="text-left p-2">Name</th><th className="text-left p-2">Birthday</th></tr></thead>
            <tbody>{preview.slice(0, 10).map((b, i) => <tr key={i} className={`border-t ${c('border-gray-700', 'border-gray-200')}`}><td className="p-2">{b.name}</td><td className="p-2">{b.date}</td></tr>)}
            {preview.length > 10 && <tr className={`border-t ${c('border-gray-700', 'border-gray-200')}`}><td colSpan={2} className={`p-2 text-center ${c('text-gray-500', 'text-gray-400')}`}>... and {preview.length - 10} more</td></tr>}</tbody></table>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setPreview(null); setError(null); }} className={`flex-1 py-3 rounded-xl font-medium ${c('bg-gray-800 hover:bg-gray-700', 'bg-gray-100 hover:bg-gray-200')}`}>Cancel</button>
            <button onClick={confirmImport} disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">{saving && <Loader2 size={18} className="animate-spin"/>}Import {preview.length}</button>
          </div>
        </>)}
        {success && <div className="py-8 text-center"><CheckCircle size={48} className="mx-auto text-emerald-400 mb-3"/><p className="text-lg font-semibold text-emerald-400">Import Successful!</p><p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{preview?.length} birthdays added</p></div>}
      </div>
    </Modal>;
  };const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div><h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Dashboard</h1><p className={c('text-gray-400', 'text-gray-500')}>{MONTHS[selectedMonth]} {selectedYear} Overview</p></div>
        <div className="flex items-center gap-3 flex-wrap">
          <MonthSelector/>
          <button onClick={fetchRates} className={`p-2.5 rounded-xl border transition-all hover:scale-105 ${c('bg-gray-800/50 border-gray-700', 'bg-white border-gray-200')}`}><RefreshCw size={18}/></button>
        </div>
      </div>

      {budgetWarning && showBudgetAlert && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${c('bg-red-500/10 border-red-500/30', 'bg-red-50 border-red-200')}`}>
          <div className="flex items-center gap-4"><div className="p-2 rounded-xl bg-red-500/20"><Bell size={20} className="text-red-400"/></div><div><p className="font-semibold text-red-400">Budget Alert: {pct.toFixed(0)}% spent!</p><p className={`text-sm ${c('text-gray-300', 'text-gray-600')}`}>You've used {pct >= 100 ? 'all' : 'over 80%'} of the monthly budget</p></div></div>
          <button onClick={() => setShowBudgetAlert(false)} className="p-2 hover:bg-red-500/20 rounded-lg"><X size={18} className="text-red-400"/></button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setModal('expense')} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"><Plus size={18}/>Add Expense</button>
        <button onClick={() => setModal('event')} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 hover:scale-105"><Plus size={18}/>New Event</button>
        <button onClick={() => setModal('converter')} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"><RefreshCw size={18}/>Convert</button>
      </div>

      {lowStock.length > 0 && <div className={`p-4 rounded-2xl border flex items-center gap-4 ${c('bg-amber-500/10 border-amber-500/30', 'bg-amber-50 border-amber-200')}`}><div className="p-2 rounded-xl bg-amber-500/20"><AlertTriangle size={20} className="text-amber-500"/></div><div><p className="font-semibold text-amber-500">Low Stock Alert</p><p className={`text-sm ${c('text-gray-300', 'text-gray-600')}`}>{lowStock.map(i => i.name).join(', ')}</p></div></div>}

      {upcomingBirthdays.length > 0 && <div className={`p-4 rounded-2xl border flex items-center gap-4 ${c('bg-pink-500/10 border-pink-500/30', 'bg-pink-50 border-pink-200')}`}><div className="p-2 rounded-xl bg-pink-500/20"><Cake size={20} className="text-pink-500"/></div><div><p className="font-semibold text-pink-500">Upcoming Birthdays</p><p className={`text-sm ${c('text-gray-300', 'text-gray-600')}`}>{upcomingBirthdays.map(b => `${b.name} (${b.date})`).join(', ')}</p></div></div>}

      <div className={`p-6 rounded-3xl border relative overflow-hidden ${c('bg-gradient-to-br from-violet-900/50 via-purple-900/30 to-gray-900 border-violet-700/50', 'bg-gradient-to-br from-violet-100 via-purple-50 to-white border-violet-200')}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"/>
        <div className="relative">
          <div className="flex justify-between mb-6">
            <div><div className="flex items-center gap-2 mb-1"><Target size={18} className="text-violet-400"/><span className={c('text-violet-300', 'text-violet-600')}>Monthly Budget</span></div><p className="text-4xl font-bold">${spentUSD.toFixed(0)} <span className={`text-xl font-normal ${c('text-gray-500', 'text-gray-400')}`}>/ ${budgetUSD}</span></p><p className={`text-sm mt-1 ${c('text-gray-400', 'text-gray-500')}`}>{spentRON.toFixed(0)} RON spent</p></div>
            <div className="text-right"><p className={c('text-gray-400', 'text-gray-500')}>Remaining</p><p className={`text-3xl font-bold ${budgetWarning ? 'text-red-400' : 'text-emerald-400'}`}>${(budgetUSD - spentUSD).toFixed(0)}</p></div>
          </div>
          <div className={`w-full h-4 rounded-full overflow-hidden ${c('bg-gray-800', 'bg-gray-200')}`}><div className={`h-full rounded-full transition-all duration-1000 ${budgetWarning ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500'}`} style={{ width: `${Math.min(pct, 100)}%` }}/></div>
          <p className={`text-sm mt-2 ${c('text-gray-400', 'text-gray-500')}`}>{pct.toFixed(1)}% used</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Calendar} label="Events" value={completed.length} sub={`${upcoming.length} upcoming`} gradient="from-violet-500 to-purple-600"/>
        <Stat icon={Users} label="Attendees" value={attendees} sub={`${costPerPerson} RON avg`} gradient="from-cyan-500 to-blue-600"/>
<Stat icon={Gift} label="Birthdays" value={`${birthdays.filter(b => { const parts = b.date?.split('-'); if (!parts) return false; const m = parseInt(parts[0]); if (m !== selectedMonth + 1) return false; const d = parseInt(parts[1]); const today = new Date(); if (selectedMonth < today.getMonth()) return true; if (selectedMonth === today.getMonth() && d <= today.getDate()) return true; return false; }).length}/${birthdays.filter(b => { const parts = b.date?.split('-'); return parts && parseInt(parts[0]) === selectedMonth + 1; }).length}`} sub={`celebrated in ${MONTHS[selectedMonth].slice(0,3)}`} gradient="from-pink-500 to-rose-600"/>
        <Stat icon={Coffee} label="TGIT" value={events.filter(e => e.type === 'TGIT').length} sub="happy hours" gradient="from-amber-500 to-orange-600"/>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`p-5 rounded-2xl border ${c('bg-gray-800/50 border-gray-700/50', 'bg-white border-gray-200')}`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-violet-500"/>Spending by Category</h3>
          {byCategory.length > 0 ? <><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={byCategory} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} strokeWidth={0}>{byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}</Pie><Tooltip formatter={v => `${v.toFixed(0)} RON`} contentStyle={{ backgroundColor: dark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12 }}/></PieChart></ResponsiveContainer><div className="flex flex-wrap gap-2 mt-2">{byCategory.slice(0,4).map((x,i) => <span key={x.name} className={`text-xs px-3 py-1.5 rounded-full font-medium ${c('bg-gray-700/50', 'bg-gray-100')}`}><span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: COLORS[i] }}/>{x.name}</span>)}</div></> : <p className={`text-center py-8 ${c('text-gray-500', 'text-gray-400')}`}>No expenses this month</p>}
        </div>
        <div className={`p-5 rounded-2xl border ${c('bg-gray-800/50 border-gray-700/50', 'bg-white border-gray-200')}`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"/>Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={200}><AreaChart data={trend}><defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: dark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: dark ? '#9CA3AF' : '#6B7280', fontSize: 12 }}/><Tooltip contentStyle={{ backgroundColor: dark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12 }}/><Area type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={3} fill="url(#colorV)"/></AreaChart></ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`p-5 rounded-2xl border ${c('bg-gray-800/50 border-gray-700/50', 'bg-white border-gray-200')}`}>
          <div className="flex justify-between mb-4"><h3 className="font-semibold">Upcoming Events</h3><button onClick={() => setTab('events')} className="text-violet-400 text-sm">View all →</button></div>
          <div className="space-y-3">{upcoming.slice(0,3).map(e => { const t = eventTypes.find(x => x.name === e.type); return <div key={e.id} className={`flex items-center gap-4 p-4 rounded-xl ${c('bg-gray-700/30', 'bg-gray-50')}`}><span className="text-2xl">{t?.icon}</span><div className="flex-1"><p className="font-medium">{e.name}</p><p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div><button onClick={() => { setEditItem(e); setModal('complete'); }} className="text-xs text-emerald-400 font-medium">Complete →</button></div>; })}{upcoming.length === 0 && <p className={`text-center py-4 ${c('text-gray-500', 'text-gray-400')}`}>No upcoming events</p>}</div>
        </div>
        <div className={`p-5 rounded-2xl border ${c('bg-gray-800/50 border-gray-700/50', 'bg-white border-gray-200')}`}>
          <div className="flex justify-between mb-4"><h3 className="font-semibold">Recent Expenses</h3><button onClick={() => setTab('expenses')} className="text-violet-400 text-sm">View all →</button></div>
          <div className="space-y-3">{expenses.slice(0,3).map(e => <div key={e.id} className={`flex items-center gap-4 p-4 rounded-xl ${c('bg-gray-700/30', 'bg-gray-50')}`}><div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600"><DollarSign size={18} className="text-white"/></div><div className="flex-1"><p className="font-medium">{e.item}</p><p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{e.category}</p></div><p className="font-semibold">{e.amount} {e.currency}</p></div>)}</div>
        </div>
      </div>
    </div>
  );

  const Events = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4"><h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Events</h1><button onClick={() => { setEditItem(null); setModal('event'); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-violet-500/25"><Plus size={18}/>New Event</button></div>
      <SearchBar placeholder="Search events..." filters={eventTypes.map(t => t.name)}/>
      <div className="space-y-4">{filteredEvents.map(e => { const t = eventTypes.find(x => x.name === e.type); return <div key={e.id} className={`p-5 rounded-2xl border transition-all ${c('bg-gray-800/50 border-gray-700/50 hover:border-gray-600', 'bg-white border-gray-200 shadow-sm')}`}><div className="flex items-start gap-4"><span className="text-3xl">{t?.icon}</span><div className="flex-1"><div className="flex items-center gap-3 flex-wrap"><h3 className="text-lg font-semibold">{e.name}</h3><span className={`px-3 py-1 rounded-full text-xs font-medium ${e.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{e.status}</span></div><p className={c('text-gray-400', 'text-gray-500')}>{new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>{e.notes && <p className={`text-sm mt-2 flex items-center gap-2 ${c('text-gray-500', 'text-gray-400')}`}><MessageSquare size={14}/>{e.notes}</p>}<div className="flex gap-6 mt-3"><div><p className={`text-xs uppercase ${c('text-gray-500', 'text-gray-400')}`}>Budget</p><p className="font-bold">{e.budget} RON</p></div>{e.actual !== null && <div><p className={`text-xs uppercase ${c('text-gray-500', 'text-gray-400')}`}>Actual</p><p className="font-bold">{e.actual} RON</p></div>}{e.attendees && <div><p className={`text-xs uppercase ${c('text-gray-500', 'text-gray-400')}`}>Attendees</p><p className="font-bold">{e.attendees}</p></div>}</div></div><div className="flex gap-2">{e.status === 'upcoming' && <button onClick={() => { setEditItem(e); setModal('complete'); }} className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"><Check size={18}/></button>}<button onClick={() => { setEditItem(e); setModal('event'); }} className={`p-2.5 rounded-xl ${c('hover:bg-gray-700', 'hover:bg-gray-100')}`}><Edit size={18} className={c('text-gray-400', 'text-gray-500')}/></button><button onClick={() => setDeleteConfirm({ type: 'event', id: e.id, name: e.name })} className={`p-2.5 rounded-xl ${c('hover:bg-gray-700', 'hover:bg-gray-100')}`}><Trash2 size={18} className="text-red-400"/></button></div></div></div>; })}{filteredEvents.length === 0 && <p className={`text-center py-8 ${c('text-gray-500', 'text-gray-400')}`}>No events found</p>}</div>
    </div>
  );

  const Expenses = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4"><h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Expenses</h1><button onClick={() => { setEditItem(null); setModal('expense'); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-violet-500/25"><Plus size={18}/>Add Expense</button></div>
      <SearchBar placeholder="Search by item or vendor..." filters={categories}/>
      <div className={`rounded-2xl border overflow-hidden ${c('bg-gray-800/50 border-gray-700/50', 'bg-white border-gray-200')}`}>
        <div className="overflow-x-auto"><table className="w-full"><thead className={c('bg-gray-900/50', 'bg-gray-50')}><tr><th className="text-left px-5 py-4 font-semibold">Item</th><th className="text-left px-5 py-4 font-semibold hidden sm:table-cell">Category</th><th className="text-left px-5 py-4 font-semibold hidden md:table-cell">Vendor</th><th className="text-left px-5 py-4 font-semibold hidden lg:table-cell">Date</th><th className="text-right px-5 py-4 font-semibold">Amount</th><th className="px-3"></th></tr></thead>
        <tbody>{filteredExpenses.map(e => <tr key={e.id} className={`border-t ${c('border-gray-700/50 hover:bg-gray-700/20', 'border-gray-100 hover:bg-gray-50')}`}><td className="px-5 py-4"><p className="font-medium">{e.item}</p>{e.notes && <p className={`text-xs ${c('text-gray-500', 'text-gray-400')}`}>{e.notes}</p>}</td><td className="px-5 py-4 hidden sm:table-cell"><span className={`px-3 py-1 rounded-full text-xs ${c('bg-gray-700', 'bg-gray-100')}`}>{e.category}</span></td><td className={`px-5 py-4 hidden md:table-cell ${c('text-gray-400', 'text-gray-500')}`}>{e.vendor || '-'}</td><td className={`px-5 py-4 hidden lg:table-cell ${c('text-gray-400', 'text-gray-500')}`}>{new Date(e.date).toLocaleDateString()}</td><td className="px-5 py-4 text-right"><span className="font-bold">{e.amount} {e.currency}</span>{e.currency !== 'RON' && <p className={`text-xs ${c('text-gray-500', 'text-gray-400')}`}>≈{toRON(e.amount, e.currency).toFixed(0)} RON</p>}</td><td className="px-3"><div className="flex gap-1 items-center">{e.invoice_url && <a href={e.invoice_url} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${c('hover:bg-gray-700 text-violet-400', 'hover:bg-gray-200 text-violet-600')}`} title="View Invoice"><FileText size={16}/></a>}<button onClick={() => { setEditItem(e); setModal('expense'); }} className={`p-2 rounded-lg ${c('hover:bg-gray-700', 'hover:bg-gray-200')}`}><Edit size={16} className={c('text-gray-400', 'text-gray-500')}/></button><button onClick={() => setDeleteConfirm({ type: 'expense', id: e.id, name: e.item })} className={`p-2 rounded-lg ${c('hover:bg-gray-700', 'hover:bg-gray-200')}`}><Trash2 size={16} className="text-red-400"/></button></div></td></tr>)}</tbody>
        </table></div>
        {filteredExpenses.length === 0 && <p className={`text-center py-8 ${c('text-gray-500', 'text-gray-400')}`}>No expenses found</p>}
      </div>
    </div>
  );

  const Inventory = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4"><h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Inventory</h1><button onClick={() => { setEditItem(null); setModal('inventory'); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-violet-500/25"><Plus size={18}/>Add Item</button></div>
      {lowStock.length > 0 && <div className={`p-4 rounded-2xl border flex items-center gap-4 ${c('bg-red-500/10 border-red-500/30', 'bg-red-50 border-red-200')}`}><AlertTriangle size={20} className="text-red-400"/><p className={c('text-gray-300', 'text-gray-600')}><strong className="text-red-400">Low stock:</strong> {lowStock.map(i => i.name).join(', ')}</p></div>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{inventory.map(i => <div key={i.id} className={`p-5 rounded-2xl border ${i.stock <= i.min ? c('border-red-500/50 bg-red-500/5', 'border-red-200 bg-red-50') : c('border-gray-700/50 bg-gray-800/50', 'border-gray-200 bg-white')}`}><div className="flex justify-between items-start"><div><p className="font-semibold text-lg">{i.name}</p><p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{i.category}</p></div><div className="flex gap-1"><button onClick={() => { setEditItem(i); setModal('inventory'); }} className={`p-1.5 rounded-lg ${c('hover:bg-gray-700', 'hover:bg-gray-200')}`}><Edit size={14} className={c('text-gray-400', 'text-gray-500')}/></button><button onClick={() => setDeleteConfirm({ type: 'inventory', id: i.id, name: i.name })} className={`p-1.5 rounded-lg ${c('hover:bg-gray-700', 'hover:bg-gray-200')}`}><Trash2 size={14} className="text-red-400"/></button></div></div><div className="mt-4 flex items-end justify-between"><div><p className="text-4xl font-bold">{i.stock}</p><p className={`text-sm ${c('text-gray-500', 'text-gray-400')}`}>{i.unit} (min: {i.min})</p></div><div className="flex gap-1"><button onClick={() => updateInventoryStock(i.id, i.stock + 1)} className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">+</button><button onClick={() => updateInventoryStock(i.id, Math.max(0, i.stock - 1))} className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30">−</button></div></div></div>)}</div>
    </div>
  );

  const Vendors = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4"><h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Vendors</h1><button onClick={() => { setEditVendor(null); setModal('vendor'); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-violet-500/25"><Plus size={18}/>Add Vendor</button></div>
      <div className="grid md:grid-cols-2 gap-4">{vendors.map(v => <div key={v.id} className={`p-5 rounded-2xl border ${c('border-gray-700/50 bg-gray-800/50', 'border-gray-200 bg-white')}`}><div className="flex justify-between"><div><p className="font-semibold text-lg flex items-center gap-2">{v.name}{v.favorite && <Star size={16} className="text-amber-400 fill-amber-400"/>}</p><p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{v.category}</p></div><div className="flex gap-1"><button onClick={() => toggleVendorFavorite(v.id)} className={`p-2 rounded-xl ${c('hover:bg-gray-700', 'hover:bg-gray-100')}`}><Star size={18} className={v.favorite ? 'text-amber-400 fill-amber-400' : c('text-gray-500', 'text-gray-400')}/></button><button onClick={() => { setEditVendor(v); setModal('vendor'); }} className={`p-2 rounded-xl ${c('hover:bg-gray-700', 'hover:bg-gray-100')}`}><Edit size={18} className={c('text-gray-400', 'text-gray-500')}/></button><button onClick={() => setDeleteConfirm({ type: 'vendor', id: v.id, name: v.name })} className={`p-2 rounded-xl ${c('hover:bg-gray-700', 'hover:bg-gray-100')}`}><Trash2 size={18} className="text-red-400"/></button></div></div>{(v.contact || v.phone || v.email) && <div className={`text-sm mt-3 p-3 rounded-xl ${c('bg-gray-900/50', 'bg-gray-50')}`}>{v.contact && <p className="font-medium">👤 {v.contact}</p>}{v.phone && <p className={c('text-gray-400', 'text-gray-500')}>📞 {v.phone}</p>}{v.email && <p className={c('text-gray-400', 'text-gray-500')}>✉️ {v.email}</p>}</div>}</div>)}</div>
    </div>
  );

  const Birthdays = () => {
    const groupedByMonth = MONTHS.map((month, idx) => ({
      month, monthNum: idx + 1,
      birthdays: birthdays.filter(b => parseInt(b.date.split('-')[0]) === idx + 1).sort((a, b) => parseInt(a.date.split('-')[1]) - parseInt(b.date.split('-')[1]))
    })).filter(g => g.birthdays.length > 0);
    const thisMonthBirthdays = birthdays.filter(b => parseInt(b.date.split('-')[0]) === selectedMonth + 1);
    const todayDate = new Date(), todayDay = todayDate.getDate(), todayMonth = todayDate.getMonth();
    const getOrdinal = (n) => { const s = ["th","st","nd","rd"]; const v = n % 100; return n + (s[(v-20)%10] || s[v] || s[0]); };
    const getBirthdayStatus = (monthNum, day) => { const bm = monthNum - 1; if (bm < todayMonth) return 'past'; if (bm > todayMonth) return 'upcoming'; if (day < todayDay) return 'past'; if (day > todayDay) return 'upcoming'; return 'today'; };

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Employee Birthdays</h1>
          <div className="flex gap-2">
            <button onClick={() => setModal('importBirthdays')} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-emerald-500/25"><Upload size={18}/>Import Excel</button>
            <button onClick={() => { setEditItem(null); setModal('birthday'); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-pink-500/25"><Plus size={18}/>Add</button>
          </div>
        </div>
        {birthdays.length > 0 ? (
          <div className="space-y-6">
            {thisMonthBirthdays.length > 0 && (
              <div className={`p-6 rounded-2xl border ${c('bg-gradient-to-br from-pink-900/30 to-rose-900/20 border-pink-500/30', 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200')}`}>
                <div className="flex items-center justify-between mb-4"><h3 className={`font-semibold text-lg ${c('text-pink-300', 'text-pink-600')}`}>Celebrating in {MONTHS[selectedMonth]}</h3><span className={`text-sm px-3 py-1 rounded-full ${c('bg-pink-500/20 text-pink-300', 'bg-pink-100 text-pink-600')}`}>{thisMonthBirthdays.length} {thisMonthBirthdays.length === 1 ? 'birthday' : 'birthdays'}</span></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {thisMonthBirthdays.map(b => { const day = parseInt(b.date.split('-')[1]); const mn = parseInt(b.date.split('-')[0]); const status = getBirthdayStatus(mn, day); return (
                    <div key={b.id} className={`flex items-center gap-3 p-4 rounded-xl transition-all ${status === 'today' ? c('bg-pink-500/30 ring-2 ring-pink-400', 'bg-pink-200 ring-2 ring-pink-400') : c('bg-gray-900/50 hover:bg-gray-900/70', 'bg-white hover:bg-gray-50')}`}>
                      {status === 'past' ? <div className={`w-8 h-8 rounded-full flex items-center justify-center ${c('bg-emerald-500/20', 'bg-emerald-100')}`}><Check size={16} className="text-emerald-500"/></div>
                      : <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${status === 'today' ? 'bg-pink-500 text-white' : c('bg-violet-500/20 text-violet-400', 'bg-violet-100 text-violet-600')}`}>{status === 'today' ? '!' : day}</div>}
                      <div className="flex-1 min-w-0"><p className={`font-semibold truncate ${status === 'today' ? c('text-pink-300', 'text-pink-700') : ''}`}>{b.name}</p><p className={`text-sm ${status === 'today' ? c('text-pink-200', 'text-pink-600') : c('text-gray-400', 'text-gray-500')}`}>{status === 'today' ? "Today!" : status === 'past' ? "Celebrated" : `${MONTHS[selectedMonth]} ${getOrdinal(day)}`}</p></div>
                      <div className="flex gap-1"><button onClick={() => { setEditItem(b); setModal('birthday'); }} className={`p-1.5 rounded-lg opacity-60 hover:opacity-100 ${c('hover:bg-gray-700', 'hover:bg-gray-200')}`}><Edit size={14}/></button><button onClick={() => setDeleteConfirm({ type: 'birthday', id: b.id, name: b.name })} className={`p-1.5 rounded-lg opacity-60 hover:opacity-100 ${c('hover:bg-gray-700', 'hover:bg-gray-200')}`}><Trash2 size={14} className="text-red-400"/></button></div>
                    </div>); })}
                </div>
              </div>
            )}
            <div className={`rounded-2xl border overflow-hidden ${c('bg-gray-800/50 border-gray-700/50', 'bg-white border-gray-200')}`}>
              <div className={`px-6 py-4 border-b flex items-center justify-between ${c('bg-gray-900/50 border-gray-700', 'bg-gray-50 border-gray-200')}`}><h3 className="font-semibold">All Birthdays</h3><span className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{birthdays.length} employees</span></div>
              <div>{groupedByMonth.map(group => (
                <div key={group.month} className={`border-b last:border-b-0 ${c('border-gray-700/50', 'border-gray-100')}`}>
                  <div className={`px-6 py-3 flex items-center gap-3 ${c('bg-gray-800/50', 'bg-gray-50')}`}><span className="font-semibold">{group.month}</span><span className={`text-xs px-2 py-0.5 rounded-full ${c('bg-gray-700 text-gray-300', 'bg-gray-200 text-gray-600')}`}>{group.birthdays.length}</span></div>
                  <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 ${c('bg-gray-900/20', 'bg-white')}`}>
                    {group.birthdays.map(b => { const day = parseInt(b.date.split('-')[1]); const status = getBirthdayStatus(group.monthNum, day); return (
                      <div key={b.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${c('hover:bg-gray-700/50', 'hover:bg-gray-50')} transition-colors group`}>
                        {status === 'past' ? <div className={`w-6 h-6 rounded-full flex items-center justify-center ${c('bg-emerald-500/20', 'bg-emerald-100')}`}><Check size={12} className="text-emerald-500"/></div>
                        : <div className={`text-sm font-medium w-16 ${status === 'today' ? 'text-pink-400' : c('text-violet-400', 'text-violet-600')}`}>{status === 'today' ? 'Today' : `${group.month.slice(0,3)} ${day}`}</div>}
                        <div className={`flex-1 truncate ${status === 'past' ? c('text-gray-500', 'text-gray-400') : ''}`}>{b.name}</div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditItem(b); setModal('birthday'); }} className={`p-1 rounded ${c('hover:bg-gray-600', 'hover:bg-gray-200')}`}><Edit size={12}/></button><button onClick={() => setDeleteConfirm({ type: 'birthday', id: b.id, name: b.name })} className={`p-1 rounded ${c('hover:bg-gray-600', 'hover:bg-gray-200')}`}><Trash2 size={12} className="text-red-400"/></button></div>
                      </div>); })}
                  </div>
                </div>
              ))}</div>
            </div>
          </div>
        ) : (
          <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${c('border-gray-700', 'border-gray-300')}`}>
            <Cake size={48} className={`mx-auto mb-4 ${c('text-gray-600', 'text-gray-400')}`}/>
            <p className={`text-xl font-medium ${c('text-gray-400', 'text-gray-500')}`}>No birthdays yet</p>
            <p className={`text-sm mt-1 mb-6 ${c('text-gray-500', 'text-gray-400')}`}>Start building your team's birthday calendar</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setModal('importBirthdays')} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold"><Upload size={18}/>Import Excel</button>
              <button onClick={() => { setEditItem(null); setModal('birthday'); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold"><Plus size={18}/>Add Manually</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Reports = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Monthly Report</h1>
        <div className="flex gap-2"><MonthSelector/><button onClick={() => setShowPrintReport(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-violet-500/25"><Download size={18}/>Export</button></div>
      </div>
      <div className={`p-8 rounded-3xl border ${c('border-gray-700/50 bg-gray-800/50', 'border-gray-200 bg-white')}`}>
        <div className="text-center mb-8"><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium mb-4"><Award size={16}/>Official Report</div><h2 className="text-2xl font-bold">OPS Department Report</h2><p className={c('text-gray-400', 'text-gray-500')}>{MONTHS[selectedMonth]} {selectedYear}</p></div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">{[{ v: `${spentUSD.toFixed(0)}`, l: 'Total Spent', s: `of ${budgetUSD}`, g: 'from-violet-500 to-purple-600' }, { v: completed.length, l: 'Events', s: `${upcoming.length} upcoming`, g: 'from-cyan-500 to-blue-600' }, { v: attendees, l: 'Attendees', s: `${costPerPerson} RON avg`, g: 'from-pink-500 to-rose-600' }].map(x => <div key={x.l} className={`text-center p-6 rounded-2xl ${c('bg-gray-900/50', 'bg-gray-50')}`}><p className={`text-4xl font-bold bg-gradient-to-r ${x.g} bg-clip-text text-transparent`}>{x.v}</p><p className={c('text-gray-400', 'text-gray-500')}>{x.l}</p><p className={`text-sm ${c('text-gray-500', 'text-gray-400')}`}>{x.s}</p></div>)}</div>
        <div><h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Sparkles size={18} className="text-amber-400"/>Highlights</h3><ul className={`space-y-3 ${c('text-gray-300', 'text-gray-600')}`}>{[`Organized ${events.filter(e => e.type === 'TGIT').length} TGIT happy hours`, `Celebrated ${events.filter(e => e.type === 'Birthday').length} employee birthdays`, `${lowStock.length > 0 ? `${lowStock.length} inventory items need restocking` : 'All inventory items well-stocked'}`, `Cost efficiency: ${costPerPerson} RON per attendee`].map((h, i) => <li key={i} className={`flex items-start gap-3 p-3 rounded-xl ${c('bg-gray-900/30', 'bg-gray-50')}`}><span className="text-amber-400">✦</span><span>{h}</span></li>)}</ul></div>
      </div>
    </div>
  );

const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Bogdan Seretean', email: 'bogdan.seretean@alchemy.com', role: 'Admin', initials: 'BS' }
  ]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);// Profile state
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;
      try {
        const { data, error } = await supabase.from('ops_profiles').select('*').eq('id', session.user.id).single();
        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist yet, create it
          const { data: newProfile } = await supabase.from('ops_profiles').insert({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email,
            email: session.user.email,
            avatar_url: session.user.user_metadata?.avatar_url || '',
            role: 'Admin'
          }).select().single();
          setProfile(newProfile);
        } else if (data) {
          setProfile(data);
        }
      } catch (err) { console.error('Profile load error:', err); }
      setProfileLoading(false);
    };
    loadProfile();
  }, [session]);

  const updateProfile = async (updates) => {
    if (!profile) return;
    try {
      const { data, error } = await supabase.from('ops_profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', profile.id).select().single();
      if (!error && data) setProfile(data);
    } catch (err) { console.error('Profile update error:', err); }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const avatarOptions = [
    { id: 'purple-star', emoji: '⭐', bg: 'from-violet-500 to-purple-600' },
    { id: 'blue-rocket', emoji: '🚀', bg: 'from-blue-500 to-cyan-600' },
    { id: 'pink-heart', emoji: '💖', bg: 'from-pink-500 to-rose-600' },
    { id: 'green-leaf', emoji: '🌿', bg: 'from-emerald-500 to-teal-600' },
    { id: 'orange-fire', emoji: '🔥', bg: 'from-amber-500 to-orange-600' },
    { id: 'red-gem', emoji: '💎', bg: 'from-red-500 to-pink-600' },
    { id: 'teal-wave', emoji: '🌊', bg: 'from-teal-500 to-cyan-600' },
    { id: 'yellow-sun', emoji: '☀️', bg: 'from-yellow-400 to-amber-500' },
    { id: 'indigo-moon', emoji: '🌙', bg: 'from-indigo-500 to-violet-600' },
    { id: 'lime-bolt', emoji: '⚡', bg: 'from-lime-500 to-green-600' },
    { id: 'rose-music', emoji: '🎵', bg: 'from-rose-500 to-fuchsia-600' },
    { id: 'sky-cloud', emoji: '☁️', bg: 'from-sky-400 to-blue-500' },
  ];

  const getAvatarById = (id) => avatarOptions.find(a => a.id === id);

  const AvatarDisplay = ({ avatarId, name, size = 'md' }) => {
    const avatar = getAvatarById(avatarId);
    const sizes = { sm: 'w-7 h-7 text-sm', md: 'w-12 h-12 text-xl', lg: 'w-16 h-16 text-3xl' };
    if (avatar) {
      return (
        <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${avatar.bg} flex items-center justify-center shadow-lg animate-pulse-slow`}>
          <span className={size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-lg'}>{avatar.emoji}</span>
        </div>
      );
    }
    return (
      <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg`}>
        {name?.charAt(0) || '?'}
      </div>
    );
  };const Profile = () => {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [prefs, setPrefs] = useState({
      notify_changes: profile?.notify_changes || false,
      notify_birthdays: profile?.notify_birthdays || false,
      notify_birthdays_days: profile?.notify_birthdays_days || 3,
      notify_low_stock: profile?.notify_low_stock || false,
      notify_budget: profile?.notify_budget || false,
      notify_budget_threshold: profile?.notify_budget_threshold || 80,
    });

    const savePrefs = async () => {
      setSaving(true);
      await updateProfile(prefs);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    };

    const Toggle = ({ label, desc, checked, onChange }) => (
      <div className={`flex items-center justify-between p-4 rounded-xl ${c('bg-gray-800/50', 'bg-gray-50')}`}>
        <div className="flex-1 mr-4">
          <p className="font-medium">{label}</p>
          <p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{desc}</p>
        </div>
        <button onClick={() => onChange(!checked)} className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-violet-500' : c('bg-gray-700', 'bg-gray-300')}`}>
          <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    );

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">My Profile</h1>

{/* Profile Card */}
        <div className={`p-6 rounded-2xl border ${c('border-gray-700/50 bg-gray-800/50', 'border-gray-200 bg-white')}`}>
          <div className="flex items-center gap-5">
            <AvatarDisplay avatarId={profile?.avatar_url} name={profile?.name} size="lg" />
            <div className="flex-1">
              <p className="text-xl font-bold">{profile?.name}</p>
              <p className={c('text-gray-400', 'text-gray-500')}>{profile?.email}</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                profile?.role === 'Admin' ? 'bg-violet-500/20 text-violet-400' :
                profile?.role === 'Editor' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>{profile?.role || 'Viewer'}</span>
            </div>
            <button onClick={signOut} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${c('bg-gray-700 hover:bg-gray-600 text-gray-300', 'bg-gray-100 hover:bg-gray-200 text-gray-600')}`}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Avatar Picker */}
        <div className={`p-6 rounded-2xl border ${c('border-gray-700/50 bg-gray-800/50', 'border-gray-200 bg-white')}`}>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={18} className="text-violet-400" />
            <h3 className="font-semibold">Choose Your Avatar</h3>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-3">
            {avatarOptions.map(a => (
              <button
                key={a.id}
                onClick={() => updateProfile({ avatar_url: a.id })}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.bg} flex items-center justify-center text-lg transition-all hover:scale-110 ${
                  profile?.avatar_url === a.id ? 'ring-3 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className={`p-6 rounded-2xl border ${c('border-gray-700/50 bg-gray-800/50', 'border-gray-200 bg-white')}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email Notifications</h3>
              <p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>Choose what you want to be notified about</p>
            </div>
          </div>

          <div className="space-y-3">
            <Toggle
              label="All Changes"
              desc="Get notified when events, expenses, or inventory are added or modified"
              checked={prefs.notify_changes}
              onChange={v => setPrefs({ ...prefs, notify_changes: v })}
            />

            <Toggle
              label="Upcoming Birthdays"
              desc="Reminder before team member birthdays"
              checked={prefs.notify_birthdays}
              onChange={v => setPrefs({ ...prefs, notify_birthdays: v })}
            />
            {prefs.notify_birthdays && (
              <div className={`ml-4 p-4 rounded-xl border-l-4 border-pink-500 ${c('bg-pink-500/5', 'bg-pink-50')}`}>
                <label className="text-sm font-medium">Notify me this many days before:</label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="range" min="1" max="14" value={prefs.notify_birthdays_days}
                    onChange={e => setPrefs({ ...prefs, notify_birthdays_days: parseInt(e.target.value) })}
                    className="flex-1 accent-pink-500"
                  />
                  <span className="text-lg font-bold text-pink-400 w-12 text-center">{prefs.notify_birthdays_days}d</span>
                </div>
              </div>
            )}

            <Toggle
              label="Low Stock Alerts"
              desc="Get notified when inventory items fall below minimum"
              checked={prefs.notify_low_stock}
              onChange={v => setPrefs({ ...prefs, notify_low_stock: v })}
            />

            <Toggle
              label="Budget Warnings"
              desc="Get notified when monthly spending exceeds threshold"
              checked={prefs.notify_budget}
              onChange={v => setPrefs({ ...prefs, notify_budget: v })}
            />
            {prefs.notify_budget && (
              <div className={`ml-4 p-4 rounded-xl border-l-4 border-amber-500 ${c('bg-amber-500/5', 'bg-amber-50')}`}>
                <label className="text-sm font-medium">Alert when budget reaches:</label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="range" min="50" max="100" step="5" value={prefs.notify_budget_threshold}
                    onChange={e => setPrefs({ ...prefs, notify_budget_threshold: parseInt(e.target.value) })}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-lg font-bold text-amber-400 w-16 text-center">{prefs.notify_budget_threshold}%</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={savePrefs}
            disabled={saving}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : null}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    );
  };

  const TeamMemberModal = () => {
    const [f, sF] = useState(editingTeam || { name: '', email: '', role: 'Viewer', initials: '' });
    const save = () => {
      if (!f.name) return;
      const initials = f.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const member = { ...f, initials };
      if (editingTeam) {
        setTeamMembers(prev => prev.map(m => m.id === editingTeam.id ? { ...member, id: editingTeam.id } : m));
      } else {
        setTeamMembers(prev => [...prev, { ...member, id: Date.now() }]);
      }
      setShowTeamModal(false);
      setEditingTeam(null);
    };
    return <Modal title={editingTeam ? 'Edit Member' : 'Add Team Member'} onClose={() => { setShowTeamModal(false); setEditingTeam(null); }}>
      <div className="space-y-4">
        <Input label="Full Name" value={f.name} onChange={e => sF({ ...f, name: e.target.value })} placeholder="e.g., Maria Popescu" />
        <Input label="Email" value={f.email} onChange={e => sF({ ...f, email: e.target.value })} placeholder="e.g., maria@alchemy.com" />
        <Sel label="Role" value={f.role} onChange={e => sF({ ...f, role: e.target.value })} opts={['Admin', 'Editor', 'Viewer']} />
        <div className={`p-3 rounded-xl text-sm ${c('bg-gray-800', 'bg-gray-100')}`}>
          <p className="font-medium mb-1">Role permissions:</p>
          <div className={`space-y-1 text-xs ${c('text-gray-400', 'text-gray-500')}`}>
            <p><strong className="text-violet-400">Admin</strong> — Full access, manage team & settings</p>
            <p><strong className="text-cyan-400">Editor</strong> — Add/edit events, expenses, inventory</p>
            <p><strong className="text-emerald-400">Viewer</strong> — View dashboard & reports only</p>
          </div>
        </div>
        <button onClick={save} disabled={!f.name} className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 disabled:opacity-50">
          {editingTeam ? 'Update' : 'Add'} Member
        </button>
      </div>
    </Modal>;
  };

  const Team = () => {
    const roleColors = {
      Admin: 'bg-violet-500/20 text-violet-400',
      Editor: 'bg-cyan-500/20 text-cyan-400',
      Viewer: 'bg-emerald-500/20 text-emerald-400'
    };
    const gradients = [
      'from-violet-500 to-purple-600',
      'from-cyan-500 to-blue-600',
      'from-pink-500 to-rose-600',
      'from-amber-500 to-orange-600',
      'from-emerald-500 to-teal-600',
    ];
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Team</h1>
          <button onClick={() => { setEditingTeam(null); setShowTeamModal(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-violet-500/25">
            <Plus size={18} />Add Member
          </button>
        </div>
        <div className={`p-5 rounded-2xl border ${c('border-gray-700/50 bg-gray-800/50', 'border-gray-200 bg-white')}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Team Members</h3>
            <span className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}</span>
          </div>
          <div className="space-y-3">
            {teamMembers.map((m, idx) => (
              <div key={m.id} className={`flex items-center justify-between p-4 rounded-xl ${c('bg-gray-900/50 hover:bg-gray-900/70', 'bg-gray-50 hover:bg-gray-100')} transition-colors`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {m.initials || m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{m.name} {idx === 0 && <span className={`text-xs ${c('text-gray-500', 'text-gray-400')}`}>(You)</span>}</p>
                    <p className={`text-sm ${c('text-gray-400', 'text-gray-500')}`}>{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${roleColors[m.role] || roleColors.Viewer}`}>{m.role}</span>
                  <button onClick={() => { setEditingTeam(m); setShowTeamModal(true); }} className={`p-2 rounded-xl ${c('hover:bg-gray-700', 'hover:bg-gray-200')}`}>
                    <Edit size={16} className={c('text-gray-400', 'text-gray-500')} />
                  </button>
                  {idx !== 0 && (
                    <button onClick={() => setTeamMembers(prev => prev.filter(x => x.id !== m.id))} className={`p-2 rounded-xl ${c('hover:bg-gray-700', 'hover:bg-gray-200')}`}>
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─── MAIN RETURN ───
  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-violet-500 mx-auto mb-4"/>
            <p className={c('text-gray-400', 'text-gray-500')}>Loading OPS Hub...</p>
          </div>
        </div>
      ) : (
      <div className="flex">
        <div className={`w-72 min-h-screen p-5 flex-col hidden md:flex border-r ${c('bg-gray-900/50 border-gray-800', 'bg-white border-gray-200')}`}>
          <div className="flex items-center gap-3 px-4 py-4 mb-6 rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20"><div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30"><Sparkles className="text-white" size={22}/></div><div><h1 className="font-bold text-lg">OPS Hub</h1><p className={`text-xs ${c('text-gray-400', 'text-gray-500')}`}>Alchemy Bucharest</p></div></div>
          <nav className="space-y-2 flex-1">
            <Nav icon={Home} label="Dashboard" t="dashboard"/>
            <Nav icon={Calendar} label="Events" t="events"/>
            <Nav icon={DollarSign} label="Expenses" t="expenses"/>
            <Nav icon={Package} label="Inventory" t="inventory" badge={lowStock.length}/>
            <Nav icon={Star} label="Vendors" t="vendors"/>
            <Nav icon={Cake} label="Birthdays" t="birthdays"/>
            <Nav icon={FileText} label="Reports" t="reports"/>
            <Nav icon={UserCog} label="Team" t="team"/><Nav icon={Users} label="My Profile" t="profile"/>
          </nav>
          <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${c('text-gray-400 hover:bg-white/5', 'text-gray-600 hover:bg-gray-100')}`}>
<AvatarDisplay avatarId={profile?.avatar_url} name={profile?.name} size="sm" />  <span className="text-sm truncate">{profile?.name || 'Profile'}</span>
</button><button onClick={() => setDark(!dark)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${c('text-gray-400 hover:bg-white/5', 'text-gray-600 hover:bg-gray-100')}`}>{dark ? <Sun size={20}/> : <Moon size={20}/>}{dark ? 'Light' : 'Dark'} Mode</button>
          <div className={`flex items-center gap-2 px-4 py-2 mt-2 rounded-xl text-xs ${syncError ? 'text-red-400' : 'text-emerald-400'}`}>
            {syncError ? <CloudOff size={14}/> : <Cloud size={14}/>}
            {syncError || 'Synced'}
          </div>
        </div>
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="md:hidden flex gap-2 mb-4 overflow-x-auto pb-2">{[{ i: Home, t: 'dashboard' }, { i: Calendar, t: 'events' }, { i: DollarSign, t: 'expenses' }, { i: Package, t: 'inventory' }, { i: Star, t: 'vendors' }, { i: Cake, t: 'birthdays' }, { i: FileText, t: 'reports' }].map(({ i: I, t }) => <button key={t} onClick={() => setTab(t)} className={`p-3 rounded-xl ${tab === t ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' : c('bg-gray-800 text-gray-400', 'bg-white text-gray-600')}`}><I size={20}/></button>)}</div>
          {tab === 'dashboard' && <Dashboard/>}
          {tab === 'events' && <Events/>}
          {tab === 'expenses' && <Expenses/>}
          {tab === 'inventory' && <Inventory/>}
          {tab === 'vendors' && <Vendors/>}
          {tab === 'birthdays' && <Birthdays/>}
          {tab === 'reports' && <Reports/>}
          {tab === 'team' && <Team/>}{tab === 'profile' && <Profile/>}
        </div>
      </div>
      )}
      {modal === 'expense' && <ExpenseModal/>}
      {modal === 'event' && <EventModal/>}
      {modal === 'complete' && <CompleteModal/>}
      {modal === 'converter' && <ConverterModal/>}
      {modal === 'vendor' && <VendorModal/>}
      {modal === 'inventory' && <InventoryModal/>}
      {modal === 'birthday' && <BirthdayModal/>}
{modal === 'importBirthdays' && <ImportBirthdaysModal/>}
      {deleteConfirm && <DeleteModal/>}
      {showTeamModal && <TeamMemberModal/>}
      {showPrintReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPrintReport(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
              <p className="text-gray-600 text-sm">Screenshot to save as image</p>
              <button onClick={() => setShowPrintReport(false)} className="p-2.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-xl text-gray-600 transition-colors">
                <X size={22}/>
              </button>
            </div>
            <div className="p-8 text-gray-800">
              <div className="text-center mb-8 pb-6 border-b-2 border-violet-500"><h1 className="text-3xl font-bold text-violet-600">OPS Department Report</h1><p className="text-gray-500 mt-2">Alchemy Bucharest • {MONTHS[selectedMonth]} {selectedYear}</p></div>
              <div className="grid grid-cols-3 gap-4 mb-8"><div className="text-center p-5 bg-gray-50 rounded-xl"><p className="text-3xl font-bold text-violet-600">${spentUSD.toFixed(0)}</p><p className="text-gray-600">Total Spent</p></div><div className="text-center p-5 bg-gray-50 rounded-xl"><p className="text-3xl font-bold text-violet-600">{completed.length}</p><p className="text-gray-600">Events</p></div><div className="text-center p-5 bg-gray-50 rounded-xl"><p className="text-3xl font-bold text-violet-600">{attendees}</p><p className="text-gray-600">Attendees</p></div></div>
              <div className="mb-6"><h2 className="text-lg font-semibold mb-3">Events</h2><table className="w-full text-sm"><thead><tr className="bg-gray-100"><th className="text-left p-3">Event</th><th className="text-left p-3">Date</th><th className="text-right p-3">Budget</th><th className="text-right p-3">Actual</th></tr></thead><tbody>{events.map(e => <tr key={e.id} className="border-b"><td className="p-3">{e.name}</td><td className="p-3">{new Date(e.date).toLocaleDateString()}</td><td className="p-3 text-right">{e.budget} RON</td><td className="p-3 text-right">{e.actual || '-'}</td></tr>)}</tbody></table></div>
              <div className="pt-4 border-t text-center text-gray-400 text-sm">Generated {new Date().toLocaleDateString()} • OPS Hub</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}