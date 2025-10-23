// import { useEffect, useRef, useState } from "react";
// import instance from "../../api/axios";
// import ReactPlayer from 'react-player'
import config from "../../config/config";

function ImageDocument(
    {
        item,
    }: {
        item: any;
    }
) {
    
    return (
        <div className="overflow-hidden w-full h-full" >
            <img src={config.API_URL+"assert" + item.file_path} className="w-full h-full object-cover"/>
        </div>
    );

}

export default ImageDocument