"use client";

import { DepartmentList } from "@/components/production/department-list";

export default function QCPage() {
  return <DepartmentList department="QC" description="Quality control to check if cutting was done properly before issuing materials." />;
}
