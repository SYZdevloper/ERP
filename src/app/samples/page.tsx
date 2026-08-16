"use client";

import React, { useState } from "react";
import { Search, Plus, Shirt, Package, Scissors, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockSamples } from "@/data/mock-samples";

export default function SamplesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredSamples = mockSamples.filter((sample) => 
    sample.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sample.article.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sample.currentHolder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sample Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">Track the lifecycle and current location of all samples.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Shirt className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-slate-500">Total Samples</span>
            <span className="text-2xl font-bold text-slate-800 leading-tight">{mockSamples.length}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">All tracked samples</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-slate-500">In Progress</span>
            <span className="text-2xl font-bold text-slate-800 leading-tight">
              {mockSamples.filter(s => s.status !== "Sample Complete" && s.status !== "Buyer Dispatch" && s.status !== "Sample Store").length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">Currently active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Scissors className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-slate-500">At Embroidery</span>
            <span className="text-2xl font-bold text-slate-800 leading-tight">
              {mockSamples.filter(s => s.status === "Embroidery Outward").length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">Outside job work</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-slate-500">Completed</span>
            <span className="text-2xl font-bold text-slate-800 leading-tight">
              {mockSamples.filter(s => s.status === "Sample Complete" || s.status === "Sample Store").length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">Ready for review</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 overflow-hidden">
        {/* Controls */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search samples, articles or holders..." 
              className="pl-9 h-9 bg-slate-50/50 border-slate-200 text-[13px] focus-visible:ring-[#0453B8]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/samples/create">
            <Button className="h-9 px-4 font-semibold shadow-md text-[13px] bg-[#0453B8] hover:bg-[#034294] text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Sample Requirement
            </Button>
          </Link>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white m-6 mt-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-4 font-bold text-slate-600">Sample ID</TableHead>
                  <TableHead className="px-4 font-bold text-slate-600">Article / Type</TableHead>
                  <TableHead className="px-4 font-bold text-slate-600">Fabric</TableHead>
                  <TableHead className="px-4 font-bold text-slate-600">Current Location</TableHead>
                  <TableHead className="px-4 font-bold text-slate-600">Holder</TableHead>
                  <TableHead className="px-4 font-bold text-slate-600">Last Update</TableHead>
                  <TableHead className="px-4 font-bold text-slate-600 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSamples.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-slate-500 font-medium">No samples found.</TableCell>
                  </TableRow>
                ) : (
                  filteredSamples.map(sample => (
                    <TableRow 
                      key={sample.id} 
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => router.push(`/samples/${sample.id}`)}
                    >
                      <TableCell className="px-4 py-3 font-bold text-[#0453B8]">{sample.id}</TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="font-bold text-slate-700">{sample.article}</div>
                        <div className="text-xs text-slate-500">{sample.sampleType}</div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="text-sm">{sample.fabric}</div>
                        <div className="text-xs text-slate-500">{sample.color}</div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-slate-800">{sample.currentLocation}</TableCell>
                      <TableCell className="px-4 py-3">{sample.currentHolder}</TableCell>
                      <TableCell className="px-4 py-3 text-sm text-slate-600">{sample.lastMovementDate}</TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {sample.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
