export const MOCK_ORDERS = {
  "SO-2026-008": {
    id: "SO-2026-008",
    buyerName: "NorthTrail Outdoors",
    products: [
      {
        id: "P-101",
        style: "Winter Parka - Olive",
        image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=200&q=80",
        techpackDate: "2026-06-15",
        brand: "NorthTrail",
        size: "L",
        fit: "Regular Fit",
        fabricDetail: "100% Nylon Taslan with Poly Lining",
        buyerDesignNumber: "NT-WP-2026",
        patternNo: "PTRN-2026-X8",
        sizeRatio: "1:2:2:1",
        targetQty: 850,
        fabricRolls: [
          { id: "R-101", material: "NYLON-TASLAN-04", color: "Yellow", meter: 296, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
          { id: "R-102", material: "NYLON-TASLAN-04", color: "Brown", meter: 297, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
          { id: "R-103", material: "NYLON-TASLAN-04", color: "Blue", meter: 293, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
          { id: "R-104", material: "NYLON-TASLAN-04", color: "Black", meter: 300, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
          { id: "R-201", material: "POLY-LINING-99", color: "Olive", meter: 100, width: 44, originalQty: 100, availableQty: 100, unit: "Mtr" },
          { id: "R-202", material: "POLY-LINING-99", color: "Olive", meter: 100, width: 44, originalQty: 100, availableQty: 100, unit: "Mtr" },
        ],
        trims: [
          { id: "T-101", itemType: "Button", description: "Metal Snap Button - 15mm", requiredQty: 850, allocatedQty: 850, unit: "Pcs" },
          { id: "T-102", itemType: "Zipper", description: "Nylon Coil Zipper - 24\"", requiredQty: 850, allocatedQty: 850, unit: "Pcs" },
        ]
      },
      {
        id: "P-102",
        style: "Winter Parka - Black",
        image: "https://images.unsplash.com/photo-1551028719-0c14498877bc?w=200&q=80",
        techpackDate: "2026-06-15",
        brand: "NorthTrail",
        size: "M",
        fit: "Regular Fit",
        fabricDetail: "100% Nylon Taslan with Poly Lining",
        buyerDesignNumber: "NT-WP-2026-B",
        patternNo: "PTRN-2026-X9",
        sizeRatio: "1:2:2:1",
        targetQty: 400,
        fabricRolls: [
          { id: "R-105", material: "NYLON-TASLAN-BLK", color: "Black", meter: 200, width: 44, originalQty: 100, availableQty: 100, unit: "Mtr" },
          { id: "R-203", material: "POLY-LINING-99", color: "Olive", meter: 150, width: 44, originalQty: 50, availableQty: 50, unit: "Mtr" },
        ],
        trims: [
          { id: "T-103", itemType: "Button", description: "Metal Snap Button - 15mm (Black)", requiredQty: 400, allocatedQty: 400, unit: "Pcs" },
        ]
      }
    ]
  },
  "SO-2026-009": {
    id: "SO-2026-009",
    buyerName: "Essentials Inc.",
    products: [
      {
        id: "P-201",
        style: "Basic Cotton Hoodie",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80",
        techpackDate: "2026-06-18",
        brand: "Essentials",
        size: "M",
        fit: "Oversized",
        fabricDetail: "100% French Terry Cotton 280 GSM",
        buyerDesignNumber: "ESS-CH-001",
        patternNo: "PTRN-2026-Y1",
        sizeRatio: "1:3:3:2:1",
        targetQty: 1200,
        fabricRolls: [
          { id: "R-301", material: "FRENCH-TERRY-280", color: "Grey", meter: 250, width: 54, originalQty: 100, availableQty: 100, unit: "Mtr" },
          { id: "R-302", material: "FRENCH-TERRY-280", color: "Grey", meter: 250, width: 54, originalQty: 100, availableQty: 100, unit: "Mtr" },
          { id: "R-401", material: "RIB-KNIT-MATCHING", color: "Grey", meter: 100, width: 54, originalQty: 50, availableQty: 20, unit: "Mtr" },
        ],
        trims: [
          { id: "T-201", itemType: "Drawstring", description: "Cotton Drawstring - 120cm", requiredQty: 1200, allocatedQty: 1200, unit: "Pcs" },
        ]
      }
    ]
  },
};
