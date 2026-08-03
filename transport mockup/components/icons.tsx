import type { IconName } from "@/types/site";

interface IconProps {
  name: IconName;
  size?: number;
}

export function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 64 64" role="img" aria-label="Transportation Industry Insights logo">
      <rect x="4" y="4" width="56" height="56" rx="14" fill="#1261A0" />
      <path d="M14 39c7-1 10-5 14-14 3-7 8-10 22-10" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M17 46c10 0 16-3 22-10 4-5 8-7 13-8" fill="none" stroke="#00A6A6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="16" cy="39" r="4" fill="#F28C28" stroke="#fff" strokeWidth="2" />
      <circle cx="50" cy="15" r="4" fill="#F28C28" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function SectorIcon({ name, size = 25 }: IconProps) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;

  switch (name) {
    case "auto": return <svg {...common}><path d="m5 14 2-5h10l2 5M4 14h16v5H4v-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="7" cy="18" r="1.5" fill="currentColor" /><circle cx="17" cy="18" r="1.5" fill="currentColor" /></svg>;
    case "rail": return <svg {...common}><rect x="6" y="3" width="12" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M8 8h8M9 18l-3 3m9-3 3 3M9 13h.01M15 13h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
    case "air": return <svg {...common}><path d="m3 13 8-2V5l2-2 1 8 6 2v2l-6-1-1 7h-2v-7l-8 1v-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
    case "marine": return <svg {...common}><path d="m4 14 3 5h10l3-5H4Zm4 0V8h8v6m-6-6V5h4v3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M3 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
    case "logistics": return <svg {...common}><path d="M3 6h12v12H3V6Zm12 5h4l2 3v4h-6v-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="7" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="18" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>;
    case "urban": return <svg {...common}><path d="M4 21V9h6v12m4 0V3h6v18M2 21h20M6 12h2m-2 3h2m8-8h2m-2 4h2m-2 4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
    case "infra": return <svg {...common}><path d="M3 18h18M5 18V9m14 9V9M3 9h18M7 9V5h10v4M9 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
    case "smart": return <svg {...common}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
    case "mobility": return <svg {...common}><circle cx="7" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="17" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M7 17 11 8h4l2 9M9 12h7M13 5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "aftermarket": return <svg {...common}><path d="M14 6a5 5 0 0 0-7 7l-4 4 4 4 4-4a5 5 0 0 0 7-7l-3 3-3-3 2-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
    case "safety": return <svg {...common}><path d="M12 3 20 6v6c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-3Z" stroke="currentColor" strokeWidth="1.5" /><path d="m8 12 2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "source": return <svg {...common}><path d="M5 4h14v16H5V4Zm3 4h8m-8 4h8m-8 4h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
    case "model": return <svg {...common}><path d="M4 18 9 13l3 3 7-9M15 7h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "expert": return <svg {...common}><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M3 20v-3c0-3 2.5-5 6-5 2 0 3.6.7 4.7 1.8M16 13l1.4 1.4L21 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "refresh": return <svg {...common}><path d="M20 8a8 8 0 1 0 1 6M20 3v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "road":
    default: return <svg {...common}><path d="M8 21 10 3m6 18L14 3M12 6v3m0 3v3m0 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
  }
}
