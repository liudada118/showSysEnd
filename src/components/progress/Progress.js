import React, { useEffect, useImperativeHandle, useState } from 'react'
import './progress.scss'
import { Select, message } from 'antd'
import { moveValue, changePxToValue } from './util'
import play from "../../assets/images/play.png";
import pause from "../../assets/images/pause.png";
import { timeStampToDate } from '../../assets/util/util';

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
let timer
const ProgressCom = React.forwardRef((props, refs) => {

    const [playFlag, setPlayFlag] = useState(false)
    const [leftFlag, setLeftFlag] = useState(false)
    const [rightFlag, setRightFlag] = useState(false)
    const [lineFlag, setLineFlag] = useState(false)
    const [dataTime, setDataTime] = useState()

    const thrott = (fun) => {
        if (!timer) {
            timer = setTimeout(() => {
                fun();
                timer = null;
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

            console.log(lineleft, e.clientX - leftX + 10, document.querySelector(".progressLine").style.left)

            if (lineleft < e.clientX - leftX + 10) {
                document.querySelector(".progressLine").style.left = `${moveValue(left + 20)}px`;
                let value = changePxToValue({ value: left, type: "line", length: props.length });
                thrott(() => {
                    props.wsSendObj({
                        value,
                    });
                });
            }
            let arr = [changePxToValue({ value: left, length: props.length }), changePxToValue({ value: right, length: props.length })];

            thrott(() => {
                props.wsSendObj({
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
                let value = changePxToValue({ value: right, type: "line", length: props.length });
                thrott(() => {
                    props.wsSendObj({
                        value,
                    });
                });
            }

            let arr = [changePxToValue({ value: left, length: props.length }), changePxToValue({ value: right, length: props.length })];

            thrott(() => {
                props.wsSendObj({
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

            let value = changePxToValue({ value: lineleft, type: "line", length: props.length });
            thrott(() => {
                props.wsSendObj({
                    value,
                });
            });

            if (props.areaArr) {
                props.data.current?.handleChartsArea(
                    props.areaArr,
                    props.max + 100,
                    value + 1
                );
            }


            if (props.pressArr && (props.matrixName == "car" || props.matrixName == "bigBed")) {
                props.data.current?.handleCharts(
                    props.pressArr,
                    props.pressMax + 100,
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
        console.log('useEffect')
        window.addEventListener("mousemove", changeLeftProgress);
        window.addEventListener("mouseup", changeLeftProgressFalse);

        return () => {
            console.log('remove')
            window.removeEventListener("mousemove", changeLeftProgress)
            window.removeEventListener("mouseup", changeLeftProgressFalse)
        }
    }, [playFlag, leftFlag, rightFlag, lineFlag])

    const playData = (value) => {
        props.wsSendObj({ play: value })
        setPlayFlag(value)
    };

    const changeIndex = (value) => {
        if (value <= props.length) {
            const line = document.querySelector(".progressLine");

            const lineLeft = 20 + (value * 560) / (props.length ? props.length : 1);
            const leftX = document.querySelector(".progress").getBoundingClientRect().x;
            const left = parseInt(document.querySelector(".leftProgress").style.left);
            const right = parseInt(document.querySelector(".rightProgress").style.left);
            line.style.left = `${20 + (value * 560) / (props.length ? props.length : 1)}px`;

            const lineLocaltion = moveValue(lineLeft < left + 20 ? left + 20 : lineLeft > right ? right : lineLeft)
            document.querySelector(".progressLine").style.left = `${lineLocaltion}px`;

            // this.setState({
            //   index: value,
            // });


            if (props.areaArr) {
                props.data.current?.handleChartsArea(
                    props.areaArr,
                    props.max + 100,
                    value
                );
                if (value == props.areaArr.length) {
                    props.wsSendObj({ play: false });

                    setPlayFlag(false)
                }
            }
            if (props.pressArr && (props.matrixName == "car" || props.matrixName == "bigBed" || props.matrixName == "car10")) {
                props.data.current?.handleCharts(
                    props.pressArr,
                    props.pressMax + 100,
                    value
                );
            }

            // if (this.bodyArr && this.state.matrixName == "bigBed") {
            //   this.data.current?.handleChartsBody(this.bodyArr, 200);
            // }


        }
    }


    /**
     * 当进度条被点击的时候，定位到点击的帧上
     */
    const progressClick = (e) => {
        // 
        const leftX = document.querySelector(".progress").getBoundingClientRect().x;
        const left = parseInt(document.querySelector(".leftProgress").style.left);
        const right = parseInt(document.querySelector(".rightProgress").style.left);

        // 让表示进度帧的竖线定位到点击的位置

        const lineLocaltion = moveValue(e.clientX - leftX < left + 20 ? left + 20 : e.clientX - leftX > right ? right : e.clientX - leftX)

        document.querySelector(".progressLine").style.left = `${lineLocaltion}px`;

        const lineleft = parseInt(document.querySelector(".progressLine").style.left);

        let value = changePxToValue({ value: lineleft, type: "line", length: props.length });

        // 向后端索要当前帧的数据
        props.wsSendObj({ value });

        // 渲染当前帧的图表
        if (props.areaArr) props.data.current?.handleChartsArea(props.areaArr, props.max + 100, value + 1);
        if (props.pressArr && (props.matrixName == "car" || props.matrixName == "bigBed")) {
            props.data.current?.handleCharts(props.pressArr, props.pressMax + 100, value + 1);
        }
    }

    useImperativeHandle(refs, () => ({
        changeIndex
    }));


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
                        border: leftFlag ? "1px solid #991BFA" : "0px",
                        left: 0
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
                        border: rightFlag ? "1px solid #991BFA" : "0px",
                        left: '580px'
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
                    // ref={this.line}
                    className="progressLine"
                    style={{ left: 20 }}
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
                        display: playFlag ? "none" : "unset",
                    }}


                    onClick={() => {
                        if (props.dataTime) {
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
                        display: playFlag ? "unset" : "none",
                    }}
                    onClick={() => {
                        playData(false);
                    }}
                    alt=""
                />
                <div style={{ position: "absolute", right: "30%" }}>
                    <Select
                        defaultValue="1.0X"
                        style={{
                            width: 80,
                        }}
                        onChange={(e) => {
                            props.wsSendObj({ speed: e });
                        }}
                        placement={"topLeft"}
                        options={playOptions}
                    />
                </div>
                <div style={{ position: "absolute", left: "calc(50% - 300px)" }}>
                    <span style={{ color : '#fff'}}>{timeStampToDate(props.time)}</span>
                </div>

                
                    
                
            </div>
        </div>
    )
})
export default ProgressCom