import "./App.css";
import { useEffect } from "react";
import MainLayout from "./components/layouts/MainLayout";
import LoginLayout from "./components/layouts/LogInLayout";
// import type { MeetingParticipantType } from "./enum/MeetingPaticipantType";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { loginHandler, logoutHandler } from "./redux/accountSlice";

function App() {
  const dispatch = useDispatch();
  // const [isLogin, setIsLogin] = useState(false);
  const accountData = useSelector((state: RootState) => state.account_state);
  // const [role, setRole] = useState<"delegate" | "chairman"|"">("");
  // const [data, setData] = useState<MeetingParticipantType|null>();

  useEffect(()=>{
    const storedData = localStorage.getItem("data") ?? null;
    if(storedData){
      const parsedData = JSON.parse(storedData);
      dispatch(loginHandler(parsedData));
    } else {
      dispatch(logoutHandler());
    }
  }, [])
  // const [user, setUser] = useState("")
  return (
    <div>
      {accountData.isLogin && (accountData.account?.type === "delegate" || accountData.account?.type === "chairman") && (
        <MainLayout />
      )}
      {!accountData.isLogin && (
        <LoginLayout/>
      )}
    </div>
  );
}

export default App;
