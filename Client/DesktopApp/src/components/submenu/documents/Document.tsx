import { FileExcelOutlined, FilePdfOutlined, FilePptOutlined, FileWordOutlined } from "@ant-design/icons";
import { Button, Card, Avatar, List, Input, Empty } from "antd";
import { Download, File, FileImage, FileText, FileVideo, Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";
import DocxDocument from "../../documents/DocxDocument";
import 'react-quill-new/dist/quill.snow.css';
import config from "../../../config/config";
import instance from "../../../api/axios";
import type { MeetingDocumentType } from "../../../enum/MeetingDocumentType";
import PdfDocument from "../../documents/PdfDocument";
import PptxDocument from "../../documents/PptxDocument";
import ExcelDocument from "../../documents/ExcelDocument";
import VideoDocument from "../../documents/VideoDocument";
import ImageDocument from "../../documents/ImageDocument";
// import WebRTSPlayer from "../../video/WebRTSPlayer";
import VideoWrapper from "../../video/VideoWrapper";
const {Search} = Input

function Document(
    {
        role,
        open,
    }: {
        role: "delegate" | "chairman"
        open: boolean
    }
) {
    
    const [selectDoc, setSelectDoc] = useState<number|null>(null);
    const [_, setOpenPresent] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [__, setOpenCollapse] = useState(false);
    const [docLst, setDocLst] = useState<Array<MeetingDocumentType|never>>([]);
    const [screenLayout, setScreenLayout] = useState({
        infor: "col-span-2 row-span-3 min-w-2xl",
        camera: "col-start-3",
        list: "row-span-2 col-start-3 row-start-2",
    });
    const [mode, setMode] = useState("normal");

    const fileIconGen = (file_type: string) =>{
        if(file_type.includes("pdf")){
            return <FilePdfOutlined className="text-orange-600! text-2xl"/>
        }
        if(file_type.includes("powerpoint") || file_type.includes("presentation")){
            return <FilePptOutlined className="text-red-600! text-2xl" size={25}/>
        }
        if(file_type.includes("word")){
            return <FileWordOutlined className="text-blue-600! text-2xl" size={25}/>
        }
        if(file_type.includes("excel")|| file_type.includes("sheet")){
            return <FileExcelOutlined className="text-green-600! text-2xl" size={25}/>
        }
        if(file_type.includes("video")){
            return <FileVideo className="text-sky-600! text-2xl" size={25}/>
        }
        if(file_type.includes("image")){
            return <FileImage className="text-purple-600! text-2xl" size={25}/>
        }
        return <File className="text-sky-600! text-2xl" size={25}/>
    } 


    const onSearch = (value: any, _e: any, _info: any) =>{
        setSearchText(value);
        getMeetingDocument(value);
    }
    const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const getMeetingDocument = async (searchTxt = searchText,) =>{
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setDocLst(meetingData.data?.file?.filter((x: any)=>{
                let res = true
                if(searchTxt.length > 0){
                    if((new RegExp(searchTxt, 'g')).test(x.full_name)){
                        res = true
                    }else{
                        res = false
                    }
                }
                return res;
            }).map((x: MeetingDocumentType, index: number)=>({
                            ...x,
                            id: index + 1
                        })));
        } catch (error) {
            
        }
    }

    const onSizeCamera = (type: "fullscreen-cam"|"fullscreen-doc"|"halfscreen"|"normal") =>{
        setMode(type)
        if(type == "normal"){
            setScreenLayout({
                infor: "col-span-2 row-span-3 flex-1",
                camera: "col-start-3 w-sm",
                list: "row-span-2 col-start-3 row-start-2 flex-1",
            })
        }

        if(type == "halfscreen"){
            setScreenLayout({
                camera: "row-start-3",
                infor: "col-span-3 row-span-2",
                list: "col-span-2 row-start-3"
            })
        }
        if(type == "fullscreen-cam"){
            setScreenLayout({
                camera: "col-span-3 row-span-3 w-full",
                infor: "hidden",
                list: "hidden"
            })
        }
        if(type == "fullscreen-doc"){
            setScreenLayout({
                camera: "hidden",
                infor: "col-span-3 row-span-3 w-full!",
                list: "hidden"
            })
        }
    }

    useEffect(()=>{
        if(open){
            getMeetingDocument();
            setSelectDoc(null)
            onSizeCamera("normal");
            setOpenCollapse(false);
            setOpenPresent(false)
        }
    },[open])

    // const toggleHiddenFile = (id: number, status: boolean)=>{
    //     setDocLst((prev)=>prev.map((x)=>{
    //         if(x.id == id){
    //             x.hidden = status;
    //         }
    //         return x;
    //     }))
    // }

    const downloadFile = async (item: MeetingDocumentType) => {
        try {
            const response = await instance.get("/assert/" + item.file_path, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', item.file_name.split(".")[0]+"."+item.file_path.split(".")[item.file_path.split(".").length - 1]); // Set your desired filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className="flex bg-slate-300! overflow-auto h-full">
            <div className={`${screenLayout.infor} rounded-lg m-1 overflow-hidden`}>
                <Card 
                    className="h-full overflow-hidden" 
                    size="small" 
                    title={<div className="uppercase font-semibold">{docLst.find((x)=>x.id == selectDoc)?.file_name}</div>}
                    styles={{
                        "body": {
                            height: "calc(100% - 40px)",
                            paddingTop: 0
                        }
                    }}
                    extra={
                        docLst.find((x)=>x.id == selectDoc) ?
                        mode == "normal" ? 
                        <div className="flex gap-2 items-start">
                            {/* <Button
                                type="text"
                                icon={<Download />}
                                onClick={() => {
                                    const doc = docLst.find((x) => x.id == selectDoc);
                                    if (doc) downloadFile(doc);
                                }}
                                size="small"
                            ></Button> */}
                            {!/video/i.test(docLst?.find((x)=>x.id == selectDoc)?.file_type ?? "") && 
                                <Button type="text" icon={<Maximize />} size="small" onClick={()=>onSizeCamera("fullscreen-doc")} ></Button>
                            }
                        </div>
                        : <div className="flex gap-2 items-start">
                            <Button
                                type="text"
                                icon={<Download className="mt-1"/>}
                                onClick={() => {
                                    const doc = docLst.find((x) => x.id == selectDoc);
                                    if (doc) downloadFile(doc);
                                }}
                                size="small"
                            ></Button>
                            <Button type="text" icon={<Minimize className="mt-2"/>} onClick={()=>onSizeCamera("normal")} size="small" ></Button>
                        </div>
                        : <></>
                    }
                >
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto">
                            {selectDoc == null && 
                                <div className="h-full">
                                    <div className="bg-slate-400 flex items-center justify-center h-full" nonce="Chưa chọn file">
                                        <Empty/>
                                    </div>
                                </div>
                            }
                            {selectDoc && (() => {
                                const foundFile = docLst.find((x) => x.id == selectDoc);
                                if (!foundFile) return null;
                                switch (true) {
                                    case /pdf/i.test(foundFile.file_type):
                                        // Render PDF viewer component here
                                        return <PdfDocument item={foundFile} openPresent={mode}/>;
                                    case /word/i.test(foundFile.file_type):
                                        // Render Word viewer component here
                                        return <DocxDocument item={foundFile} openPresent={mode} />;
                                    case /powerpoint|presentation/i.test(foundFile.file_type):
                                        // Render PowerPoint viewer component here
                                        return <PptxDocument item={foundFile} openPresent={mode} />;
                                    case /excel|sheet/i.test(foundFile.file_type):
                                        // Render Excel viewer component here
                                        return <ExcelDocument item={foundFile} openPresent={mode}/>;
                                    case /video/i.test(foundFile.file_type):
                                        // Render Excel viewer component here
                                        return <VideoDocument item={foundFile} openPresent={mode}/>;
                                    case /image/i.test(foundFile.file_type):
                                        // Render Excel viewer component here
                                        return <ImageDocument item={foundFile}/>;
                                    default:
                                        // Render generic file viewer or fallback
                                        return <div>Unsupported file type</div>;
                                }
                            })()}
                        </div>
                    </div>
                </Card>
            </div>
            <div className="flex flex-col">
                <div className={`${screenLayout.camera}  rounded-lg m-1 ml-0`}>
                    <Card className="h-full" size="small" color="#05df72" title={"Hình ảnh Camera Trực tiếp"}
                        styles={{
                            "body": {
                                height: "calc(100% - 38px)",
                                padding: '5px'
                            },
                            header: {
                                paddingTop: 0,
                                paddingBottom: 0,
                            }
                        }}
                        // extra={
                        //     mode == "fullscreen-cam" ? 
                        //     <div>
                        //         <Button type="text" icon={<Minimize/>} onClick={()=>onSizeCamera("normal")} size="small" ></Button>
                        //     </div>
                        //     : <div className="flex gap-2">
                        //         {/* <Button type="text" icon={<RectangleHorizontal/>} onClick={()=>onSizeCamera("halfscreen")} size="small" ></Button> */}
                        //         <Button type="text" icon={<Maximize />} size="small" onClick={()=>onSizeCamera("fullscreen-cam")} ></Button>
                        //     </div>
                        // }
                        >
                        <div className="text-xl rounded-lg flex items-center justify-center bg-slate-300 font-bold text-slate-800 text-center h-full">
                            {/* <WebRTSPlayer/> */}
                            <VideoWrapper className=" h-full!"/>
                        </div>
                    </Card>
                </div>
                <div className={`${screenLayout.list} rounded-lg m-1 mt-0 ml-0 overflow-hidden`}>
                    <div className="bg-green-100 h-full py-1 px-2">
                        <span className="font-bold text-base flex gap-2 mt-2 text-main">
                            <FileText/> <div>Danh sách tài liệu</div>
                        </span>
                        {/* <div className="border-t border-slate-400 w-full my-2"></div> */}
                        <Search placeholder="Tên tài liệu" className="my-1" value={searchText} onChange={onChangeText} allowClear onSearch={onSearch}/>
                        <List
                            itemLayout="horizontal"
                            bordered
                            size="small"
                            className="overflow-auto h-[calc(100%-80px)]"
                            dataSource={docLst}
                            renderItem={(item) => (
                            <List.Item 
                                className={(item.id == selectDoc ? "bg-green-300 ": item.hidden ? "bg-slate-300" :"") +" cursor-pointer hover:bg-green-200 py-1! border-b! border-green-300!"}
                                onClick={()=>{setSelectDoc(item.id)}}
                                actions={role == "chairman" ? [
                                    // <a onClick={()=>toggleHiddenFile(item.id, !item.hidden)}>{item.hidden ? <EyeInvisibleOutlined className="text-slate-600! text-2xl"/> : <Eye className="text-slate-600!"/>}</a>
                                    // <a onClick={()=>downloadFile(item)}><Download className="text-slate-600! text-2xl"/></a>
                                ] : []}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div className="flex flex-col items-center justify-center">
                                            <Avatar shape="square" src={fileIconGen(item.file_type)} />
                                        </div>
                                    }
                                    title={<div className={(item.hidden ? " text-slate-700 " : "") +" font-semibold"}>{item.file_name}</div>}
                                    description={<div className={(item.hidden ? " text-slate-800! " : "text-slate-600") +""}>{item.description}</div>}
                                />

                            </List.Item>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Document