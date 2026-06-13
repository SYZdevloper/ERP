const fs = require('fs');
const path = 'c:/ERP/src/app/sales-orders/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const oldImport = 'import { Search, Download, Plus, MoreHorizontal, Eye, Edit2, FileText, IndianRupee, ClipboardList, Truck } from "lucide-react";';
const newImport = 'import { Search, Download, Plus, MoreHorizontal, Eye, Edit2, FileText, IndianRupee, ClipboardList, Truck, Activity } from "lucide-react";';
code = code.replace(oldImport, newImport);

const oldMenu = `<DropdownMenuItem className="p-0 cursor-pointer">
                               <Link href={\`/sales-orders/\${order.id}/material-bom\`} className="flex items-center w-full px-2 py-2 text-slate-700 font-medium">
                                 <ClipboardList className="mr-2 h-4 w-4 text-slate-400" /> Material BOM
                               </Link>
                             </DropdownMenuItem>`;
const newMenu = `<DropdownMenuItem className="p-0 cursor-pointer">
                               <Link href={\`/sales-orders/\${order.id}/material-bom\`} className="flex items-center w-full px-2 py-2 text-slate-700 font-medium">
                                 <ClipboardList className="mr-2 h-4 w-4 text-slate-400" /> Material BOM
                               </Link>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="p-0 cursor-pointer">
                               <Link href={\`/sales-orders/\${order.id}/tracking\`} className="flex items-center w-full px-2 py-2 text-slate-700 font-medium">
                                 <Activity className="mr-2 h-4 w-4 text-slate-400" /> Fabric Tracking
                               </Link>
                             </DropdownMenuItem>`;
code = code.replace(oldMenu, newMenu);

fs.writeFileSync(path, code);
console.log("Done");
