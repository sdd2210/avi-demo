import { Coffee } from "lucide-react"

function WaitingScreen(
    {
        title,
        content,
    }: {
        title: string,
        content: string,
    }
) {
    
    return (
        <>
            <div className="flex flex-col items-center h-full aspect-video justify-center bg-red-100">
                <div><Coffee size={40}/></div>
                <div className="font-bold text-2xl">{title}</div>
                <div className="font-bold tex-xl text-slate-600">{content}</div>
            </div>
        </>
    )

}

export default WaitingScreen