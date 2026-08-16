export type SampleStatus = 
  | "Fabric Pending"
  | "Fabric Issued"
  | "Stitching In Progress"
  | "Stitching Complete"
  | "Embroidery Outward"
  | "Embroidery Return"
  | "Sample Complete"
  | "Marketing Issue"
  | "Marketing Return"
  | "Sample Store"
  | "Buyer Dispatch";

export interface SampleEvent {
  id: string;
  type: string;
  date: string;
  actor: string;
  notes?: string;
}

export interface Sample {
  id: string;
  article: string;
  sampleType: string;
  fabric: string;
  color: string;
  requiredQty: number;
  assignedTo?: string;
  embroideryRequired: boolean;
  
  status: SampleStatus;
  currentLocation: string;
  currentHolder: string;
  lastMovementDate?: string;
  expectedReturnDate?: string;
  
  history: SampleEvent[];
}

export const mockSamples: Sample[] = [
  {
    id: "SMP-26-0045",
    article: "ZR-101",
    sampleType: "Photo Sample",
    fabric: "White Poplin",
    color: "White",
    requiredQty: 1,
    assignedTo: "Ramesh",
    embroideryRequired: true,
    
    status: "Fabric Issued",
    currentLocation: "Sample Maker WIP",
    currentHolder: "Ramesh",
    lastMovementDate: "2026-08-10",
    
    history: [
      {
        id: "EV-001",
        type: "Fabric Order",
        date: "2026-08-05",
        actor: "Merchandiser",
        notes: "Order SF-00045 created"
      },
      {
        id: "EV-002",
        type: "Fabric GRN",
        date: "2026-08-07",
        actor: "Store Manager",
        notes: "Received 19.8 Mtr"
      },
      {
        id: "EV-003",
        type: "Sample Requirement",
        date: "2026-08-08",
        actor: "Sample Coordinator",
        notes: "Created Sample Sheet"
      },
      {
        id: "EV-004",
        type: "Fabric Issue",
        date: "2026-08-10",
        actor: "Store Manager",
        notes: "Issued 3.50 Mtr to Ramesh"
      }
    ]
  },
  {
    id: "SMP-26-0046",
    article: "ZR-102",
    sampleType: "Fit Sample",
    fabric: "Cotton Twill",
    color: "Navy",
    requiredQty: 2,
    assignedTo: "Suresh",
    embroideryRequired: false,
    
    status: "Stitching Complete",
    currentLocation: "Sample Department",
    currentHolder: "Suresh",
    lastMovementDate: "2026-08-12",
    
    history: [
      {
        id: "EV-005",
        type: "Fabric Issue",
        date: "2026-08-08",
        actor: "Store Manager",
        notes: "Issued 6.00 Mtr to Suresh"
      },
      {
        id: "EV-006",
        type: "Stitching Complete",
        date: "2026-08-12",
        actor: "Suresh",
        notes: "Stitching completed, pending finishing"
      }
    ]
  },
  {
    id: "SMP-26-0047",
    article: "ZR-2026-101",
    sampleType: "Development",
    fabric: "Cotton Poplin",
    color: "White",
    requiredQty: 1,
    assignedTo: "Mahesh",
    embroideryRequired: true,
    
    status: "Embroidery Outward",
    currentLocation: "XYZ Embroidery",
    currentHolder: "Vendor Person",
    lastMovementDate: "2026-08-15",
    expectedReturnDate: "2026-08-17",
    
    history: [
      {
        id: "EV-007",
        type: "Fabric Issue",
        date: "2026-08-10",
        actor: "Store Manager",
        notes: "Issued fabric"
      },
      {
        id: "EV-008",
        type: "Stitching Complete",
        date: "2026-08-14",
        actor: "Mahesh",
        notes: "Shirt body complete"
      },
      {
        id: "EV-009",
        type: "Embroidery Outward",
        date: "2026-08-15",
        actor: "Sample Department",
        notes: "Sent to XYZ Embroidery, Outward EO-00031"
      }
    ]
  }
];
