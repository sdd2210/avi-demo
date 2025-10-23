import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import instance from "../../api/axios";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

function PdfDocument(
    {
        item,
        openPresent,
    }: {
        item: any;
        openPresent: string
    }
) {

    const [pdfData, setPdfData] = useState(null);
    const [numPagesOv , setNumPagesOv] = useState<number|null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPagesOv(numPages);
        updateWidth();
    }
    
    const updateWidth = () => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    };
    useEffect(() => {
        if (!containerRef.current) return;
        updateWidth(); // Lần đầu
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        updateWidth();
    }, [openPresent]);

    useEffect(() => {
        instance.get("/assert/" + item.file_path, { responseType: 'blob' })
        .then(res => {
            // 2. Set the Blob data in state
            setPdfData(res.data);
            
        })
        .catch(error => console.error("Error fetching PDF:", error));
    }, [item]);

    if (!pdfData) {
        return <div>Loading PDF...</div>;
    }

    return (
        <div className="overflow-hidden" ref={containerRef}>
            <Document className={"overflow-auto w-full h-full!"} file={pdfData} onLoadSuccess={onDocumentLoadSuccess} >
                {Array.from(new Array(numPagesOv), (_el, index) => (
                    <Page className={"mx-auto"} key={`page_${index + 1}`} pageNumber={index + 1} width={containerWidth}/>
                ))}
            </Document>
        </div>
    );
    // return (
    //     <div className="h-full">
    //         {
    //             item == null &&
    //             <div className="bg-slate-400 flex items-center justify-center h-full" nonce="Chưa chọn file">
    //                 <Empty/>
    //             </div>
    //         }
    //         {
    //             item && 
    //             <>
    //                 <div className="flex flex-col items-center h-full justify-center bg-red-100">
    //                     <div className="font-bold text-2xl">Nội dung file {item?.file_name}</div>
    //                 </div>
    //             </>
    //         }
    //     </div>
    // )

}

export default PdfDocument