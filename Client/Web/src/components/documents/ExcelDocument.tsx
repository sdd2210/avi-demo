import { useEffect, useRef } from "react";
import instance from "../../api/axios";
// @ts-ignore
import * as xlsxPreview from 'xlsx-preview';
// import { Workbook, type WorkbookModel } from 'exceljs'

function ExcelDocument(
    {
        item,
        openPresent,
    }: {
        item: any;
        openPresent: string
    }
) {

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        instance.get("/assert/" + item.file_path, { responseType: 'blob' })
            .then(async res => {
                
                const arrayBuffer = await res.data.arrayBuffer();
                if (!containerRef.current) return;
                const result = await xlsxPreview.xlsx2Html(arrayBuffer, { separateSheets: false });
                containerRef.current.innerHTML = result
            })
            .catch(error => console.error("Error fetching PDF:", error));
    }, [item, openPresent]);



    return (
        <div className="overflow-hidden h-full w-full" >
            <div className="overflow-auto h-full w-full" ref={containerRef}>

            </div>
        </div>
    );

}

export default ExcelDocument