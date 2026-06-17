"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, ShoppingCart, CheckCircle2, Pencil, Trash2, Apple, Carrot, Beef, Sparkles, Bath, ChefHat, Pill, Wrench, Cog, MoreHorizontal,
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { useDataStore } from "../hooks/useDataStore";
import {
  PROFILES, SHOPPING_CATEGORIES, formatCurrency, formatDate, getToday, getProfileById, generateId,
} from "../lib/constants";
import Header from "../components/Header";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import BottomNav from "../components/BottomNav";
import type { ShoppingItem, ShoppingCategory, ProfileId } from "../lib/types";

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  food: <Apple size={16} />,
  "vegetables-fruits": <Carrot size={16} />,
  "meat-chicken-fish": <Beef size={16} />,
  "cleaning-supplies": <Sparkles size={16} />,
  bathroom: <Bath size={16} />,
  kitchen: <ChefHat size={16} />,
  pharmacy: <Pill size={16} />,
  "home-tools": <Wrench size={16} />,
  "spare-parts": <Cog size={16} />,
  other: <MoreHorizontal size={16} />,
};

type ShoppingTab = "all" | "needed" | "bought" | "mine";

export default function ShoppingPage() {
  const { selectedProfile } = useProfile();
  const router = useRouter();
  const { data, addShoppingItem, updateShoppingItem, deleteShoppingItem, markShoppingBought, addExpense } = useDataStore();

  const [activeTab, setActiveTab] = useState<ShoppingTab>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [boughtItem, setBoughtItem] = useState<ShoppingItem | null>(null);

  const tabs = useMemo(() => {
    const all = data.shoppingItems;
    const needed = all.filter((i) => !i.bought);
    const bought = all.filter((i) => i.bought);
    const mine = all.filter((i) => i.assignedBuyer === selectedProfile && !i.bought);
    return [
      { value: "all" as ShoppingTab, label: "All", count: all.length },
      { value: "needed" as ShoppingTab, label: "Needed", count: needed.length },
      { value: "bought" as ShoppingTab, label: "Bought", count: bought.length },
      { value: "mine" as ShoppingTab, label: "My Items", count: mine.length },
    ];
  }, [data.shoppingItems, selectedProfile]);

  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case "needed":
        return data.shoppingItems.filter((i) => !i.bought);
      case "bought":
        return data.shoppingItems.filter((i) => i.bought);
      case "mine":
        return data.shoppingItems.filter((i) => i.assignedBuyer === selectedProfile && !i.bought);
      default:
        return data.shoppingItems;
    }
  }, [data.shoppingItems, activeTab, selectedProfile]);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, ShoppingItem[]>();
    filteredItems.forEach((item) => {
      const list = groups.get(item.category) || [];
      list.push(item);
      groups.set(item.category, list);
    });
    return Array.from(groups.entries()).map(([category, items]) => ({
      category,
      categoryInfo: SHOPPING_CATEGORIES.find((c) => c.id === category),
      items,
    }));
  }, [filteredItems]);

  const totalEstimated = filteredItems.reduce((s, i) => s + (i.estimatedPrice || 0), 0);

  if (!selectedProfile) {
    router.push("/");
    return null;
  }

  const handleMarkBought = (item: ShoppingItem) => {
    if (item.estimatedPrice && item.estimatedPrice > 0) {
      setBoughtItem(item);
    } else {
      markShoppingBought(item.id, selectedProfile);
    }
  };

  const handleConvertToExpense = (item: ShoppingItem) => {
    markShoppingBought(item.id, selectedProfile);
    addExpense({
      amount: item.estimatedPrice || 0,
      categoryId: item.category === "food" || item.category === "vegetables-fruits" || item.category === "meat-chicken-fish" ? "groceries" : "home-supplies",
      description: `Shopping: ${item.name}`,
      date: getToday(),
      paidBy: selectedProfile,
      paymentMethod: "Cash",
      notes: `Bought from shopping list. Quantity: ${item.quantity}`,
    }, selectedProfile);
    setBoughtItem(null);
  };

  return (
    <div className="min-h-full bg-linen pb-24">
      <Header
        title="Shopping List"
        subtitle={totalEstimated > 0 ? `Estimated: ${formatCurrency(totalEstimated)}` : "Track what you need to buy"}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-9 h-9 rounded-xl bg-olive text-cream flex items-center justify-center hover:bg-olive-light transition-colors"
          >
            <Plus size={18} />
          </button>
        }
      />

      <div className="max-w-md mx-auto px-5 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pt-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === tab.value
                  ? "bg-olive text-cream shadow-sm"
                  : "bg-cream text-navy-muted border border-warm-gray/60 hover:bg-cream-dark"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.value ? "bg-cream/20 text-cream" : "bg-warm-gray text-navy-muted"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Shopping List */}
        <section>
          {groupedByCategory.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title={`No ${activeTab} items`}
              description="Add items to your shopping list so nothing is forgotten."
              action={activeTab !== "bought" ? { label: "Add Item", onClick: () => setIsAddOpen(true) } : undefined}
            />
          ) : (
            <div className="space-y-5 stagger-children">
              {groupedByCategory.map((group) => (
                <div key={group.category}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-warm-gray flex items-center justify-center">
                      {CATEGORY_ICON_MAP[group.category] || <MoreHorizontal size={14} />}
                    </div>
                    <h3 className="text-sm font-semibold text-navy">{group.categoryInfo?.name || group.category}</h3>
                    <span className="text-xs text-navy-muted">({group.items.length})</span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const buyer = item.assignedBuyer ? getProfileById(item.assignedBuyer) : null;
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-3 bg-cream rounded-xl border ${
                            item.bought ? "border-warm-gray/40 opacity-60" : "border-warm-gray/60"
                          }`}
                        >
                          {!item.bought && (
                            <button
                              onClick={() => handleMarkBought(item)}
                              className="w-6 h-6 rounded-full border-2 border-warm-gray flex items-center justify-center shrink-0 hover:border-olive transition-colors"
                            >
                              <CheckCircle2 size={14} className="text-olive opacity-0 hover:opacity-100" />
                            </button>
                          )}
                          {item.bought && (
                            <div className="w-6 h-6 rounded-full bg-sage flex items-center justify-center shrink-0">
                              <CheckCircle2 size={14} className="text-cream" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${item.bought ? "text-navy-muted line-through" : "text-navy"}`}>
                              {item.name}
                            </p>
                            <p className="text-xs text-navy-muted">
                              {item.quantity}
                              {item.estimatedPrice && ` · ${formatCurrency(item.estimatedPrice)}`}
                              {buyer && <span style={{ color: buyer.color }}> · {buyer.name}</span>}
                              {item.neededByDate && ` · Need by ${formatDate(item.neededByDate)}`}
                            </p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            {!item.bought && (
                              <button
                                onClick={() => setEditingItem(item)}
                                className="w-7 h-7 rounded-lg bg-warm-gray/50 flex items-center justify-center hover:bg-warm-gray transition-colors"
                              >
                                <Pencil size={12} className="text-navy-muted" />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirm(item.id)}
                              className="w-7 h-7 rounded-lg bg-rose/10 flex items-center justify-center hover:bg-rose/20 transition-colors"
                            >
                              <Trash2 size={12} className="text-rose" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />

      {/* Add Item Modal */}
      <ShoppingModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(item) => { addShoppingItem(item, selectedProfile); setIsAddOpen(false); }}
        defaultBuyer={selectedProfile}
        title="Add Shopping Item"
      />

      {/* Edit Item Modal */}
      {editingItem && (
        <ShoppingModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(item) => { updateShoppingItem(editingItem.id, item); setEditingItem(null); }}
          defaultValues={editingItem}
          title="Edit Item"
        />
      )}

      {/* Convert to Expense Modal */}
      {boughtItem && (
        <Modal isOpen={!!boughtItem} onClose={() => setBoughtItem(null)} title="Item Bought">
          <div className="space-y-4">
            <div className="bg-cream rounded-xl border border-warm-gray/60 p-4">
              <p className="text-sm font-semibold text-navy">{boughtItem.name}</p>
              <p className="text-lg font-bold text-navy mt-1">{formatCurrency(boughtItem.estimatedPrice || 0)}</p>
              <p className="text-xs text-navy-muted">Quantity: {boughtItem.quantity}</p>
            </div>
            <p className="text-sm text-navy-muted">Would you like to convert this into an expense?</p>
            <div className="flex gap-3">
              <button
                onClick={() => { markShoppingBought(boughtItem.id, selectedProfile); setBoughtItem(null); }}
                className="flex-1 py-3 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors"
              >
                Just Mark Bought
              </button>
              <button
                onClick={() => handleConvertToExpense(boughtItem)}
                className="flex-1 py-3 rounded-xl bg-olive text-cream font-medium hover:bg-olive-light transition-colors"
              >
                Add as Expense
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Item?">
        <p className="text-sm text-navy-muted mb-4">Are you sure you want to remove this item?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl bg-cream border border-warm-gray/60 text-navy font-medium hover:bg-cream-dark transition-colors">Cancel</button>
          <button onClick={() => { if (deleteConfirm) deleteShoppingItem(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-3 rounded-xl bg-rose text-cream font-medium hover:bg-rose-light transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

interface ShoppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<ShoppingItem, "id" | "createdAt" | "bought">) => void;
  defaultValues?: ShoppingItem | null;
  defaultBuyer?: ProfileId;
  title: string;
}

function ShoppingModal({ isOpen, onClose, onSubmit, defaultValues, defaultBuyer, title }: ShoppingModalProps) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [quantity, setQuantity] = useState(defaultValues?.quantity || "1");
  const [estimatedPrice, setEstimatedPrice] = useState(defaultValues?.estimatedPrice ? String(defaultValues.estimatedPrice) : "");
  const [category, setCategory] = useState<ShoppingCategory>(defaultValues?.category || "other");
  const [assignedBuyer, setAssignedBuyer] = useState<ProfileId>(defaultValues?.assignedBuyer || defaultBuyer || "moustafa");
  const [neededByDate, setNeededByDate] = useState(defaultValues?.neededByDate || getToday());
  const [notes, setNotes] = useState(defaultValues?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit({
      name,
      quantity,
      estimatedPrice: estimatedPrice ? Number(estimatedPrice) : undefined,
      category,
      assignedBuyer,
      neededByDate,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Item Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Milk" required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Quantity</label>
            <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 2 liters" required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Est. Price</label>
            <input type="number" value={estimatedPrice} onChange={(e) => setEstimatedPrice(e.target.value)} placeholder="0.00" step="0.01" min="0" className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as ShoppingCategory)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              {SHOPPING_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Buyer</label>
            <select value={assignedBuyer} onChange={(e) => setAssignedBuyer(e.target.value as ProfileId)} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30">
              {PROFILES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Needed By</label>
          <input type="date" value={neededByDate} onChange={(e) => setNeededByDate(e.target.value)} required className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30" />
        </div>
        <div>
          <label className="text-xs font-medium text-navy-muted uppercase tracking-wider mb-1 block">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Brand preference, store, etc." rows={2} className="w-full bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-olive/30 resize-none" />
        </div>
        <button type="submit" className="w-full py-3.5 rounded-xl bg-olive text-cream font-semibold hover:bg-olive-light transition-colors">{title}</button>
      </form>
    </Modal>
  );
}
