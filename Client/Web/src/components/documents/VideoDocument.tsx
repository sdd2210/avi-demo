import { useEffect, useRef } from "react";
import config from "../../config/config";

function VideoDocument(
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

        // const pptxPrviewer = init(containerRef.current, {
        //     width: containerRef.current.offsetWidth,
        //     height: containerRef.current.offsetHeight
        // });

        // instance.get("/assert/" + item.file_path, { responseType: 'blob' })
        // .then(async res => {
        //     // 2. Set the Blob data in state
        //     const arrayBuffer = await res.data.arrayBuffer();
        // })
        // .catch(error => console.error("Error fetching PDF:", error));
    }, [item, openPresent]);
    
    return (
        <div className="overflow-hidden" >
            <div className="overflow-auto" ref={containerRef}>
                <video className="w-full h-full" autoPlay controls >
                    <source src={config.API_URL+"assert" + item.file_path} />
                </video>
                {/* <ReactPlayer src={config.API_URL+"/assert/" + item.file_path}/> */}
            </div>
            
        </div>
    );

}

export default VideoDocument