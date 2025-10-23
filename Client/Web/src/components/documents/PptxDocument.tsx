import { useEffect, useRef } from "react";
import instance from "../../api/axios";
import {init} from 'pptx-preview'

function PptxDocument(
    {
        item,
        openPresent,
    }: {
        item: any;
        openPresent: string
    }
) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const pptxPrviewer = init(containerRef.current, {
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight
        });

        instance.get("/assert/" + item.file_path, { responseType: 'blob' })
        .then(async res => {
            // 2. Set the Blob data in state
            const arrayBuffer = await res.data.arrayBuffer();
            await pptxPrviewer.preview(arrayBuffer);
        })
        .catch(error => console.error("Error fetching PDF:", error));
    }, [item, openPresent]);
    
    return (
        <div className="overflow-hidden" >
            <div ref={containerRef}>

            </div>
            
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

export default PptxDocument