"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { mockSamples, Sample } from "@/data/mock-samples";

export default function CreateSamplePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    article: "",
    sampleType: "Proto",
    fabric: "",
    color: "",
    requiredQty: 1,
    assignedTo: "",
    embroideryRequired: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a new ID based on current count
    const newId = `SMP-26-${(mockSamples.length + 45).toString().padStart(4, '0')}`;
    
    const newSample: Sample = {
      id: newId,
      ...formData,
      status: "Fabric Pending",
      currentLocation: "Merchandising",
      currentHolder: "Merchandiser",
      lastMovementDate: new Date().toISOString().split('T')[0],
      history: [
        {
          id: `EV-${Date.now()}`,
          type: "Sample Requirement",
          date: new Date().toISOString().split('T')[0],
          actor: "Merchandiser",
          notes: "Sample Requirement Created"
        }
      ]
    };
    
    mockSamples.push(newSample);
    
    router.push("/samples");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'requiredQty' ? parseInt(value) || 1 : value)
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/samples")}>
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Create New Sample</h1>
          <p className="text-slate-500 mt-1">Fill out the requirements to start tracking a new sample</p>
        </div>
      </div>

      <div className="max-w-3xl bg-white border border-slate-200 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="article" className="text-sm font-medium text-slate-700">Article Number</label>
              <input 
                id="article" 
                name="article" 
                value={formData.article} 
                onChange={handleChange} 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. ZR-101"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sampleType" className="text-sm font-medium text-slate-700">Sample Type</label>
              <select 
                id="sampleType" 
                name="sampleType" 
                value={formData.sampleType} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Proto">Proto Sample</option>
                <option value="Fit">Fit Sample</option>
                <option value="Photo Sample">Photo Sample</option>
                <option value="Development">Development</option>
                <option value="Size Set">Size Set</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fabric" className="text-sm font-medium text-slate-700">Fabric</label>
              <input 
                id="fabric" 
                name="fabric" 
                value={formData.fabric} 
                onChange={handleChange} 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. White Poplin"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium text-slate-700">Color</label>
              <input 
                id="color" 
                name="color" 
                value={formData.color} 
                onChange={handleChange} 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. White"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="requiredQty" className="text-sm font-medium text-slate-700">Required Quantity</label>
              <input 
                id="requiredQty" 
                name="requiredQty" 
                type="number"
                min="1"
                value={formData.requiredQty} 
                onChange={handleChange} 
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="assignedTo" className="text-sm font-medium text-slate-700">Assigned Maker (Optional)</label>
              <input 
                id="assignedTo" 
                name="assignedTo" 
                value={formData.assignedTo} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Ramesh"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <input 
              id="embroideryRequired" 
              name="embroideryRequired" 
              type="checkbox"
              checked={formData.embroideryRequired} 
              onChange={handleChange} 
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="embroideryRequired" className="text-sm font-medium text-slate-700">
              Embroidery Required
            </label>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/samples")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0453B8] hover:bg-[#034294] text-white">
              Create Sample Requirement
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
