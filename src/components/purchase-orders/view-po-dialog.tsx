"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { X, ChevronDown, Check, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { POItemsTable } from "@/components/purchase-orders/po-items-table";

interface ViewPODialogProps {
  po: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (poId: string, newStatus: string) => void;
  onEdit: (po: any) => void;
  itemNameLabel?: string;
}

export function ViewPODialog({ 
  po, 
  open, 
  onOpenChange, 
  onStatusChange, 
  onEdit,
  itemNameLabel = "Material"
}: ViewPODialogProps) {
  if (!po) return null;

  // Enrich mock details if they are missing
  const poDate = formatDate(po.poDate || "2026-06-01");
  const deliveryDateText = formatDate(po.delivery || "2026-06-09");
  const deliverySubtext = po.deliverySubtext || "2d to delivery";
  const supplierCode = po.supplierCode || "SUP-100";
  const contactName = po.contact || "Rakesh";
  const contactPhone = po.phone || "+91 9810000000";
  const paymentTerms = po.paymentTerms || "30 days credit";
  const linkedSo = po.linkedSo || "SO-2026-002";
  const itemDesc = po.material || po.itemDesc || "Cotton";
  const qtyStr = po.qty || "1,200 Pcs";
  const rateVal = po.rate || 180;
  const gstPct = po.gst || 5;

  const numericQty = parseInt(qtyStr.replace(/[^0-9]/g, "")) || 1200;
  const subTotal = numericQty * rateVal;
  const gstAmount = (subTotal * gstPct) / 100;
  const grandTotal = subTotal + gstAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] bg-white p-0 overflow-hidden flex flex-col shadow-2xl border-0 rounded-xl">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-slate-100 flex-shrink-0 relative">
          <div className="flex justify-between items-start pr-8">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                Purchase Order {po.id}
                <StatusBadge status={po.status} className="text-sm px-2.5 py-0.5" />
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-1">
                {po.supplier} &middot; {itemDesc} &middot; linked to {linkedSo}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-[13px] border-b border-slate-100 pb-5">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">PO Date</span>
              <span className="block mt-1.5 font-semibold text-slate-800">{poDate}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delivery</span>
              <span className="block mt-1.5 font-semibold text-slate-800">
                {deliveryDateText} <span className="text-xs text-slate-500 font-normal">&middot; {deliverySubtext}</span>
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Supplier Code</span>
              <span className="block mt-1.5 font-semibold text-slate-800">{supplierCode}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact</span>
              <span className="block mt-1.5 font-semibold text-slate-800">{contactName}</span>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone</span>
              <span className="block mt-1.5 font-semibold text-slate-800">{contactPhone}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment Terms</span>
              <span className="block mt-1.5 font-semibold text-slate-800">{paymentTerms}</span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5">Items (1)</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <POItemsTable
                items={po.items || [{
                  id: "item-1",
                  soItemId: po.linkedSo || "SO-2026-002",
                  material: itemDesc,
                  description: "Men's Casual T-Shirt",
                  gsm: "180",
                  width: "44\"",
                  colorShade: "Blue",
                  qty: numericQty,
                  uom: "pcs",
                  rate: rateVal,
                  gst: gstPct,
                  amount: subTotal,
                  deliveryDate: po.delivery || "2026-06-09",
                  images: []
                }]}
                onEditClick={() => {}}
                onDeleteClick={() => {}}
                onOpenAddDialog={() => {}}
                totalQtyDisplay={`${numericQty.toLocaleString('en-IN')} pcs`}
                itemLabel={itemNameLabel}
                type={itemNameLabel === "Material" ? "Fabric" : "Trims"}
                isReadOnly={true}
              />
            </div>
          </div>

          {/* Goods Receipt Notes (GRN) */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5">Goods Receipt Notes (1)</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-slate-700 text-xs font-bold py-2.5">GRN</TableHead>
                    <TableHead className="text-slate-700 text-xs font-bold py-2.5">Date</TableHead>
                    <TableHead className="text-slate-700 text-xs font-bold py-2.5">Invoice / Challan</TableHead>
                    <TableHead className="text-slate-700 text-xs font-bold text-right py-2.5">Expected</TableHead>
                    <TableHead className="text-slate-700 text-xs font-bold text-right py-2.5">Received</TableHead>
                    <TableHead className="text-slate-700 text-xs font-bold text-right py-2.5">Accepted</TableHead>
                    <TableHead className="text-slate-700 text-xs font-bold text-right py-2.5">Rejected</TableHead>
                    <TableHead className="text-slate-700 text-xs font-bold text-center py-2.5">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-[12px]">
                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-700 py-3.5">GRN-9001</TableCell>
                    <TableCell className="text-slate-600 py-3.5">{formatDate("2026-06-06")}</TableCell>
                    <TableCell className="text-slate-600 py-3.5 leading-snug">INV-100200/2526<br/>DC DC-6660</TableCell>
                    <TableCell className="text-right text-slate-700 font-medium py-3.5">1,000</TableCell>
                    <TableCell className="text-right text-slate-700 font-medium py-3.5">800</TableCell>
                    <TableCell className="text-right text-emerald-600 font-semibold py-3.5">784</TableCell>
                    <TableCell className="text-right text-rose-600 font-semibold py-3.5">16</TableCell>
                    <TableCell className="text-center py-3.5">
                      <StatusBadge status="Pending" className="font-bold text-[10px]" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <Button variant="outline" className="h-10 text-[13px] text-slate-700 border-slate-300 font-semibold hover:bg-slate-100 bg-white">
              Open Linked SO &rarr;
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 text-[13px] text-slate-700 border-slate-300 font-semibold hover:bg-slate-100 bg-white min-w-[80px]"
            >
              Close
            </Button>

            {/* Action State transitions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 text-[13px] text-slate-700 border-slate-300 font-semibold hover:bg-slate-100 bg-white flex items-center gap-1">
                  Change Status <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-slate-200">
                <DropdownMenuItem onClick={() => onStatusChange(po.id, "Draft")} className="cursor-pointer font-medium text-slate-700">
                  Mark Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(po.id, "Approval")} className="cursor-pointer font-medium text-slate-700">
                  Mark Pending Approval
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(po.id, "Approved")} className="cursor-pointer font-medium text-slate-700">
                  Mark Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(po.id, "Partially Received")} className="cursor-pointer font-medium text-slate-700">
                  Mark Partially Received
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(po.id, "Received")} className="cursor-pointer font-medium text-slate-700">
                  Mark Received
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Action Button based on current status */}
            {po.status === "Approved" && (
              <Button
                onClick={() => onStatusChange(po.id, "Received")}
                className="h-10 px-5 text-[13px] font-semibold bg-[#0f766e] hover:bg-[#0d6059] text-white flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Mark Received
              </Button>
            )}
            {po.status === "Draft" && (
              <Button
                onClick={() => onStatusChange(po.id, "Approval")}
                className="h-10 px-5 text-[13px] font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
              >
                Send for Approval
              </Button>
            )}
            {po.status === "Approval" && (
              <Button
                onClick={() => onStatusChange(po.id, "Approved")}
                className="h-10 px-5 text-[13px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
              >
                Approve PO
              </Button>
            )}

            <Button
              onClick={() => onEdit(po)}
              className="h-10 px-6 text-[13px] font-semibold bg-[#0453B8] hover:bg-[#034294] text-white min-w-[80px]"
            >
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
