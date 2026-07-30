"use client";

import React, { useState } from "react";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SampleMakingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockSamples = [
    { id: "SMP-001", style: "Winter Parka Prototype", fabricIssuedDate: "2026-07-27", issuedTo: "Ramesh (Production)", status: "Pending" },
    { id: "SMP-002", style: "Denim Jacket V2", fabricIssuedDate: "2026-07-25", issuedTo: "Suresh (Sampling)", status: "In Progress" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      <ListPageHeader 
        title="Sample Making Pending" 
        description="Track fabric issued for samples that are pending to be made." 
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden mt-6">
        <DataTableToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search samples..."
        />
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="font-bold text-slate-600">Sample ID</TableHead>
                <TableHead className="font-bold text-slate-600">Style / Name</TableHead>
                <TableHead className="font-bold text-slate-600">Issued On</TableHead>
                <TableHead className="font-bold text-slate-600">Issued To</TableHead>
                <TableHead className="font-bold text-slate-600 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSamples.map(sample => (
                <TableRow key={sample.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-800">{sample.id}</TableCell>
                  <TableCell className="font-bold text-slate-700">{sample.style}</TableCell>
                  <TableCell>{sample.fabricIssuedDate}</TableCell>
                  <TableCell>{sample.issuedTo}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={sample.status === "Pending" ? "outline" : "default"} className={sample.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"}>
                      {sample.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
