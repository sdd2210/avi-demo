import { Pie } from "@ant-design/charts";
import { Button } from "antd";
import { useEffect, useState, } from "react";
import type { MeetingParticipantType } from "../../../enum/MeetingPaticipantType";
// import type { MeetingVoteType } from "../../../enum/MeetingVoteType";
import instance from "../../../api/axios";
import config from "../../../config/config";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import moment from "moment";

function VoteMenu(
    {
        account,
        open,
    }: {
        account: MeetingParticipantType|null|undefined,
        open: boolean
    }
) {

    const [isAns, setIsAns] = useState(false);
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


    // const getMeetingInfor = async () =>{
    //     try {
    //         const meetingData = await instance.get(config.CONFIG_UPDATE_PATH+"/list-vote");
    //         const new_data = (meetingData.data?.vote?.map((x: MeetingVoteType)=>{
    //             while(x.options.length < 4){
    //                 x.options.push({id: "new_option"+x.options.length, name: "" })
    //             }
    //             return x;
    //         }))
    //     } catch (error) {
            
    //     }
    // }

    useEffect(()=>{
        if(open){
            setIsAns(false);
            // getMeetingInfor();
        }
    },[open])

    useEffect(()=>{
        const timeLeft = globalState.runningVote?.timeleft ?? 0;
        let isAnsNew = false;
        let isAnsDoneNew = false;
        
        if (globalState.runningVote) {
            const participant_id = account?.id;
            const option = globalState.runningVote?.ans?.filter((f: any) => f.id != 'notVote' && f.participant_id == participant_id);
            if (option.length > 0) {
                isAnsNew = true;
            }
            setResult(globalState.runningVote);
        }

        if (timeLeft <= 0) {
            isAnsDoneNew = true;
        }

        setIsAns(isAnsNew);
        setIsAnsDone(isAnsDoneNew);
    },[globalState.runningVote?.timeleft])

    // useEffect(()=>{
    //     if(isAns){
    //         setResult(globalState.vote);
    //     }
    // },[isAns])

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

    // const question = {
    //     content: "Thông qua kế hoạch Quý 4?",
    //     okBtn: "Đồng ý",
    //     noBtn: "Không đồng ý",
    //     timeout: 60000
    // };


    // const renderStatus = (status: string) => {
    //     if(status == "running"){
    //         return <Tag color="red" className="flex! items-baseline gap-2" icon={<div className="size-2 rounded-full my-auto bg-red-600"></div>}>Đang tiến hành</Tag>
    //     }
    //     if(status == "start"){
    //         return <Tag className="flex! items-baseline gap-2" color="default" icon={<div className="size-2 rounded-full my-auto bg-slate-600"></div>}>Chưa tiến hành</Tag>
    //     }
    //     if(status == "done"){
    //         return <Tag color="green" className="flex! items-baseline gap-2" icon={<div className="size-2 rounded-full my-auto bg-green-600"></div>} >Đã hoàn thành</Tag>
    //     }
    //     return <></>
    // }

    // const onStart = async (index: number)=>{
        
    //     const data = form.getFieldsValue();
    //     if(data?.vote){
    //         const voteInfor = data.vote[index];
    //         await statusMeeting(voteInfor.id)
    //     }
    // }

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
            const precent = (filter.length / globalState.participant.length)
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
                (!isAnsDone && account?.type == "delegate") &&
                <div className="flex h-full items-center justify-center flex-col">
                    <div className="font-bold text-center pt-4 text-xl mt-10">Thời gian biểu quyết</div>
                    <div className="font-bold text-center pt-4 text-xl ">{ moment.utc(globalState.runningVote?.timeleft ?? 0).format("mm:ss") }</div>
                    <div className="flex h-full items-center justify-center flex-col">
                        {
                            (isAns && globalState.runningVote?.timeleft > 0) &&
                            <div>
                                <div className="font-bold text-center text-2xl mb-3 text-black">Cảm ơn đại biểu đã biểu quyết!</div>
                                <div className="font-bold text-center text-xl mb-3 text-slate-500">Vui lòng chờ trong giây lát!</div>
                            </div>
                        }
                        {
                            !isAns &&
                            <>
                                <div className="font-bold text-center text-2xl mb-3 text-black">Biểu quyết: {globalState.runningVote?.content}</div>
                                <div className="flex gap-2">
                                    {
                                        globalState.runningVote?.options.map((x: any)=>{
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
                            </>
                        }
                    </div>
                </div>
            }
            {/* {
                ( !isAns &&  account?.type == "chairman") &&
                <div className="flex flex-col h-full items-center justify-center gap-3 w-4xl mx-auto overflow-y-auto">
                    {globalState.vote?.map((item: any)=><>
                        <Card size="small" className="w-full" title={<span className="flex justify-baseline gap-2"> <Clock size={20}/>Thời gian: {formatMsTo_mm_phut_ss_giay(item?.timeout ?? 0)}</span>}
                            extra={[
                                item?.status == "start" && <Button onClick={()=>voteClick(item)} size="small" variant="solid" color="red">Bắt đầu</Button>,
                                (item?.status == "done" || item?.status == "running") && <Button onClick={()=>voteClick(item)} size="small" variant="solid" color="blue">Kết quả</Button>,
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
            } */}
            {
                isAnsDone && !isAns &&
                <>
                    <div className="flex h-full items-center justify-center flex-col m-auto">
                        <div className="font-bold text-center text-2xl mb-3 mt-2">Kết quả Biểu quyết</div>
                        <div className="flex gap-4 ">
                        {
                            result?.options?.concat({ id: 'notVote', name: "Chưa biểu quyết" }).map((el: any) => {
                                const filter = result?.ans?.filter((f: any) => f.id == el.id);
                                const textOption = el.name;
                                const precent = (filter.length / globalState.participant.length) * 100;
                                return <div className="flex! items-baseline gap-2">
                                    <div className="size-2 rounded-full my-auto" style={{backgroundColor: color[el.id] }}></div>
                                    <div className="text-lg font-semibold">{textOption} { precent.toFixed(1) }%</div>
                                </div>
                            })
                            // result?.ans.map((x: any, _: any, arr: any[])=>(<>
                            //     <Badge size="default" className="flex! items-baseline" text={<div className="text-lg font-semibold">{x.name} ({(x.value/(arr.reduce((a: { value: any; }, c: any)=>(a?.value ?? 0) + c, 0)))*100}%)</div>} status="success"></Badge>
                            // </>))
                        }
                        </div>
                        <Pie
                            style={{ width: '50%' }}
                            angleField= 'value'
                            colorField = 'area'
                            legend = {false}
                            tooltip = {{title: "area"}}
                            label={{text: "area"}}
                            height={500}
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

export default VoteMenu