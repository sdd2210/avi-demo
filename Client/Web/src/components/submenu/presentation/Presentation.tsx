import { Button, Select } from 'antd';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { useEffect, useState } from 'react';

function PresentationScreen(
    {
        open,
    }: {
        open: boolean
    }
) {

    const slides = [
        { id: 0, title: "Q3 Report", content: "Quarterly Business Review" },
        { id: 1, title: "Revenue Analysis", content: "Financial Performance" },
        { id: 2, title: "Market Trends", content: "Industry Insights" },
        { id: 3, title: "Team Updates", content: "Organizational Changes" },
        { id: 4, title: "Next Steps", content: "Action Items" },
    ]

    const [currentSlide, setCurrentSlide] = useState(0)
    const [mode, setMode] = useState("normal");

    const goToNextSlide = () => {
        if (currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1)
        }
    }

    const goToPreviousSlide = () => {
        if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1)
        }
    }

    const handleSlideSelect = (value: number) => {
        setCurrentSlide(value)
    }

    useEffect(()=>{
        if(open){
            setCurrentSlide(0)
            setMode("normal");
        }
    },[open])

    return (
        <div className={`size-full ${mode == "normal" ? 'p-4' : 'p-0'} bg-green-100 flex flex-col`}>
            <div className={`flex gap-3 ${mode == "normal" ? 'h-[3em]' : 'hidden'}`}>
                <div className='font-bold text-lg'>Trang trình chiếu</div>
                <Select
                    value={currentSlide}
                    defaultValue={1}
                    style={{ width: 300 }}
                    onChange={handleSlideSelect}
                    options={slides.map(x=>({
                        value: x.id,
                        label: x.content,
                    }))}
                />
                <Button icon={<Maximize/>} onClick={()=>setMode("fullscreen")}></Button>
            </div>
            <main className={`flex-1 flex flex-col items-center justify-center ${mode == "normal" ? 'h-[calc(100%-3em)]' : 'h-full'}`}>
                <div className={`w-full ${mode == "normal" ? 'h-[calc(100%-4em)]' : 'h-full'}`}>
                    <div className="z-10 relative size-full aspect-video bg-muted rounded-lg border border-slate-400 shadow-lg overflow-hidden bg-amber-50">
                        {mode == "fullscreen" &&
                        <>
                            <div className='absolute right-0 pt-2 pr-2 z-20'>
                                <Button size='small' variant='filled' type='text' onClick={()=>setMode("normal")} icon={<Minimize/>}></Button>
                            </div>
                            <div className='absolute bottom-0 right-0 pb-2 pr-2 z-30'>
                                <Button
                                    icon={<ChevronLeft className="h-5 w-5" />}
                                    onClick={goToPreviousSlide}
                                    disabled={currentSlide === 0}
                                    className="h-10 w-10 bg-transparent"
                                />
                                <Button
                                    icon={<ChevronRight className="h-5 w-5" />}
                                    onClick={goToNextSlide}
                                    disabled={currentSlide === slides.length - 1}
                                    className="h-10 w-10 bg-transparent"
                                ></Button>
                            </div>
                        </>
                        }
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                            <div className="text-center space-y-6">
                                <h2 className="text-5xl font-bold text-foreground tracking-tight">{slides[currentSlide].content}</h2>
                                <p className="text-xl text-muted-foreground">{slides[currentSlide].title}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${mode == "normal" ? "w-full h-[4em]" : "hidden"} flex justify-center items-center gap-6 `}>
                    <Button
                        icon={<ChevronLeft className="h-5 w-5" />}
                        onClick={goToPreviousSlide}
                        disabled={currentSlide === 0}
                        className="h-10 w-10 bg-transparent"
                    >
                        <span className="sr-only">Previous slide</span>
                    </Button>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">{currentSlide + 1}</span>
                        <span className="text-sm text-muted-foreground">/</span>
                        <span className="text-sm text-muted-foreground">{slides.length}</span>
                    </div>

                    <Button
                        icon={<ChevronRight className="h-5 w-5" />}
                        onClick={goToNextSlide}
                        disabled={currentSlide === slides.length - 1}
                        className="h-10 w-10 bg-transparent"
                    >
                        <span className="sr-only">Next slide</span>
                    </Button>
                </div>
            </main>
        </div>
    )

}

export default PresentationScreen