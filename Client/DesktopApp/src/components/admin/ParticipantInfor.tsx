import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import type { MeetingParticipantType } from "../../enum/MeetingPaticipantType";
import instance from "../../api/axios";
import config from "../../config/config";
import * as XLSX from "xlsx";
import { UploadIcon } from "lucide-react";
import { toast } from "react-toastify";

function ParticipantInfor({isSelected}: {isSelected: boolean}) {

    const [paticipantOutLst, setPaticipantOutLst] = useState<Array<MeetingParticipantType|never>>([]);
    const inputRef = useRef(null)
    const [originalData, setOriginalData] = useState<any>()
    const columns: ColumnsType<MeetingParticipantType> = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            render: (text: number) => <div className="text-center">{text}</div>,
            width: "10%",
            align: "center"
        },
        {
            title: 'Tên đại biểu',
            dataIndex: 'full_name',
            key: 'full_name',
            render: (text: string) => <div>{text}</div>,
            width: "40%",
        },
        {
            title: 'Vai trò',
            dataIndex: 'type',
            key: 'type',
            render: (text: string) => <div className="text-center">{text == "delegate" ? "Đại biểu" : "Chủ tọa"}</div>,
            width: "30%",
            align: "center"
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (text: string) => <Tag className="text-center" bordered={false} color={text == "joined" ? "green" : "red"}>{text == "joined" ? "Đã tham dự" : "Vắng mặt"}</Tag>,
        //     width: "20%",
        //     align: "center"
        // },
    ]
    const getData = async () => {
        const meetingData = await instance.get(config.CONFIG_FILE);
        setPaticipantOutLst(meetingData.data?.participant.map((x: MeetingParticipantType, index: number)=>({
            ...x,
            id: index + 1
        })))
        setOriginalData(meetingData.data);
    }

    const onChangeFile = async (e: any) =>{
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            if (!event.target) return;
            if (inputRef.current) {
                (inputRef.current as HTMLInputElement).value = "";
            }
            const arrayBuffer = event.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const keyMap: { [key: string]: string } = {
                "Tên đại biểu": "full_name",
                "Vai trò": "type",
                "Trạng thái": "status"
            };
            // Map keys for each row in the jsonData array
            const res = (jsonData as any[]).map((row: any, index: number) => {
                const mappedRow: any = {};
                Object.entries(row).forEach(([key, value]) => {
                    mappedRow[keyMap[key as string] || key] = typeof value === "string" ? value.trim() : value;
                });
                if(mappedRow["type"].trim() == "Chủ tọa"){
                    mappedRow["type"] = "chairman"
                }
                if(mappedRow["type"] == "Đại biểu"){
                    mappedRow["type"] = "delegate"
                }

                if(mappedRow["status"] == "Đã tham dự"){
                    mappedRow["status"] = "joined"
                }
                if(mappedRow["status"] == "Vắng mặt"){
                    mappedRow["status"] = "not-joined"
                }
                
                mappedRow["id"] = index+1;
                return mappedRow;
            });
            setPaticipantOutLst(res);
            const req = {
                ...originalData,
                participant: res.map((x)=>({
                    id: x.id,
                    full_name: x.full_name,
                    status: x.status,
                    type: x.type,
                }))
            };
            await instance.post(config.CONFIG_UPDATE_PATH, req);
            await getData()
            toast("Thay đổi danh sách đại biểu thành công", {type: "success"})
            
        };
        reader.readAsArrayBuffer(file);
    }

    useEffect(()=>{
        getData()
    },[isSelected])

    return (
    <div className="w-full h-full p-2 pr-0">
        <div className="font-bold">Danh sách đại biểu</div>
        <div>
            <label htmlFor="dropzone-file" className="float-right my-2 cursor-pointer h-8 rounded-lg text-white bg-green-600 hover:bg-green-600/90 text-sm px-5 py-2.5 gap-2 text-center inline-flex items-center">
                <UploadIcon/>
                <div className="text-sm">Tải file dữ liệu</div>
                <input ref={inputRef} id="dropzone-file" className="hidden" onChange={onChangeFile} accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" type="file"/>
            </label>
        </div>
        <Table
            size="small"
            sticky
            rowHoverable={false}
            className="border-slate-300! mt-2 h-full"
            dataSource={paticipantOutLst}
            columns={columns}
            bordered
            scroll={{
                y: "90vh"
            }}
            pagination={false}
        />
    </div>
    )
}

export default ParticipantInfor;