const fs = require('fs');
const path = 'c:/ERP/src/components/purchase-orders/po-form.tsx';
const content = fs.readFileSync(path, 'utf8');

const originalBlock = `                    <Select 
                      value={selectedTrimItem} 
                      onValueChange={(newVal) => {
                        setSelectedTrimItem(newVal);
                      }}
                    >
                      <SelectTrigger className="w-auto h-auto px-1 py-0 border-none shadow-none text-slate-600 font-bold focus:ring-0 bg-transparent hover:bg-slate-100 rounded">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {type === "Trims" ? (
                           <>
                             <SelectItem value="Button">Button</SelectItem>
                             <SelectItem value="Label">Label</SelectItem>
                             <SelectItem value="Hangtag">Hangtag</SelectItem>
                           </>
                         ) : (
                           <>
                             <SelectItem value="All Fabrics">All Fabrics</SelectItem>
                             <SelectItem value="Cotton Fabric">Cotton Fabric</SelectItem>
                             <SelectItem value="Linen">Linen</SelectItem>
                           </>
                         )}
                      </SelectContent>
                    </Select>
                    <span>)</span>
                  </div>
                }
              />
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">`;

const brokenContentRegex = /value=\{selectedTrimItem\}\s*onValueChange=\{\(newVal\) => \{\s*setSelectedTrimItem\(newVal\);\s*\}\s*\{\/\* PO Number\/Date Badges \*\/\}/s;

const newContent = content.replace(brokenContentRegex, 
  `value={selectedTrimItem} 
                      onValueChange={(newVal) => {
                        setSelectedTrimItem(newVal);
                      }}
                    >
                      <SelectTrigger className="w-auto h-auto px-1 py-0 border-none shadow-none text-slate-600 font-bold focus:ring-0 bg-transparent hover:bg-slate-100 rounded">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {type === "Trims" ? (
                           <>
                             <SelectItem value="Button">Button</SelectItem>
                             <SelectItem value="Label">Label</SelectItem>
                             <SelectItem value="Hangtag">Hangtag</SelectItem>
                           </>
                         ) : (
                           <>
                             <SelectItem value="All Fabrics">All Fabrics</SelectItem>
                             <SelectItem value="Cotton Fabric">Cotton Fabric</SelectItem>
                             <SelectItem value="Linen">Linen</SelectItem>
                           </>
                         )}
                      </SelectContent>
                    </Select>
                    <span>)</span>
                  </div>
                }
              />
            </div>

            {/* Right Column (Sidebar) */}
            <div className="w-full xl:w-[320px] flex flex-col gap-5 flex-shrink-0">
              {/* PO Number/Date Badges */}`
);

fs.writeFileSync(path, newContent);
console.log("Done");
