import React, { useEffect, useImperativeHandle, useState } from 'react'
import './aside.scss'
import * as echarts from "echarts";


const dataArr = [{
    color: '#FFA63F',
    data: '点数',
    eng: 'Points'
},
{
    color: '#2A99FF',
    data: '面积',
    eng: 'Area'
},]

const dataArr1 = [
    {
        color: '#2A99FF',
        data: '平均压力',
        eng: 'Mean Pres'
    }, {
        color: '#FF2A2A',
        data: '最大压力',
        eng: 'Max Pres'
    },
    {
        color: '#FF2A2A',
        data: '压力总和',
        eng: 'Pressure'
    }, {
        color: '#FFA63F',
        data: '压力标准差',
        eng: 'Pres Standard'
    }
]



let myChart1, myChart2

const initCharts1 = (props) => {
    let option = {
        animation: false,
        // tooltip: {
        //   trigger: "axis",
        //   show: "true",
        // },
        grid: {
            x: 10,
            x2: 10,
            y: 10,
            y2: 10,
        },
        xAxis: {
            type: "category",
            show: false,
            splitLine: {
                show: false,

            },
            data: props.xData,
            axisLabel: {
                show: false,

            },
        },

        yAxis: {
            type: "value",
            show: false,
            splitLine: {
                show: false,
            },
            max: props.yMax,
            axisLabel: {
                show: false,

            },
        },
        series: [
            {
                symbol: "none",
                data: props.yData,
                type: "line",
                smooth: true,
                color: "#E93CA7",

            },

        ],
    };
    option && props.myChart.setOption(option);

};

// const Aside = React.forwardRef((props, refs) => {

//     const initCharts = (props) => {
//         let option = {
//             tooltip: {
//                 formatter: '{a} <br/>{b} : {c}%'
//             },
//             series: [
//                 {
//                     name: 'Pressure',
//                     type: 'gauge',
//                     progress: {
//                         show: true
//                     },
//                     detail: {
//                         valueAnimation: true,
//                         formatter: '{value}'
//                     },
//                     pointer: {
//                         show: false
//                     },
//                     axisTick: {
//                         show: false,
//                     },
//                     axisLabel: {
//                         show: false,
//                     },
//                     splitLine: {
//                         show: false,
//                     },
//                     data: [
//                         {
//                             value: 50,
//                             color: '#fff'
//                         }
//                     ],
//                     itemStyle: {
//                         color: '#8a00ef'
//                     },
//                     detail: {
//                         formatter: '{value}%',
//                     },

//                     axisLine: {
//                         show: true,
//                         lineStyle: {
//                             color: [
//                                 [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
//                                     {
//                                         offset: 0.1,
//                                         color: "#FFC600"
//                                     },
//                                     {
//                                         offset: 0.6,
//                                         color: "#30D27C"
//                                     },
//                                     {
//                                         offset: 1,
//                                         color: "#0B95FF"
//                                     }
//                                 ])
//                                 ]
//                             ]

//                         }
//                     }
//                 }
//             ]
//         };

//         option && props.myChart.setOption(option);

//         // window.addEventListener("resize", function () {
//         //   props.myChart.resize();
//         // });
//     };





//     const [totalPres, setTotalPres] = useState(0)
//     const [meanPres, setMeanPres] = useState(0)
//     const [minPres, setMinPres] = useState(0)
//     const [maxPres, setMaxPres] = useState(0)
//     const [point, setPoint] = useState(0)
//     const [area, setArea] = useState(0)
//     const [pressure, setPressure] = useState(0)
//     const [presStan, setPresStan] = useState(0)
//     const [obj, setObj] = useState({})


//     useImperativeHandle(refs, () => ({
//         setMeanPres,
//         setMinPres,
//         setMaxPres,
//         setPoint,
//         setArea,
//         setPressure,
//         setPresStan,
//         setTotalPres,
//         handleCharts,
//         handleChartsArea,
//         setObj
//     }));

//     useEffect(() => {

//         myChart1 = echarts.init(document.getElementById(`myChart1`));
//         myChart2 = echarts.init(document.getElementById(`myChart2`));

//     }, [])

//     const arr = ['meanPres', 'maxPres', 'totalPres', 'presStan']
//     const arrArea = ['point', 'area',]
//     console.log('aside', obj)
//     return (

//         <div className='aside'>
//             <div className="asideContent firstAside">
//                 <h2 className="asideTitle">Pressure Area</h2>
//                 <div id="myChart1" style={{ height: '150px' }}></div>
//                 {
//                     dataArr.map((a, index) => {
//                         return (
//                             <div className='dataItem' key={a.eng}>
//                                 <div className='dataItemCircle'>
//                                     <div className='circleItem' style={{ backgroundColor: a.color }}></div>
//                                     <div>{a.data}</div>
//                                 </div>
//                                 <div className='dataIteminfo'>
//                                     <div className='standardColor'>{a.eng}</div>
//                                     <div>{obj[arrArea[index]]}</div>
//                                 </div>
//                             </div>

//                         )
//                     })
//                 }
//             </div>
//             <div className="asideContent">
//                 <h2 className="asideTitle">Pressure Data</h2>
//                 <h1 className='pressData'>{pressure}</h1>
//                 <div className='pressTitle standardColor'>总体压力 Total Pres</div>
//                 <div id="myChart2" style={{ height: '150px' }}></div>
//                 {
//                     dataArr1.map((a, index) => {
//                         return (
//                             <div className='dataItem' key={a.eng}>
//                                 <div className='dataItemCircle'>
//                                     <div className='circleItem' style={{ backgroundColor: a.color }}></div>
//                                     <div>{a.data}</div>
//                                 </div>
//                                 <div className='dataIteminfo'>
//                                     <div className='standardColor'>{a.eng}</div>
//                                     <div>{obj[arr[index]]}</div>
//                                 </div>
//                             </div>
//                         )
//                     })
//                 }
//             </div>
//         </div>
//     )
// })


// const [totalPres, setTotalPres] = useState(0)
// const [meanPres, setMeanPres] = useState(0)
// const [minPres, setMinPres] = useState(0)
// const [maxPres, setMaxPres] = useState(0)
// const [point, setPoint] = useState(0)
// const [area, setArea] = useState(0)
// const [pressure, setPressure] = useState(0)
// const [presStan, setPresStan] = useState(0)
// const [obj, setObj] = useState({})
const arr = ['meanPres', 'maxPres', 'totalPres', 'presStan']
const arrArea = ['point', 'area',]
class Aside extends React.Component {
    constructor() {
        super()
        this.state = {
            totalPres: 0,
            meanPres: 0,
            minPres: 0,
            point: 0,
            maxPres: 0,
            area: 0,
            pressure: 0,
            presStan: 0
        }
        this.totalPres = React.createRef()
        this.meanPres = React.createRef()
        this.point = React.createRef()
        this.maxPres = React.createRef()
        this.area = React.createRef()
        this.pressure = React.createRef()
        this.presStan = React.createRef()
    }

    componentDidMount() {
        myChart1 = echarts.init(document.getElementById(`myChart1`));
        myChart2 = echarts.init(document.getElementById(`myChart2`));
    }

    componentWillUnmount(){
        if(myChart1)myChart1.dispose()
        if(myChart2)myChart2.dispose()
    }
    
    initCharts1 = (props) => {
        let option = {
            animation: false,
            // tooltip: {
            //   trigger: "axis",
            //   show: "true",
            // },
            grid: {
                x: 10,
                x2: 10,
                y: 10,
                y2: 10,
            },
            xAxis: {
                type: "category",
                show: false,
                splitLine: {
                    show: false,
    
                },
                data: props.xData,
                axisLabel: {
                    show: false,
    
                },
            },
    
            yAxis: {
                type: "value",
                show: false,
                splitLine: {
                    show: false,
                },
                max: props.yMax,
                axisLabel: {
                    show: false,
    
                },
            },
            series: [
                {
                    symbol: "none",
                    data: props.yData,
                    type: "line",
                    smooth: true,
                    color: "#E93CA7",
    
                },
    
            ],
        };
        option && myChart1.setOption(option);
    
    };

    initCharts2 = (props) => {
        let option = {
            animation: false,
            // tooltip: {
            //   trigger: "axis",
            //   show: "true",
            // },
            grid: {
                x: 10,
                x2: 10,
                y: 10,
                y2: 10,
            },
            xAxis: {
                type: "category",
                show: false,
                splitLine: {
                    show: false,
    
                },
                data: props.xData,
                axisLabel: {
                    show: false,
    
                },
            },
    
            yAxis: {
                type: "value",
                show: false,
                splitLine: {
                    show: false,
                },
                max: props.yMax,
                axisLabel: {
                    show: false,
    
                },
            },
            series: [
                {
                    symbol: "none",
                    data: props.yData,
                    type: "line",
                    smooth: true,
                    color: "#E93CA7",
    
                },
    
            ],
        };
        option && myChart2.setOption(option);
    
    };


    changeData(obj){
        this.setState(obj)
    }

    render() {
        console.log('aside')

        return (
            <div className='aside'>
                <div className="asideContent firstAside">
                    <h2 className="asideTitle">Pressure Area</h2>
                    <div id="myChart1" style={{ height: '150px' }}></div>
                    {
                        dataArr.map((a, index) => {
                            return (
                                <div className='dataItem' key={a.eng}>
                                    <div className='dataItemCircle'>
                                        <div className='circleItem' style={{ backgroundColor: a.color }}></div>
                                        <div>{a.data}</div>
                                    </div>
                                    <div className='dataIteminfo'>
                                        <div className='standardColor'>{a.eng}</div>
                                        <div>
                                            {this.state[arrArea[index]]}
                                            </div>
                                    </div>
                                </div>

                            )
                        })
                    }
                </div>
                <div className="asideContent">
                    <h2 className="asideTitle">Pressure Data</h2>
                    <h1 className='pressData' ref={this.pressure}>
                        {/* {this.state.pressure} */}
                        </h1>
                    <div className='pressTitle standardColor'>总体压力 Total Pres</div>
                    <div id="myChart2" style={{ height: '150px' }}></div>
                    {
                        dataArr1.map((a, index) => {
                            return (
                                <div className='dataItem' key={a.eng}>
                                    <div className='dataItemCircle'>
                                        <div className='circleItem' style={{ backgroundColor: a.color }}></div>
                                        <div>{a.data}</div>
                                    </div>
                                    <div className='dataIteminfo'>
                                        <div className='standardColor'>{a.eng}</div>
                                        <div>{this.state[arr[index]]}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Aside
