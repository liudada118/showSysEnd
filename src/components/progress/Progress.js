import React, { useEffect, useState } from 'react'
import './progress.scss'
import { message } from 'antd'
import { moveValue } from './util'

const playOptions = [
    {
        value: 0.25,
        label: "0.25X",
    },
    {
        value: 0.5,
        label: "0.5X",
    },
    {
        value: 1,
        label: "1.0X",
    },
    {
        value: 1.5,
        label: "1.5X",
    },
    {
        value: 2,
        label: "2.0X",
    },
]

export default function Progress() {

    const [playFlag, setPlayFlag] = useState(false)
    const [leftFlag, setLeftFlag] = useState(false)
    const [rightFlag, setRightFlag] = useState(false)
    const [lineFlag, setLineFlag] = useState(false)
    const [dataTime, setDataTime] = useState()

    const thrott = (fun) => {
        if (!this.timer) {
            this.timer = setTimeout(() => {
                fun();
                this.timer = null;
            }, 100);
        }
    }

    const changeLeftProgress = (e) => {

        // 当进度条左边被按住调节起始的时间时
        if (leftFlag) {
            const leftX = document.querySelector(".progress").getBoundingClientRect().x;
            const right = parseInt(document.querySelector(".rightProgress").style.left);

            const leftpx = moveValue(e.clientX - leftX - 10);

            document.querySelector(".leftProgress").style.left = `${leftpx > right - 20 ? right - 20 : leftpx}px`;

            const left = parseInt(document.querySelector(".leftProgress").style.left);

            const lineleft = parseInt(document.querySelector(".progressLine").style.left);

            if (lineleft < e.clientX - leftX + 10) {
                document.querySelector(".progressLine").style.left = `${moveValue(left + 20)}px`;
                let value = changePxToValue(left, "line");
                thrott(() => {
                    this.wsSendObj({
                        value,
                    });
                });
            }
            let arr = [changePxToValue(left), changePxToValue(right)];

            thrott(() => {
                this.wsSendObj({
                    indexArr: arr,
                });
            });
        }


        // 当进度条右边被按住调节结束的时间时
        if (rightFlag) {
            const leftX = document.querySelector(".progress").getBoundingClientRect().x;
            const left = parseInt(document.querySelector(".leftProgress").style.left);

            var moveX = e.clientX;

            const rightpx = moveValue(e.clientX - leftX - 10);
            document.querySelector(".rightProgress").style.left = `${rightpx < left + 20 ? left + 20 : rightpx}px`;

            const right = parseInt(document.querySelector(".rightProgress").style.left);
            const lineleft = parseInt(document.querySelector(".progressLine").style.left);

            if (lineleft > e.clientX - leftX - 10) {
                document.querySelector(".progressLine").style.left = `${moveValue(right)}px`;
                let value = changePxToValue(right, "line");
                thrott(() => {
                    this.wsSendObj({
                        value,
                    });
                });
            }

            let arr = [changePxToValue(left), changePxToValue(right)];

            thrott(() => {
                this.wsSendObj({
                    indexArr: arr,
                });
            });
        }

        // 当帧条被按住调节帧时
        if (lineFlag) {
            const leftX = document.querySelector(".progress").getBoundingClientRect().x;
            var moveX = e.clientX;
            const left = parseInt(document.querySelector(".leftProgress").style.left);
            const right = parseInt(document.querySelector(".rightProgress").style.left);
            document.querySelector(".progressLine").style.left = `${moveValue(e.clientX - leftX < left + 20 ? left + 20 : e.clientX - leftX > right ? right : e.clientX - leftX)}px`;

            const lineleft = parseInt(document.querySelector(".progressLine").style.left);

            let value = changePxToValue(lineleft, "line");
            thrott(() => {
                this.wsSendObj({
                    value,
                });
            });

            if (this.areaArr) {
                this.data.current?.handleChartsArea(
                    this.areaArr,
                    this.max + 100,
                    value + 1
                );
            }


            if (this.pressArr && (this.state.matrixName == "car" || this.state.matrixName == "bigBed")) {
                this.data.current?.handleCharts(
                    this.pressArr,
                    this.pressMax + 100,
                    value + 1
                );
            }
        }
    }

    const changeLeftProgressFalse = () => {
        setLeftFlag(false)
        setRightFlag(false)
        setLineFlag(false)
    }

    useEffect(() => {
        window.addEventListener("mousemove", changeLeftProgress);

        window.addEventListener("mouseup", changeLeftProgressFalse);

        return () => {
            window.removeEventListener("mousemove", changeLeftProgress)
            window.removeEventListener("mouseup", changeLeftProgressFalse)
        }
    }, [])

    const playData = (value) => {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({ play: value }));
            // setPlayflag(value)
            setPlayFlag(value)
        }
    };


    /**
     * 当进度条被点击的时候，定位到点击的帧上
     */
    const progressClick = () => {
        // 
        const leftX = document.querySelector(".progress").getBoundingClientRect().x;
        const left = parseInt(document.querySelector(".leftProgress").style.left);
        const right = parseInt(document.querySelector(".rightProgress").style.left);

        // 让表示进度帧的竖线定位到点击的位置

        const lineLocaltion = moveValue(e.clientX - leftX < left + 20 ? left + 20 : e.clientX - leftX > right ? right : e.clientX - leftX)

        document.querySelector(".progressLine").style.left = `${lineLocaltion}px`;

        const lineleft = parseInt(document.querySelector(".progressLine").style.left);

        let value = changePxToValue(lineleft, "line");

        // 向后端索要当前帧的数据
        this.wsSendObj({ value });

        // 渲染当前帧的图表
        if (this.areaArr) this.data.current?.handleChartsArea(this.areaArr, this.max + 100, value + 1);
        if (this.pressArr && (this.state.matrixName == "car" || this.state.matrixName == "bigBed")) {
            this.data.current?.handleCharts(this.pressArr, this.pressMax + 100, value + 1);
        }
    }

    return (
        <div
            className='progressContent'
        >
            {/* 新进度条 */}

            <div
                className="progress"
                onClick={progressClick}
            >
                <div
                    style={{
                        border: this.state.leftFlag ? "1px solid #991BFA" : "0px",
                    }}
                    className="leftProgress"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        setLeftFlag(true)
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                </div>
                <div
                    style={{
                        border: this.state.rightFlag ? "1px solid #991BFA" : "0px",
                    }}
                    className="rightProgress"
                    onMouseDown={(e) => {
                        setRightFlag(true)
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                ></div>
                <div
                    ref={this.line}
                    className="progressLine"
                    onMouseDown={(e) => {
                        setLineFlag(true)
                    }}
                ></div>
            </div>
            <div className='playContent'>
                <img
                    src={play}
                    style={{
                        width: "50px",
                        display: this.state.playflag ? "none" : "unset",
                    }}


                    onClick={() => {
                        if (this.state.dataTime) {
                            playData(true);
                        } else {
                            message.info("请先选择回放数据时间段");
                        }
                    }}
                    alt=""
                />
                <img
                    src={pause}
                    style={{
                        width: "50px",
                        display: this.state.playflag ? "unset" : "none",
                    }}
                    onClick={() => {
                        playData(false);
                    }}
                    alt=""
                />
                <div style={{ position: "absolute", right: "40%" }}>
                    <Select
                        defaultValue="1.0X"
                        style={{
                            width: 80,
                        }}
                        onChange={(e) => {
                            this.wsSendObj({ speed: e });
                        }}
                        placement={"topLeft"}
                        options={playOptions}
                    />
                </div>
            </div>
        </div>
    )
}
