"use client";

import React, { createContext, useContext, useState } from "react";

export interface Visitor {
  id: string;
  in_time: string; // ISO string
  out_time: string | null;
  name: string;
  photo_url: string | null;
  mobile_number: string;
  whom_to_visit: string;
  purpose: string;
}

interface VisitorContextType {
  visitors: Visitor[];
  setVisitors: React.Dispatch<React.SetStateAction<Visitor[]>>;
  addVisitor: (v: Visitor) => void;
  markOutTime: (id: string) => void;
}

const initialVisitors: Visitor[] = [
  {
    id: "V-1001",
    in_time: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
    out_time: null,
    name: "Amit Sharma",
    photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    mobile_number: "+91 9876543210",
    whom_to_visit: "Rajesh Kumar (HR)",
    purpose: "Interview",
  },
  {
    id: "V-1002",
    in_time: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(),
    out_time: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
    name: "Suresh Delivery",
    photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh",
    mobile_number: "+91 9988776655",
    whom_to_visit: "Warehouse Manager",
    purpose: "Package Delivery",
  }
];

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);

  const addVisitor = (visitor: Visitor) => {
    setVisitors(prev => [visitor, ...prev]);
  };

  const markOutTime = (id: string) => {
    setVisitors(prev => prev.map(v => 
      v.id === id ? { ...v, out_time: new Date().toISOString() } : v
    ));
  };

  return (
    <VisitorContext.Provider value={{ visitors, setVisitors, addVisitor, markOutTime }}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitors() {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error("useVisitors must be used within a VisitorProvider");
  }
  return context;
}
