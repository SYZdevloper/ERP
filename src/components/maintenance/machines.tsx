"use client";

import React, { useState } from 'react';
import { useMaintenance, Machine, MachineStatus } from '@/context/maintenance-context';
import { Plus, Edit2, Trash2, Cog, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';

const MACHINE_TYPES = ['Lockstitch', 'Overlock', 'Chainstitch', 'Zigzag', 'Bar Tack', 'Buttonhole', 'Coverstitch', 'Blind Hem'];
const BRANDS = ['Juki', 'Brother', 'Pfaff', 'Singer', 'Bernina', 'Janome', 'Yamata', 'Jack'];
const STATUS_OPTIONS: { value: MachineStatus; label: string; color: string }[] = [
    { value: 'operational', label: 'Operational', color: 'success' },
    { value: 'maintenance', label: 'In Maintenance', color: 'warning' },
    { value: 'breakdown', label: 'Breakdown', color: 'danger' },
    { value: 'retired', label: 'Retired', color: 'default' },
];

export function MachinesList() {
    const { machines, setMachines, schedules } = useMaintenance();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Machine | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    const [formData, setFormData] = useState({
        machine_code: '',
        machine_name: '',
        brand: '',
        model: '',
        machine_type: 'Lockstitch',
        location: '',
        install_date: '',
        status: 'operational' as MachineStatus,
        notes: '',
    });

    function resetForm() {
        setFormData({
            machine_code: '',
            machine_name: '',
            brand: '',
            model: '',
            machine_type: 'Lockstitch',
            location: '',
            install_date: '',
            status: 'operational',
            notes: '',
        });
        setEditing(null);
    }

    function handleEdit(machine: Machine) {
        setEditing(machine);
        setFormData({
            machine_code: machine.machine_code,
            machine_name: machine.machine_name,
            brand: machine.brand || '',
            model: machine.model || '',
            machine_type: machine.machine_type,
            location: machine.location || '',
            install_date: machine.install_date || '',
            status: machine.status,
            notes: machine.notes || '',
        });
        setShowForm(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload: Machine = {
            id: editing ? editing.id : `M-${Math.floor(Math.random() * 10000)}`,
            ...formData,
            brand: formData.brand || null,
            model: formData.model || null,
            location: formData.location || null,
            install_date: formData.install_date || null,
            notes: formData.notes || null,
        };

        if (editing) {
            setMachines(prev => prev.map(m => m.id === editing.id ? payload : m));
        } else {
            setMachines(prev => [...prev, payload]);
        }
        
        resetForm();
        setShowForm(false);
    }

    function handleDelete(id: string) {
        if (!confirm('Delete this machine? All related maintenance schedules and logs will also be removed.')) return;
        setMachines(prev => prev.filter(m => m.id !== id));
    }

    const filtered = machines.filter((m) => {
        const matchSearch =
            !search ||
            m.machine_code.toLowerCase().includes(search.toLowerCase()) ||
            m.machine_name.toLowerCase().includes(search.toLowerCase()) ||
            (m.brand || '').toLowerCase().includes(search.toLowerCase()) ||
            (m.location || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || m.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Machines</h1>
                    <p className="text-slate-500 mt-1">{machines.length} machines in fleet</p>
                </div>
                <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#0453B8] hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Machine
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Search by code, name, brand, location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>
                <div className="w-[200px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-10">
                          <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
            </div>

            {/* Form Modal */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Machine' : 'Add New Machine'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Machine Code <span className="text-red-500">*</span></Label>
                                <Input required placeholder="SM-009" value={formData.machine_code} onChange={e => setFormData({ ...formData, machine_code: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Machine Name <span className="text-red-500">*</span></Label>
                                <Input required placeholder="Juki DDL-8700" value={formData.machine_name} onChange={e => setFormData({ ...formData, machine_name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Brand</Label>
                                <Select value={formData.brand} onValueChange={v => setFormData({ ...formData, brand: v })}>
                                    <SelectTrigger><SelectValue placeholder="Select brand..." /></SelectTrigger>
                                    <SelectContent>
                                        {BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <Input placeholder="DDL-8700" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Machine Type</Label>
                                <Select value={formData.machine_type} onValueChange={v => setFormData({ ...formData, machine_type: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {MACHINE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input placeholder="Line 1 - Station A" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Install Date</Label>
                                <Input type="date" value={formData.install_date} onChange={e => setFormData({ ...formData, install_date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v as MachineStatus })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Input placeholder="Additional notes..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
                            <Button type="submit" className="bg-[#0453B8] hover:bg-blue-700">{editing ? 'Update Machine' : 'Save Machine'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Machine Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((machine) => {
                    const statusOpt = STATUS_OPTIONS.find((s) => s.value === machine.status);
                    
                    // calculate open tasks
                    const openTasks = schedules.filter(s => s.machine_id === machine.id && (s.status === 'scheduled' || s.status === 'overdue')).length;

                    return (
                        <div key={machine.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-lg">
                                        <Cog className="w-5 h-5 text-[#0453B8]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight">{machine.machine_name}</h3>
                                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{machine.machine_code}</p>
                                    </div>
                                </div>
                                <StatusBadge status={machine.status === 'operational' ? 'Active' : machine.status === 'maintenance' ? 'Pending' : 'Inactive'} />
                            </div>

                            <div className="space-y-2 text-sm">
                                {machine.brand && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Brand</span>
                                        <span className="text-slate-800 font-semibold">{machine.brand}</span>
                                    </div>
                                )}
                                {machine.model && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Model</span>
                                        <span className="text-slate-800 font-semibold">{machine.model}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Type</span>
                                    <span className="text-slate-800 font-semibold">{machine.machine_type}</span>
                                </div>
                                {machine.location && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Location</span>
                                        <span className="text-slate-800 font-semibold">{machine.location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className={`px-3 py-1.5 rounded-lg text-center ${openTasks > 0 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                                    <span className={`text-sm font-bold ${openTasks > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {openTasks} <span className="text-xs font-semibold opacity-80 ml-1">open tasks</span>
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(machine)} className="h-8 border-slate-200">
                                        <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(machine.id)} className="h-8 border-slate-200 text-red-500 hover:text-red-700">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-xl">
                    <Cog className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold">No machines found.</p>
                </div>
            )}
        </div>
    );
}
