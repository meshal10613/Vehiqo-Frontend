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
//     Eye,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useState, useEffect } from "react";

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
//     UNPAID: {
//         label: "Unpaid",
//         className: "text-orange-500 bg-orange-50 border-orange-200",
//     },
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

// const SectionLabel = ({ children }: { children: React.ReactNode }) => (
//     <div className="flex items-center gap-2 px-4 pt-1 pb-0.5">
//         <div className="h-px flex-1 bg-zinc-100" />
//         <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.15em] shrink-0">
//             {children}
//         </span>
//         <div className="h-px flex-1 bg-zinc-100" />
//     </div>
// );

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

// /**
//  * Convert Cloudinary URL to viewable format
//  * Adds fl_attachment:false to enable in-browser viewing
//  * Handles URLs with or without version numbers
//  */
// const getViewablePdfUrl = (url: string) => {
//     if (!url) return url;

//     // If it already has fl_attachment:false, return as is
//     if (url.includes("fl_attachment:false")) {
//         return url;
//     }

//     // If it has fl_attachment:true, replace it
//     if (url.includes("fl_attachment:true")) {
//         return url.replace("fl_attachment:true", "fl_attachment:false");
//     }

//     // For Cloudinary URLs, insert transformation after /upload/
//     // Pattern: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{path}
//     // Convert to: https://res.cloudinary.com/{cloud}/image/upload/fl_attachment:false/v{version}/{path}
//     if (url.includes("cloudinary.com")) {
//         const uploadMatch = url.match(/\/upload\//);
//         if (uploadMatch) {
//             const uploadIndex = uploadMatch.index! + uploadMatch[0].length;
//             const urlBefore = url.substring(0, uploadIndex);
//             const urlAfter = url.substring(uploadIndex);
//             return `${urlBefore}fl_attachment:false/${urlAfter}`;
//         }
//     }

//     // Return as-is for non-Cloudinary URLs
//     return url;
// };

// /**
//  * Get download URL (force attachment download)
//  * Adds fl_attachment:true to trigger download dialog
//  */
// const getDownloadUrl = (url: string) => {
//     if (!url) return url;

//     // If it already has fl_attachment:false, replace with true
//     if (url.includes("fl_attachment:false")) {
//         return url.replace("fl_attachment:false", "fl_attachment:true");
//     }

//     // If it has fl_attachment:true, return as is
//     if (url.includes("fl_attachment:true")) {
//         return url;
//     }

//     // For Cloudinary URLs without any attachment flag
//     if (url.includes("cloudinary.com")) {
//         const uploadMatch = url.match(/\/upload\//);
//         if (uploadMatch) {
//             const uploadIndex = uploadMatch.index! + uploadMatch[0].length;
//             const urlBefore = url.substring(0, uploadIndex);
//             const urlAfter = url.substring(uploadIndex);
//             return `${urlBefore}fl_attachment:true/${urlAfter}`;
//         }
//     }

//     // Return as-is for non-Cloudinary URLs
//     return url;
// };

// const InvoiceCard = ({
//     url,
//     label,
//     onView,
// }: {
//     url: string;
//     label: string;
//     onView: () => void;
// }) => {
//     const downloadUrl = getDownloadUrl(url);

//     return (
//         <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white hover:border-orange-300 hover:shadow-md transition-all duration-200">
//             {/* Icon area */}
//             <div className="flex items-center justify-center h-24 bg-linear-to-br from-orange-50 to-zinc-50 border-b border-zinc-100">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-orange-100 shadow-sm">
//                     <FileText className="h-7 w-7 text-[#FF5100]" />
//                 </div>
//             </div>

//             {/* Label */}
//             <div className="px-3 py-2">
//                 <p className="text-[11px] font-semibold text-zinc-700 truncate capitalize">
//                     {label}
//                 </p>
//             </div>

//             {/* Actions */}
//             <div className="flex border-t border-zinc-100">
//                 <button
//                     type="button"
//                     onClick={onView}
//                     className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-[#FF5100] hover:bg-orange-50 transition-colors cursor-pointer"
//                 >
//                     <Eye className="h-3 w-3" />
//                     View
//                 </button>
//                 <div className="w-px bg-zinc-100" />
//                 <a
//                     href={downloadUrl}
//                     download
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-50 transition-colors"
//                 >
//                     <Download className="h-3 w-3" />
//                     Download
//                 </a>
//             </div>
//         </div>
//     );
// };

// const PdfFullscreenViewer = ({
//     url,
//     label,
//     onClose,
// }: {
//     url: string;
//     label: string;
//     onClose: () => void;
// }) => {
//     const [isLoading, setIsLoading] = useState(true);
//     const [iframeFailed, setIframeFailed] = useState(false);

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

//     const viewUrl = getViewablePdfUrl(url);
//     const downloadUrl = getDownloadUrl(url);
//     console.log(viewUrl);
//     // Use Google Docs viewer as fallback
//     const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(viewUrl)}&embedded=true`;

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
//                     <span className="text-sm font-semibold text-zinc-100 truncate capitalize max-w-[40vw]">
//                         {label}
//                     </span>
//                 </div>

//                 <div className="flex items-center gap-2 shrink-0">
//                     {/* Try direct view / Google viewer toggle */}
//                     <button
//                         type="button"
//                         onClick={() => setIframeFailed(!iframeFailed)}
//                         className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-colors"
//                         title={
//                             iframeFailed
//                                 ? "Switch to direct view"
//                                 : "Switch to Google Docs viewer"
//                         }
//                     >
//                         {iframeFailed ? "Try Direct" : "Use Viewer"}
//                     </button>

//                     {/* Open in new tab */}
//                     <a
//                         href={viewUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-colors"
//                         title="Open PDF in new tab"
//                     >
//                         <ExternalLink className="h-3 w-3" />
//                         <span className="hidden sm:inline">Open</span>
//                     </a>

//                     {/* Download */}
//                     <a
//                         href={downloadUrl}
//                         // onClick={(e) => {
//                         //     e.preventDefault();
//                         //     try {
//                         //         console.log("Downloading from:", downloadUrl);
//                         //         const link = document.createElement("a");
//                         //         link.href = downloadUrl;
//                         //         link.setAttribute("download", label);
//                         //         document.body.appendChild(link);
//                         //         link.click();
//                         //         document.body.removeChild(link);
//                         //     } catch (error) {
//                         //         console.error("Download failed:", error);
//                         //         // Fallback: open in new tab
//                         //         window.open(downloadUrl, "_blank");
//                         //     }
//                         // }}
//                         download
//                         className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-400 hover:text-orange-300 border border-orange-500/40 hover:border-orange-400/60 rounded-lg px-3 py-1.5 transition-colors"
//                         title="Download PDF to your device"
//                     >
//                         <Download className="h-3 w-3" />
//                         <span className="hidden sm:inline">Download</span>
//                     </a>

//                     {/* Close */}
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
//                         aria-label="Close PDF viewer"
//                     >
//                         <X className="h-4 w-4 text-zinc-300" />
//                     </button>
//                 </div>
//             </div>

//             {/* PDF display area */}
//             <div className="flex-1 relative overflow-hidden bg-black">
//                 {/* Loading overlay */}
//                 {isLoading && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900 z-10">
//                         <Loader2 className="h-8 w-8 animate-spin text-[#FF5100]" />
//                         <span className="text-sm text-zinc-400">
//                             Loading PDF…
//                         </span>
//                     </div>
//                 )}

//                 {/* iframe — direct or Google viewer */}
//                 {!iframeFailed ? (
//                     <iframe
//                         key="direct"
//                         src={viewUrl}
//                         className="w-full h-full border-0"
//                         title={label}
//                         sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
//                         onLoad={() => setIsLoading(false)}
//                         onError={() => {
//                             setIsLoading(false);
//                             console.error(
//                                 "Direct PDF view failed, switching to Google Docs viewer",
//                             );
//                             setIframeFailed(true);
//                         }}
//                     />
//                 ) : (
//                     <iframe
//                         key="google"
//                         src={googleViewerUrl}
//                         className="w-full h-full border-0"
//                         title={label}
//                         onLoad={() => setIsLoading(false)}
//                         onError={() => {
//                             setIsLoading(false);
//                             console.error("Google Docs viewer also failed");
//                         }}
//                     />
//                 )}
//             </div>

//             {/* Bottom info bar */}
//             <div className="flex items-center justify-center gap-4 py-2 bg-zinc-900/80 border-t border-zinc-800 shrink-0 text-xs">
//                 <span className="text-zinc-500">
//                     {iframeFailed ? "Google Docs Viewer" : "Direct PDF View"}
//                 </span>
//                 <span className="text-zinc-600">•</span>
//                 <span className="text-zinc-500">Press ESC to close</span>
//             </div>
//         </div>
//     );
// };

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

//     if (!booking && !fullscreenPdf) return null;

//     const bookingStatus = booking?.status ?? "PENDING";
//     const status = statusConfig[bookingStatus] ?? statusConfig["PENDING"];
//     const StatusIcon = status.icon;
//     const vehicle = booking?.vehicle;
//     const customer = booking?.customer;
//     const payments = booking?.payments ?? [];
//     const invoices = payments.filter((p) => !!p.invoiceUrl);
//     const isCancelled = booking?.status === "CANCELLED";

//     return (
//         <>
//             {/* Fullscreen PDF Viewer */}
//             {fullscreenPdf && (
//                 <PdfFullscreenViewer
//                     url={fullscreenPdf.url}
//                     label={fullscreenPdf.label}
//                     onClose={() => setFullscreenPdf(null)}
//                 />
//             )}

//             {booking && (
//                 <Dialog open={open} onOpenChange={onOpenChange}>
//                     <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-hidden p-0">
//                         <div className="h-1 w-full bg-linear-to-r from-orange-400 via-[#FF5100] to-orange-400" />

//                         <DialogHeader className="border-b px-6 py-5">
//                             <div className="flex items-start justify-between gap-3">
//                                 <div>
//                                     <DialogTitle className="text-base font-bold text-zinc-900">
//                                         Booking Details
//                                     </DialogTitle>
//                                     <DialogDescription className="text-sm text-zinc-400 mt-0.5">
//                                         #{booking.id.slice(0, 8).toUpperCase()}
//                                     </DialogDescription>
//                                 </div>
//                                 <Badge
//                                     variant="outline"
//                                     className={cn(
//                                         "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shrink-0",
//                                         status.className,
//                                     )}
//                                 >
//                                     <StatusIcon className="h-3 w-3" />
//                                     {status.label}
//                                 </Badge>
//                             </div>
//                         </DialogHeader>

//                         <div className="px-6 py-5 space-y-4 max-h-[calc(90vh-9rem)] overflow-y-auto">
//                             {/* ── Vehicle snapshot ── */}
//                             {vehicle && (
//                                 <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
//                                     {vehicle.image?.[0] ? (
//                                         <div className="relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border border-orange-100">
//                                             <img
//                                                 src={vehicle.image[0]}
//                                                 alt={`${vehicle.brand} ${vehicle.model}`}
//                                                 className="h-full w-full object-cover"
//                                             />
//                                         </div>
//                                     ) : (
//                                         <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-orange-200 bg-orange-50">
//                                             <Car className="h-6 w-6 text-orange-300" />
//                                         </div>
//                                     )}
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-bold text-zinc-900 truncate">
//                                             {vehicle.brand} {vehicle.model}
//                                         </p>
//                                         <p className="text-xs text-zinc-500 mt-0.5">
//                                             {vehicle.year} · {vehicle.plateNo}
//                                         </p>
//                                         <p className="text-xs font-semibold text-[#FF5100] mt-0.5">
//                                             {formatCurrency(
//                                                 vehicle.pricePerDay,
//                                             )}{" "}
//                                             / day
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}

//                             <div className="flex gap-2">
//                                 <StatCard
//                                     label="Days"
//                                     value={String(booking.totalDays)}
//                                     sub={
//                                         booking.extraDays
//                                             ? `+${booking.extraDays} late`
//                                             : undefined
//                                     }
//                                 />
//                                 <StatCard
//                                     label="Total Cost"
//                                     value={formatCurrency(booking.totalCost)}
//                                     accent
//                                 />
//                                 <StatCard
//                                     label="Due"
//                                     value={formatCurrency(booking.remainingDue)}
//                                     sub={
//                                         booking.remainingDue === 0
//                                             ? "Cleared"
//                                             : undefined
//                                     }
//                                 />
//                             </div>

//                             {/* ── Rental period ── */}
//                             <SectionLabel>Rental Period</SectionLabel>
//                             <div className="divide-y divide-zinc-50 -mx-2">
//                                 <InfoRow
//                                     icon={CalendarDays}
//                                     label="Start Date"
//                                     value={formatDate(booking.startDate)}
//                                 />
//                                 <InfoRow
//                                     icon={CalendarDays}
//                                     label="End Date"
//                                     value={formatDate(booking.endDate)}
//                                 />
//                                 {booking.pickedUpAt && (
//                                     <InfoRow
//                                         icon={Car}
//                                         label="Picked Up At"
//                                         value={formatDate(booking.pickedUpAt)}
//                                     />
//                                 )}
//                                 {booking.returnedAt && (
//                                     <InfoRow
//                                         icon={CalendarCheck2}
//                                         label="Returned At"
//                                         value={formatDate(booking.returnedAt)}
//                                     />
//                                 )}
//                             </div>

//                             {/* ── Cost breakdown ── */}
//                             <SectionLabel>Cost Breakdown</SectionLabel>
//                             <div className="divide-y divide-zinc-50 -mx-2">
//                                 <InfoRow
//                                     icon={Banknote}
//                                     label="Price Per Day"
//                                     value={formatCurrency(booking.pricePerDay)}
//                                 />
//                                 <InfoRow
//                                     icon={ReceiptText}
//                                     label="Base Cost"
//                                     value={formatCurrency(booking.baseCost)}
//                                 />
//                                 <InfoRow
//                                     icon={Wallet}
//                                     label="Advance Amount"
//                                     value={formatCurrency(
//                                         booking.advanceAmount,
//                                     )}
//                                 />
//                                 {booking.lateFee > 0 && (
//                                     <InfoRow
//                                         icon={Timer}
//                                         label={`Late Fee (${booking.extraDays} day${booking.extraDays > 1 ? "s" : ""})`}
//                                         value={formatCurrency(booking.lateFee)}
//                                     />
//                                 )}
//                                 {booking.fuelCharge > 0 && (
//                                     <InfoRow
//                                         icon={Fuel}
//                                         label="Fuel Charge"
//                                         value={formatCurrency(
//                                             booking.fuelCharge,
//                                         )}
//                                     />
//                                 )}
//                                 {booking.fuelCredit > 0 && (
//                                     <InfoRow
//                                         icon={Droplets}
//                                         label="Fuel Credit"
//                                         value={`− ${formatCurrency(booking.fuelCredit)}`}
//                                     />
//                                 )}
//                                 {booking.damageCharge > 0 && (
//                                     <InfoRow
//                                         icon={AlertCircle}
//                                         label="Damage Charge"
//                                         value={formatCurrency(
//                                             booking.damageCharge,
//                                         )}
//                                     />
//                                 )}
//                                 <InfoRow
//                                     icon={TrendingUp}
//                                     label="Total Cost"
//                                     value={formatCurrency(booking.totalCost)}
//                                     highlight
//                                 />
//                                 <InfoRow
//                                     icon={CreditCard}
//                                     label="Remaining Due"
//                                     value={
//                                         booking.remainingDue === 0 ? (
//                                             <span className="text-green-600 font-semibold">
//                                                 Fully Paid
//                                             </span>
//                                         ) : (
//                                             formatCurrency(booking.remainingDue)
//                                         )
//                                     }
//                                 />
//                             </div>

//                             {/* ── Fuel levels ── */}
//                             {(booking.fuelLevelPickup != null ||
//                                 booking.fuelLevelReturn != null) && (
//                                 <>
//                                     <SectionLabel>Fuel Levels</SectionLabel>
//                                     <div className="divide-y divide-zinc-50 -mx-2">
//                                         {booking.fuelLevelPickup != null && (
//                                             <InfoRow
//                                                 icon={Fuel}
//                                                 label="At Pickup"
//                                                 value={`${booking.fuelLevelPickup}%`}
//                                             />
//                                         )}
//                                         {booking.fuelLevelReturn != null && (
//                                             <InfoRow
//                                                 icon={Fuel}
//                                                 label="At Return"
//                                                 value={`${booking.fuelLevelReturn}%`}
//                                             />
//                                         )}
//                                     </div>
//                                 </>
//                             )}

//                             {/* ── Customer info ── */}
//                             {customer && (
//                                 <>
//                                     <SectionLabel>Customer</SectionLabel>
//                                     <div className="divide-y divide-zinc-50 -mx-2">
//                                         <InfoRow
//                                             icon={User}
//                                             label="Name"
//                                             value={customer.name}
//                                         />
//                                         <InfoRow
//                                             icon={Hash}
//                                             label="Email"
//                                             value={customer.email}
//                                         />
//                                         {customer.mobileNumber && (
//                                             <InfoRow
//                                                 icon={Hash}
//                                                 label="Phone"
//                                                 value={customer.mobileNumber}
//                                             />
//                                         )}
//                                         {customer.licenseNumber && (
//                                             <InfoRow
//                                                 icon={FileText}
//                                                 label="License No."
//                                                 value={customer.licenseNumber}
//                                             />
//                                         )}
//                                     </div>
//                                 </>
//                             )}

//                             {/* ── Payments ── */}
//                             {payments.length > 0 && (
//                                 <>
//                                     <SectionLabel>Payments</SectionLabel>
//                                     <div className="space-y-2 -mx-2 px-2">
//                                         {payments.map((p) => {
//                                             const ps =
//                                                 paymentStatusConfig[p.status] ??
//                                                 paymentStatusConfig["PENDING"];
//                                             return (
//                                                 <div
//                                                     key={p.id}
//                                                     className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3"
//                                                 >
//                                                     <div className="flex items-center gap-2.5">
//                                                         <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
//                                                             <CreditCard className="h-3.5 w-3.5 text-[#FF5100]" />
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-xs font-semibold text-zinc-700 capitalize">
//                                                                 {p.type
//                                                                     .replace(
//                                                                         /_/g,
//                                                                         " ",
//                                                                     )
//                                                                     .toLowerCase()}
//                                                             </p>
//                                                             <p className="text-[10px] text-zinc-400">
//                                                                 {p.method.replace(
//                                                                     /_/g,
//                                                                     " ",
//                                                                 )}
//                                                                 {p.paidAt
//                                                                     ? ` · ${formatDate(p.paidAt?.toString())}`
//                                                                     : ""}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex flex-col items-end gap-1">
//                                                         <p className="text-sm font-bold text-zinc-800">
//                                                             {formatCurrency(
//                                                                 p.amount,
//                                                             )}
//                                                         </p>
//                                                         <Badge
//                                                             variant="outline"
//                                                             className={cn(
//                                                                 "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0 h-4",
//                                                                 ps.className,
//                                                             )}
//                                                         >
//                                                             {ps.label}
//                                                         </Badge>
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </>
//                             )}

//                             {/* ── Invoice PDFs ── */}
//                             {invoices.length > 0 && (
//                                 <>
//                                     <SectionLabel>Invoices</SectionLabel>
//                                     <div className="grid grid-cols-2 gap-2">
//                                         {invoices.map((p) => {
//                                             const pdfLabel = `${p.type.replace(/_/g, " ").toLowerCase()} invoice`;
//                                             return (
//                                                 <InvoiceCard
//                                                     key={p.id}
//                                                     url={p.invoiceUrl!}
//                                                     label={pdfLabel}
//                                                     onView={() => {
//                                                         setFullscreenPdf({
//                                                             url: p.invoiceUrl!,
//                                                             label: pdfLabel,
//                                                         });

//                                                         onOpenChange(false);
//                                                     }}
//                                                 />
//                                             );
//                                         })}
//                                     </div>
//                                 </>
//                             )}

//                             {/* ── Notes ── */}
//                             {booking.notes && (
//                                 <>
//                                     <SectionLabel>Notes</SectionLabel>
//                                     <div className="px-4 py-3 rounded-xl border border-zinc-100 bg-zinc-50 mx-2">
//                                         <p className="text-sm text-zinc-600 leading-relaxed">
//                                             {booking.notes}
//                                         </p>
//                                     </div>
//                                 </>
//                             )}

//                             {/* ── Cancellation info ── */}
//                             {isCancelled && (
//                                 <>
//                                     <SectionLabel>Cancellation</SectionLabel>
//                                     <div className="divide-y divide-zinc-50 -mx-2">
//                                         {booking.cancelledAt && (
//                                             <InfoRow
//                                                 icon={Ban}
//                                                 label="Cancelled At"
//                                                 value={formatDate(
//                                                     booking.cancelledAt,
//                                                 )}
//                                             />
//                                         )}
//                                         {booking.cancelledBy && (
//                                             <InfoRow
//                                                 icon={User}
//                                                 label="Cancelled By"
//                                                 value={booking.cancelledBy}
//                                             />
//                                         )}
//                                         {booking.cancellationReason && (
//                                             <InfoRow
//                                                 icon={FileText}
//                                                 label="Reason"
//                                                 value={
//                                                     booking.cancellationReason
//                                                 }
//                                             />
//                                         )}
//                                     </div>
//                                 </>
//                             )}

//                             <div className="pb-1" />
//                         </div>
//                     </DialogContent>
//                 </Dialog>
//             )}
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
    Download,
    ExternalLink,
    Loader2,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";

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
    UNPAID: {
        label: "Unpaid",
        className: "text-orange-500 bg-orange-50 border-orange-200",
    },
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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-2 px-4 pt-1 pb-0.5">
        <div className="h-px flex-1 bg-zinc-100" />
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.15em] shrink-0">
            {children}
        </span>
        <div className="h-px flex-1 bg-zinc-100" />
    </div>
);

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

/**
 * Get inline-viewable URL for Cloudinary PDFs.
 * Uses fl_inline which sets Content-Disposition: inline server-side —
 * far more reliable than fl_attachment:false which only hints to the CDN.
 */
const getViewablePdfUrl = (url: string): string => {
    if (!url) return url;
    if (!url.includes("cloudinary.com")) return url;

    // Strip any existing fl_attachment or fl_inline flags to avoid conflicts
    const cleaned = url
        .replace(/fl_attachment(:[^/]*)?\//, "")
        .replace(/fl_inline\//, "");

    // Insert fl_inline right after /upload/
    return cleaned.replace(/\/upload\//, "/upload/fl_inline/");
};

/**
 * Programmatic blob-based download.
 *
 * The native <a download> attribute is silently ignored by browsers for
 * cross-origin URLs (Cloudinary is a different origin). We must fetch the
 * file as a blob and create an object URL to trigger a real download dialog.
 */
const downloadPdf = async (url: string, filename: string): Promise<void> => {
    // Build the download URL: strip any existing flags, add fl_attachment
    const cleaned = url
        .replace(/fl_attachment(:[^/]*)?\//, "")
        .replace(/fl_inline\//, "");
    const downloadUrl = cleaned.replace(/\/upload\//, "/upload/fl_attachment/");

    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL after a short delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
    } catch (err) {
        console.error("PDF download failed, falling back to new tab:", err);
        window.open(downloadUrl, "_blank");
    }
};

const InvoiceCard = ({
    url,
    label,
}: {
    url: string;
    label: string;
}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        await downloadPdf(url, label);
        setIsDownloading(false);
    };

    return (
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
                <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-[#FF5100] hover:bg-orange-50 transition-colors cursor-pointer"
                >
                    <Eye className="h-3 w-3" />
                    View
                </Link>
                <div className="w-px bg-zinc-100" />
                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDownloading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        <Download className="h-3 w-3" />
                    )}
                    {isDownloading ? "…" : "Download"}
                </button>
            </div>
        </div>
    );
};

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
    const [useGoogleViewer, setUseGoogleViewer] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const viewUrl = getViewablePdfUrl(url);
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(viewUrl)}&embedded=true`;

    // Lock body scroll
    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    // Escape key to close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    // Reset loading state whenever the viewer source switches
    useEffect(() => {
        setIsLoading(true);
    }, [useGoogleViewer]);

    const handleDownload = async () => {
        setIsDownloading(true);
        await downloadPdf(url, label);
        setIsDownloading(false);
    };

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
                    {/* Toggle viewer mode */}
                    <button
                        type="button"
                        onClick={() => setUseGoogleViewer((v) => !v)}
                        className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-colors"
                        title={
                            useGoogleViewer
                                ? "Switch to direct view"
                                : "Switch to Google Docs viewer"
                        }
                    >
                        {useGoogleViewer ? "Try Direct" : "Use Viewer"}
                    </button>

                    {/* Open in new tab — always uses the fl_inline URL */}
                    <a
                        href={viewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg px-3 py-1.5 transition-colors"
                        title="Open PDF in new tab"
                    >
                        <ExternalLink className="h-3 w-3" />
                        <span className="hidden sm:inline">Open</span>
                    </a>

                    {/* Download — blob-based to bypass cross-origin restriction */}
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-400 hover:text-orange-300 border border-orange-500/40 hover:border-orange-400/60 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download PDF to your device"
                    >
                        {isDownloading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <Download className="h-3 w-3" />
                        )}
                        <span className="hidden sm:inline">
                            {isDownloading ? "Downloading…" : "Download"}
                        </span>
                    </button>

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
            <div className="flex-1 relative overflow-hidden bg-zinc-950">
                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FF5100]" />
                        <span className="text-sm text-zinc-400">
                            Loading PDF…
                        </span>
                    </div>
                )}

                {/*
                 * Direct viewer: NO sandbox attribute.
                 * The sandbox attribute — even with allow-same-origin — can
                 * prevent the browser's native PDF plugin from mounting for
                 * cross-origin documents. Removing it gives the iframe full
                 * trust, which is what we need for the PDF renderer to work.
                 *
                 * fl_inline on the URL ensures Cloudinary responds with
                 * Content-Disposition: inline so the browser renders it
                 * instead of downloading it.
                 */}
                {!useGoogleViewer ? (
                    <iframe
                        key="direct"
                        src={viewUrl}
                        className="w-full h-full border-0"
                        title={label}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setUseGoogleViewer(true);
                        }}
                    />
                ) : (
                    <iframe
                        key="google"
                        src={googleViewerUrl}
                        className="w-full h-full border-0"
                        title={label}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            console.error("Google Docs viewer also failed");
                        }}
                    />
                )}
            </div>

            {/* Bottom info bar */}
            <div className="flex items-center justify-center gap-4 py-2 bg-zinc-900/80 border-t border-zinc-800 shrink-0 text-xs">
                <span className="text-zinc-500">
                    {useGoogleViewer ? "Google Docs Viewer" : "Direct PDF View"}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500">Press ESC to close</span>
            </div>
        </div>
    );
};

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

    // Reset fullscreen when dialog closes — but only if the viewer isn't
    // intentionally open (i.e. we closed the dialog to show the viewer).
    useEffect(() => {
        if (!open && !fullscreenPdf) setFullscreenPdf(null);
    }, [open]);

    const openPdfViewer = (url: string, label: string) => {
        // Mount the viewer first, THEN close the dialog.
        // If we close first, the component tree collapses before the viewer
        // renders and nothing is shown.
        setFullscreenPdf({ url, label });
        setTimeout(() => onOpenChange(false), 50);
    };

    // Allow rendering if either the dialog booking is set OR the viewer is open.
    // Without this, closing the dialog would unmount the viewer immediately.
    if (!booking && !fullscreenPdf) return null;

    const bookingStatus = booking?.status ?? "PENDING";
    const status = statusConfig[bookingStatus] ?? statusConfig["PENDING"];
    const StatusIcon = status.icon;
    const vehicle = booking?.vehicle;
    const customer = booking?.customer;
    const payments = booking?.payments ?? [];
    const invoices = payments.filter((p) => !!p.invoiceUrl);
    const isCancelled = booking?.status === "CANCELLED";

    return (
        <>
            {/* Fullscreen PDF Viewer — rendered outside the Dialog so it isn't
                clipped by the dialog's overflow or z-index stacking context */}
            {fullscreenPdf && (
                <PdfFullscreenViewer
                    url={fullscreenPdf.url}
                    label={fullscreenPdf.label}
                    onClose={() => {
                        setFullscreenPdf(null);
                        // Re-open the booking dialog when viewer is dismissed
                        onOpenChange(true);
                    }}
                />
            )}

            {booking && (
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
                                            {formatCurrency(vehicle.pricePerDay)} / day
                                        </p>
                                    </div>
                                </div>
                            )}

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
                                                                    .replace(/_/g, " ")
                                                                    .toLowerCase()}
                                                            </p>
                                                            <p className="text-[10px] text-zinc-400">
                                                                {p.method.replace(/_/g, " ")}
                                                                {p.paidAt
                                                                    ? ` · ${formatDate(p.paidAt?.toString())}`
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <p className="text-sm font-bold text-zinc-800">
                                                            {formatCurrency(p.amount)}
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
                                                />
                                            );
                                        })}
                                    </div>
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
                                                value={formatDate(booking.cancelledAt)}
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
            )}
        </>
    );
}