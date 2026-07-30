"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useProduction } from "@/components/production/production-context";

export default function EmbroideryJobCardView() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { jobCards, updateJobCard } = useProduction();
  const jobCard = jobCards.find(c => c.id === id);

  const [isSaved, setIsSaved] = useState(false);

  const handleComplete = () => {
    setIsSaved(true);
    // Transition to the next phase: Printing
    updateJobCard(id, { currentPhase: "Printing" });
    setTimeout(() => {
      router.push("/production/embroidery");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/production/embroidery">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-white shadow-sm rounded-md border-slate-200">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Embroidery: {id}</h1>
            <p className="text-sm text-slate-500 font-medium">Style: {jobCard?.style}</p>
          </div>
        </div>
        
        <div>
          <Button 
            onClick={handleComplete}
            disabled={isSaved}
            className={`h-10 px-6 font-bold shadow-sm transition-all ${isSaved ? 'bg-emerald-600 text-white' : 'bg-[#0453B8] hover:bg-blue-700 text-white hover:shadow-md'}`}
          >
            {isSaved ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Passed to Printing</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Complete & Send to Printing</>
            )}
          </Button>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-slate-600">
        Placeholder for Embroidery details and data entry.
      </div>
    </div>
  );
}
