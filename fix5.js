const fs = require('fs');
const path = 'c:/ERP/src/components/purchase-orders/po-form.tsx';
const content = fs.readFileSync(path, 'utf8');

const brokenRegex = /\{ALL_SO_ITEMS\.filter\(i => i\.soId === activeSoForLines\.id\)\.length === 0 && \(\s*<tr>\s*material: \(item\.fabricBom\?\.type === "Cotton"/s;

const newContent = content.replace(brokenRegex, 
  `{ALL_SO_ITEMS.filter(i => i.soId === activeSoForLines.id).length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No fabric lines found for this Sales Order.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-between items-center">
              <Button type="button" variant="outline" size="sm" onClick={() => setActiveSoForLines(null)} className="h-8">
                Cancel
              </Button>
              <Button 
                type="button"
                size="sm" 
                className="h-8 bg-[#0453B8] hover:bg-blue-700 text-white"
                onClick={() => {
                  const itemsToAdd = ALL_SO_ITEMS.filter(i => i.soId === activeSoForLines.id && parseFloat(orderQuantities[i.id]) > 0);
                  
                  const newPoItems = itemsToAdd.map(item => ({
                    id: "item-" + Math.random().toString(36).substr(2, 9),
                    soItemId: item.id,
                    material: (item.fabricBom?.type === "Cotton" ? "Cotton Fabric" : item.fabricBom?.type) || "Cotton Fabric",`
);

fs.writeFileSync(path, newContent);
console.log("Done");
