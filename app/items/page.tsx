"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Tv, Pencil, Trash2, MapPin, DollarSign, Calendar, Shield, ShieldCheck, ShieldAlert, Wrench, ArrowRight,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  LOCATIONS, formatCurrency, formatDate, getToday, getDaysUntil, getProfileById,
} from "../lib/constants";
import Header from "../components/Header";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import BottomNav from "../components/BottomNav";
import type { HomeItem } from "../lib/types";

export default function ItemsPage() {
  const { selectedProfile } = useProfile();
  const router = useRouter();
  const { data, addHomeItem, updateHomeItem, deleteHomeItem } = useDataStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomeItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const groupedByLocation = useMemo(() => {
    const groups = new Map<string, HomeItem[]>();
    data.homeItems.forEach((item) => {
      const list = groups.get(item.location) || [];
      list.push(item);
      groups.set(item.location, list);
    });
    return Array.from(groups.entries())
      .map(([location, items]) => ({ location, items }))
      .sort((a, b) => a.location.localeCompare(b.location));
  }, [data.homeItems]);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header
        title="Home Items & Appliances"
        subtitle={`${data.homeItems.length} items tracked`}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-9 h-9 rounded-xl bg-olive text-cream flex items-center justify-center hover:bg-olive-light transition-colors"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="max-w-md mx-auto px-5 space-y-6 pt-4">
        {data.homeItems.length === 0 ? (
          <EmptyState
            icon={Tv}
            title="No items yet"
            description="Track your appliances, furniture, and important home items."
            action={{ label: "Add Item", onClick: () => setIsAddOpen(true) }}
          />
        ) : (
          <div className="space-y-5 stagger-children">
            {groupedByLocation.map((group) => (
              <div key={group.location}>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-navy-muted" />
                  <h2 className="text-sm font-semibold text-navy uppercase tracking-wider">{group.location}</h2>
                  <span className="text-xs text-navy-muted">({group.items.length})</span>
                </div>
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const warrantyDays = item.warrantyEndDate ? getDaysUntil(item.warrantyEndDate) : null;
                    const isUnderWarranty = warrantyDays !== null && warrantyDays > 0;
                    const isExpired = warrantyDays !== null && warrantyDays <= 0;
                    const relatedRepairs = data.repairs.filter((r) => r.relatedHomeItemId === item.id);
                    return (
                      <div
                        key={item.id}
                        className="bg-cream rounded-2xl border border-warm-gray/60 p-4 space-y-2"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-olive/15 flex items-center justify-center shrink-0">
                            <Tv size={18} className="text-olive" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-navy">{item.name}</p>
                              {isUnderWarranty && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage/15 text-sage font-medium flex items-center gap-1">
                                  <ShieldCheck size={10} /> {warrantyDays}d left
                                </span>
                              )}
                              {isExpired && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose/15 text-rose font-medium flex items-center gap-1">
                                  <ShieldAlert size={10} /> Expired
                                </span>
                              )}
                              {!item.warrantyEndDate && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm-gray text-navy-muted font-medium">
                                  No Warranty
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-navy-muted">
                              {item.brand && `${item.brand} `}{item.model && `· ${item.model}`}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="w-7 h-7 rounded-lg bg-warm-gray/50 flex items-center justify-center hover:bg-warm-gray transition-colors"
                            >
                              <Pencil size={12} className="text-navy-muted" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(item.id)}
                              className="w-7 h-7 rounded-lg bg-rose/10 flex items-center justify-center hover:bg-rose/20 transition-colors"
                            >
                              <Trash2 size={12} className="text-rose" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-navy-muted">
                          {item.purchasePrice && (
                            <span className="flex items-center gap-1">
                              <DollarSign size={10} />
                              {formatCurrency(item.purchasePrice)}
                            </span>
                          )}
                          {item.purchaseDate && (
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {formatDate(item.purchaseDate)}
                            </span>
                          )}
                          {item.totalRepairCost > 0 && (
                            <span className="flex items-center gap-1 text-rose">
                              <Wrench size={10} />
                              {formatCurrency(item.totalRepairCost)} repairs
                            </span>
                          )}
                        </div>

                        {relatedRepairs.length > 0 && (
                          <div className="pt-2 border-t border-warm-gray/40">
                            <p className="text-xs text-navy-muted mb-1">{relatedRepairs.length} repair history:</p>
                            <div className="flex flex-wrap gap-1">
                              {relatedRepairs.slice(0, 3).map((r) => (
                                <span key={r.id} className="text-[10px] px-2 py-0.5 rounded-full bg-warm-gray text-navy-muted">
                                  {r.itemName}
                                </span>
                              ))}
                              {relatedRepairs.length > 3 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm-gray text-navy-muted">
                                  +{relatedRepairs.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />

      <ItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(item) => { addHomeItem(item, selectedProfile); setIsAddOpen(false); }}
        title="Add Home Item"
      />

      {editingItem && (
        <ItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(item) => { updateHomeItem(editingItem.id, item); setEditingItem(null); }}
          defaultValues={editingItem}
          title="Edit Item"
        />
      )}

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Item?">
        <p className="text-sm text-navy-muted mb-4">Are you sure you want to delete this item?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors">Cancel</button>
          <button onClick={() => { if (deleteConfirm) deleteHomeItem(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<HomeItem, "id" | "createdAt" | "totalRepairCost">) => void;
  defaultValues?: HomeItem | null;
  title: string;
}

function ItemModal({ isOpen, onClose, onSubmit, defaultValues, title }: ItemModalProps) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [brand, setBrand] = useState(defaultValues?.brand || "");
  const [model, setModel] = useState(defaultValues?.model || "");
  const [location, setLocation] = useState(defaultValues?.location || LOCATIONS[0]);
  const [purchaseDate, setPurchaseDate] = useState(defaultValues?.purchaseDate || "");
  const [purchasePrice, setPurchasePrice] = useState(defaultValues?.purchasePrice ? String(defaultValues.purchasePrice) : "");
  const [warrantyEndDate, setWarrantyEndDate] = useState(defaultValues?.warrantyEndDate || "");
  const [notes, setNotes] = useState(defaultValues?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;
    onSubmit({
      name,
      brand: brand || undefined,
      model: model || undefined,
      location,
      purchaseDate: purchaseDate || undefined,
      purchasePrice: purchasePrice ? Number(purchasePrice) : undefined,
      warrantyEndDate: warrantyEndDate || undefined,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Item Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Samsung Fridge" required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Brand</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Optional" className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Model</label>
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Optional" className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Purchase Price</label>
            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" step="0.01" min="0" className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Purchase Date</label>
            <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Warranty Until</label>
            <input type="date" value={warrantyEndDate} onChange={(e) => setWarrantyEndDate(e.target.value)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Serial number, store, warranty info..." rows={2} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30 resize-none" />
        </div>
        <button type="submit" className="w-full py-3.5 rounded-xl bg-olive text-cream font-semibold hover:bg-olive-light transition-colors">{title}</button>
      </form>
    </Modal>
  );
}
