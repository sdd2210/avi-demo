import { Button, Form, Input, DatePicker, TimePicker } from "antd";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import config from "../../config/config";
import dayjs from 'dayjs';
import { MinusCircleIcon, PlusCircle, Save } from "lucide-react";
import { toast } from "react-toastify";

const { RangePicker } = TimePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function MeetingInfor(
    {isSelected}: {isSelected: boolean}
) {
    const [originalData, setOriginalData] = useState<any>()
    const dateFormat = 'DD/MM/YYYY';
    const getMeetingInfor = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setOriginalData(meetingData.data)
            form.setFieldsValue({
                ...meetingData.data,
                start_date: dayjs(meetingData.data.start_date), 
                range_time: [dayjs(meetingData.data.start_date), dayjs(meetingData.data.end_date)],
                schedule: meetingData.data.schedule.map((x : any)=>({
                    ...x,
                    range_time: [dayjs(x.start_date), dayjs(x.end_date)]
                }))
            });
        } catch (error) {
            
        }
    }
    const [form] = Form.useForm();

    useEffect(()=>{
        if(isSelected){
            getMeetingInfor();
        }
    },[isSelected])

    const onFinish = async (values: any) => {
        const req = {
            ...originalData,
            name: values.name,
            place: values.place,
            link_stream: values.link_stream,
            start_date: values.start_date.hour(values.range_time[0].hour())
                        .minute(values.range_time[0].minute())
                        .second(values.range_time[0].second()).toDate(),
            end_date: values.start_date.hour(values.range_time[1].hour())
                        .minute(values.range_time[1].minute())
                        .second(values.range_time[1].second()).toDate(),
            schedule: values.schedule.map((x: any)=>({
                content: x.content,
                start_date: values.start_date.hour(x.range_time[0].hour())
                        .minute(x.range_time[0].minute())
                        .second(x.range_time[0].second()).toDate(),
                end_date: values.start_date.hour(x.range_time[1].hour())
                        .minute(x.range_time[1].minute())
                        .second(x.range_time[1].second()).toDate()
            }))
        }
        await instance.post(config.CONFIG_UPDATE_PATH, req);
        await getMeetingInfor()
        toast("Thay đổi thành công", {type: "success"})
    };

    // const onReset = () => {
    //     form.resetFields();
    // };

    // const onFill = () => {
    //     form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
    // };
    return (
    <div className="w-full h-full p-2 pr-0">
        <div className="font-bold mb-3">Thông tin cuộc họp</div>
        <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{width: "90%"}}
            >
            <div className="grid grid-cols-1 xl:grid-cols-2">
                <div>
                    <Form.Item name="name" label="Tên cuộc họp" required>
                        <Input />
                    </Form.Item>
                    <Form.Item name="start_date" label="Ngày diễn ra" required>
                        <DatePicker format={dateFormat} className="w-full!" required/>
                    </Form.Item>
                    <Form.Item name="range_time" label="Thời gian diễn ra" required>
                        <RangePicker format={"HH:mm"} className="w-full!" needConfirm required/>
                    </Form.Item>
                    <Form.Item name="place" label="Địa điểm" required>
                        <Input className="w-full" />
                    </Form.Item>
                    <Form.Item name="link_stream" label="Link Stream Cuộc họp" required>
                        <Input placeholder="https://example.com"/>
                    </Form.Item>
                </div>
                <div className="ml-2 pl-2 border-l border-slate-300">
                    <Form.List name="schedule">
                        {(fields, { add, remove }) =>(
                            <div className="">
                                <div className="mb-1">Lịch trình sự kiện:</div>
                            {fields.map(({ key, name, ...restField }) =>(
                                <div key={key} style={{display: "flex"}}>
                                    <Form.Item
                                        className="w-full"
                                        {...restField}
                                        wrapperCol={{
                                            xs: { span: 20 },
                                        }}
                                        name={[name, 'range_time']}
                                    >
                                        <RangePicker format={"HH:mm"} className="w-full" />
                                    </Form.Item>
                                    <Form.Item
                                        className="w-full"
                                        wrapperCol={{
                                            xs: { span: 30 },
                                        }}
                                        {...restField}
                                        name={[name, 'content']}
                                    >
                                        <Input placeholder="Nội dung" className="w-full" />
                                    </Form.Item>
                                    <Form.Item className="cursor-pointer">
                                        <MinusCircleIcon onClick={() => remove(name)} />
                                    </Form.Item>
                                </div>
                            ))}
                            <Form.Item>
                                <Button color="blue" variant="solid" className="w-[100px]!" onClick={() => add()} block icon={<PlusCircle className="mt-1" />}>
                                    Thêm
                                </Button>
                            </Form.Item>
                            </div>
                        )}
                    </Form.List>
                </div>
            </div>
            
            <Form.Item {...tailLayout} className="float-end!">
                <Button color="geekblue" variant="solid" icon={<Save className="mt-1"/>} htmlType="submit" >
                    Lưu
                </Button>
            </Form.Item>
            </Form>       
    </div>
    )
}

export default MeetingInfor;