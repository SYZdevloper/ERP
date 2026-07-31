"use client";

import React, { createContext, useContext, useState } from "react";

export interface SparePartIssue {
  id: string;
  product_name: string;
  image_url: string | null;
  issue_to: string;
  issue_date: string;
  reason: string;
  machine_number: string;
  expected_receiving_date: string;
  quantity: number;
  status?: 'issued' | 'received';
  received_date?: string;
  received_quantity?: number;
}

export interface SparePartInventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  min_quantity: number;
}

interface SparePartsContextType {
  issues: SparePartIssue[];
  inventory: SparePartInventoryItem[];
  setIssues: React.Dispatch<React.SetStateAction<SparePartIssue[]>>;
  addIssue: (issue: SparePartIssue) => void;
  deleteIssue: (id: string) => void;
  updateIssue: (id: string, updates: Partial<SparePartIssue>) => void;
  addInventory: (item: SparePartInventoryItem) => void;
  updateInventory: (id: string, quantityDelta: number) => void;
}

const initialIssues: SparePartIssue[] = [
  {
    id: "SPI-001",
    product_name: "Juki DDL-8700 Hook Assembly",
    image_url: "https://images.unsplash.com/photo-1590725140246-2007e03ebcd4?q=80&w=200&auto=format&fit=crop", // Mock industrial gear
    issue_to: "Tech - Rajesh",
    issue_date: "2026-07-24",
    reason: "Routine replacement during monthly maintenance",
    machine_number: "SM-001",
    expected_receiving_date: "2026-07-25",
    quantity: 1,
    status: 'issued',
  },
  {
    id: "SPI-002",
    product_name: "Brother Bobbin Case",
    image_url: null,
    issue_to: "Tech - Kumar",
    issue_date: "2026-07-22",
    reason: "Damaged part due to thread jam",
    machine_number: "SM-002",
    expected_receiving_date: "2026-07-22",
    quantity: 3,
    status: 'issued',
  }
];

const initialInventory: SparePartInventoryItem[] = [
  { id: "INV-001", name: "Juki DDL-8700 Hook Assembly", category: "Mechanical", quantity: 10, min_quantity: 2 },
  { id: "INV-002", name: "Brother Bobbin Case", category: "Mechanical", quantity: 25, min_quantity: 5 },
  { id: "INV-003", name: "Needle Plate Set", category: "Mechanical", quantity: 15, min_quantity: 5 },
  { id: "INV-004", name: "Sewing Machine Motor Belt", category: "Electrical", quantity: 8, min_quantity: 3 },
];

const SparePartsContext = createContext<SparePartsContextType | undefined>(undefined);

export function SparePartsProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<SparePartIssue[]>(initialIssues);
  const [inventory, setInventory] = useState<SparePartInventoryItem[]>(initialInventory);

  const addIssue = (issue: SparePartIssue) => {
    setIssues(prev => [issue, ...prev]);
    // Also deduct from inventory
    setInventory(prev => prev.map(inv => inv.name === issue.product_name ? { ...inv, quantity: inv.quantity - issue.quantity } : inv));
  };

  const deleteIssue = (id: string) => {
    const issue = issues.find(i => i.id === id);
    if (issue) {
      // Revert inventory
      setInventory(prev => prev.map(inv => inv.name === issue.product_name ? { ...inv, quantity: inv.quantity + issue.quantity } : inv));
    }
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  const updateIssue = (id: string, updates: Partial<SparePartIssue>) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const addInventory = (item: SparePartInventoryItem) => {
    setInventory(prev => [item, ...prev]);
  };

  const updateInventory = (id: string, quantityDelta: number) => {
    setInventory(prev => prev.map(inv => inv.id === id ? { ...inv, quantity: inv.quantity + quantityDelta } : inv));
  };

  return (
    <SparePartsContext.Provider value={{ issues, inventory, setIssues, addIssue, deleteIssue, updateIssue, addInventory, updateInventory }}>
      {children}
    </SparePartsContext.Provider>
  );
}

export function useSpareParts() {
  const context = useContext(SparePartsContext);
  if (!context) {
    throw new Error("useSpareParts must be used within a SparePartsProvider");
  }
  return context;
}
