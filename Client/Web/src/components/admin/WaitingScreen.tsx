import { Button, Form, Input, Switch } from "antd";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import config from "../../config/config";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function WaitingScreen(
    {isSelected}: {isSelected: boolean}
) {
    const [originalData, setOriginalData] = useState<any>()
    const getMeetingInfor = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setOriginalData(meetingData.data)
            form.setFieldsValue({
                ...meetingData.data,
                is_open_waiting: meetingData.data.is_open_waiting ?? false,
                title_waiting: meetingData.data.title_waiting ?? "",
                content_waiting: meetingData.data.content_waiting ?? "",
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

    // const normFile = (e: any) => {
    //     if (Array.isArray(e)) {
    //         return e;
    //     }
    //     console.log(e?.fileList);
    //     return e?.fileList;
    // };

    const onFinish = async (values: any) => {
        const req = {
            ...originalData,
            is_open_waiting: values.is_open_waiting,
            title_waiting: values.title_waiting,
            content_waiting: values.content_waiting,
        }
        await instance.post(config.CONFIG_UPDATE_PATH, req);
        await getMeetingInfor()
        toast("Thay đổi thành công", {type: "success"})
    };

    return (
    <div className="w-full h-full p-2 pr-0">
        <div className="font-bold mb-3">Cài đặt màn hình chờ</div>
        <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{width: "90%"}}
            >
                <div>
                    <Form.Item name="is_open_waiting" label="Bật màn hình chờ" required>
                        <Switch />
                    </Form.Item>
                    <Form.Item name="title_waiting" label="Tiêu đề" required>
                        <Input className="w-full" />
                    </Form.Item>
                    <Form.Item name="content_waiting" label="Nội dung" required>
                        <Input className="w-full" />
                    </Form.Item>
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

export default WaitingScreen;