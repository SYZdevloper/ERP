import { useFormContext } from "react-hook-form";
import { SalesOrder } from "@/types/sales-order";


export function NotesPanel({ isReadOnly = false }: { isReadOnly?: boolean }) {
  const { register, watch } = useFormContext<SalesOrder>();

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-semibold text-slate-800 text-sm">Notes</h3>
      </div>
      
      <div className="p-4">
        {isReadOnly ? (
          <div className="w-full min-h-[250px] text-sm text-slate-700 whitespace-pre-wrap">
            {watch("internalNotes") || <span className="text-slate-400 italic">No notes provided</span>}
          </div>
        ) : (
          <textarea 
            placeholder="Add any internal notes or special instructions for this order..."
            className="w-full min-h-[250px] resize-none border border-slate-200 rounded-md p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            {...register("internalNotes")}
          />
        )}
      </div>
    </div>
  );
}
