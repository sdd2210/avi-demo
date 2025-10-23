// import { useState } from "react";
import { Crown, Users, } from "lucide-react";
import { Button } from 'antd';
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import config from "../../config/config";
import type { MeetingParticipantType } from "../../enum/MeetingPaticipantType";
import { useDispatch } from "react-redux";
import { loginHandler } from "../../redux/accountSlice";

function LoginLayout(
) {
    const dispatch = useDispatch();
    const [lstParticipant, setLstParticipant] = useState<Array<MeetingParticipantType|null>>();

    const getMeetingInfor = async () =>{
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setLstParticipant(meetingData.data?.participant)
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        getMeetingInfor()
    },[])

    const onClick = async (item: MeetingParticipantType|null) => {
        if(item?.type){
            localStorage.setItem("role", item.type);
            localStorage.setItem("data", JSON.stringify(item));
            dispatch(loginHandler(item));
        }
    }

    return (
        <div className="bg-gradient-to-br from-green-500 to-indigo-600 min-h-screen w-dvw h-dvh flex items-center">
            <div className="m-auto bg-white w-full shadow-2xl p-8 md:p-12 text-center">
                <div className="text-center mb-8">
                    <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r! from-green-600 to-red-600" >Hệ thống Hội nghị và Phòng họp</div>
                    <div className="text-xl md:text-2xl font-bold text-gray-700 mt-2" >Thông minh - Không giấy tờ</div>
                </div>
                <div className="flex justify-center gap-4 max-w-4xl mx-auto flex-wrap items-center">
                    {lstParticipant?.sort((a,b)=>((a?.type ?? "")?.localeCompare(b?.type ?? ""))).map((item)=>(<>
                        <Button
                        className= {`${item?.type == "chairman" ? "bg-green-600!" : "bg-red-600!" } text-white py-7! px-6! w-[250px]! rounded-2xl! hover:scale-[102%]`}
                        variant="solid" 
                        color="green"
                        onClick={()=>onClick(item)}
                    >
                        {item?.type == "chairman" && 
                         <div><Crown size={30} /></div>
                        }
                        {item?.type == "delegate" && 
                         <div><Users size={30} /></div>
                        }
                        <div className="text-2xl">{item?.full_name}</div>
                    </Button>
                    </>))}
                </div>
            </div>
        </div>
    );
}

export default LoginLayout;
