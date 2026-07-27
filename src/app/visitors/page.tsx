"use client";

import React, { useState } from "react";
import { useVisitors, Visitor } from "@/context/visitor-context";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, UserCircle2, Clock, LogOut, Camera } from "lucide-react";
import Image from "next/image";

export default function VisitorsPage() {
  const { visitors, addVisitor, markOutTime } = useVisitors();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    whom_to_visit: "",
    purpose: "",
    photo_url: "",
  });

  function resetForm() {
    setFormData({
      name: "",
      mobile_number: "",
      whom_to_visit: "",
      purpose: "",
      photo_url: "",
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newVisitor: Visitor = {
      id: `V-${Math.floor(Math.random() * 10000)}`,
      in_time: new Date().toISOString(),
      out_time: null,
      name: formData.name,
      photo_url: formData.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`,
      mobile_number: formData.mobile_number,
      whom_to_visit: formData.whom_to_visit,
      purpose: formData.purpose,
    };
    addVisitor(newVisitor);
    resetForm();
    setShowForm(false);
  }

  const filtered = visitors.filter((v) => {
    return (
      !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.whom_to_visit.toLowerCase().includes(search.toLowerCase()) ||
      v.mobile_number.includes(search)
    );
  });

  const activeCount = visitors.filter(v => !v.out_time).length;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visitor Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track incoming guests, vendors, and interviewees.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0453B8] flex items-center justify-center shrink-0">
            <UserCircle2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-slate-500">Active Visitors</span>
            <span className="text-2xl font-bold text-slate-800 leading-tight">{activeCount}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Currently on premises</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Controls */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search name, phone, host..."
                className="pl-9 h-9 bg-slate-50/50 border-slate-200 text-[13px] focus-visible:ring-[#0453B8]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="h-9 px-4 font-semibold shadow-md text-[13px] bg-[#0453B8] hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Visitor Entry
            </Button>
          </div>
        </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gate Pass - New Visitor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                {formData.photo_url ? (
                  <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-6 h-6 text-slate-400 mb-1 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] text-slate-400 font-medium group-hover:text-blue-500 transition-colors">Capture</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, photo_url: URL.createObjectURL(file) });
                    }
                  }} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Visitor Name <span className="text-red-500">*</span></Label>
              <Input required placeholder="E.g. Amit Sharma" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number <span className="text-red-500">*</span></Label>
              <Input required placeholder="+91 ..." value={formData.mobile_number} onChange={e => setFormData({ ...formData, mobile_number: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Whom to Visit <span className="text-red-500">*</span></Label>
              <Select required value={formData.whom_to_visit} onValueChange={v => setFormData({ ...formData, whom_to_visit: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Host / Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR Department">HR Department</SelectItem>
                  <SelectItem value="Admin Department">Admin Department</SelectItem>
                  <SelectItem value="IT Department">IT Department</SelectItem>
                  <SelectItem value="Sales Team">Sales Team</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Purpose <span className="text-red-500">*</span></Label>
              <Select required value={formData.purpose} onValueChange={v => setFormData({ ...formData, purpose: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Vendor Visit">Vendor Visit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-2 mt-4">
              <Clock className="w-4 h-4 text-[#0453B8]" />
              <p className="text-xs font-semibold text-blue-800">In-time will be auto-captured as {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" className="bg-[#0453B8] hover:bg-blue-700">Approve Entry</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

        <div className="overflow-y-auto flex-1 min-h-0">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm">
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Host & Purpose</TableHead>
                <TableHead>In-Time</TableHead>
                <TableHead>Out-Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => {
                const isActive = !v.out_time;
                return (
                  <TableRow key={v.id} className={isActive ? 'bg-blue-50/20' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {v.photo_url ? (
                          <div className="relative w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <Image src={v.photo_url} alt={v.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                            <UserCircle2 className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">{v.name}</p>
                          <p className="text-xs font-semibold text-slate-500">{v.mobile_number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-slate-900">{v.whom_to_visit}</p>
                      <p className="text-xs font-semibold text-slate-500">{v.purpose}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-slate-800">
                        {new Date(v.in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400">
                        {new Date(v.in_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </TableCell>
                    <TableCell>
                      {v.out_time ? (
                        <div>
                          <p className="font-bold text-slate-800">
                            {new Date(v.out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-400">
                            {new Date(v.out_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 italic">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 inline-block">
                          On Premises
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 inline-block">
                          Checked Out
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isActive && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => markOutTime(v.id)} 
                          className="h-8 border-red-200 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          <LogOut className="w-3.5 h-3.5 mr-1.5" /> 
                          Mark Exit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                    <UserCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">No visitors found.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
