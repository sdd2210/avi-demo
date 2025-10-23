import { useEffect, useState } from "react";
import instance from "../../api/axios";
import config from "../../config/config";
import { Button, Form, Input } from "antd";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

// function AddEditDoc ({open, item, onClose}: {open: boolean, item: any, onClose: any}) {
//     return (
//         <Modal
//             title={item ? "Sửa tài liệu" : "Thêm tài liệu"}
//             closable={{ 'aria-label': 'Custom Close Button' }}
//             open={open}
//             onCancel={onClose}
//         >
//             <p>Some contents...</p>
//             <p>Some contents...</p>
//             <p>Some contents...</p>
//         </Modal>
//     )
// }

function DocInfor({isSelected}: {isSelected: boolean}) {
    const [originalData, setOriginalData] = useState<any>()
    // const [docList, setDocList] = useState<any[]>()
    // const [openModal, setOpenModal] = useState<boolean>(false);
    // const [selectDoc, setSelectDoc] = useState<MeetingDocumentType|null>(null);
    const [form] = Form.useForm();

    const getMeetingInfor = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setOriginalData(meetingData.data)
            // setDocList(meetingData.data.file.map((doc: MeetingDocumentType)=>{
            //     const suffix = doc.file_name.split(".")
            //     const lastIndx = doc.file_name.lastIndexOf(".")
            //     return {
            //         ...doc,
            //         file_oriName: doc.file_name.substring(0, lastIndx),
            //         file_suffix: suffix[suffix.length - 1]
            //     }
            // }))
            form.setFieldValue("file",meetingData.data.file )
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        if(isSelected){
            getMeetingInfor();
        }
    },[isSelected])

    // const layout = {
    //     labelCol: { span: 8 },
    //     wrapperCol: { span: 16 },
    // };

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };


    const onFinish = async (values: any) => {
        const req = {
            ...originalData,
            file : values.file
        }
        await instance.post(config.CONFIG_UPDATE_PATH, req);
        await getMeetingInfor()
        toast("Thay đổi thành công", {type: "success"})
        
    }

    // const columns: ColumnsType<MeetingDocumentType> = [
    //     {
    //         title: 'STT',
    //         dataIndex: 'id',
    //         key: 'id',
    //         render: (text: number) => <div className="text-center">{text}</div>,
    //         width: "10%",
    //         align: "center"
    //     },
    //     {
    //         title: 'Tên tài liệu',
    //         dataIndex: 'file_name',
    //         key: 'file_name',
    //         render: (text: string) => <div>{text}</div>,
    //         width: "30%",
    //     },
    //     {
    //         title: 'Mô tả',
    //         dataIndex: 'description',
    //         key: 'description',
    //         render: (text: string) => <div>{text}</div>,
    //         width: "40%",
    //     },
    //     {
    //         title: '',
    //         dataIndex: '_',
    //         key: '_',
    //         render: (text: string, item: MeetingDocumentType) => 
    //         <div className="flex gap-2">
    //             <Button icon={<Pencil className="mt-1 size-5!"/>} onClick={} variant="filled" color="blue" size="small"></Button>
    //             <Button icon={<Trash2 className="mt-1 size-5!"/>} variant="filled" color="red" size="small"></Button>
    //         </div>,
    //         width: "20%",
    //         align: "center"
    //     },
    // ]

    return (
    <div className="w-full h-full p-2 pr-0">
        <div className="font-bold">Danh sách tài liệu</div>
        <div className="w-4xl min-w-[600px] mx-auto">
            <Form
            // {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{width: "100%"}}
            >
                <Form.List name="file">
                    {(fields, {  }) =>(
                        <div className="">
                            <div style={{display: "flex"}}>
                                <Form.Item
                                    // label="Tên tài liệu"
                                    className="w-full"
                                    wrapperCol={{
                                        xs: { span: 20 },
                                    }}
                                >
                                    <div className="font-semibold">Tên tài liệu</div>
                                </Form.Item>
                                <Form.Item
                                    // label="Tên tài liệu"
                                    className="w-full"
                                    wrapperCol={{
                                        xs: { span: 20 },
                                    }}
                                >
                                    <div className="font-semibold">Mô tả tài liệu</div>
                                </Form.Item>
                            </div>
                        {fields.map(({ key, name, ...restField }) =>(
                            <div key={key} style={{display: "flex"}}>
                                <Form.Item
                                    // label="Tên tài liệu"
                                    className="w-full"
                                    {...restField}
                                    wrapperCol={{
                                        xs: { span: 20 },
                                    }}
                                    name={[name, 'file_name']}
                                >
                                    <Input className="w-full" />
                                </Form.Item>
                                <Form.Item
                                    // label="Mô tả"
                                    className="w-full"
                                    wrapperCol={{
                                        xs: { span: 20 },
                                    }}
                                    {...restField}
                                    name={[name, 'description']}
                                >
                                    <Input placeholder="Nội dung" className="w-full" />
                                </Form.Item>
                                {/* <div>
                                    <MinusCircleIcon onClick={() => remove(name)} />
                                </div> */}
                            </div>
                        ))}
                        {/* <Form.Item>
                            <Button color="blue" variant="solid" className="w-[100px]!" onClick={() => add()} block icon={<PlusCircle className="mt-1" />}>
                                Thêm
                            </Button>
                        </Form.Item> */}
                        </div>
                    )}
                </Form.List>
                <Form.Item {...tailLayout} className="float-end!">
                    <Button color="geekblue" variant="solid" icon={<Save className="mt-1"/>} htmlType="submit" >
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
            {/* {
                <Table
                    size="small"
                    sticky
                    rowHoverable={false}
                    className="border-slate-300! mt-2 h-full"
                    dataSource={docList}
                    columns={columns}
                    bordered
                    scroll={{
                        y: "90vh"
                    }}
                    pagination={false}
                />
            } */}

        </div>
    </div>
    )
}

export default DocInfor;