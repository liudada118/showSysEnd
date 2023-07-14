import React from 'react'
import Title from '../../components/title/Title'
import './index.scss'
import CanvasCar from '../../components/three/carnewTest'
import Canvas from '../../components/three/Three'
import CanvasHand from '../../components/three/hand'
import Aside from '../../components/aside/Aside'
import plus from '../../assets/images/Plus.png'
import minus from '../../assets/images/Minus.png'
import icon from '../../assets/images/Icon.png'
import load from '../../assets/images/load.png'
import stop from '../../assets/images/stop.png'
import play from '../../assets/images/play.png'
import pause from '../../assets/images/pause.png'
import { findMax, findMin, returnChartMax, } from '../../assets/util/util'
import { rainbowTextColors } from "../../assets/util/color";
import { handLine, footLine, carSitLine, carBackLine } from '../../assets/util/line';
import { Select, Slider, Popover } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

let ws, ws1, xvalue = 0, yvalue = 0, sitIndexArr = new Array(4).fill(0), backIndexArr = new Array(4).fill(0), sitPress = 0, backPress = 0, ctx;
let backTotal = 0, backMean = 0, backMax = 0, backMin = 0, backPoint = 0, backArea = 0, sitTotal = 0, sitMean = 0, sitMax = 0, sitMin = 0, sitPoint = 0, sitArea = 0

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

// valueg1={this.state.valueg1}
// value1={this.state.value1}
// valuef1={this.state.valuef1}
// valuel1={this.state.valuel1}
// valuej1={this.state.valuej1}
// valuelInit1={this.state.valuelInit1}
// ref={this.title}
// com={this.com}
// port={this.state.port}
// portname={this.state.portname}
// portnameBack={this.state.portnameBack}
// local={this.state.local}
// dataArr={this.state.dataArr}
// matrixName={this.state.matrixName}

// wsSendObj={this.wsSendObj}
// changeMatrix={this.changeMatrix}
// changeLocal={this.changeLocal}
// colFlag={this.state.colFlag}

class TitleCom extends React.Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps)
    return this.state.valueg1 != nextState.valueg1 && this.state.value1 != nextState.value1
      && this.state.valuef1 != nextState.valuef1 && this.state.valuel1 != nextState.valuel1 &&
      this.state.valuej1 != nextState.valuej1 && this.state.valuelInit1 != nextState.valuelInit1 &&
      this.state.port != nextState.port && this.state.portname != nextState.portname &&
      this.state.portnameBack != nextState.portnameBack && this.state.local != nextState.local &&
      this.state.dataArr != nextState.dataArr && this.state.matrixName != nextState.matrixName
  }
  render() {
    console.log(this.props)
    return (
      <>{this.props.children}</>
    )
  }
}

let totalArr = [], totalPointArr = [], wsMatrixName = 'foot'

// data.current?.setMeanPres(totalMean)
// data.current?.setMaxPres(totalMax)
// data.current?.setPoint(totalPoint)
// data.current?.setArea(totalArea)
// data.current?.setTotalPres(totalPress)
// if(sitPoint < 100){
//   data.current?.setPressure(0)
// }else{
//   data.current?.setPressure((sitMax*1000/sitArea).toFixed(2))
// }


let num = 0, colValueFlag = false, meanSmooth = 0, maxSmooth = 0, pointSmooth = 0, areaSmooth = 0, pressSmooth = 0, pressureSmooth = 0, sitDataFlag = false

const text = '旋转'
const text2 = '框选'

const content = (
  <div>
    <p>绕x轴旋转30°</p>
  </div>
);

const content1 = (
  <div>
    <p>绕y轴旋转30°</p>
  </div>
);

const content2 = (
  <div>
    <p>款选一个矩形区域</p>
  </div>
);

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      valueg1: localStorage.getItem('carValueg') ? JSON.parse(localStorage.getItem('carValueg')) : 2,
      valuej1: localStorage.getItem('carValuej') ? JSON.parse(localStorage.getItem('carValuej')) : 200,
      valuel1: localStorage.getItem('carValuel') ? JSON.parse(localStorage.getItem('carValuel')) : 2,
      valuef1: localStorage.getItem('carValuef') ? JSON.parse(localStorage.getItem('carValuef')) : 2,
      value1: localStorage.getItem('carValue') ? JSON.parse(localStorage.getItem('carValue')) : 2,
      valuelInit1: localStorage.getItem('carValueInit') ? JSON.parse(localStorage.getItem('carValueInit')) : 2,
      port: [{ value: ' ', label: ' ' }],
      portname: '',
      portnameBack: "",
      matrixName: 'foot',
      length: 0,
      local: false,
      dataArr: [],
      index: 0,
      playflag: false,
      selectFlag: false,
      colFlag: true,
      colNum: 0
    }
    this.com = React.createRef()
    this.data = React.createRef()
    this.title = React.createRef()
  }

  componentDidMount() {

    var c = document.getElementById("myCanvasTrack");
    ctx = c.getContext("2d");
    // ctx.fillStyle = "rgb(200,0,0)";
    ctx.strokeStyle = "rgb(200,0,0)"
    ctx.moveTo(0, 0);
    // ws = new WebSocket(" ws://192.168.31.114:19999");
    ws = new WebSocket(" ws://127.0.0.1:19999");
    ws.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws.onmessage = (e) => {
      sitPress = 0
      let jsonObject = JSON.parse(e.data);
      //处理空数组
      sitDataFlag = false
      if (jsonObject.sitData != null) {

        if (colValueFlag) {
          num++

          this.title.current?.changeNum(num)
        } else {
          num = 0
        }
        // console.log(num)



        let selectArr
        let wsPointData = jsonObject.sitData;
        if (!Array.isArray(wsPointData)) {
          wsPointData = JSON.parse(wsPointData)
        }

        if (this.state.matrixName == 'foot') {
          const { sitData, backData, arr,realData } = footLine(wsPointData)

          ctx.lineTo(arr[0] * 300 / 32, arr[1] * 300 / 32);
          ctx.stroke();

          this.com.current?.changeDataFlag();
          this.com.current?.sitData({
            wsPointData: sitData,
            arr
          });
          // console.log(arr)
          selectArr = []



          for (let i = sitIndexArr[0]; i < sitIndexArr[1]; i++) {
            for (let j = sitIndexArr[2]; j < sitIndexArr[3]; j++) {
              selectArr.push(sitData[i * 16 + j])
            }
          }

          this.com.current?.backData({
            wsPointData: backData,
          });



          // 脚型渲染页面

          let totalPress = realData.reduce((a, b) => a + b, 0)
          let totalPoint = realData.filter((a) => a > 10).length
          let totalMean = parseInt(backTotal / (totalPoint ? totalPoint : 1))
          let totalMax = findMax(realData)
          // backMin = findMin(realData.filter((a) => a > 10))
          let totalArea = totalPoint * 4
          const sitPressure = totalMax * 1000 / (totalArea ? totalArea : 1)

          meanSmooth = parseInt(meanSmooth + (totalMean - meanSmooth) / 10)
          maxSmooth = parseInt(maxSmooth + (totalMax - maxSmooth) / 10)
          pointSmooth = parseInt(pointSmooth + (totalPoint - pointSmooth) / 10)
          areaSmooth = parseInt(areaSmooth + (totalArea - areaSmooth) / 10)
          pressSmooth = parseInt(pressSmooth + (totalPress - pressSmooth) / 10)
          
          pressureSmooth = parseInt(pressureSmooth + (sitPressure - pressureSmooth) / 10)

          this.data.current?.changeData({ meanPres: meanSmooth, maxPres: maxSmooth, point: pointSmooth, area: areaSmooth, totalPres: pressSmooth, pressure: pressureSmooth })



          // if (totalArr.length < 20) {
          //   totalArr.push(totalPress)
          // } else {
          //   totalArr.shift()
          //   totalArr.push(totalPress)
          // }
          // // console.log(totalArr.length)
          // const max = findMax(totalArr)
          // this.data.current?.handleCharts(totalArr, returnChartMax(max))

          // if (totalPointArr.length < 20) {
          //   totalPointArr.push(totalPoint)
          // } else {
          //   totalPointArr.shift()
          //   totalPointArr.push(totalPoint)
          // }

          // const max1 = findMax(totalPointArr)
          // this.data.current?.handleChartsArea(totalPointArr, returnChartMax(max1))



        } else if (this.state.matrixName == 'hand') {
          wsPointData = handLine(wsPointData)
          this.com.current?.sitData({
            wsPointData: wsPointData,
          });

        } else if (this.state.matrixName == 'car') {
          wsPointData = carSitLine(wsPointData)
          this.com.current?.sitData({
            wsPointData: wsPointData,
          });
          selectArr = []

          for (let i = sitIndexArr[0]; i < sitIndexArr[1]; i++) {
            for (let j = sitIndexArr[2]; j < sitIndexArr[3]; j++) {

              selectArr.push(wsPointData[i * 32 + j])
            }
          }
        }

        let DataArr
        if (sitIndexArr.every((a) => a == 0) && backIndexArr.every((a) => a == 0)) {
          DataArr = [...wsPointData]
        } else {
          DataArr = [...selectArr]
        }
        sitPoint = DataArr.filter((a) => a > 10).length
        sitTotal = DataArr.reduce((a, b) => a + b, 0)
        sitMean = parseInt(sitTotal / (sitPoint ? sitPoint : 1))
        sitMax = findMax(DataArr)
        sitMin = findMin(DataArr.filter((a) => a > 10))
        sitArea = sitPoint * 4
        if (sitPoint < 80) {
          sitMean = 0
          sitMax = 0
          sitTotal = 0
          sitPoint = 0
          sitArea = 0
        }






        // console.log(totalArr)

        // data.current?.initCharts2(totalArr)
      }


      if (jsonObject.port != null) {
        // console.log(jsonObject.port)
        const port = []
        jsonObject.port.forEach((a, index) => {
          port.push({
            value: a.path,
            label: a.path
          })
        })

        this.setState({
          port: port
        })
      }
      if (jsonObject.length != null) {

        this.setState({
          length: jsonObject.length
        })
      }
      if (jsonObject.time != null) {

        this.setState({
          time: jsonObject.time
        })
      }
      if (jsonObject.timeArr != null) {
        // const arr = []
        const arr = jsonObject.timeArr.map((a, index) => a.date)
        // console.log(arr)
        let obj = []
        arr.forEach((a, index) => {
          obj.push({
            value: a,
            label: a
          })
        })
        this.setState({ dataArr: obj })
      }
      // console.log(jsonObject)
      if (jsonObject.index != null) {
        // console.log(index , length)
        if (jsonObject.index <= this.state.length) {

          this.setState({
            index: jsonObject.index
          })
        }

      }

    };
    ws.onerror = (e) => {
      // an error occurred
    };
    ws.onclose = (e) => {
      // connection closed
    };


    ws1 = new WebSocket(" ws://127.0.0.1:19998");
    ws1.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws1.onmessage = (e) => {
      let jsonObject = JSON.parse(e.data);

      if (jsonObject.backData != null) {

        backPress = 0
        let wsPointData = jsonObject.backData;

        if (!Array.isArray(wsPointData)) {
          wsPointData = JSON.parse(wsPointData)
        }

        this.com.current?.backData({
          wsPointData: wsPointData,
        });



        const selectArr = []
        for (let i = 31 - backIndexArr[0]; i > 31 - backIndexArr[1]; i--) {
          for (let j = backIndexArr[2]; j < backIndexArr[3]; j++) {
            selectArr.push(wsPointData[i * 32 + j])
          }
        }



        let DataArr
        if (sitIndexArr.every((a) => a == 0) && backIndexArr.every((a) => a == 0)) {
          DataArr = [...wsPointData]
        } else {
          DataArr = [...selectArr]
        }

        backTotal = DataArr.reduce((a, b) => a + b, 0)
        backPoint = DataArr.filter((a) => a > 10).length
        backMean = parseInt(backTotal / (backPoint ? backPoint : 1))
        backMax = findMax(DataArr)
        backMin = findMin(DataArr.filter((a) => a > 10))
        backArea = backPoint * 4

        if (backPoint < 80) {
          backMean = 0
          backMax = 0
          backTotal = 0
          backPoint = 0
          backArea = 0
        }



        const totalPress = backTotal + sitTotal
        let totalMean = ((backMean + sitMean) / 2).toFixed(0)
        if (backMean == 0) {
          totalMean = sitMean
        }
        if (sitMean == 0) {
          totalMean = backMean
        }
        const totalMax = Math.max(backMax, sitMax)
        const totalPoint = backPoint + sitPoint
        const totalArea = backArea + sitArea
        const totalMin = Math.min(backMin, sitMin)
        const sitPressure = sitMax * 1000 / (sitArea ? sitArea : 1)
        // meanSmooth=0 , maxSmooth=0 , pointSmooth=0 , areaSmooth=0 , pressSmooth =0, pressureSmooth=0
        meanSmooth = parseInt(meanSmooth + (totalMean - meanSmooth) / 10)
        maxSmooth = parseInt(maxSmooth + (totalMax - maxSmooth) / 10)
        pointSmooth = parseInt(pointSmooth + (totalPoint - pointSmooth) / 10)
        areaSmooth = parseInt(areaSmooth + (totalArea - areaSmooth) / 10)
        pressSmooth = parseInt(pressSmooth + (totalPress - pressSmooth) / 10)
        pressureSmooth = parseInt(pressureSmooth + (sitPressure - pressureSmooth) / 10)
        if (sitPoint < 100) {
          pressureSmooth = 0
        }

        this.data.current?.changeData({ meanPres: meanSmooth, maxPres: maxSmooth, point: pointSmooth, area: areaSmooth, totalPres: pressSmooth, pressure: pressureSmooth })



        if (totalArr.length < 20) {
          totalArr.push(totalPress)
        } else {
          totalArr.shift()
          totalArr.push(totalPress)
        }
        // console.log(totalArr.length)
        const max = findMax(totalArr)
        this.data.current?.handleCharts(totalArr, returnChartMax(max))

        if (totalPointArr.length < 20) {
          totalPointArr.push(totalPoint)
        } else {
          totalPointArr.shift()
          totalPointArr.push(totalPoint)
        }

        const max1 = findMax(totalPointArr)
        this.data.current?.handleChartsArea(totalPointArr, returnChartMax(max1))

      }

    };
    ws1.onerror = (e) => {
      // an error occurred
    };
    ws1.onclose = (e) => {
      // connection closed
    };
  }

  wsSendObj = (obj) => {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(obj));
    }
    // if (obj.file) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ file: obj.file }));
    //   }
    // }

    // if (obj.sitPort) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ sitPort: obj.sitPort }));
    //   }
    // }

    // if (obj.backPort) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ backPort: obj.backPort }));
    //   }
    // }

    // if (obj.flag != null) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ flag: obj.flag }));
    //   }
    // }

    // if (obj.getTime) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ getTime: obj.getTime }));
    //   }
    // }

    // if (obj.local) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ local: obj.local }));
    //   }
    // }

    // if (obj.time) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ time: obj.time }));
    //   }
    // }

    // if (obj.speed) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ speed: obj.speed }));
    //   }
    // }

    // if (obj.index != null) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ index: obj.index }));
    //   }
    // }

    // if (obj.exchange != null) {
    //   if (ws && ws.readyState === 1) {
    //     ws.send(JSON.stringify({ exchange: obj.exchange }));
    //   }
    // }


  }

  playData = (value) => {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify({ play: value }));
      // setPlayflag(value)
      this.setState({
        playflag: value
      })
    }
  }

  changeMatrix = (e) => {
    console.log(e)
    // setMatrixName(e)
    this.setState({ matrixName: e })
    wsMatrixName = e
  }

  // changeDateArr = (matrixName) => {
  //   if (matrixName == 'foot') {
  //     const dataArr = localStorage.getItem('dataArr')
  //     const arr = dataArr ? JSON.parse(dataArr) : []
  //     this.setState({ dataArr: arr })
  //   } else if (matrixName == 'hand') {
  //     const dataArr = localStorage.getItem('handArr')
  //     const arr = dataArr ? JSON.parse(dataArr) : []
  //     this.setState({ dataArr: arr })
  //   } else if (matrixName == 'car') {
  //     const dataArr = localStorage.getItem('carArr')
  //     const arr = dataArr ? JSON.parse(dataArr) : []
  //     this.setState({ dataArr: arr })
  //   }
  // }

  changeLocal = (value) => {

    this.setState({ local: value })
    // changeDateArr(matrixName)

    if (ws && ws.readyState === 1) {
      if (value) {
        ws.send(JSON.stringify({ local: true }));
      } else {
        ws.send(JSON.stringify({ local: false }));
      }

    }
  }

  // formatter = (value) => {

  //   return `${value}%`
  // };

  changeValue = (value) => {
    return value < 8 ? 0 : value > 68 ? 31 : Math.round((value - 8) / 2)
  }

  changeSelect = (obj) => {

    let sit = obj.sit
    let back = obj.back
    // console.log(sit , back , 'length')
    const sitIndex = sit.length ? sit.map((a) => { return this.changeValue(a) }) : []
    const backIndex = back.length ? back.map((a) => { return this.changeValue(a) }) : []
    // setSitArr(obj.sit)
    // setBackArr(obj.back)

    sitIndexArr = sitIndex
    backIndexArr = backIndex
  }

  changeStateData = (obj) => {
    this.setState(obj)
  }

  setColValueFlag = (value) => {
    colValueFlag = value
  }


  render() {
    // console.log('home')
    return (
      <div className='home'>
        <div className="setIcons">
          <div className="setIconItem setIconItem1">
            <Popover placement="top" title={text} content={content}
            // arrow={mergedArrow}
            >
              <div className='setIcon marginB10' onClick={() => {

                xvalue++
                if (xvalue < 3) {
                  // this.com.current?.changeGroupRotate({ x: xvalue })
                  console.log(xvalue)
                } else {
                  xvalue = 0
                  // this.com.current?.changeGroupRotate({ x: xvalue })
                }
              }}>
                <img src={plus} alt="" />
              </div>
            </Popover>

            <Popover placement="top" title={text} content={content1}
            // arrow={mergedArrow}
            >
              <div className='setIcon' onClick={() => {
                yvalue++
                if (yvalue < 3) {
                  // this.com.current?.changeGroupRotate({ y: yvalue })
                  console.log(yvalue)
                } else {
                  yvalue = 0
                  // this.com.current?.changeGroupRotate({ y: yvalue })
                  console.log(yvalue)
                }
              }}>
                <img src={minus} alt="" />
              </div>
            </Popover>
          </div>

          <div className="setIconItem setIconItem2">
            <div className='setIcon'>
              <img src={icon} alt="" onClick={() => {
                this.com.current?.reset()
              }} />
            </div>
          </div>

          <div className="setIconItem setIconItem2">
            <div className='setIcon marginB10' onClick={() => {
              console.log('load')
              const date = new Date(Date.now());
              const formattedDate = date.toLocaleString();
              // if (matrixName == 'foot') {
              //   const dataArr = localStorage.getItem('dataArr')
              //   const arr = dataArr ? JSON.parse(dataArr) : []
              //   arr.push(formattedDate)
              //   localStorage.setItem('dataArr', JSON.stringify(arr))
              // } else if (matrixName == 'hand') {
              //   const dataArr = localStorage.getItem('handArr')
              //   const arr = dataArr ? JSON.parse(dataArr) : []
              //   arr.push(formattedDate)
              //   localStorage.setItem('handArr', JSON.stringify(arr))
              // } else if (matrixName == 'car') {
              //   const dataArr = localStorage.getItem('handArr')
              //   const arr = dataArr ? JSON.parse(dataArr) : []
              //   arr.push(formattedDate)
              //   localStorage.setItem('handArr', JSON.stringify(arr))
              // }


              this.wsSendObj({ flag: true, time: formattedDate })
            }}>
              <img src={load} alt="" />
            </div>
            <div className='setIcon marginB10' onClick={() => {
              console.log('load')
              this.wsSendObj({ flag: false })
            }}>
              <img src={stop} alt="" />
            </div>
            <Popover placement="top" title={text2} content={content2}
            // arrow={mergedArrow}
            >
              <div className='setIcon'
                onClick={() => {
                  const flag = this.state.selectFlag
                  // setSelectFlag(!flag)
                  this.setState({
                    selectFlag: !flag
                  })
                  this.com.current?.changeSelectFlag(flag)
                }}
              >

                {/* <img src={icon2} alt="" /> */}
                <SelectOutlined style={{ color: this.state.selectFlag ? '#fff' : '#4c4671', fontSize: '20px' }} color={this.state.selectFlag ? '#fff' : '#4c4671'} />
                {/* <input type="file" id='fileInput' onChange={(e) => getPath(e)}
            /> */}
              </div>
            </Popover>
          </div>
        </div>


        <div style={{ position: 'fixed', display: 'flex', flexDirection: 'column', right: '3%', height: '55%', bottom: '6%', boxSizing: 'border-box', }}>
          {rainbowTextColors.slice(0, rainbowTextColors.length - 7).map((items, indexs) => {
            return (
              <div key={`${rainbowTextColors[items]}${indexs}`} style={{ display: "flex", height: `${100 / rainbowTextColors.slice(0, rainbowTextColors.length - 7).length}%`, alignItems: 'center', padding: '3px', boxSizing: 'border-box' }}>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    padding: "0px 10px",
                  }}
                >
                  <div
                    className="switch"
                    style={{
                      color: "#ccc",
                      // minWidth: "80px",
                      textAlign: "left",
                    }}
                  >
                    {(0.92 * ((rainbowTextColors.length - 1 - indexs)) / rainbowTextColors.length).toFixed(2)}N/cm^2
                  </div>
                  <div className="switchLevels"></div>
                </div>
                <div
                  style={{
                    width: 50,
                    height: '100%',
                    backgroundColor: `rgb(${items})`,

                  }}
                ></div>

              </div>
            );
          })}
        </div>
        {/* <Com valueg1={valueg1}
        value1={value1}
        valuef1={valuef1}
        valuel1={valuel1}
        valuej1={valuej1}
        valuelInit1={valuelInit1}
        port={port}
        portname={portname}
        portnameBack={portnameBack}
        local={local}
        dataArr={dataArr}
      > */}
        {/* <TitleCom
        valueg1={this.state.valueg1}
        value1={this.state.value1}
        valuef1={this.state.valuef1}
        valuel1={this.state.valuel1}
        valuej1={this.state.valuej1}
        valuelInit1={this.state.valuelInit1}
       
        port={this.state.port}
        portname={this.state.portname}
        portnameBack={this.state.portnameBack}
        local={this.state.local}
        dataArr={this.state.dataArr}
        matrixName={this.state.matrixName}

        
        colFlag={this.state.colFlag}
       
      > */}
        <Title
          valueg1={this.state.valueg1}
          value1={this.state.value1}
          valuef1={this.state.valuef1}
          valuel1={this.state.valuel1}
          valuej1={this.state.valuej1}
          valuelInit1={this.state.valuelInit1}
          ref={this.title}
          com={this.com}
          port={this.state.port}
          portname={this.state.portname}
          portnameBack={this.state.portnameBack}
          local={this.state.local}
          dataArr={this.state.dataArr}
          matrixName={this.state.matrixName}

          wsSendObj={this.wsSendObj}
          changeMatrix={this.changeMatrix}
          changeLocal={this.changeLocal}
          colFlag={this.state.colFlag}
          changeStateData={this.changeStateData}
          setColValueFlag={this.setColValueFlag}
        // colNum={colNum}
        // changeDateArr={changeDateArr}
        />
        {/* </TitleCom> */}
        {/* </Com> */}
        <Com>
          <Aside ref={this.data} />

        </Com>


        {this.state.matrixName == 'foot' ? <Com> <Canvas ref={this.com} changeSelect={this.changeSelect} /> </Com> : this.state.matrixName == 'hand' ? <CanvasHand ref={this.com} /> :

          null

        }
        {/* <Com>
          <CanvasCar ref={this.com} changeSelect={this.changeSelect} />
        </Com> */}

        {this.state.local ?
          <div style={{ position: "fixed", bottom: 0, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
              <Slider
                // tooltip={{
                //   formatter,
                // }}

                min={0}
                max={this.state.length - 2}
                onChange={(value) => {
                  localStorage.setItem("localValuej", value);
                  console.log(value)
                  // setIndex(value)
                  this.setState({
                    index: value
                  })
                  if (ws && ws.readyState === 1) {
                    ws.send(JSON.stringify({ value }))
                  }
                }}
                value={this.state.index}
                step={1}
                style={{ width: '100%' }}
              />
              <div>
                <img src={play} style={{ width: '50px', display: this.state.playflag ? 'none' : 'unset' }}
                  onClick={() => { this.playData(true) }}
                  alt="" />
                <img src={pause} style={{ width: '50px', display: this.state.playflag ? 'unset' : 'none' }}
                  onClick={() => { this.playData(false) }}
                  alt="" />
                <div style={{ position: 'absolute', bottom: 0, right: '20%' }}>
                  <Select
                    defaultValue="1.0X"
                    style={{
                      width: 80,
                    }}
                    onChange={(e) => {
                      console.log(e)
                      this.wsSendObj({ speed: e })
                    }}

                    // dropdownMatchSelectWidth={false}
                    placement={'topLeft'}
                    options={[
                      {
                        value: 0.25,
                        label: '0.25X',
                      },
                      {
                        value: 0.5,
                        label: '0.5X',
                      },
                      {
                        value: 1,
                        label: '1.0X',
                      },
                      {
                        value: 1.5,
                        label: '1.5X',
                      },
                      {
                        value: 2,
                        label: '2.0X',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div> : null}

        {this.state.matrixName == 'foot' ? <canvas id="myCanvasTrack" width="300" height="300" style={{ position: 'fixed', top: '5%', right: '5%' }}></canvas> : null

        }
      </div>
    )
  }
}

export default Home