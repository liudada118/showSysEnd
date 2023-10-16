import React from 'react'
import './aside.scss'
import { CanvasDemo } from '../chart/Chart'


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
        color: '#FFA63F',
        data: '点数',
        eng: 'Points'
    },
    {
        color: '#2A99FF',
        data: '面积',
        eng: 'Area'
    }
]

const dataArrCar = [
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
    },
    //  {
    //     color: '#FFA63F',
    //     data: '压力标准差',
    //     eng: 'Pres Standard'
    // }
]



let myChart1, myChart2



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

class Com extends React.Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false
    }
    render() {
        console.log(this.props)
        return (
            <>{this.props.children}</>
        )
    }
}

const arr = ['meanPres', 'maxPres', 'totalPres', 'presStan']
const arrArea = ['point', 'area',]
const footArr = ['meanPres', 'maxPres', 'point', 'area',]
let ctx1, ctx2,ctx3
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
            presStan: 0,
            pressMult: localStorage.getItem("valueMult")
                ? JSON.parse(localStorage.getItem("valueMult"))
                : 1,
            fontSize : 1
        }
        this.canvas = React.createRef()
    }

    changePressMult(value) {
        this.setState({
            pressMult: value
        })
    }

    componentDidMount() {

        this.setState({
            fontSize : window.innerWidth / 1920
        })

        var c = document.getElementById("myChart1");
        if (c) ctx1 = c.getContext("2d");

        var c1 = document.getElementById("myChart2");
        if (c1) ctx2 = c1.getContext("2d");

        var c2 = document.getElementById("myChart3");
        if (c2) ctx3 = c2.getContext("2d");
    }

    componentDidUpdate() {
        var c = document.getElementById("myChart1");
        if (c) ctx1 = c.getContext("2d");

        var c1 = document.getElementById("myChart2");
        if (c1) ctx2 = c1.getContext("2d");

        var c2 = document.getElementById("myChart3");
        if (c2) ctx3 = c2.getContext("2d");
    }

    drawChart({ ctx, arr, max, canvas, index }) {
        // 清空画布
        const data = arr.map((a) => a * 150 / max)

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 计算数据点之间的间距
        var gap = canvas.width / (data.length + 1);

        // 绘制曲线
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(gap, canvas.height - data[0]);

        for (var i = 1; i < data.length - 2; i++) {
            var xMid = (gap * (i + 1) + gap * (i + 2)) / 2;
            var yMid = (canvas.height - data[i + 1] + canvas.height - data[i + 2]) / 2;
            ctx.quadraticCurveTo(gap * (i + 1), canvas.height - data[i + 1], xMid, yMid);
        }

        // 连接最后两个数据点
        ctx.quadraticCurveTo(
            gap * (data.length - 1),
            canvas.height - data[data.length - 1],
            gap * data.length,
            canvas.height - data[data.length - 1]
        );

        // 设置曲线样式
        ctx.strokeStyle = "#991BFA";
        ctx.lineWidth = 2;
        ctx.stroke();

        if (index != null) {
            ctx.beginPath();
            ctx.moveTo(gap * (index), canvas.height);
            ctx.lineTo(gap * (index), 0);
            ctx.strokeStyle = "#01F1E3";
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
        }

    }

    componentWillUnmount() {

    }

    handleCharts(arr, max, index) {
        const canvas = document.getElementById('myChart1')
        // console.log(arr, max)
        this.drawChart({ ctx: ctx1, arr, max, canvas, index })
    }

    handleChartsArea(arr, max, index) {
        const canvas = document.getElementById('myChart2')
        this.drawChart({ ctx: ctx2, arr, max, canvas, index })
        // console.log(arr, max)
    }

    handleChartsBody(arr, max, index) {
        console.log('handleChartsBody')
        const canvas = document.getElementById('myChart3')
        if(canvas){
            this.drawChart({ ctx: ctx3, arr, max, canvas, index })
        }
       
        // console.log(arr, max)
    }

    initCharts() {
        const canvas = document.getElementById('myChart1')
        if (ctx1 && canvas) {
            ctx1.clearRect(0, 0, canvas.width, canvas.height);
        }
        const canvas1 = document.getElementById('myChart2')
        if (ctx2) {
            ctx2.clearRect(0, 0, canvas1.width, canvas1.height);
        }

        const canvas2 = document.getElementById('myChart3')
        if (ctx3) {
            ctx3.clearRect(0, 0, canvas2.width, canvas2.height);
        }
    }

    changeData(obj) {
        this.setState(obj)
    }

    render() {
        // console.log('aside')

        return (
            <div className='aside'>
                <div className="asideContent firstAside">
                    {this.props.matrixName != 'foot' ? <><h2 className="asideTitle">Pressure Area</h2>
                        <canvas id="myChart1" style={{ height: `${150*this.state.fontSize}px`, width: '100%' }}></canvas>
                        <>
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
                                                    { arrArea[index] === 'area' ? 
                                                <div>{parseInt(this.state[arrArea[index]]*2.1)} <span style={{color:'#999'}}>cm²</span></div> 
                                                :  <div>{this.state[arrArea[index]]} <span style={{color:'#999'}}>个</span></div>}  
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </> </> : <Com> <CanvasDemo ref={this.canvas} /></Com>}
                </div>
                <div className="asideContent firstAside">
                    <h2 className="asideTitle">Pressure Data</h2>
                    {/* <div style={{}}> */}
                    <span className='pressData'>{(this.state.pressure * this.state.pressMult).toFixed(2)}</span> <span style={{ color: '#999' }}>{'mmgH'}</span>
                    {/* </div> */}

                    {this.props.matrixName != 'foot' ? <>
                        <div className='pressTitle standardColor'>总体压力 Total Pres</div>
                        <canvas id="myChart2" style={{ height: `${150*this.state.fontSize}px`, width: '100%' }}></canvas>
                        {
                            dataArrCar.map((a, index) => {
                                return (
                                    <div className='dataItem' key={a.eng}>
                                        <div className='dataItemCircle'>
                                            <div className='circleItem' style={{ backgroundColor: a.color }}></div>
                                            <div>{a.data}</div>
                                        </div>
                                        <div className='dataIteminfo'>
                                            <div className='standardColor'>{a.eng}</div>
                                            <div>{this.state[arr[index]]} <span style={{ color: '#999' }}>N</span></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </> : <>
                        <div className='pressTitle standardColor'>总体面积 Total Area</div>
                        <canvas id="myChart2" style={{ height: '150px', width: '100%' }}></canvas>
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
                                            <div>{this.state[footArr[index]]}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>}
                </div>
                {/* {this.props.matrixName === 'bigBed' ? <div className="asideContent" style={{padding : 0}}>
                    <canvas id="myChart3" style={{ height: '150px', width: '100%' }}></canvas>
                </div> : null} */}
            </div>
        )
    }
}

export default Aside
