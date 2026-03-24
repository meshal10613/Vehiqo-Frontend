// "use client";

// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "../../../ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { IBooking } from "../../../../types/booking.type";
// import {
//     Ban,
//     CalendarDays,
//     CalendarCheck2,
//     Car,
//     CreditCard,
//     Droplets,
//     FileText,
//     Fuel,
//     Hash,
//     ReceiptText,
//     Timer,
//     TrendingUp,
//     User,
//     Wallet,
//     AlertCircle,
//     CheckCircle2,
//     Clock,
//     Banknote,
//     FileDown,
//     X,
//     Maximize2,
//     Download,
//     ExternalLink,
//     Loader2,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useState, useCallback, useEffect } from "react";

// // ── Dynamic import for react-pdf (SSR safe) ───────────────────────────────────
// import dynamic from "next/dynamic";

// // We need to import react-pdf dynamically because it uses canvas/DOM APIs
// const PDFDocument = dynamic(
//     () => import("react-pdf").then((mod) => mod.Document),
//     {
//         ssr: false,
//         loading: () => (
//             <div className="flex items-center justify-center h-full w-full">
//                 <Loader2 className="h-5 w-5 animate-spin text-[#FF5100]" />
//             </div>
//         ),
//     },
// );

// const PDFPage = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
//     ssr: false,
// });

// // ── Setup PDF.js worker ────────────────────────────────────────────────────────
// // This must run on client side only
// if (typeof window !== "undefined") {
//     import("react-pdf").then((reactPdf) => {
//         const pdfjs = reactPdf.pdfjs;
//         pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
//     });
// }

// // ── Formatters ─────────────────────────────────────────────────────────────────

// const formatDate = (date?: string | null) => {
//     if (!date) return null;
//     return new Date(date).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//     });
// };

// const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "BDT",
//         minimumFractionDigits: 0,
//     }).format(amount);

// // ── Status config ──────────────────────────────────────────────────────────────

// const statusConfig: Record<
//     string,
//     { label: string; className: string; icon: React.ElementType }
// > = {
//     PENDING: {
//         label: "Pending",
//         className: "border-amber-200 text-amber-600 bg-amber-50",
//         icon: Clock,
//     },
//     ADVANCE_PAID: {
//         label: "Advance Paid",
//         className: "border-blue-200 text-blue-600 bg-blue-50",
//         icon: CreditCard,
//     },
//     PICKED_UP: {
//         label: "Picked Up",
//         className: "border-violet-200 text-violet-600 bg-violet-50",
//         icon: Car,
//     },
//     RETURNED: {
//         label: "Returned",
//         className: "border-teal-200 text-teal-600 bg-teal-50",
//         icon: CheckCircle2,
//     },
//     COMPLETED: {
//         label: "Completed",
//         className: "border-green-200 text-green-600 bg-green-50",
//         icon: CheckCircle2,
//     },
//     CANCELLED: {
//         label: "Cancelled",
//         className: "border-zinc-200 text-zinc-500 bg-zinc-50",
//         icon: Ban,
//     },
// };

// const paymentStatusConfig: Record<
//     string,
//     { label: string; className: string }
// > = {
//     PENDING: {
//         label: "Pending",
//         className: "text-amber-500 bg-amber-50 border-amber-200",
//     },
//     PAID: {
//         label: "Paid",
//         className: "text-green-600 bg-green-50 border-green-200",
//     },
//     FAILED: {
//         label: "Failed",
//         className: "text-red-500 bg-red-50 border-red-200",
//     },
//     REFUNDED: {
//         label: "Refunded",
//         className: "text-zinc-500 bg-zinc-50 border-zinc-200",
//     },
// };

// // ── InfoRow ────────────────────────────────────────────────────────────────────

// const InfoRow = ({
//     icon: Icon,
//     label,
//     value,
//     highlight,
// }: {
//     icon: React.ElementType;
//     label: string;
//     value: React.ReactNode;
//     highlight?: boolean;
// }) => (
//     <div
//         className={cn(
//             "group flex items-start gap-3 rounded-xl px-4 py-3.5 transition-colors duration-150",
//             highlight ? "bg-orange-50/60" : "hover:bg-zinc-50",
//         )}
//     >
//         <div
//             className={cn(
//                 "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150",
//                 highlight
//                     ? "bg-orange-100 border-orange-200 group-hover:bg-orange-200"
//                     : "bg-orange-50 border-orange-100 group-hover:bg-orange-100",
//             )}
//         >
//             <Icon className="h-3.5 w-3.5 text-[#FF5100]" />
//         </div>
//         <div className="flex-1 min-w-0">
//             <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
//                 {label}
//             </p>
//             <div
//                 className={cn(
//                     "text-sm font-medium mt-0.5",
//                     highlight ? "text-[#FF5100] font-bold" : "text-zinc-800",
//                 )}
//             >
//                 {value ?? (
//                     <span className="text-zinc-300 font-normal italic text-sm">
//                         —
//                     </span>
//                 )}
//             </div>
//         </div>
//     </div>
// );

// // ── Section Label ──────────────────────────────────────────────────────────────

// const SectionLabel = ({ children }: { children: React.ReactNode }) => (
//     <div className="flex items-center gap-2 px-4 pt-1 pb-0.5">
//         <div className="h-px flex-1 bg-zinc-100" />
//         <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.15em] shrink-0">
//             {children}
//         </span>
//         <div className="h-px flex-1 bg-zinc-100" />
//     </div>
// );

// // ── Stat Card ──────────────────────────────────────────────────────────────────

// const StatCard = ({
//     label,
//     value,
//     sub,
//     accent,
// }: {
//     label: string;
//     value: string;
//     sub?: string;
//     accent?: boolean;
// }) => (
//     <div
//         className={cn(
//             "flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl border py-3 px-2",
//             accent
//                 ? "border-orange-200 bg-orange-50"
//                 : "border-zinc-100 bg-zinc-50",
//         )}
//     >
//         <p
//             className={cn(
//                 "text-base font-bold leading-tight",
//                 accent ? "text-[#FF5100]" : "text-zinc-800",
//             )}
//         >
//             {value}
//         </p>
//         {sub && <p className="text-[10px] text-zinc-400">{sub}</p>}
//         <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">
//             {label}
//         </p>
//     </div>
// );

// // ── PDF Thumbnail ──────────────────────────────────────────────────────────────

// const PdfThumbnail = ({
//     url,
//     label,
//     onClick,
// }: {
//     url: string;
//     label: string;
//     onClick: () => void;
// }) => {
//     const [loadError, setLoadError] = useState(false);
//     const [isLoaded, setIsLoaded] = useState(false);

//     return (
//         <button
//             type="button"
//             onClick={onClick}
//             className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
//         >
//             {/* Canvas preview */}
//             <div className="relative w-full h-36 overflow-hidden bg-zinc-100 flex items-center justify-center">
//                 {loadError ? (
//                     <div className="flex flex-col items-center gap-1.5 text-zinc-400">
//                         <FileDown className="h-5 w-5" />
//                         <span className="text-[10px]">Preview unavailable</span>
//                     </div>
//                 ) : (
//                     <>
//                         {/* Loading indicator */}
//                         {!isLoaded && (
//                             <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 z-10">
//                                 <Loader2 className="h-5 w-5 animate-spin text-[#FF5100]" />
//                             </div>
//                         )}
//                         <PDFDocument
//                             file={url}
//                             onLoadSuccess={() => setIsLoaded(true)}
//                             onLoadError={(error) => {
//                                 console.error(
//                                     "PDF thumbnail load error:",
//                                     error,
//                                 );
//                                 setLoadError(true);
//                             }}
//                             loading={null} // We handle loading above
//                             error={
//                                 <div className="flex flex-col items-center gap-1 text-zinc-400 text-[10px]">
//                                     <FileDown className="h-5 w-5" />
//                                     Preview unavailable
//                                 </div>
//                             }
//                         >
//                             <PDFPage
//                                 pageNumber={1}
//                                 width={180}
//                                 renderTextLayer={false}
//                                 renderAnnotationLayer={false}
//                             />
//                         </PDFDocument>
//                     </>
//                 )}

//                 {/* Hover overlay */}
//                 <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-200 flex items-center justify-center pointer-events-none z-20">
//                     <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2 shadow-lg">
//                         <Maximize2 className="h-4 w-4 text-[#FF5100]" />
//                     </div>
//                 </div>
//             </div>

//             {/* Label */}
//             <div className="flex items-center gap-1.5 px-3 py-2 border-t border-zinc-100 bg-white">
//                 <FileDown className="h-3 w-3 text-[#FF5100] shrink-0" />
//                 <span className="text-[11px] font-semibold text-zinc-600 truncate capitalize">
//                     {label}
//                 </span>
//             </div>
//         </button>
//     );
// };

// // ── PDF Fullscreen Viewer ──────────────────────────────────────────────────────

// const PdfFullscreenViewer = ({
//     url,
//     label,
//     onClose,
// }: {
//     url: string;
//     label: string;
//     onClose: () => void;
// }) => {
//     const [numPages, setNumPages] = useState<number>(0);
//     const [containerWidth, setContainerWidth] = useState(800);
//     const [loadError, setLoadError] = useState(false);

//     // Lock body scroll
//     useEffect(() => {
//         const original = document.body.style.overflow;
//         document.body.style.overflow = "hidden";
//         return () => {
//             document.body.style.overflow = original;
//         };
//     }, []);

//     // Escape key
//     useEffect(() => {
//         const handleKey = (e: KeyboardEvent) => {
//             if (e.key === "Escape") onClose();
//         };
//         window.addEventListener("keydown", handleKey);
//         return () => window.removeEventListener("keydown", handleKey);
//     }, [onClose]);

//     // Measure container width
//     const containerRef = useCallback((node: HTMLDivElement | null) => {
//         if (!node) return;

//         const updateWidth = () => {
//             setContainerWidth(node.getBoundingClientRect().width - 48);
//         };
//         updateWidth();

//         const observer = new ResizeObserver(updateWidth);
//         observer.observe(node);

//         // Cleanup doesn't work with callback refs this way,
//         // but ResizeObserver will be GC'd when node unmounts
//     }, []);

//     return (
//         <div
//             className="fixed inset-0 z-9999 flex flex-col bg-black/95 backdrop-blur-sm"
//             role="dialog"
//             aria-modal="true"
//             aria-label={`PDF viewer: ${label}`}
//         >
//             {/* Top bar */}
//             <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
//                 <div className="flex items-center gap-2 min-w-0">
//                     <FileDown className="h-4 w-4 text-[#FF5100] shrink-0" />
//                     <span className="text-sm font-semibold text-zinc-100 truncate capitalize">
//                         {label}
//                     </span>
//                     {numPages > 0 && (
//                         <span className="text-xs text-zinc-500 shrink-0">
//                             ({numPages} page{numPages > 1 ? "s" : ""})
//                         </span>
//                     )}
//                 </div>

//                 <div className="flex items-center gap-2 shrink-0">
//                     <a
//                         href={url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-colors duration-150"
//                     >
//                         <ExternalLink className="h-3 w-3" />
//                         <span className="hidden sm:inline">Open</span>
//                     </a>
//                     <a
//                         href={url}
//                         download
//                         className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-400 hover:text-orange-300 border border-orange-500/40 hover:border-orange-400/60 rounded-lg px-3 py-1.5 transition-colors duration-150"
//                     >
//                         <Download className="h-3 w-3" />
//                         <span className="hidden sm:inline">Download</span>
//                     </a>
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors duration-150"
//                         aria-label="Close PDF viewer"
//                     >
//                         <X className="h-4 w-4 text-zinc-300" />
//                     </button>
//                 </div>
//             </div>

//             {/* PDF scroll area */}
//             <div
//                 ref={containerRef}
//                 className="flex-1 overflow-y-auto flex flex-col items-center py-6 px-6 gap-4"
//             >
//                 {loadError ? (
//                     <div className="flex flex-col items-center gap-3 mt-20 text-zinc-400">
//                         <FileDown className="h-10 w-10" />
//                         <p className="text-sm">Failed to load PDF</p>
//                         <a
//                             href={url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-xs text-orange-400 underline hover:text-orange-300"
//                         >
//                             Open directly in browser
//                         </a>
//                     </div>
//                 ) : (
//                     <PDFDocument
//                         file={url}
//                         onLoadSuccess={({ numPages: n }) => {
//                             console.log("PDF loaded, pages:", n);
//                             setNumPages(n);
//                         }}
//                         onLoadError={(error) => {
//                             console.error("PDF fullscreen load error:", error);
//                             setLoadError(true);
//                         }}
//                         loading={
//                             <div className="flex flex-col items-center gap-3 mt-20 text-zinc-400">
//                                 <Loader2 className="h-8 w-8 animate-spin text-[#FF5100]" />
//                                 <span className="text-sm">Loading PDF…</span>
//                             </div>
//                         }
//                         error={
//                             <div className="flex flex-col items-center gap-3 mt-20 text-zinc-400">
//                                 <FileDown className="h-10 w-10" />
//                                 <p className="text-sm">Failed to load PDF</p>
//                                 <a
//                                     href={url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-xs text-orange-400 underline"
//                                 >
//                                     Open directly
//                                 </a>
//                             </div>
//                         }
//                     >
//                         {Array.from({ length: numPages }, (_, i) => (
//                             <div
//                                 key={i + 1}
//                                 className="shadow-2xl rounded-lg overflow-hidden bg-white"
//                             >
//                                 <PDFPage
//                                     pageNumber={i + 1}
//                                     width={Math.min(containerWidth, 900)}
//                                     renderTextLayer={true}
//                                     renderAnnotationLayer={false}
//                                     loading={
//                                         <div className="flex items-center justify-center py-20 px-40">
//                                             <Loader2 className="h-5 w-5 animate-spin text-[#FF5100]" />
//                                         </div>
//                                     }
//                                 />
//                             </div>
//                         ))}
//                     </PDFDocument>
//                 )}
//             </div>

//             {/* Page count footer */}
//             {numPages > 1 && (
//                 <div className="flex items-center justify-center py-2 bg-zinc-900/80 border-t border-zinc-800 shrink-0">
//                     <span className="text-xs text-zinc-500">
//                         {numPages} pages — scroll to view all
//                     </span>
//                 </div>
//             )}
//         </div>
//     );
// };

// // ── Main Component ─────────────────────────────────────────────────────────────

// interface ViewBookingDialogProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     booking: IBooking | null;
// }

// export default function ViewBookingDialog({
//     open,
//     onOpenChange,
//     booking,
// }: ViewBookingDialogProps) {
//     const [fullscreenPdf, setFullscreenPdf] = useState<{
//         url: string;
//         label: string;
//     } | null>(null);

//     // Reset fullscreen when dialog closes
//     useEffect(() => {
//         if (!open) setFullscreenPdf(null);
//     }, [open]);

//     if (!booking) return null;

//     const status = statusConfig[booking.status] ?? statusConfig["PENDING"];
//     const StatusIcon = status.icon;
//     const vehicle = booking.vehicle;
//     const customer = booking.customer;
//     const payments = booking.payments ?? [];
//     const invoices = payments.filter((p) => !!p.invoiceUrl);
//     const isCancelled = booking.status === "CANCELLED";

//     return (
//         <>
//             {/* Fullscreen PDF — outside Dialog to avoid z-index conflicts */}
//             {fullscreenPdf && (
//                 <PdfFullscreenViewer
//                     url={fullscreenPdf.url}
//                     label={fullscreenPdf.label}
//                     onClose={() => setFullscreenPdf(null)}
//                 />
//             )}

//             <Dialog open={open} onOpenChange={onOpenChange}>
//                 <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-hidden p-0">
//                     <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

//                     <DialogHeader className="border-b px-6 py-5">
//                         <div className="flex items-start justify-between gap-3">
//                             <div>
//                                 <DialogTitle className="text-base font-bold text-zinc-900">
//                                     Booking Details
//                                 </DialogTitle>
//                                 <DialogDescription className="text-sm text-zinc-400 mt-0.5">
//                                     #{booking.id.slice(0, 8).toUpperCase()}
//                                 </DialogDescription>
//                             </div>
//                             <Badge
//                                 variant="outline"
//                                 className={cn(
//                                     "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shrink-0",
//                                     status.className,
//                                 )}
//                             >
//                                 <StatusIcon className="h-3 w-3" />
//                                 {status.label}
//                             </Badge>
//                         </div>
//                     </DialogHeader>

//                     <div className="px-6 py-5 space-y-4 max-h-[calc(90vh-9rem)] overflow-y-auto">
//                         {/* ── Vehicle snapshot ── */}
//                         {vehicle && (
//                             <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
//                                 {vehicle.image?.[0] ? (
//                                     <div className="relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border border-orange-100">
//                                         <img
//                                             src={vehicle.image[0]}
//                                             alt={`${vehicle.brand} ${vehicle.model}`}
//                                             className="h-full w-full object-cover"
//                                         />
//                                     </div>
//                                 ) : (
//                                     <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-orange-200 bg-orange-50">
//                                         <Car className="h-6 w-6 text-orange-300" />
//                                     </div>
//                                 )}
//                                 <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-bold text-zinc-900 truncate">
//                                         {vehicle.brand} {vehicle.model}
//                                     </p>
//                                     <p className="text-xs text-zinc-500 mt-0.5">
//                                         {vehicle.year} · {vehicle.plateNo}
//                                     </p>
//                                     <p className="text-xs font-semibold text-[#FF5100] mt-0.5">
//                                         {formatCurrency(vehicle.pricePerDay)} /
//                                         day
//                                     </p>
//                                 </div>
//                             </div>
//                         )}

//                         {/* ── Summary stats ── */}
//                         <div className="flex gap-2">
//                             <StatCard
//                                 label="Days"
//                                 value={String(booking.totalDays)}
//                                 sub={
//                                     booking.extraDays
//                                         ? `+${booking.extraDays} late`
//                                         : undefined
//                                 }
//                             />
//                             <StatCard
//                                 label="Total Cost"
//                                 value={formatCurrency(booking.totalCost)}
//                                 accent
//                             />
//                             <StatCard
//                                 label="Due"
//                                 value={formatCurrency(booking.remainingDue)}
//                                 sub={
//                                     booking.remainingDue === 0
//                                         ? "Cleared"
//                                         : undefined
//                                 }
//                             />
//                         </div>

//                         {/* ── Rental period ── */}
//                         <SectionLabel>Rental Period</SectionLabel>
//                         <div className="divide-y divide-zinc-50 -mx-2">
//                             <InfoRow
//                                 icon={CalendarDays}
//                                 label="Start Date"
//                                 value={formatDate(booking.startDate)}
//                             />
//                             <InfoRow
//                                 icon={CalendarDays}
//                                 label="End Date"
//                                 value={formatDate(booking.endDate)}
//                             />
//                             {booking.pickedUpAt && (
//                                 <InfoRow
//                                     icon={Car}
//                                     label="Picked Up At"
//                                     value={formatDate(booking.pickedUpAt)}
//                                 />
//                             )}
//                             {booking.returnedAt && (
//                                 <InfoRow
//                                     icon={CalendarCheck2}
//                                     label="Returned At"
//                                     value={formatDate(booking.returnedAt)}
//                                 />
//                             )}
//                         </div>

//                         {/* ── Cost breakdown ── */}
//                         <SectionLabel>Cost Breakdown</SectionLabel>
//                         <div className="divide-y divide-zinc-50 -mx-2">
//                             <InfoRow
//                                 icon={Banknote}
//                                 label="Price Per Day"
//                                 value={formatCurrency(booking.pricePerDay)}
//                             />
//                             <InfoRow
//                                 icon={ReceiptText}
//                                 label="Base Cost"
//                                 value={formatCurrency(booking.baseCost)}
//                             />
//                             <InfoRow
//                                 icon={Wallet}
//                                 label="Advance Amount"
//                                 value={formatCurrency(booking.advanceAmount)}
//                             />
//                             {booking.lateFee > 0 && (
//                                 <InfoRow
//                                     icon={Timer}
//                                     label={`Late Fee (${booking.extraDays} day${booking.extraDays > 1 ? "s" : ""})`}
//                                     value={formatCurrency(booking.lateFee)}
//                                 />
//                             )}
//                             {booking.fuelCharge > 0 && (
//                                 <InfoRow
//                                     icon={Fuel}
//                                     label="Fuel Charge"
//                                     value={formatCurrency(booking.fuelCharge)}
//                                 />
//                             )}
//                             {booking.fuelCredit > 0 && (
//                                 <InfoRow
//                                     icon={Droplets}
//                                     label="Fuel Credit"
//                                     value={`− ${formatCurrency(booking.fuelCredit)}`}
//                                 />
//                             )}
//                             {booking.damageCharge > 0 && (
//                                 <InfoRow
//                                     icon={AlertCircle}
//                                     label="Damage Charge"
//                                     value={formatCurrency(booking.damageCharge)}
//                                 />
//                             )}
//                             <InfoRow
//                                 icon={TrendingUp}
//                                 label="Total Cost"
//                                 value={formatCurrency(booking.totalCost)}
//                                 highlight
//                             />
//                             <InfoRow
//                                 icon={CreditCard}
//                                 label="Remaining Due"
//                                 value={
//                                     booking.remainingDue === 0 ? (
//                                         <span className="text-green-600 font-semibold">
//                                             Fully Paid
//                                         </span>
//                                     ) : (
//                                         formatCurrency(booking.remainingDue)
//                                     )
//                                 }
//                             />
//                         </div>

//                         {/* ── Fuel levels ── */}
//                         {(booking.fuelLevelPickup != null ||
//                             booking.fuelLevelReturn != null) && (
//                             <>
//                                 <SectionLabel>Fuel Levels</SectionLabel>
//                                 <div className="divide-y divide-zinc-50 -mx-2">
//                                     {booking.fuelLevelPickup != null && (
//                                         <InfoRow
//                                             icon={Fuel}
//                                             label="At Pickup"
//                                             value={`${booking.fuelLevelPickup}%`}
//                                         />
//                                     )}
//                                     {booking.fuelLevelReturn != null && (
//                                         <InfoRow
//                                             icon={Fuel}
//                                             label="At Return"
//                                             value={`${booking.fuelLevelReturn}%`}
//                                         />
//                                     )}
//                                 </div>
//                             </>
//                         )}

//                         {/* ── Payments ── */}
//                         {payments.length > 0 && (
//                             <>
//                                 <SectionLabel>Payments</SectionLabel>
//                                 <div className="space-y-2 -mx-2 px-2">
//                                     {payments.map((p) => {
//                                         const ps =
//                                             paymentStatusConfig[p.status] ??
//                                             paymentStatusConfig["PENDING"];
//                                         return (
//                                             <div
//                                                 key={p.id}
//                                                 className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
//                                             >
//                                                 <div className="flex items-center gap-2.5">
//                                                     <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
//                                                         <CreditCard className="h-3.5 w-3.5 text-[#FF5100]" />
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-xs font-semibold text-zinc-700 capitalize">
//                                                             {p.type
//                                                                 .replace(
//                                                                     /_/g,
//                                                                     " ",
//                                                                 )
//                                                                 .toLowerCase()}
//                                                         </p>
//                                                         <p className="text-[10px] text-zinc-400">
//                                                             {p.method.replace(
//                                                                 /_/g,
//                                                                 " ",
//                                                             )}
//                                                             {p.paidAt
//                                                                 ? ` · ${formatDate(p.paidAt?.toString())}`
//                                                                 : ""}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-col items-end gap-1">
//                                                     <p className="text-sm font-bold text-zinc-800">
//                                                         {formatCurrency(
//                                                             p.amount,
//                                                         )}
//                                                     </p>
//                                                     <Badge
//                                                         variant="outline"
//                                                         className={cn(
//                                                             "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0 h-4",
//                                                             ps.className,
//                                                         )}
//                                                     >
//                                                         {ps.label}
//                                                     </Badge>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </>
//                         )}

//                         {/* ── Invoice PDFs ── */}
//                         {invoices.length > 0 && (
//                             <>
//                                 <SectionLabel>Invoices</SectionLabel>
//                                 <div className="grid grid-cols-2 gap-2">
//                                     {invoices.map((p) => {
//                                         const pdfLabel = `${p.type.replace(/_/g, " ").toLowerCase()} invoice`;
//                                         return (
//                                             <PdfThumbnail
//                                                 key={p.id}
//                                                 url={p.invoiceUrl!}
//                                                 label={pdfLabel}
//                                                 onClick={() =>
//                                                     setFullscreenPdf({
//                                                         url: p.invoiceUrl!,
//                                                         label: pdfLabel,
//                                                     })
//                                                 }
//                                             />
//                                         );
//                                     })}
//                                 </div>
//                             </>
//                         )}

//                         {/* ── Customer info ── */}
//                         {customer && (
//                             <>
//                                 <SectionLabel>Customer</SectionLabel>
//                                 <div className="divide-y divide-zinc-50 -mx-2">
//                                     <InfoRow
//                                         icon={User}
//                                         label="Name"
//                                         value={customer.name}
//                                     />
//                                     <InfoRow
//                                         icon={Hash}
//                                         label="Email"
//                                         value={customer.email}
//                                     />
//                                     {customer.mobileNumber && (
//                                         <InfoRow
//                                             icon={Hash}
//                                             label="Phone"
//                                             value={customer.mobileNumber}
//                                         />
//                                     )}
//                                     {customer.licenseNumber && (
//                                         <InfoRow
//                                             icon={FileText}
//                                             label="License No."
//                                             value={customer.licenseNumber}
//                                         />
//                                     )}
//                                 </div>
//                             </>
//                         )}

//                         {/* ── Notes ── */}
//                         {booking.notes && (
//                             <>
//                                 <SectionLabel>Notes</SectionLabel>
//                                 <div className="px-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 mx-2">
//                                     <p className="text-sm text-zinc-600 leading-relaxed">
//                                         {booking.notes}
//                                     </p>
//                                 </div>
//                             </>
//                         )}

//                         {/* ── Cancellation info ── */}
//                         {isCancelled && (
//                             <>
//                                 <SectionLabel>Cancellation</SectionLabel>
//                                 <div className="divide-y divide-zinc-50 -mx-2">
//                                     {booking.cancelledAt && (
//                                         <InfoRow
//                                             icon={Ban}
//                                             label="Cancelled At"
//                                             value={formatDate(
//                                                 booking.cancelledAt,
//                                             )}
//                                         />
//                                     )}
//                                     {booking.cancelledBy && (
//                                         <InfoRow
//                                             icon={User}
//                                             label="Cancelled By"
//                                             value={booking.cancelledBy}
//                                         />
//                                     )}
//                                     {booking.cancellationReason && (
//                                         <InfoRow
//                                             icon={FileText}
//                                             label="Reason"
//                                             value={booking.cancellationReason}
//                                         />
//                                     )}
//                                 </div>
//                             </>
//                         )}

//                         <div className="pb-1" />
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IBooking } from "../../../../types/booking.type";
import {
    Ban,
    CalendarDays,
    CalendarCheck2,
    Car,
    CreditCard,
    Droplets,
    FileText,
    Fuel,
    Hash,
    ReceiptText,
    Timer,
    TrendingUp,
    User,
    Wallet,
    AlertCircle,
    CheckCircle2,
    Clock,
    Banknote,
    FileDown,
    X,
    Maximize2,
    Download,
    ExternalLink,
    Loader2,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// ── Formatters ─────────────────────────────────────────────────────────────────

const formatDate = (date?: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
    }).format(amount);

// ── Status config ──────────────────────────────────────────────────────────────

const statusConfig: Record<
    string,
    { label: string; className: string; icon: React.ElementType }
> = {
    PENDING: {
        label: "Pending",
        className: "border-amber-200 text-amber-600 bg-amber-50",
        icon: Clock,
    },
    ADVANCE_PAID: {
        label: "Advance Paid",
        className: "border-blue-200 text-blue-600 bg-blue-50",
        icon: CreditCard,
    },
    PICKED_UP: {
        label: "Picked Up",
        className: "border-violet-200 text-violet-600 bg-violet-50",
        icon: Car,
    },
    RETURNED: {
        label: "Returned",
        className: "border-teal-200 text-teal-600 bg-teal-50",
        icon: CheckCircle2,
    },
    COMPLETED: {
        label: "Completed",
        className: "border-green-200 text-green-600 bg-green-50",
        icon: CheckCircle2,
    },
    CANCELLED: {
        label: "Cancelled",
        className: "border-zinc-200 text-zinc-500 bg-zinc-50",
        icon: Ban,
    },
};

const paymentStatusConfig: Record<
    string,
    { label: string; className: string }
> = {
    PENDING: {
        label: "Pending",
        className: "text-amber-500 bg-amber-50 border-amber-200",
    },
    PAID: {
        label: "Paid",
        className: "text-green-600 bg-green-50 border-green-200",
    },
    FAILED: {
        label: "Failed",
        className: "text-red-500 bg-red-50 border-red-200",
    },
    REFUNDED: {
        label: "Refunded",
        className: "text-zinc-500 bg-zinc-50 border-zinc-200",
    },
};

// ── InfoRow ────────────────────────────────────────────────────────────────────

const InfoRow = ({
    icon: Icon,
    label,
    value,
    highlight,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
}) => (
    <div
        className={cn(
            "group flex items-start gap-3 rounded-xl px-4 py-3.5 transition-colors duration-150",
            highlight ? "bg-orange-50/60" : "hover:bg-zinc-50",
        )}
    >
        <div
            className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150",
                highlight
                    ? "bg-orange-100 border-orange-200 group-hover:bg-orange-200"
                    : "bg-orange-50 border-orange-100 group-hover:bg-orange-100",
            )}
        >
            <Icon className="h-3.5 w-3.5 text-[#FF5100]" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
                {label}
            </p>
            <div
                className={cn(
                    "text-sm font-medium mt-0.5",
                    highlight ? "text-[#FF5100] font-bold" : "text-zinc-800",
                )}
            >
                {value ?? (
                    <span className="text-zinc-300 font-normal italic text-sm">
                        —
                    </span>
                )}
            </div>
        </div>
    </div>
);

// ── Section Label ──────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-2 px-4 pt-1 pb-0.5">
        <div className="h-px flex-1 bg-zinc-100" />
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.15em] shrink-0">
            {children}
        </span>
        <div className="h-px flex-1 bg-zinc-100" />
    </div>
);

// ── Stat Card ──────────────────────────────────────────────────────────────────

const StatCard = ({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: string;
    sub?: string;
    accent?: boolean;
}) => (
    <div
        className={cn(
            "flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl border py-3 px-2",
            accent
                ? "border-orange-200 bg-orange-50"
                : "border-zinc-100 bg-zinc-50",
        )}
    >
        <p
            className={cn(
                "text-base font-bold leading-tight",
                accent ? "text-[#FF5100]" : "text-zinc-800",
            )}
        >
            {value}
        </p>
        {sub && <p className="text-[10px] text-zinc-400">{sub}</p>}
        <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">
            {label}
        </p>
    </div>
);

// ── Invoice Card (simple, no react-pdf needed) ─────────────────────────────────

const InvoiceCard = ({
    url,
    label,
    onView,
}: {
    url: string;
    label: string;
    onView: () => void;
}) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white hover:border-orange-300 hover:shadow-md transition-all duration-200">
        {/* Icon area */}
        <div className="flex items-center justify-center h-24 bg-linear-to-br from-orange-50 to-zinc-50 border-b border-zinc-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-orange-100 shadow-sm">
                <FileText className="h-7 w-7 text-[#FF5100]" />
            </div>
        </div>

        {/* Label */}
        <div className="px-3 py-2">
            <p className="text-[11px] font-semibold text-zinc-700 truncate capitalize">
                {label}
            </p>
        </div>

        {/* Actions */}
        <div className="flex border-t border-zinc-100">
            <button
                type="button"
                onClick={onView}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-[#FF5100] hover:bg-orange-50 transition-colors cursor-pointer"
            >
                <Eye className="h-3 w-3" />
                View
            </button>
            <div className="w-px bg-zinc-100" />
            <a
                href={url}
                download
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-50 transition-colors"
            >
                <Download className="h-3 w-3" />
                Download
            </a>
        </div>
    </div>
);

// ── Fullscreen PDF Viewer (iframe-based — works everywhere) ────────────────────

const PdfFullscreenViewer = ({
    url,
    label,
    onClose,
}: {
    url: string;
    label: string;
    onClose: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [iframeFailed, setIframeFailed] = useState(false);

    // Lock body scroll
    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    // Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    // Use Google Docs viewer as fallback for cross-origin PDFs
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

    return (
        <div
            className="fixed inset-0 z-9999 flex flex-col bg-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`PDF viewer: ${label}`}
        >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <FileDown className="h-4 w-4 text-[#FF5100] shrink-0" />
                    <span className="text-sm font-semibold text-zinc-100 truncate capitalize max-w-[40vw]">
                        {label}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {/* Try direct view */}
                    {iframeFailed && (
                        <button
                            type="button"
                            onClick={() => setIframeFailed(false)}
                            className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-colors"
                        >
                            Try Direct
                        </button>
                    )}

                    {/* Google viewer fallback */}
                    {!iframeFailed && (
                        <button
                            type="button"
                            onClick={() => setIframeFailed(true)}
                            className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-colors"
                        >
                            Google Viewer
                        </button>
                    )}

                    {/* Open in new tab */}
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-colors"
                    >
                        <ExternalLink className="h-3 w-3" />
                        <span className="hidden sm:inline">New Tab</span>
                    </a>

                    {/* Download */}
                    <a
                        href={url}
                        download
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-400 hover:text-orange-300 border border-orange-500/40 hover:border-orange-400/60 rounded-lg px-3 py-1.5 transition-colors"
                    >
                        <Download className="h-3 w-3" />
                        <span className="hidden sm:inline">Download</span>
                    </a>

                    {/* Close */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                        aria-label="Close PDF viewer"
                    >
                        <X className="h-4 w-4 text-zinc-300" />
                    </button>
                </div>
            </div>

            {/* PDF display area */}
            <div className="flex-1 relative overflow-hidden">
                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FF5100]" />
                        <span className="text-sm text-zinc-400">
                            Loading PDF…
                        </span>
                    </div>
                )}

                {/* iframe — direct or Google viewer */}
                <iframe
                    key={iframeFailed ? "google" : "direct"}
                    src={iframeFailed ? googleViewerUrl : url}
                    className="w-full h-full border-0"
                    title={label}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        if (!iframeFailed) setIframeFailed(true);
                    }}
                />
            </div>

            {/* Bottom info bar */}
            <div className="flex items-center justify-center gap-4 py-2 bg-zinc-900/80 border-t border-zinc-800 shrink-0">
                <span className="text-[11px] text-zinc-500">
                    {iframeFailed
                        ? "Using Google Docs Viewer"
                        : "Direct PDF View"}
                </span>
                <span className="text-[11px] text-zinc-600">•</span>
                <span className="text-[11px] text-zinc-500">
                    Press ESC to close
                </span>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────

interface ViewBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: IBooking | null;
}

export default function ViewBookingDialog({
    open,
    onOpenChange,
    booking,
}: ViewBookingDialogProps) {
    const [fullscreenPdf, setFullscreenPdf] = useState<{
        url: string;
        label: string;
    } | null>(null);

    // Reset fullscreen when dialog closes
    useEffect(() => {
        if (!open) setFullscreenPdf(null);
    }, [open]);

    if (!booking) return null;

    const status = statusConfig[booking.status] ?? statusConfig["PENDING"];
    const StatusIcon = status.icon;
    const vehicle = booking.vehicle;
    const customer = booking.customer;
    const payments = booking.payments ?? [];
    const invoices = payments.filter((p) => !!p.invoiceUrl);
    const isCancelled = booking.status === "CANCELLED";

    // DEBUG: Log invoice URLs
    console.log(
        "Invoice URLs:",
        invoices.map((p) => p.invoiceUrl),
    );

    return (
        <>
            {/* Fullscreen PDF */}
            {fullscreenPdf && (
                <PdfFullscreenViewer
                    url={fullscreenPdf.url}
                    label={fullscreenPdf.label}
                    onClose={() => setFullscreenPdf(null)}
                />
            )}

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-hidden p-0">
                    <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

                    <DialogHeader className="border-b px-6 py-5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <DialogTitle className="text-base font-bold text-zinc-900">
                                    Booking Details
                                </DialogTitle>
                                <DialogDescription className="text-sm text-zinc-400 mt-0.5">
                                    #{booking.id.slice(0, 8).toUpperCase()}
                                </DialogDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shrink-0",
                                    status.className,
                                )}
                            >
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="px-6 py-5 space-y-4 max-h-[calc(90vh-9rem)] overflow-y-auto">
                        {/* ── Vehicle snapshot ── */}
                        {vehicle && (
                            <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
                                {vehicle.image?.[0] ? (
                                    <div className="relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border border-orange-100">
                                        <img
                                            src={vehicle.image[0]}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-orange-200 bg-orange-50">
                                        <Car className="h-6 w-6 text-orange-300" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-zinc-900 truncate">
                                        {vehicle.brand} {vehicle.model}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {vehicle.year} · {vehicle.plateNo}
                                    </p>
                                    <p className="text-xs font-semibold text-[#FF5100] mt-0.5">
                                        {formatCurrency(vehicle.pricePerDay)} /
                                        day
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── Summary stats ── */}
                        <div className="flex gap-2">
                            <StatCard
                                label="Days"
                                value={String(booking.totalDays)}
                                sub={
                                    booking.extraDays
                                        ? `+${booking.extraDays} late`
                                        : undefined
                                }
                            />
                            <StatCard
                                label="Total Cost"
                                value={formatCurrency(booking.totalCost)}
                                accent
                            />
                            <StatCard
                                label="Due"
                                value={formatCurrency(booking.remainingDue)}
                                sub={
                                    booking.remainingDue === 0
                                        ? "Cleared"
                                        : undefined
                                }
                            />
                        </div>

                        {/* ── Rental period ── */}
                        <SectionLabel>Rental Period</SectionLabel>
                        <div className="divide-y divide-zinc-50 -mx-2">
                            <InfoRow
                                icon={CalendarDays}
                                label="Start Date"
                                value={formatDate(booking.startDate)}
                            />
                            <InfoRow
                                icon={CalendarDays}
                                label="End Date"
                                value={formatDate(booking.endDate)}
                            />
                            {booking.pickedUpAt && (
                                <InfoRow
                                    icon={Car}
                                    label="Picked Up At"
                                    value={formatDate(booking.pickedUpAt)}
                                />
                            )}
                            {booking.returnedAt && (
                                <InfoRow
                                    icon={CalendarCheck2}
                                    label="Returned At"
                                    value={formatDate(booking.returnedAt)}
                                />
                            )}
                        </div>

                        {/* ── Cost breakdown ── */}
                        <SectionLabel>Cost Breakdown</SectionLabel>
                        <div className="divide-y divide-zinc-50 -mx-2">
                            <InfoRow
                                icon={Banknote}
                                label="Price Per Day"
                                value={formatCurrency(booking.pricePerDay)}
                            />
                            <InfoRow
                                icon={ReceiptText}
                                label="Base Cost"
                                value={formatCurrency(booking.baseCost)}
                            />
                            <InfoRow
                                icon={Wallet}
                                label="Advance Amount"
                                value={formatCurrency(booking.advanceAmount)}
                            />
                            {booking.lateFee > 0 && (
                                <InfoRow
                                    icon={Timer}
                                    label={`Late Fee (${booking.extraDays} day${booking.extraDays > 1 ? "s" : ""})`}
                                    value={formatCurrency(booking.lateFee)}
                                />
                            )}
                            {booking.fuelCharge > 0 && (
                                <InfoRow
                                    icon={Fuel}
                                    label="Fuel Charge"
                                    value={formatCurrency(booking.fuelCharge)}
                                />
                            )}
                            {booking.fuelCredit > 0 && (
                                <InfoRow
                                    icon={Droplets}
                                    label="Fuel Credit"
                                    value={`− ${formatCurrency(booking.fuelCredit)}`}
                                />
                            )}
                            {booking.damageCharge > 0 && (
                                <InfoRow
                                    icon={AlertCircle}
                                    label="Damage Charge"
                                    value={formatCurrency(booking.damageCharge)}
                                />
                            )}
                            <InfoRow
                                icon={TrendingUp}
                                label="Total Cost"
                                value={formatCurrency(booking.totalCost)}
                                highlight
                            />
                            <InfoRow
                                icon={CreditCard}
                                label="Remaining Due"
                                value={
                                    booking.remainingDue === 0 ? (
                                        <span className="text-green-600 font-semibold">
                                            Fully Paid
                                        </span>
                                    ) : (
                                        formatCurrency(booking.remainingDue)
                                    )
                                }
                            />
                        </div>

                        {/* ── Fuel levels ── */}
                        {(booking.fuelLevelPickup != null ||
                            booking.fuelLevelReturn != null) && (
                            <>
                                <SectionLabel>Fuel Levels</SectionLabel>
                                <div className="divide-y divide-zinc-50 -mx-2">
                                    {booking.fuelLevelPickup != null && (
                                        <InfoRow
                                            icon={Fuel}
                                            label="At Pickup"
                                            value={`${booking.fuelLevelPickup}%`}
                                        />
                                    )}
                                    {booking.fuelLevelReturn != null && (
                                        <InfoRow
                                            icon={Fuel}
                                            label="At Return"
                                            value={`${booking.fuelLevelReturn}%`}
                                        />
                                    )}
                                </div>
                            </>
                        )}
						
                        {/* ── Customer info ── */}
                        {customer && (
                            <>
                                <SectionLabel>Customer</SectionLabel>
                                <div className="divide-y divide-zinc-50 -mx-2">
                                    <InfoRow
                                        icon={User}
                                        label="Name"
                                        value={customer.name}
                                    />
                                    <InfoRow
                                        icon={Hash}
                                        label="Email"
                                        value={customer.email}
                                    />
                                    {customer.mobileNumber && (
                                        <InfoRow
                                            icon={Hash}
                                            label="Phone"
                                            value={customer.mobileNumber}
                                        />
                                    )}
                                    {customer.licenseNumber && (
                                        <InfoRow
                                            icon={FileText}
                                            label="License No."
                                            value={customer.licenseNumber}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        {/* ── Payments ── */}
                        {payments.length > 0 && (
                            <>
                                <SectionLabel>Payments</SectionLabel>
                                <div className="space-y-2 -mx-2 px-2">
                                    {payments.map((p) => {
                                        const ps =
                                            paymentStatusConfig[p.status] ??
                                            paymentStatusConfig["PENDING"];
                                        return (
                                            <div
                                                key={p.id}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
                                                        <CreditCard className="h-3.5 w-3.5 text-[#FF5100]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-zinc-700 capitalize">
                                                            {p.type
                                                                .replace(
                                                                    /_/g,
                                                                    " ",
                                                                )
                                                                .toLowerCase()}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400">
                                                            {p.method.replace(
                                                                /_/g,
                                                                " ",
                                                            )}
                                                            {p.paidAt
                                                                ? ` · ${formatDate(p.paidAt?.toString())}`
                                                                : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <p className="text-sm font-bold text-zinc-800">
                                                        {formatCurrency(
                                                            p.amount,
                                                        )}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0 h-4",
                                                            ps.className,
                                                        )}
                                                    >
                                                        {ps.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* ── Invoice PDFs ── */}
                        {invoices.length > 0 && (
                            <>
                                <SectionLabel>Invoices</SectionLabel>
                                <div className="grid grid-cols-2 gap-2">
                                    {invoices.map((p) => {
                                        const pdfLabel = `${p.type.replace(/_/g, " ").toLowerCase()} invoice`;
                                        return (
                                            <InvoiceCard
                                                key={p.id}
                                                url={p.invoiceUrl!}
                                                label={pdfLabel}
                                                onView={() =>
                                                    setFullscreenPdf({
                                                        url: p.invoiceUrl!,
                                                        label: pdfLabel,
                                                    })
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* ── DEBUG: Show raw URLs ── */}
                        {invoices.length > 0 && (
                            <>
                                <SectionLabel>Debug URLs</SectionLabel>
                                {invoices.map((p) => (
                                    <div
                                        key={p.id}
                                        className="px-4 py-2 bg-zinc-50 rounded-lg border border-zinc-200 mx-2"
                                    >
                                        <p className="text-[10px] text-zinc-400 font-mono break-all">
                                            {p.invoiceUrl}
                                        </p>
                                        <a
                                            href={p.invoiceUrl!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-orange-500 underline mt-1 inline-block"
                                        >
                                            Test this URL →
                                        </a>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ── Notes ── */}
                        {booking.notes && (
                            <>
                                <SectionLabel>Notes</SectionLabel>
                                <div className="px-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 mx-2">
                                    <p className="text-sm text-zinc-600 leading-relaxed">
                                        {booking.notes}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* ── Cancellation info ── */}
                        {isCancelled && (
                            <>
                                <SectionLabel>Cancellation</SectionLabel>
                                <div className="divide-y divide-zinc-50 -mx-2">
                                    {booking.cancelledAt && (
                                        <InfoRow
                                            icon={Ban}
                                            label="Cancelled At"
                                            value={formatDate(
                                                booking.cancelledAt,
                                            )}
                                        />
                                    )}
                                    {booking.cancelledBy && (
                                        <InfoRow
                                            icon={User}
                                            label="Cancelled By"
                                            value={booking.cancelledBy}
                                        />
                                    )}
                                    {booking.cancellationReason && (
                                        <InfoRow
                                            icon={FileText}
                                            label="Reason"
                                            value={booking.cancellationReason}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        <div className="pb-1" />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
