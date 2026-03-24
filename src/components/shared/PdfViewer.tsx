"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// ✅ Fix worker issue
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Props = {
    fileUrl: string;
};

export default function PdfViewer({ fileUrl }: Props) {
    const [numPages, setNumPages] = useState<number>(0);

    function onLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <Document file={fileUrl} onLoadSuccess={onLoadSuccess}>
                {Array.from(new Array(numPages), (_, i) => (
                    <Page key={i} pageNumber={i + 1} />
                ))}
            </Document>
        </div>
    );
}
