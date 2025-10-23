import { Empty } from "antd"
import { useEffect, useRef, } from "react";
import instance from "../../api/axios";
import { renderAsync } from "docx-preview";

function DocxDocument(
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
            // 2. Set the Blob data in state
            const arrayBuffer = await res.data.arrayBuffer();
            if (containerRef.current) {
                await renderAsync(arrayBuffer, containerRef.current, containerRef.current, {
                    // ignoreWidth: true
                    // inWrapper: false,
                } );
                // setDocxData(data.value)
            }
        })
        .catch(error => console.error("Error fetching PDF:", error));
    }, [item]);

    useEffect(() => {
        instance.get("/assert/" + item.file_path, { responseType: 'blob' })
        .then(async res => {
            // 2. Set the Blob data in state
            const arrayBuffer = await res.data.arrayBuffer();
            if (containerRef.current) {
                await renderAsync(arrayBuffer, containerRef.current, containerRef.current, {
                    // ignoreWidth: true
                    // inWrapper: false,
                    className: "docx"
                } );
                // setDocxData(data.value)
            }
        })
        .catch(error => console.error("Error fetching PDF:", error));
    }, [openPresent]);

    return (
        <div className="h-full w-full">
            {
                item == null &&
                <div className="bg-slate-400 flex items-center justify-center h-full" nonce="Chưa chọn file">
                    <Empty/>
                </div>
            }
            {
                item && 
                <div className="">
                    <div className="h-full w-full mx-auto flex flex-col items-center justify-center" ref={containerRef}>

                    </div>
                </div>
            }
        </div>
    )

}

export default DocxDocument