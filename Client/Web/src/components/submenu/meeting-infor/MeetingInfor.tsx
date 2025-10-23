import { Button, Card, Table, Tag, Radio, List, Tabs, ConfigProvider } from "antd";
import { Clock, Map, Maximize, Minimize } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
// import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import type { MeetingInforType, MeetingScheduleType } from "../../../enum/MeetingInforType";
import instance from "../../../api/axios";
import config from "../../../config/config";
import type { MeetingParticipantType } from "../../../enum/MeetingPaticipantType";
import type { ColumnsType } from "antd/es/table";
// import WebRTSPlayer from "../../video/WebRTSPlayer";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import VideoWrapper from "../../video/VideoWrapper";
// import WebRTCPlayer from "../../video/WebRTC";

// const { Search } = Input

function MeetingInfor(
    {
        open,
    }: {
        open: boolean
    }
) {

    const globalState = useSelector((state: RootState) => state.global_state); 

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
            render: (text: string) => <div className="text-center">{text == "delegate" ? "Đại biểu" : ""}</div>,
            width: "30%",
            align: "center"
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: boolean) => <Tag className={`text-center ${text ? "" : "text-main-red!"}`} bordered={false} color={text ? "green" : "red"}>{text ? "Đã tham dự" : "Vắng mặt"}</Tag>,
            width: "20%",
            align: "center"
        },
    ]

    const [meetingInformation, setMeetingInformation] = useState<MeetingInforType>(
        {
            id: 0,
            name: "",
            place: "",
            start_date: null,
            end_date: null
        }
    )
    const [scheduleInformation, setScheduleInformation] = useState<Array<MeetingScheduleType|never>>([])
    const [isChairMan, setIsChairMan] = useState(localStorage.getItem("role") == "chairman");
    const [searchText, setSearchText] = useState("");
    // const [isStartMeeting, setIsStartMeeting] = useState(false);
    const [selectTab, setSelectTab] = useState("2");
    const [searchStatus, setSearchStatus] = useState("all");
    const [mode, setMode] = useState("normal");
    const [screenLayout, setScreenLayout] = useState({
        camera: "col-span-2",
        infor: "col-span-2 row-start-2",
        list: "col-span-3 row-span-2 col-start-3"
    });
    const [paticipantOutLst, setPaticipantOutLst] = useState<Array<MeetingParticipantType|never>>([]);

    // const onSearch = (value: any, _e: any, _info: any) => {
    //     setSearchText(value);
    //     getMeetingPaticipant(value);
    // }
    // const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchText(e.target.value);
    // };
    const onChangeStatus = (e: any) => {
        setSearchStatus(e.target.value);
        getMeetingPaticipant(searchText, e.target.value);
    }

    const getMeetingPaticipant = async (searchTxt = searchText, statusTxt = searchStatus) =>{
        try {
            setPaticipantOutLst(globalState?.participant?.filter((x: MeetingParticipantType)=> {
                let res = true
                if(searchTxt.length > 0){
                    if((new RegExp(searchTxt, 'g')).test(x.full_name)){
                        res = true
                    }else{
                        res = false
                    }

                    if(statusTxt !== "all" && res){
                        if(x.status && statusTxt == "joined"){
                            res = true
                        }else if(!x.status && statusTxt == "not-joined"){
                            res = true
                        }else{
                            res = false
                        }
                        
                    }
                }else{
                    if(statusTxt !== "all"){
                        if(x.status && statusTxt == "joined"){
                            res = true
                        }else if(!x.status && statusTxt == "not-joined"){
                            res = true
                        }else{
                            res = false
                        }
                    }
                }
                if(x.type == "chairman"){
                    return false;
                }
                return res;
            } ).map((x: MeetingParticipantType, index: number)=>({
                ...x,
                id: index + 1,
            })));
        } catch (error) {
            
        }
    }

    const getMeetingInfor = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setMeetingInformation(meetingData.data)
        } catch (error) {
            
        }
    }

    const getMeetingScheduleInfor = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setScheduleInformation(meetingData.data?.schedule)
        } catch (error) {
            
        }
    }

    useEffect(() => {
        if (open) {
            setSearchText("")
            setPaticipantOutLst([])
            setSearchStatus("all")
            setIsChairMan(localStorage.getItem("role") == "chairman")
            onSizeCamera("normal");
            getMeetingInfor();
            getMeetingScheduleInfor();
            getMeetingPaticipant();
        }
    }, [open])

    useEffect(()=>{
        getMeetingPaticipant();
    },[globalState.participant])

    const formatTimer = (start_date: Date | string | null, end_date: Date | string | null, includeDate = true) => {
        const momentStart = moment(start_date);
        const momentEnd = moment(end_date);
        if (momentStart.isSame(momentEnd, "day")) {
            return `${includeDate ? momentEnd.format('DD/MM/YYYY') : ""} ${momentStart?.format("HH:mm") ?? ""} - ${momentEnd?.format("HH:mm") ?? ""} `
        }
        return `${momentStart.format("HH:mm DD/MM/YYYY")} - ${momentEnd.format("HH:mm DD/MM/YYYY")}`
    }

    const onSizeCamera = (type: "fullscreen" | "halfscreen" | "normal") => {
        setMode(type)
        if (type == "normal") {
            setScreenLayout({
                camera: "col-span-2",
                infor: "col-span-2 row-start-2",
                list: "col-span-3 row-span-2 col-start-3"
            })
        }

        if (type == "fullscreen") {
            setScreenLayout({
                camera: "col-span-5 row-span-2 w-full h-full",
                infor: "hidden",
                list: "hidden"
            })
        }
    }

    return <>
        <div className="flex bg-slate-300! overflow-y-auto w-full h-full">
            <div className="flex flex-col w-full h-full">
                <div className={`${screenLayout.camera} min-w-[500px] rounded-xl m-1`}>
                    <Card className="h-full" size="small" color="#05df72" title={"Hình ảnh Camera Trực tiếp"}
                        styles={{
                            "body": {
                                height: "calc(100% - 38px)",
                                padding: "5px",
                                width: "100%"
                            },
                            header: {
                                paddingTop: "0px",
                                paddingBottom: "0px"
                            }
                        }}
                        extra={
                            mode == "normal" ?
                                <div className="flex gap-2">
                                    <Button type="text" icon={<Maximize />} size="small" onClick={() => onSizeCamera("fullscreen")} ></Button>
                                </div>
                                : <div>
                                    <Button type="text" icon={<Minimize />} onClick={() => onSizeCamera("normal")} size="small" ></Button>
                                </div>

                        }>
                        <div className="flex justify-center bg-slate-300 font-bold text-slate-800 text-center flex-1 h-full rounded-lg">
                            <VideoWrapper className="rounded-lg w-full h-auto!"/>
                            {/* <WebRTSPlayer className="rounded-lg h-auto!"/> */}
                        </div>
                    </Card>
                </div>
                <div className={`${screenLayout.infor} min-w-[500px] rounded-xl m-1 mt-2 overflow-hidden`}>
                    <Card className="h-full w-full pr-3" size="small" color="#05df72" title={"Lịch trình chi tiết"}
                        styles={{
                            "body": {
                                height: "calc(100% - 38px)",
                                padding: "5px"
                            },
                            header: {
                                paddingTop: "0px",
                                paddingBottom: "0px"
                            }
                        }}
                        >
                        <List
                            size="small"
                            className="overflow-y-auto overflow-x-hidden h-[30vh] pt-1! infor-list"
                            dataSource={scheduleInformation}
                            renderItem={(item) =>
                                <List.Item className="pl-0! py-1!">
                                    <List.Item.Meta
                                        avatar={<Tag className="mx-0! text-main!" bordered={false} ><b>{formatTimer(item.start_date, item.end_date, false)}</b></Tag>}
                                        title={<div className="font-semibold">{item.content}</div>}
                                    />
                                </List.Item>}
                        >
                        </List>
                    </Card>
                </div>
            </div>
            <div className={`${screenLayout.list} rounded-lg m-1  overflow-hidden`}>
                <div className="flex flex-col gap-2 bg-white px-2 py-1 rounded-lg mb-2">
                    <div className="flex gap-2 items-end text-sm">
                        <div className="flex font-bold text-sm items-center gap-2">
                            <div>
                                <Clock size={20} />
                            </div>
                            <div>Thời gian:</div>
                        </div>
                        <div>
                            {formatTimer(meetingInformation.start_date, meetingInformation.end_date)}
                        </div>
                    </div>
                    <div className="flex gap-2 items-end text-sm">
                        <div className="flex font-bold text-sm items-center gap-2">
                            <div>
                                <Map size={20} />
                            </div>
                            <div>Địa điểm:</div>
                        </div>
                        <div>
                            {meetingInformation.place}
                        </div>
                    </div>
                </div>
                <ConfigProvider
                    theme={{
                        components: {
                            Tabs: {
                                itemSelectedColor: "var(--color-main)",
                                inkBarColor: "var(--color-main)"
                            },
                            Radio: {
                                buttonSolidCheckedBg: "var(--color-main)",
                                buttonColor: "var(--color-main)",
                                buttonSolidCheckedHoverBg: "var(--color-main)"
                            }
                        }
                    }}
                >
                    <Tabs
                        className={"bg-white px-2! rounded-lg mb-2! " + (isChairMan ? "h-[calc(100%-110px)]" : "h-[calc(100%-60px)]")}
                        onChange={(activekey)=>setSelectTab(activekey)}
                        activeKey={selectTab}
                        items={
                            [
                                // ...(isStartMeeting
                                //     ? [{
                                //         key: '1',
                                //         label: 'Meeting Notes',
                                //         children: <div className="h-full bg-white!">
                                //                 <div className="h-[calc(100%-50px)]">
                                //                     <ReactQuill theme="snow" className="h-full bg-white!" />
                                //                 </div>
                                //                 <Button className="h-[30px] mt-1 float-right" type="primary" icon={<Save className="size-5"/>}>Lưu</Button>
                                //         </div>,
                                //     }]
                                //     : []
                                // ),
                                {
                                    key: "2",
                                    label: "Danh sách đại biểu",
                                    children: <div className="h-full">
                                        <div className="flex justify-between h-10 mb-3">
                                            {/* <div className="w-1/2!">
                                                <div className="font-semibold">Tìm kiếm</div>
                                                <Search placeholder="Tên đại biểu" value={searchText} onChange={onChangeText} allowClear onSearch={onSearch} />
                                            </div> */}
                                            <div>
                                                <div className="font-semibold">Lọc theo trạng thái</div>
                                                <Radio.Group buttonStyle="solid" value={searchStatus} defaultValue="all" onChange={onChangeStatus}>
                                                    <Radio.Button value="all">Tất cả</Radio.Button>
                                                    <Radio.Button value="not-joined">Vắng mặt</Radio.Button>
                                                    <Radio.Button value="joined">Tham dự</Radio.Button>
                                                </Radio.Group>
                                            </div>
                                        </div>
                                        <div className="h-[calc(100%-2.5rem)]  overflow-hidden">
                                            <Table
                                                size="small"
                                                sticky
                                                rowHoverable={false}
                                                className="border-slate-300! mt-2 h-full"
                                                dataSource={paticipantOutLst}
                                                columns={columns}
                                                bordered
                                                scroll={{
                                                    y: isChairMan ? "38vh" : "45vh"
                                                }}
                                                pagination={false}
                                            />
                                        </div>
                                    </div>
                                },
                                
                            ]
                        }
                    >
                    </Tabs>
                </ConfigProvider>
                {/* {isChairMan &&
                    <div className="w-full">
                        {
                            !isStartMeeting &&
                            <Button color="green" onClick={()=>{setIsStartMeeting(true); setSelectTab("2")}} className="w-full" size="middle" icon={<ListStart />} variant="solid">Bắt đầu cuộc họp</Button>
                        }
                        {
                            isStartMeeting &&
                            <Button color="red" onClick={()=>{setIsStartMeeting(false); setSelectTab("2")}} className="w-full" size="middle" icon={<ListEnd />} variant="solid">Kết thúc cuộc họp</Button>
                        }
                    </div>
                } */}
            </div>

        </div>
    </>
}

export default MeetingInfor; 