import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Card, FloatButton, Statistic } from "antd";
import { Blocks, Crown, FileText, Info, LogOut, MessageCircle, Presentation, Speech, Video, Vote, X } from "lucide-react";
import { useEffect, useState } from "react";
import MeetingInfor from "../submenu/meeting-infor/MeetingInfor";
import Document from "../submenu/documents/Document";
import VoteMenu from "../submenu/votes/Vote";
// import WaitingScreen from "../submenu/waitingScreen/WaitingScreen";
import PresentationScreen from "../submenu/presentation/Presentation";
import moment from "moment";
import instance from "../../api/axios";
import config from "../../config/config";
import type { MeetingInforType } from "../../enum/MeetingInforType";
// import WebRTSPlayer from "../video/WebRTSPlayer";
// import type { MeetingParticipantType } from "../../enum/MeetingPaticipantType";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { addParticipant, addRunningVote, addVote, turnOffWaiting, turnOnWaiting } from "../../redux/globalStateSlice";
import { logoutHandler } from "../../redux/accountSlice";
import VideoWrapper from "../video/VideoWrapper";
import VoteChairmanMenu from "../submenu/votes/VoteChairman";
const { Header, Content } = Layout;
// const { Timer } = Statistic

const ModalMenu =  (
    {
        title,
        open,
        onClose,
        content,
    }:{
        role: "delegate" | "chairman",
        title: any,
        open: boolean,
        onClose: any,
        content: any
    }
) =>{

    return(
        // <Modal
        //     title={title}
        //     open={open}
        //     onCancel={()=>onClose()}
        //     footer={<></>}
        //     width={"60vw"}
        //     className="min-w-[480px] md:min-w-[700px]"
        // >
        //     {content}
        // </Modal>
        <Card
            title={<div className="uppercase text-base!">{title}</div>} 
            hidden={!open} 
            size="small"
            className="z-[1000]! h-[calc(100vh-60px)] fixed! w-full! top-15 rounded-none! overflow-hidden"
            styles={{
                "body": {
                    padding: "0px",
                    height: "calc(100% - 38px)"
                },
                "header": {
                    borderTop: "1px solid #90a1b9  ",
                    paddingTop: "0.1em",
                    paddingBottom: "0.1em"
                }
            }}
            extra={
                <div className="flex gap-2">
                    {/* {role == "chairman" &&
                        <Button size="small" color="red" variant="solid" icon={<VoteIcon className="mt-1"/>}>Bắt đầu biểu quyết</Button>
                    }
                    {role == "delegate" &&
                        <Button size="small" color="green" variant="solid" icon={<Speech className="mt-1"/>}>Giơ tay phát biểu</Button>
                    } */}
                    <Button variant="solid" size="small" className="bg-exit!" color="red" icon={<X className="text-sm size-7 pt-1" />} onClick={()=>onClose()}/>
                </div>
            } >
                {/* <div className="flex justify-between px-3 py-1 text-base uppercase border-y border-slate-300 text-red-500 font-semibold">
                    <div>Lịch trình: {currentSchedule.content}</div>
                    <div className="flex gap-2 timer items-start ">
                        <div>Còn lại:</div> 
                        <Timer type="countdown" className="text-base!" value={Date.now() + 10 * 1500 * 60}/> 
                        {role == "chairman" &&
                            <Button size="small" color="red" variant="solid" icon={<VoteIcon className="mt-1"/>}>Bắt đầu biểu quyết</Button>
                        }
                        {role == "delegate" &&
                            <Button size="small" color="green" variant="solid" icon={<Speech className="mt-1"/>}>Giơ tay phát biểu</Button>
                        }
                    </div>
                </div>
                <div className="flex px-3 py-1 items-center justify-between text-base text-slate-800 bg-slate-100 font-semibold">
                    <div className="flex">
                        <PinIcon/>
                        <div>Lịch trình tiếp theo: {nextSchedule.content}</div>
                    </div>
                    {
                        role == "chairman" &&
                        <div>
                            <Button color="green" onClick={()=>setOpenLst(true)} size="small" variant="solid" icon={<ListCheckIcon size={18} className="mt-1"/>}>Danh sách đăng ký phát biểu</Button>
                        </div>
                    }
                </div> */}
                {/* h-[calc(100%-60px)] */}
                <div className="bg-slate-200! h-full pb-1"> 
                    {content}
                </div>
        </Card>
    )
}
// const formatTimer = (start_date: Date|string, end_date: Date|string, includeDate = true) =>{
//     const momentStart = moment(start_date);
//     const momentEnd = moment(end_date);
//     if(momentStart.isSame(momentEnd, "day")){
//         return `${momentStart?.format("HH:mm") ?? ""} - ${momentEnd?.format("HH:mm") ?? ""} ${includeDate ? ","+ momentEnd.format('DD/MM/YYYY') : "" }`
//     }
//     return `${momentStart.format("HH:mm DD/MM/YYYY")} - ${momentEnd.format("HH:mm DD/MM/YYYY")}`
// }
function MainLayout(
) {

    const layoutStyle = {
        overflow: 'hidden',
    };
    const [openMenu, setOpenMenu] = useState(true);
    const [openSubmenu, setOpenSubmenu] = useState(false);
    const [selectSubmenu, setSelectSubmenu] = useState<string|null>(null);
    const [hovered, setHovered] = useState(false);
    const dispatch = useDispatch();

    const accountData = useSelector((state: RootState) => state.account_state);
    const globalState = useSelector((state: RootState) => state.global_state);

    const openSubmenuHandler = (id: string) => {
        setOpenSubmenu(true);
        setSelectSubmenu(id);
    }

    const [meetingInformation, setMeetingInformation] = useState<MeetingInforType>(
        {
            id: 0,
            name: "",
            place: "",
            start_date: null,
            end_date: null
        }
    ) 

    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000); // update every second
        return () => clearInterval(timer);
    }, []);

    const fetchData = async() =>{
        if(accountData.account){
            const data = await instance.get("/api/config-data/list/"+accountData.account?.id);
            if(data){
                dispatch(addParticipant(data.data?.participant));
                dispatch(addVote(data.data?.vote));
                dispatch(addRunningVote(data.data?.vote?.find((x: any)=>x.status == "running")));
                
                if(data?.data.is_open_waiting){
                    dispatch(turnOnWaiting());
                }else{
                    dispatch(turnOffWaiting());
                }
            }
            return data;
        }
        return null
    }
    const INTERVAL_DURATION = 300;
    useEffect(() => {
        if(accountData.isLogin){
            let timeoutId: any = null;
            
            const runFetchLoop = async () => {
                const data = await fetchData();
                if (data) {
                    timeoutId = setTimeout(
                        () => runFetchLoop(),
                        INTERVAL_DURATION
                    );
                }
            }
            runFetchLoop();
            return () => {
                clearTimeout(timeoutId);
                return;
            };
        }
        
    }, [accountData.isLogin]);

    const getMeetingInfor = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setMeetingInformation(meetingData.data)
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        if(accountData.isLogin){
            getMeetingInfor()
        }
    },[accountData.isLogin])


    const menuList = [
        {
            id: "infor",
            icon: <Info/>,
            title: "Thông tin",
            titleFull: <div className="flex gap-2">
                        <div className="font-bold text-main"> Cuộc họp: {meetingInformation.name}</div>
                    </div>,
            disable: false,
            content: <MeetingInfor open={openSubmenu}/>
        },
        {
            id: "document",
            icon: <FileText/>,
            title: "Tài liệu",
            titleFull: "Tài liệu cuộc họp",
            disable: false,
            content: <Document open={openSubmenu} role={accountData.account?.type}/>
        },
        {
            id: "vote",
            icon: <Vote/>,
            title: (accountData.account?.type == "chairman" ? "Biểu quyết" : "Biểu quyết"),
            titleFull: (accountData.account?.type == "chairman" ? "Biểu quyết" : "Biểu quyết"),
            disable: false,
            content: accountData.account?.type == "chairman" ? <VoteChairmanMenu account={accountData.account} open={openSubmenu}/> : <VoteMenu account={accountData.account} open={openSubmenu}/>
        },
        {
            id: "raise-hand",
            icon: <Speech/>,
            title: (accountData.account?.type == "chairman" ? "Danh sách phát biểu" : "Giơ tay phát biểu"),
            titleFull: (accountData.account?.type == "chairman" ? "Danh sách phát biểu" : "Giơ tay phát biểu"),
            disable: true,
            content: <></>
        },
        {
            id: "presentation",
            icon: <Presentation/>,
            title: "Trình chiếu",
            titleFull: "Xem trình chiếu",
            disable: true,
            content: <PresentationScreen open={openSubmenu}/>
        },
        {
            id: "stream",
            icon: <Video/>,
            title: "Họp từ xa",
            titleFull: "Họp từ xa",
            disable: true,
            content: <></>
        },
        {
            id: "message",
            icon: <MessageCircle/>,
            title: "Tin nhắn",
            titleFull: "Tin nhắn",
            disable: true,
            content: <></>
        },
        // {
        //     id: "waiting",
        //     icon: <Airplay/>,
        //     title: "Màn hình chờ",
        //     titleFull: "Màn hình chờ",
        //     disable: false,
        //     content: <WaitingScreen />
        // },
    ]
    const onClick = () =>{
        localStorage.removeItem("role");
        dispatch(logoutHandler())
        // logoutProcess();
    }
    useEffect(() => {
        if (hovered || openSubmenu) return; // stop timer if hovering
        const timer = setTimeout(() => {
        setOpenMenu(false);
        }, 5000); // 5s

        return () => clearTimeout(timer); // cleanup if hover or unmount
    }, [hovered, openSubmenu]);
    return (
        <Layout style={layoutStyle}>
            <Header className="flex justify-between bg-slate-100! px-3! h-[60px]!">
                <div className="flex gap-2">
                    <Avatar className="bg-main! my-auto!" size={45} icon={
                        accountData.account?.type== "chairman" ? 
                        <Crown/>
                        : <UserOutlined/>
                    } />
                    <div className="mt-2">
                        {accountData.account?.type== "chairman" && <>
                            <div className="text-xl font-bold">Chủ tọa {accountData.account.full_name}</div>
                            <div className="text-sm text-slate-600">Chủ tọa</div>
                        </>}
                        {accountData.account?.type == "delegate" && <>
                            <div className="text-xl font-bold">Đại biểu {accountData.account?.full_name}</div>
                            <div className="text-sm text-slate-600">Đại biểu</div>
                        </>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div>
                        <Statistic
                            value={moment(new Date(now)).format("DD/MM/YYYY HH:mm:ss") } // realtime system clock
                        />
                        {/* <Clock format="DD/MM/YYYY, HH:mm:ss"/> */}
                    </div>
                    <Button className="font-semibold! bg-exit!" size="small" type="primary" onClick={onClick} icon={<LogOut className="size-4! pt-[3px]"/>}>
                        Thoát
                    </Button>
                </div>
            </Header>
            <Content className="max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] relative!">
                <div className={(openMenu ? 'max-h-[150px] opacity-100' : 'max-h-0 opacity-0') +" transition-all transition-discrete duration-500 ease-in-out absolute! z-[1000] flex items-end w-3xl min-w-[600px] h-1/6 bottom-2 m-auto left-0 right-0"}>
                    <div 
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className=" bottom-0 grid grid-cols-7 px-1 py-3 w-full h-full"
                    >
                        {menuList.filter((x)=>{
                            return !(!globalState?.vote?.find((x: {status: string})=>x?.status == "running") && x.id == "vote" && accountData.account.type == "delegate")
                        }).map((item)=>
                        <div className="flex items-center flex-col">
                            <div
                                onClick={()=>{
                                    if(!item.disable){
                                        openSubmenuHandler(item.id)
                                    }
                                }}
                                className=
                                {`w-fit cursor-pointer rounded-full flex flex-col font-bold justify-center items-center ${!item.disable ? "bg-main! hover:bg-main-hover! hover:scale-105" : "bg-disable" } ${
                                    (globalState?.vote?.find((x: {status: string})=>x?.status == "running") && item.id == "vote") ? "animate-led" : ""
                                }  text-white`}
                                >
                                <div className="p-4">{item.icon}</div>
                            </div>
                            <div className="w-fit relative">
                                {/* <div className="absolute h-full bg-slate-800/40 w-full rounded-2xl"></div> */}
                                <div className={`p-2 w-fit text-sm text-center mb-2 text-shadow-sm/30 text-shadow-black text-wrap font-semibold ${!item.disable ? 'text-white': 'text-slate-200'}`}>{item.title}</div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className="w-full h-full flex justify-center bg-slate-500">
                    <VideoWrapper className="z-[999] w-full"/>
                    {/* <video>
                        <source src="ws://192.168.0.34:8555/stream/mp4_loop"></source>
                    </video> */}
                </div>
                <FloatButton
                    onClick={()=>setOpenMenu((prev)=>!prev)}
                    className={`bg-main! size-10! bottom-10! hover:bg-main-hover! ${(globalState?.vote?.find((x: {status: string})=>x?.status == "running")) ? "animate-led" : ""}`} 
                    icon={openMenu ? <X size={20} className="mr-4 text-white"/> :<Blocks size={20} className="text-white"/>} 
                    shape="circle">
                </FloatButton>
                <ModalMenu
                    role={accountData.account?.type}
                    open={openSubmenu}
                    title={menuList.find((x)=>x.id == selectSubmenu)?.titleFull ?? ""}
                    onClose={()=>setOpenSubmenu(false)}
                    content={menuList.find((x)=>x.id == selectSubmenu)?.content ?? <></>}
                />
            </Content>
        </Layout>
    );
}

export default MainLayout;