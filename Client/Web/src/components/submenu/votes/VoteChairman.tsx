import { Pie } from "@ant-design/charts";
import { Button, Card, Tag } from "antd";
import { useEffect, useState, } from "react";
import { Clock, MoveLeft } from "lucide-react";
import type { MeetingParticipantType } from "../../../enum/MeetingPaticipantType";
import instance from "../../../api/axios";
import config from "../../../config/config";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import moment from "moment";

function VoteChairmanMenu(
    {
        account,
        open,
    }: {
        account: MeetingParticipantType|null|undefined,
        open: boolean
    }
) {

    const [isShow, setIsShow] = useState(false);
    const [isAnsDone, setIsAnsDone] = useState(false);
    const [result, setResult] = useState<any>(null);
    const globalState = useSelector((state: RootState) => state.global_state);
    // const [timedown, setTimedown] = useState<string|null>(null);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         if(globalState.runningVote){
    //             const diffsec = moment(globalState.runningVote?.start_time).add(globalState.runningVote?.timeout).diff(new Date(), "millisecond");
    //             if(diffsec >= 0){
    //                 setTimedown(formatMMSS(diffsec))
    //                 setRunningId(globalState.runningVote?.id)
    //             }
    //         }
    //     }, 1000); // update every second
    //     return () => clearInterval(timer);
    // }, [globalState.runningVote?.timeleft]);

    // useEffect(()=>{
    //     if(timedown == "00:00"){
    //         setIsAns(true)
    //     }
    // }, [timedown])

    function formatMsTo_mm_phut_ss_giay(ms: number) {
        // 1. Tính tổng số giây (làm tròn để có kết quả hiển thị tốt hơn)
        const totalSeconds = Math.round(ms / 1000); 

        // 2. Tính số phút (phần nguyên của tổng số giây chia 60)
        const minutes = Math.floor(totalSeconds / 60);

        // 3. Tính số giây còn lại (phần dư của tổng số giây chia 60)
        const seconds = totalSeconds % 60;

        // 4. Định dạng và trả về chuỗi "mm phút ss giây"
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        // Chú ý: Ở đây ta dùng chuỗi để làm cho đầu ra dễ đọc trong tiếng Việt
        return `${formattedMinutes} phút ${formattedSeconds} giây`;
    }

    // const getMeetingInfor = async () =>{
    //     try {
    //         const meetingData = await instance.get(config.CONFIG_UPDATE_PATH+"/list-vote");
    //         const new_data = (meetingData.data?.vote?.map((x: MeetingVoteType)=>{
    //             while(x.options.length < 4){
    //                 x.options.push({id: "new_option"+x.options.length, name: "" })
    //             }
    //             return x;
    //         }))
    //         setQuestTemplate(new_data)
    //     } catch (error) {
            
    //     }
    // }

    useEffect(()=>{
        if(open){
            setIsShow(false);
            // getMeetingInfor();
        }
    },[open])

    useEffect(()=>{
        const timeLeft = globalState.runningVote?.timeleft ?? 0;
        
        if (globalState.runningVote && timeLeft > 0) {
            setResult(globalState.runningVote);
        }

        if (timeLeft <= 0) {
            return;
        }

    },[globalState.runningVote?.timeleft])


    const statusMeeting = async (id: number) =>{
        try {
            const meetingData = await instance.get(config.CONFIG_UPDATE_PATH+"/start-vote/"+id);
            if(!meetingData.data){
                toast.error("Không bắt đầu được biểu quyết")
                return;
            }
            toast.success("Bắt đầu biểu quyết thành công");
        } catch (error) {
            toast.error("Không bắt đầu được biểu quyết")
        }
        return null;
    }

    const showResult = async (id: number) =>{
        setIsShow(true);
        setResult(globalState.vote[id - 1]);
    }

    const callVote = async(optionId: string)=>{
        setIsAnsDone(false);
        try {
            await instance.post(config.CONFIG_UPDATE_PATH+"/vote", {
                optionId: optionId,
                participant_id: account?.id,
            });
            setIsAnsDone(true);
        } catch (error) {
            
        }
    }

    const ansVote = async (ans: string) => {
        await callVote(ans)
    }

    const color = {
        notVote: '#90a1b9',
        okBtn: '#00ff00',
        noBtn: '#ff0000',
        new_option2: '#2b7fff',
        new_option3: '#f54a00',
    } as any;

    const renderPie = () =>{
        const colorPie = [] as any[];
        const data = result?.options?.concat({ id: 'notVote', name: "Chưa biểu quyết" }).map((el: any) => {
            const filter = result?.ans?.filter((f: any) => f.id == el.id);
            const precent = (filter?.length / globalState.participant.length)
            const textOption = el.name;
            return {
                id: el.id,
                area: textOption,
                value: precent*100
            }
        }).filter((el: any)=>{
            if(el.value > 0){
                colorPie.push(color[el.id]);
            }
            return el.value !== 0
        });
        return {
            data,
            colorPie
        }
    }

    return (
        <div className="h-full bg-green-100 overflow-hidden">
            {
                ( !isShow ) &&
                <div className="flex flex-col h-full items-center justify-center gap-3 w-4xl mx-auto overflow-y-auto">
                    {globalState.vote?.map((item: any)=><>
                        <Card size="small" className="w-full" title={
                            <div className="flex gap-1">
                                <span className="flex justify-baseline gap-2"> <Clock size={20}/>Thời gian: {formatMsTo_mm_phut_ss_giay(item?.timeout ?? 0)}</span>
                            </div>
                        }
                            extra={[
                                <div className="flex gap-2">
                                    {
                                        item?.status == "start" && <Button disabled={globalState.runningVote} onClick={()=>statusMeeting(item.id as number)} size="small" variant="solid" color="red">Bắt đầu</Button>
                                    }
                                    {
                                        item?.status == "running" && 
                                        <>
                                            <div className="font-semibold">{ moment.utc(globalState.runningVote?.timeleft ?? 0).format("mm:ss") }</div>
                                            <Tag color="red" className="flex! items-baseline gap-2" icon={<div className="size-2 rounded-full my-auto bg-red-600"></div>}>Đang tiến hành</Tag>
                                        </>
                                    }
                                    {
                                        (item?.status == "done" || item?.status == "running") && <Button onClick={()=>showResult(item.id as number)} size="small" variant="solid" color="blue">Kết quả</Button>
                                    }
                                </div>
                            ]}
                        >
                        <div className="mb-2">
                            <label className="font-semibold">Nội dung:</label>
                            <div className="text-base">{item?.content}</div>
                        </div>
                        <div className="">
                            <label className="font-semibold">Lựa chọn:</label>
                            <div className="flex gap-2">
                                {item?.options?.filter((x: { name: { trim: () => { (): any; new(): any; length: number; }; }; })=>x.name.trim().length > 0).map((op: any)=>(<>
                                    <div key={op.id} className="border border-slate-600 rounded-2xl px-3 py-2">
                                        {op.name}
                                    </div>
                                </>))}
                            </div>
                        </div>
                        </Card>
                    </>)}
                </div>
            }
            {
                isShow &&
                <>
                    <div className="flex h-full items-center justify-center flex-col m-auto relative">
                        <Button icon={<MoveLeft className="mt-1"/>} variant="solid" className="bg-exit! absolute! top-0 left-2 mt-2 text-white!" onClick={()=>{setIsShow(false); setResult(null);}}></Button>
                        <div className="font-bold text-center text-xl mt-2 mb-1">Kết quả Biểu quyết</div>
                        {globalState.runningVote && 
                            <div className="font-semibold text-xl">{ moment.utc(globalState.runningVote?.timeleft ?? 0).format("mm:ss") }</div>
                        }
                        <div className="font-semibold text-lg text-wrap mb-2">
                        Nội dung: {result?.content}
                        </div>
                        <div className="flex gap-1">
                        {
                            !isAnsDone && globalState.runningVote?.options.map((x: any)=>{
                                return(
                                    <>
                                        <Button onClick={()=>ansVote(x.id)} size="large" className={
                                            `px-7! py-5! font-semibold! text-lg!`
                                        } style={{backgroundColor: color[x.id as any]}} color="green" variant="solid" shape="round">{x.name}</Button>
                                    </>
                                )
                            })
                        }
                        </div>
                        <div className="flex gap-4 ">
                        {
                            result?.options?.concat({ id: 'notVote', name: "Chưa biểu quyết" }).map((el: any) => {
                                const filter = result?.ans?.filter((f: any) => f.id == el.id);
                                const textOption = el.name;
                                const precent = (filter?.length / globalState.participant.length) * 100;
                                return <div className="flex! items-baseline gap-2">
                                    <div className="size-2 rounded-full my-auto" style={{backgroundColor: color[el.id] }}></div>
                                    <div className="text-md font-semibold">{textOption} { precent.toFixed(1) }%</div>
                                </div>
                            })
                        }
                        </div>
                        <Pie
                            // style={{ width: '50%' }}
                            angleField= 'value'
                            colorField = 'area'
                            legend = {false}
                            tooltip = {{title: "area"}}
                            label={{text: "area"}}
                            height={500}
                            style= {{
                                // stroke: '#fff',
                                // inset: 1,
                                // radius: 10,
                                // width: '30vw' 
                                height: 600
                            }}
                            interaction = {{elementHighlight: true}}
                            scale={{
                                color: { 
                                    range: renderPie().colorPie 
                                } 
                            }}  
                            data = {
                                renderPie().data
                            }
                            state={{
                                inactive: {opacity: 0.5}
                            }}
                            onReady = {(plot) => {
                                setTimeout(() => {
                                    try {
                                    const geometry = plot.chart.geometries[0];

                                    geometry.elements.forEach((el: any) => {
                                        const datum = el.getData?.() || el.getModel()?.data;
                                        const sliceType = datum?.type;

                                        if (sliceType === "Đồng ý") {
                                            el.setState("active", true);
                                        } else {
                                            el.setState("inactive", true);
                                        }
                                    });
                                    } catch (err) {
                                    console.warn("Auto-highlight failed:", err);
                                    }
                                }, 0);
                            }}                     
                        />
                        
                    </div>
                </>
            }
        </div>
    )

}

export default VoteChairmanMenu