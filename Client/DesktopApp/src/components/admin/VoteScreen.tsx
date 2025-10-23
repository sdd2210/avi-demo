import { Button, Form, Input, Card, Select, Tag } from "antd";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import config from "../../config/config";
import { RefreshCw, Save } from "lucide-react";
import { toast } from "react-toastify";
import type { MeetingVoteType } from "../../enum/MeetingVoteType";

function VoteScreen(
    {isSelected}: {isSelected: boolean}
) {

    const timeOptions = [
        {id: 1, timeout: 60000, title: "01:00"},
        {id: 2, timeout: 300000, title: "05:00"},
        {id: 3, timeout: 600000, title: "10:00"},
        {id: 4, timeout: 10000, title: "00:10"}
    ]

    const [form] = Form.useForm();

    const [originalData, setOriginalData] = useState<any>();
    const [voteData, setVoteData] = useState<Array<MeetingVoteType|any>>([]);
    const getMeetingInfor = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_UPDATE_PATH+"/list-vote");
            setOriginalData(meetingData.data)
            const new_data = (meetingData.data?.vote?.map((x: MeetingVoteType)=>{
                while(x.options.length < 4){
                    x.options.push({id: "new_option"+x.options.length, name: "" })
                }
                return x;
            }))
            form.resetFields()
            form.setFieldValue("vote",new_data)
        } catch (error) {
            
        }
    }
    const getMeetingStatusLoop = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_UPDATE_PATH+"/list-vote");
            const new_data = (meetingData.data?.vote)
            setVoteData(new_data);
            return new_data;
        } catch (error) {
            
        }
        return null;
    }

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

    const resetMeeting = async (done_ids: any[]) =>{
        try {
            await instance.post(config.CONFIG_UPDATE_PATH+"/reset-vote", {
                done_ids: done_ids
            });
            toast.success("Khởi tạo lại biểu quyết thành công");
        } catch (error) {
            toast.error("Khởi tạo lại biểu quyết thất bại")
        }
        return null;
    }


    const INTERVAL_DURATION = 300;
    const fetchData = async() =>{
        try {
            const data = await getMeetingStatusLoop();
            return data;
        } catch (error) {
            
        }
        return null;
    }
    useEffect(() => {
        if(isSelected){
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
        
    }, [isSelected]);


    useEffect(()=>{
        if(isSelected){
            getMeetingInfor();
        }
    },[isSelected])

    const onFinish = async (values: any) => {
        const req = {
            ...originalData,
            vote: values.vote.map((item: any)=>{
                item.options = item.options.filter((x:any)=>x.name?.trim()?.length > 0);
                return item;
            }),
        }
        await instance.post(config.CONFIG_UPDATE_PATH, req);
        await getMeetingInfor()
        toast("Thay đổi thành công", {type: "success"})
    };

    const onStart = async (index: number)=>{
        if(form.isFieldsTouched()){
            toast.error("Bạn cần lưu dữ liệu trước khi bắt đầu");
            return;
        }
        const data = form.getFieldsValue();
        if(data?.vote){
            const voteInfor = data.vote[index];
            await statusMeeting(voteInfor.id)
        }
    }

    const onReset = async ()=>{
        if(form.isFieldsTouched()){
            toast.error("Bạn cần lưu dữ liệu trước khi bắt đầu");
            return;
        }
        const doneVote = voteData.filter((x)=>x.status == "done").map((x)=>x.id);

        if(doneVote.length > 0 || voteData.find((x)=>x.status == "running")){
            await resetMeeting(doneVote);
        }
    }

    const renderStatus = (status: string) => {
        if(status == "running"){
            return <Tag color="red" className="flex! items-baseline gap-2" icon={<div className="size-2 rounded-full my-auto bg-red-600"></div>}>Đang tiến hành</Tag>
        }
        if(status == "start"){
            return <Tag className="flex! items-baseline gap-2" color="default" icon={<div className="size-2 rounded-full my-auto bg-slate-600"></div>}>Chưa tiến hành</Tag>
        }
        if(status == "done"){
            return <Tag color="green" className="flex! items-baseline gap-2" icon={<div className="size-2 rounded-full my-auto bg-green-600"></div>} >Đã hoàn thành</Tag>
        }
        return <></>
    }

    return (
    <div className="w-full h-full p-2 pr-0">
        <div className="flex justify-between w-[90%] mb-2">
            <div className="font-bold mb-3">Danh sách biểu quyết</div>
            <Button variant="solid" onClick={()=>onReset()} color="red" icon={<RefreshCw size={20} className="mt-1"/>} >Khởi động lại</Button>
        </div>
        <Form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{width: "90%"}}
        >
            <div className="flex gap-2 flex-col">
                <Form.List name="vote">
                    {(fields) =>(
                        <>
                        {fields.map(({ key, name, ...restField }) => <>
                            <Card size="small" title={<div className="flex gap-2">
                                <div>{"Biểu quyết " + ++key}</div>
                                <div>{renderStatus(voteData[name]?.status)}</div>
                            </div>} styles={{
                                header: {
                                    backgroundColor: "var(--color-sky-300)"
                                }
                            }}>
                                <div className="flex gap-2 flex-col xl:flex-row mb-1">
                                    <Form.Item
                                        className="mb-0!"
                                       {...restField}
                                        wrapperCol={{
                                            xs: { span: 25 },
                                        }}
                                        name={[name, 'timeout']} 
                                        label="Thời gian biểu quyết"    
                                    >
                                        <Select
                                            style={{ width: 120 }}
                                            options={
                                                timeOptions.map((x)=>({
                                                    value: x.timeout,
                                                    label: x.title
                                                }))
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        className="mb-0!"
                                        {...restField}
                                        wrapperCol={{
                                            xs: { span: 30 },
                                        }}
                                        label="Nội dung"
                                        name={[name, 'content']}
                                    >
                                        <Input style={{width: 500}}
                                        />
                                    </Form.Item>
                                    <div className="flex-2 flex justify-end gap-2">
                                        {
                                            voteData[name]?.status == "start" &&
                                            <>
                                                <Button variant="solid" onClick={()=>onStart(name)} color="red" disabled={voteData.find((x)=>x.status == "running")} >Bắt đầu</Button>
                                            </>
                                        }
                                        {/* {
                                            voteData[name]?.status == "running" &&
                                            <>
                                                <Button variant="solid" onClick={()=>onStart(name)} color="blue" >Xem kết quả</Button>
                                            </>
                                        } */}
                                        {
                                            voteData[name]?.status == "done" &&
                                            <>
                                                {/* <Button variant="solid" onClick={()=>onStart(name)} color="blue" >Xem kết quả</Button> */}
                                                <Button variant="solid" onClick={()=>onStart(name)} color="blue" >Bắt đầu lại</Button>
                                            </>
                                        }
                                    </div>
                                </div>
                                <Form.List {...restField} name={[name, 'options']}>
                                    {(subfields) =>(
                                        <>
                                        <span className="mr-2">Lựa chọn: </span>
                                        <div className="grid grid-cols-4 gap-x-2">
                                            {subfields.map(({ key, name, ...subrestField }) => <>
                                                <div className="flex gap-1 items-baseline">
                                                    <div>{++key}:</div>
                                                    <Form.Item className="flex-1" {...subrestField} name={[name, 'name']}>
                                                        <Input/>   
                                                    </Form.Item>
                                                </div>
                                            </>)}
                                        </div>
                                        </>
                                    )}
                                </Form.List>
                            </Card>
                        </>)}
                        </>
                    )}

                </Form.List>
                <div className="mt-2">
                    <Button color="geekblue" variant="solid" icon={<Save className="mt-1"/>} htmlType="submit">Lưu</Button>
                </div>
            </div>
        </Form>
    </div>
    )
}

export default VoteScreen;