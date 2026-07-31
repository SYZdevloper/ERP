"use client";

import React, { useState } from "react";
import { useSpareParts, SparePartIssue } from "@/context/spare-parts-context";
import { useMaintenance } from "@/context/maintenance-context";
import { ListPageHeader } from "@/components/ui/list-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Archive, Settings, CalendarClock, Trash2, CheckCircle2, Camera, Package } from "lucide-react";

export default function SparePartsPage() {
  const { issues, inventory, addIssue, deleteIssue, updateIssue, addInventory, updateInventory } = useSpareParts();
  const { machines } = useMaintenance();
  
  const [showForm, setShowForm] = useState(false);
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [receivingIssue, setReceivingIssue] = useState<SparePartIssue | null>(null);
  const [receiveData, setReceiveData] = useState({ received_date: new Date().toISOString().split('T')[0], received_quantity: 1 });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<'inventory' | 'issues'>('issues');
  const [showAddInventoryForm, setShowAddInventoryForm] = useState(false);
  const [inventoryForm, setInventoryForm] = useState({
    name: "", category: "Mechanical", quantity: 1, min_quantity: 2
  });
  
  const [formData, setFormData] = useState({
    product_name: "",
    issue_to: "",
    issue_date: new Date().toISOString().split('T')[0],
    reason: "",
    machine_id: "",
    expected_receiving_date: new Date().toISOString().split('T')[0],
    quantity: 1,
    image_url: "",
  });

  function resetForm() {
    setFormData({
      product_name: "",
      issue_to: "",
      issue_date: new Date().toISOString().split('T')[0],
      reason: "",
      machine_id: "",
      expected_receiving_date: new Date().toISOString().split('T')[0],
      quantity: 1,
      image_url: "",
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const machine = machines.find(m => m.id === formData.machine_id);
    
    const newIssue: SparePartIssue = {
      id: `SPI-${Math.floor(Math.random() * 10000)}`,
      product_name: formData.product_name,
      image_url: formData.image_url || null,
      issue_to: formData.issue_to,
      issue_date: formData.issue_date,
      reason: formData.reason,
      machine_number: machine?.machine_code || formData.machine_id,
      expected_receiving_date: formData.expected_receiving_date,
      quantity: formData.quantity,
    };
    addIssue(newIssue);
    resetForm();
    setShowForm(false);
  }

  function handleAddInventorySubmit(e: React.FormEvent) {
    e.preventDefault();
    addInventory({
      id: `INV-${Math.floor(Math.random() * 10000)}`,
      name: inventoryForm.name,
      category: inventoryForm.category,
      quantity: inventoryForm.quantity,
      min_quantity: inventoryForm.min_quantity
    });
    setShowAddInventoryForm(false);
    setInventoryForm({ name: "", category: "Mechanical", quantity: 1, min_quantity: 2 });
  }

  function handleDelete(id: string) {
    if (confirm("Delete this spare part issue record?")) {
      deleteIssue(id);
    }
  }

  function handleReceiveSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (receivingIssue) {
      updateIssue(receivingIssue.id, {
        status: 'received',
        received_date: receiveData.received_date,
        received_quantity: receiveData.received_quantity,
      });
    }
    setShowReceiveForm(false);
    setReceivingIssue(null);
  }

  const filtered = issues.filter((i) => {
    return (
      !search ||
      i.product_name.toLowerCase().includes(search.toLowerCase()) ||
      i.issue_to.toLowerCase().includes(search.toLowerCase()) ||
      i.machine_number.toLowerCase().includes(search.toLowerCase())
    );
  });

  const today = new Date().toISOString().split('T')[0];
  const pendingReceive = issues.filter(i => i.status !== 'received').length;

  const filteredInventory = inventory.filter((i) => {
    return !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase());
  });

  const totalIssued = issues.length;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Spare Parts Issue</h1>
          <p className="text-sm text-slate-500 mt-1">Track spare parts issued to mechanics and machines.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-1 items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0453B8] flex items-center justify-center shrink-0">
            <Archive className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-slate-500">Total Parts Issued</span>
            <span className="text-2xl font-bold text-slate-800 leading-tight">{totalIssued}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">All time</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-1 items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-slate-500">Pending Receive</span>
            <span className="text-2xl font-bold text-slate-800 leading-tight">{pendingReceive}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Items to be returned</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-1 items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-slate-500">Parts In Stock</span>
            <span className="text-2xl font-bold text-slate-800 leading-tight">1,245</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Available in inventory</span>
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
                placeholder="Search part, technician, machine..."
                className="pl-9 h-9 bg-slate-50/50 border-slate-200 text-[13px] focus-visible:ring-[#0453B8]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === 'inventory' ? (
              <Button onClick={() => setShowAddInventoryForm(true)} className="h-9 px-4 font-semibold shadow-md text-[13px] bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add to Stock
              </Button>
            ) : (
              <Button onClick={() => { resetForm(); setShowForm(true); }} className="h-9 px-4 font-semibold shadow-md text-[13px] bg-[#0453B8] hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Issue Spare Part
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'inventory' ? 'border-[#0453B8] text-[#0453B8]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Spare Parts Inventory
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'issues' ? 'border-[#0453B8] text-[#0453B8]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Issued Parts
          </button>
        </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Issue Spare Part</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center mb-2">
              <div className="w-24 h-24 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-6 h-6 text-slate-400 mb-1 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] text-slate-400 font-medium group-hover:text-blue-500 transition-colors">Photo</span>
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
                      setFormData({ ...formData, image_url: URL.createObjectURL(file) });
                    }
                  }} 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Product Name / Part Name <span className="text-red-500">*</span></Label>
                <Select required value={formData.product_name} onValueChange={v => setFormData({ ...formData, product_name: v })}>
                  <SelectTrigger><SelectValue placeholder="Select from Inventory..." /></SelectTrigger>
                  <SelectContent>
                    {inventory.map(inv => (
                      <SelectItem key={inv.id} value={inv.name}>
                        {inv.name} (Stock: {inv.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Issue To (Technician) <span className="text-red-500">*</span></Label>
                <Input required placeholder="Tech - Rajesh" value={formData.issue_to} onChange={e => setFormData({ ...formData, issue_to: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Machine Number <span className="text-red-500">*</span></Label>
                <Select required value={formData.machine_id} onValueChange={v => setFormData({ ...formData, machine_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select machine..." /></SelectTrigger>
                  <SelectContent>
                    {machines.map(m => <SelectItem key={m.id} value={m.id}>{m.machine_code} - {m.machine_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity <span className="text-red-500">*</span></Label>
                <Input type="number" min="1" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="space-y-2">
                <Label>Reason <span className="text-red-500">*</span></Label>
                <Input required placeholder="Damaged, Routine Replacement..." value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Issue Date <span className="text-red-500">*</span></Label>
                <Input type="date" required value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Expected Receiving Date <span className="text-red-500">*</span></Label>
                <Input type="date" required value={formData.expected_receiving_date} onChange={e => setFormData({ ...formData, expected_receiving_date: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" className="bg-[#0453B8] hover:bg-blue-700">Issue Part</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Receive Form Dialog */}
      <Dialog open={showReceiveForm} onOpenChange={setShowReceiveForm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Receive Spare Part</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReceiveSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Received Date <span className="text-red-500">*</span></Label>
              <Input type="date" required value={receiveData.received_date} onChange={e => setReceiveData({ ...receiveData, received_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Received Quantity <span className="text-red-500">*</span></Label>
              <Input type="number" min="1" max={receivingIssue?.quantity || 1} required value={receiveData.received_quantity} onChange={e => setReceiveData({ ...receiveData, received_quantity: parseInt(e.target.value) || 1 })} />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setShowReceiveForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Receive</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Inventory Form Dialog */}
      <Dialog open={showAddInventoryForm} onOpenChange={setShowAddInventoryForm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Spare Part to Stock</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddInventorySubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Part Name <span className="text-red-500">*</span></Label>
              <Input required placeholder="E.g. Juki Hook Assembly" value={inventoryForm.name} onChange={e => setInventoryForm({ ...inventoryForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={inventoryForm.category} onValueChange={v => setInventoryForm({ ...inventoryForm, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Consumable">Consumable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Initial Quantity <span className="text-red-500">*</span></Label>
              <Input type="number" min="1" required value={inventoryForm.quantity} onChange={e => setInventoryForm({ ...inventoryForm, quantity: parseInt(e.target.value) || 1 })} />
            </div>
            <div className="space-y-2">
              <Label>Minimum Alert Quantity <span className="text-red-500">*</span></Label>
              <Input type="number" min="0" required value={inventoryForm.min_quantity} onChange={e => setInventoryForm({ ...inventoryForm, min_quantity: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddInventoryForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Add to Stock</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

        <div className="overflow-y-auto flex-1 min-h-0">
          {activeTab === 'issues' ? (
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm">
              <TableRow>
                <TableHead>Part Details</TableHead>
                <TableHead>Issued To</TableHead>
                <TableHead>Machine</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden relative">
                        {i.image_url ? (
                          <img src={i.image_url} alt={i.product_name} className="object-cover w-full h-full" />
                        ) : (
                          <Settings className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{i.product_name}</p>
                        <p className="text-xs font-semibold text-slate-500 max-w-[200px] truncate">{i.reason}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-700">{i.issue_to}</span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 inline-block">
                      {i.machine_number}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p><span className="text-slate-500 font-semibold mr-1">Issued:</span> <span className="font-bold text-slate-700">{new Date(i.issue_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></p>
                      <p className="text-xs mt-0.5"><span className="text-slate-400 font-semibold mr-1">Expected:</span> <span className="font-semibold text-slate-600">{new Date(i.expected_receiving_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-lg text-slate-700">{i.quantity}</span>
                    {i.status === 'received' && (
                      <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block ml-2">Returned: {i.received_quantity}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {i.status !== 'received' && (
                      <Button 
                        title="Receive Part"
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          setReceivingIssue(i);
                          setReceiveData({ received_date: new Date().toISOString().split('T')[0], received_quantity: i.quantity });
                          setShowReceiveForm(true);
                        }} 
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-transparent shadow-none mr-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(i.id)} 
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 border-transparent shadow-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                    <Archive className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">No spare part issues found.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 z-10 shadow-sm">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Part Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Available Stock</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-semibold text-slate-500">{i.id}</TableCell>
                  <TableCell className="font-bold text-slate-900">{i.name}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 inline-block">
                      {i.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-black text-lg text-slate-700">{i.quantity}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {i.quantity <= i.min_quantity ? (
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded inline-block">Low Stock</span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block">In Stock</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">No inventory found.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </div>
      </div>
    </div>
  );
}
