import { Menu, type MenuProps } from "antd";
import { useState } from "react";
import MeetingInfor from "./MeetingInfor";
import ParticipantInfor from "./ParticipantInfor";
import DocInfor from "./DocInfor";
import { ToastContainer } from 'react-toastify';
import WaitingScreen from "./WaitingScreen";
import VoteScreen from "./VoteScreen";

function AdminPage() {
    const [selectMenu, setSelectMenu] = useState("meeting_infor");
    const onClick: MenuProps['onClick'] = (e) => {
        setSelectMenu(e.key)
    };
    return (
    <div className="w-vw h-dvh p-3 flex">
        <Menu
            onClick={onClick}
            className="w-xs!"
            items={[
                {
                    label: "Thông tin cuộc họp",
                    key: "meeting_infor",
                },
                {
                    label: "Danh sách đại biểu",
                    key: "participant_infor",
                },
                {
                    label: "Danh sách tài liệu",
                    key: "doc_infor",
                },
                {
                    label: "Cài đặt màn hình chờ",
                    key: "waiting_screen",
                },
                {
                    label: "Danh sách biểu quyết",
                    key: "vote",
                }
            ]}
            selectedKeys={[selectMenu]}
            mode="inline"
        />
        <div className="h-full w-[calc(100vw-20.75rem)]">
            {selectMenu == "meeting_infor" && <MeetingInfor isSelected={selectMenu == "meeting_infor"}/>}
            {selectMenu == "participant_infor" && <ParticipantInfor isSelected={selectMenu == "participant_infor"}/>}
            {selectMenu == "doc_infor" && <DocInfor isSelected={selectMenu == "doc_infor"}/>}
            {selectMenu == "waiting_screen" && <WaitingScreen isSelected={selectMenu == "waiting_screen"}/>}
            {selectMenu == "vote" && <VoteScreen isSelected={selectMenu == "vote"}/>}
        </div>
        <ToastContainer/>
    </div>
    )
}

export default AdminPage;