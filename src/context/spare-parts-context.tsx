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
}

interface SparePartsContextType {
  issues: SparePartIssue[];
  setIssues: React.Dispatch<React.SetStateAction<SparePartIssue[]>>;
  addIssue: (issue: SparePartIssue) => void;
  deleteIssue: (id: string) => void;
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
  }
];

const SparePartsContext = createContext<SparePartsContextType | undefined>(undefined);

export function SparePartsProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<SparePartIssue[]>(initialIssues);

  const addIssue = (issue: SparePartIssue) => {
    setIssues(prev => [issue, ...prev]);
  };

  const deleteIssue = (id: string) => {
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  return (
    <SparePartsContext.Provider value={{ issues, setIssues, addIssue, deleteIssue }}>
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
