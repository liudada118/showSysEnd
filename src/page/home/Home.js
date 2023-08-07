import React from 'react'
import Title from '../../components/title/Title'
import './index.scss'
import CanvasCar from '../../components/three/carnewTest copy'
import Canvas from '../../components/three/Three'
import CanvasHand from '../../components/three/hand'
import Bed from '../../components/three/Bed'
import Aside from '../../components/aside/Aside'
import plus from '../../assets/images/Plus.png'
import minus from '../../assets/images/Minus.png'
import icon from '../../assets/images/Icon.png'
import load from '../../assets/images/load.png'
import stop from '../../assets/images/stop.png'
import play from '../../assets/images/play.png'
import pause from '../../assets/images/pause.png'
import refresh from '../../assets/images/refresh.png'
import { findMax, findMin, returnChartMax, rotate180, rotate90, } from '../../assets/util/util'
import { rainbowTextColors } from "../../assets/util/color";
import { handLine, footLine, carSitLine, carBackLine, press, calculateY } from '../../assets/util/line';
import { Select, Slider, Popover, message } from 'antd'
import { SelectOutlined } from '@ant-design/icons'
import { Num } from '../../components/num/Num'
import { calFoot } from '../../assets/util/value'
import { Heatmap } from '../../components/heatmap/canvas'

let ws, ws1, xvalue = 0, zvalue = 0, sitIndexArr = new Array(4).fill(0), backIndexArr = new Array(4).fill(0), sitPress = 0, backPress = 0, ctx, ctxCircle;
let backTotal = 0, backMean = 0, backMax = 0, backMin = 0, backPoint = 0, backArea = 0, sitTotal = 0, sitMean = 0, sitMax = 0, sitMin = 0, sitPoint = 0, sitArea = 0, clearFlag = false, lastArr = []

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

class CanvasCom extends React.Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.matrixName != nextProps.matrixName
  }
  render() {
    console.log(this.props)
    return (
      <>{this.props.children}</>
    )
  }
}

class FootCom extends React.Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.matrixName != nextProps.matrixName || this.props.centerFlag != nextProps.centerFlag
  }
  render() {
    console.log(this.props)
    return (
      <>{this.props.children}</>
    )
  }
}




let totalArr = [], totalPointArr = [], wsMatrixName = 'foot'

let num = 0, colValueFlag = false, meanSmooth = 0, maxSmooth = 0, pointSmooth = 0, areaSmooth = 0, pressSmooth = 0, pressureSmooth = 0, sitDataFlag = false, arrSmooth = [16, 16],
  totalSmooth = 0,
  leftValueSmooth = 0,
  leftPropSmooth = 0,
  rightValueSmooth = 0,
  rightPropSmooth = 0,
  leftTopPropSmooth = 0,
  rightTopPropSmooth = 0,
  leftBottomPropSmooth = 0,
  rightBottomPropSmooth = 0,
  canvasWidth = 300


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
    <p>框选一个矩形区域</p>
  </div>
);

const content3 = (
  <div>
    <p>刷新轨迹图</p>
  </div>
);

const content4 = (
  <div>
    <p>下载轨迹图</p>
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
      port: [{ value: ' ', label: ' ', }],
      portname: '',
      portnameBack: "",
      matrixName: 'car',
      length: 0,
      local: false,
      dataArr: [],
      index: 0,
      playflag: false,
      selectFlag: false,
      colFlag: true,
      colNum: 0,
      history: 'now',
      numMatrixFlag: 'normal',
      centerFlag: false,
      carState: 'all',
      leftFlag: false,
      rightFlag: false,
      lineFlag: false,
      pressNum : false,
      press : false,
      dataTime : ''
    }
    this.com = React.createRef()
    this.data = React.createRef()
    this.title = React.createRef()
    this.line = React.createRef()
  }

  componentDidMount() {

    console.log(window.innerWidth, document.documentElement.style)
    document.documentElement.style.fontSize = `${(window.innerWidth / 120)}px`

    if (document.getElementById("myCanvasTrack")) {
      var c = document.getElementById("myCanvasTrack");
      ctx = c.getContext("2d");
      var c1 = document.getElementById("myCanvasCircle");
      ctxCircle = c1.getContext("2d");
      canvasWidth = c.getBoundingClientRect().width
      console.log(ctx.width, ctx.height)
      this.canvasInit1(ctx, canvasWidth)
    }
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
          const { sitData, backData, arr, realData } = footLine({wsPointData , pressFlag : this.state.press , pressNumFlag : this.state.pressNum})

          arr[0] = arr[0] ? arr[0] : 0
          arr[1] = arr[1] ? arr[1] : 0
          for (let i = 0; i < arrSmooth.length; i++) {
            arrSmooth[i] = arrSmooth[i] + (arr[i] - arrSmooth[i]) / 4
          }

          // console.log(arr)
          selectArr = []


          for (let j = sitIndexArr[2]; j <= sitIndexArr[3]; j++) {
            for (let i = sitIndexArr[0]; i <= sitIndexArr[1]; i++) {
              selectArr.push(sitData[j * 16 + i])
            }
          }

          for (let j = backIndexArr[2]; j <= backIndexArr[3]; j++) {
            for (let i = backIndexArr[0]; i <= backIndexArr[1]; i++) {
              selectArr.push(backData[j * 16 + i])
            }
          }


          let DataArr
          if (sitIndexArr.every((a) => a == 0) && backIndexArr.every((a) => a == 0)) {
            DataArr = [...realData]
          } else {

            DataArr = [...selectArr]
          }

          // initData()





          // 脚型渲染页面

          let totalPress = DataArr.reduce((a, b) => a + b, 0)
          let totalPoint = DataArr.filter((a) => a > 10).length
          let totalMean = parseInt(totalPress / (totalPoint ? totalPoint : 1))
          let totalMax = findMax(DataArr)
          // backMin = findMin(realData.filter((a) => a > 10))

          let totalArea = totalPoint * 4
          const sitPressure = totalMax * 1000 / (totalArea ? totalArea : 1)

          // const {press , point , mean , max , area , pressure} = calArr(DataArr)

          meanSmooth = parseInt(meanSmooth + (totalMean - meanSmooth) / 10)
          maxSmooth = parseInt(maxSmooth + (totalMax - maxSmooth) / 10)
          pointSmooth = parseInt(pointSmooth + (totalPoint - pointSmooth) / 10)
          areaSmooth = parseInt(areaSmooth + (totalArea - areaSmooth) / 10)
          pressSmooth = parseInt(pressSmooth + (totalPress - pressSmooth) / 10)

          pressureSmooth = parseInt(pressureSmooth + (sitPressure - pressureSmooth) / 10)



          const leftValue = sitData.reduce((a, b) => a + b, 0)
          const rightValue = backData.reduce((a, b) => a + b, 0)

          let leftProp = parseInt(leftValue * 100 / (leftValue + rightValue))
          let rightProp = 100 - leftProp


          let leftTop = [...sitData].slice(0, 16 * 16).reduce((a, b) => a + b, 0)
          let leftTopProp = parseInt(leftTop * 100 / (leftValue))
          let leftBottomProp = 100 - leftTopProp

          let rightTop = [...backData].slice(0, 16 * 16).reduce((a, b) => a + b, 0)
          let rightTopProp = parseInt(rightTop * 100 / (rightValue))
          let rightBottomProp = 100 - rightTopProp


          const total = DataArr.reduce((a, b) => a + b, 0)
          totalSmooth = parseInt(totalSmooth + (total - totalSmooth) / 10)
          leftPropSmooth = parseInt(leftPropSmooth + (leftProp - leftPropSmooth) / 10)
          leftValueSmooth = parseInt(leftValueSmooth + (leftValue - leftValueSmooth) / 10)
          rightValueSmooth = parseInt(rightValueSmooth + (rightValue - rightValueSmooth) / 10)
          leftTopPropSmooth = parseInt(leftTopPropSmooth + (leftTopProp - leftTopPropSmooth) / 10)
          rightTopPropSmooth = parseInt(rightTopPropSmooth + (rightTopProp - rightTopPropSmooth) / 10)
          rightPropSmooth = 100 - leftPropSmooth
          leftBottomPropSmooth = 100 - leftTopPropSmooth
          rightBottomPropSmooth = 100 - rightTopPropSmooth

          if (totalPoint < 10 && (sitIndexArr.every((a) => a == 0) && backIndexArr.every((a) => a == 0))) {

            meanSmooth = 0
            maxSmooth = 0
            pointSmooth = 0
            areaSmooth = 0
            pressSmooth = 0
            pressureSmooth = 0
            totalSmooth = 0
            leftValueSmooth = 0
            rightValueSmooth = 0
            leftPropSmooth = 0
            rightPropSmooth = 0
            leftTopPropSmooth = 0
            leftBottomPropSmooth = 0
            rightTopPropSmooth = 0
            rightBottomPropSmooth = 0
            arrSmooth = [16, 16]
            leftProp = 50
            rightProp = 50
            totalPoint = 0
          }


          // 数字矩阵 点图
          // if (this.state.numMatrixFlag) {
          //   this.com.current?.changeWsData(realData)
          // } else {
          //   this.com.current?.backData({
          //     wsPointData: backData,
          //   });
          //   this.com.current?.sitData({
          //     wsPointData: sitData,
          //     arr: arrSmooth
          //   });
          //   this.com.current?.changeDataFlag();
          // }

          // 数字矩阵 点图 热力图
          if (this.state.numMatrixFlag == 'num') {
            this.com.current?.changeWsData(realData)
          } else if (this.state.numMatrixFlag == 'normal') {
            this.com.current?.backData({
              wsPointData: backData,
            });
            this.com.current?.sitData({
              wsPointData: sitData,
              arr: arrSmooth
            });
            this.com.current?.changeDataFlag();
          } else {
            this.com.current?.bthClickHandle(realData)
          }



          this.data.current?.changeData({ meanPres: meanSmooth, maxPres: maxSmooth, point: pointSmooth, area: areaSmooth, totalPres: pressSmooth, pressure: pressureSmooth })

          this.data.current?.canvas.current.initCanvasrotate1((rightProp - 50) / 100)

          this.data.current?.canvas.current.changeState({
            total: totalSmooth,
            leftValue: leftValueSmooth,
            rightValue: rightValueSmooth,
            leftProp: leftPropSmooth,
            rightProp: rightPropSmooth
          })


          if (this.state.centerFlag) {
            ctx.strokeStyle = '#01F1E3'
            ctx.lineTo(arrSmooth[0] * canvasWidth / 32, arrSmooth[1] * canvasWidth / 32);
            ctx.stroke();
            ctxCircle.clearRect(0, 0, canvasWidth, canvasWidth);
            ctxCircle.beginPath();
            ctxCircle.fillStyle = '#991BFA'
            ctxCircle.arc(arrSmooth[0] * canvasWidth / 32, arrSmooth[1] * canvasWidth / 32, 5, 0, 2 * Math.PI);
            ctxCircle.fill();
            this.canvasText2(ctxCircle, canvasWidth, window.innerWidth)
          }


          if (totalArr.length < 20) {
            totalArr.push(totalPress)
          } else {
            totalArr.shift()
            totalArr.push(totalPress)
          }

          if (!this.state.local) {
            if (totalPointArr.length < 20) {
              totalPointArr.push(totalPoint)
            } else {
              totalPointArr.shift()
              totalPointArr.push(totalPoint)
            }

            const max1 = findMax(totalPointArr)
            this.data.current?.handleChartsArea(totalPointArr, max1 + 100)
          }


        } else if (this.state.matrixName == 'hand') {
          // wsPointData = handLine(wsPointData)
          // wsPointData[31] = 100
          // console.log(this.com.current)

          if(this.state.press){
            wsPointData = press(wsPointData)
          }
          if(this.state.pressNum){
            wsPointData = calculateY(wsPointData)
          }

          if (this.state.numMatrixFlag == 'normal') {
            this.com.current?.sitData({
              wsPointData: wsPointData,
            });
            // console.log(wsPointData)
            let sitData = [],
              backData = [];
            for (let i = 0; i < 32; i++) {
              for (let j = 0; j < 32; j++) {
                if (j < 16) {
                  sitData.push(wsPointData[i * 32 + j]);
                } else {
                  backData.push(wsPointData[i * 32 + j]);
                }
              }
            }

            const footLength = calFoot(sitData, 16, 32)
            console.log(footLength)
          }

        } else if (this.state.matrixName == 'car') {
          // wsPointData = carSitLine(wsPointData)

          // wsPointData[31] = 100 

          if(this.state.press){
            wsPointData = press(wsPointData)
          }
          if(this.state.pressNum){
            wsPointData = calculateY(wsPointData)
          }

          if (this.state.carState == 'sit' && this.state.numMatrixFlag == 'num') {
            this.com.current?.changeWsData(wsPointData);
          } else if (this.state.carState == 'sit' && this.state.numMatrixFlag == 'heatmap') {
            this.com.current?.bthClickHandle(wsPointData);
          }

          else  // if (this.state.numMatrixFlag === 'normal' ) 
          {
            if (this.state.numMatrixFlag == 'normal') {
              this.com.current?.sitData({
                wsPointData: wsPointData,
              });
            }

          }

          selectArr = []

          for (let i = sitIndexArr[0]; i < sitIndexArr[1]; i++) {
            for (let j = sitIndexArr[2]; j < sitIndexArr[3]; j++) {
              selectArr.push(wsPointData[i * 32 + j])
            }
          }

        } else if (this.state.matrixName == 'bigBed') {
          this.com.current?.sitData({
            wsPointData: wsPointData,
          });
        }

        let DataArr
        if (sitIndexArr.every((a) => a == 0) && backIndexArr.every((a) => a == 0)) {
          DataArr = [...wsPointData]
        } else {
          DataArr = [...selectArr]
        }



        sitPoint = DataArr.filter((a) => a > this.state.valuej1 * 0.02).length
        sitTotal = DataArr.reduce((a, b) => a + b, 0)
        sitMean = parseInt(sitTotal / (sitPoint ? sitPoint : 1))
        sitMax = findMax(DataArr)
        sitMin = findMin(DataArr.filter((a) => a > 10))
        sitArea = sitPoint * 4
        if (sitPoint < 80 && (sitIndexArr.every((a) => a == 0) && backIndexArr.every((a) => a == 0))) {
          sitMean = 0
          sitMax = 0
          sitTotal = 0
          sitPoint = 0
          sitArea = 0
        }

      }


      if (jsonObject.port != null) {
        const port = []
        jsonObject.port.forEach((a, index) => {
          port.push({
            value: a.path,
            label: a.path,
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

        let obj = []
        arr.forEach((a, index) => {
          obj.push({
            value: a,
            label: a
          })
        })
        this.setState({ dataArr: obj })
      }

      if (jsonObject.index != null) {

        if (jsonObject.index <= this.state.length) {

          const line = document.querySelector('.progressLine')

          const lineLeft = 20 + jsonObject.index * 560 / (this.state.length ? this.state.length : 1)
          const leftX = document.querySelector('.progress').getBoundingClientRect().x
          const left = parseInt(document.querySelector('.leftProgress').style.left)
          const right = parseInt(document.querySelector('.rightProgress').style.left)
          line.style.left = `${20 + jsonObject.index * 560 / (this.state.length ? this.state.length : 1)}px`

          document.querySelector('.progressLine').style.left = `${this.moveValue(lineLeft < left + 20 ? left + 20 : lineLeft > right ? right : lineLeft)}px`


          this.setState({
            index: jsonObject.index
          })

          if (this.areaArr) {
            this.data.current?.handleChartsArea(this.areaArr, this.max + 100, jsonObject.index)
            if (jsonObject.index == this.areaArr.length) {
              this.wsSendObj({ play: false })
              this.setState({
                playflag: false
              })
            }
          }
          if (this.pressArr && this.state.matrixName == 'car') {
            this.data.current?.handleCharts(this.pressArr, this.pressMax + 100, jsonObject.index)
          }

        }

        // if(jsonObject.index == this.indexArr[0])

      }

      if (jsonObject.areaArr != null) {
        const max = findMax(jsonObject.areaArr)
        this.data.current?.handleChartsArea(jsonObject.areaArr, max + 100)
        this.max = max
        this.areaArr = jsonObject.areaArr
      }

      if (jsonObject.pressArr != null) {
        const max = findMax(jsonObject.pressArr)
        if (this.state.matrixName == 'car') {
          this.data.current?.handleCharts(jsonObject.pressArr, max + 100)
          this.pressMax = max
          this.pressArr = jsonObject.pressArr
        }
      }

      if (jsonObject.download != null) {
        message.info(jsonObject.download)
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

      if (jsonObject.backData != null && this.state.matrixName == 'car') {

        backPress = 0
        let wsPointData = jsonObject.backData;

        

        if (!Array.isArray(wsPointData)) {
          wsPointData = JSON.parse(wsPointData)
        }

        // wsPointData = rotate90(wsPointData,32,32)
        // console.log(wsPointData)
        if(this.state.press){
          wsPointData = press(wsPointData)
        }
        if(this.state.pressNum){
          wsPointData = calculateY(wsPointData)
        }

        // wsPointData[31] = 1000
        if (this.state.carState == 'back' && this.state.numMatrixFlag == 'num') {
          wsPointData = rotate90(wsPointData,32,32)
          this.com.current?.changeWsData(wsPointData);
        } else if (this.state.carState == 'back' && this.state.numMatrixFlag == 'heatmap') {
          wsPointData = rotate180(wsPointData,32,32)
          this.com.current?.bthClickHandle(wsPointData);
        } else
        // if (this.state.numMatrixFlag == 'normal') 
        {
          if (this.state.numMatrixFlag == 'normal')
            this.com.current?.backData({
              wsPointData: wsPointData,
            });
        }


        // console.log(backIndexArr)
        const selectArr = []
        for (let i = backIndexArr[0]; i < backIndexArr[1]; i++) {
          for (let j = 31 - backIndexArr[3]; j < 31 - backIndexArr[2]; j++) {
            selectArr.push(wsPointData[i * 32 + j])
          }
        }

        let DataArr
        if (sitIndexArr.every((a) => a == 0) && backIndexArr.every((a) => a == 0)) {
          DataArr = [...wsPointData]
        } else {
          DataArr = [...selectArr]
        }
        // console.log(DataArr)

        backTotal = DataArr.reduce((a, b) => a + b, 0)
        backPoint = DataArr.filter((a) => a > 10).length
        backMean = parseInt(backTotal / (backPoint ? backPoint : 1))
        backMax = findMax(DataArr)
        backMin = findMin(DataArr.filter((a) => a > 10))
        backArea = backPoint * 4

        if (backPoint < 80 && (sitIndexArr.every((a) => a == 0) && backIndexArr.every((a) => a == 0))) {
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
        meanSmooth = parseInt(meanSmooth + (totalMean - meanSmooth) / 10) ? parseInt(meanSmooth + (totalMean - meanSmooth) / 10) : 1
        maxSmooth = parseInt(maxSmooth + (totalMax - maxSmooth) / 10) ? parseInt(maxSmooth + (totalMax - maxSmooth) / 10) : 1
        pointSmooth = parseInt(pointSmooth + (totalPoint - pointSmooth) / 10) ? parseInt(pointSmooth + (totalPoint - pointSmooth) / 10) : 1
        areaSmooth = parseInt(areaSmooth + (totalArea - areaSmooth) / 10) ? parseInt(areaSmooth + (totalArea - areaSmooth) / 10) : 1
        pressSmooth = parseInt(pressSmooth + (totalPress - pressSmooth) / 10) ? parseInt(pressSmooth + (totalPress - pressSmooth) / 10) : 1
        pressureSmooth = parseInt(pressureSmooth + (sitPressure - pressureSmooth) / 10) ? parseInt(pressureSmooth + (sitPressure - pressureSmooth) / 10) : 1
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

        const max = findMax(totalArr)

        if (this.state.matrixName == 'car' && !this.state.local) this.data.current?.handleCharts(totalArr, max + 1000)

        if (totalPointArr.length < 20) {
          totalPointArr.push(totalPoint)
        } else {
          totalPointArr.shift()
          totalPointArr.push(totalPoint)
        }

        const max1 = findMax(totalPointArr)
        if (this.state.matrixName == 'car' && !this.state.local) this.data.current?.handleChartsArea(totalPointArr, max1 + 100)

      }

    };
    ws1.onerror = (e) => {
      // an error occurred
    };
    ws1.onclose = (e) => {
      // connection closed
    };

    window.addEventListener('mousemove', this.changeLeftProgress.bind(this))

    window.addEventListener('mouseup', this.changeLeftProgressFalse.bind(this))
  }

  canvasText1(ctx, width, htmlWidth) {
    ctx.clearRect(260, 110, 35, 35)
    ctx.fillStyle = '#333';
    ctx.fillRect(260, 110, 35, 35)
    ctx.font = "20px Arial"
    ctx.fillStyle = '#fff';
    ctx.fillText(rightTopPropSmooth, 265, 140);


    ctx.clearRect(260, 155, 35, 35)
    ctx.fillStyle = '#333';
    ctx.fillRect(260, 155, 35, 35)
    ctx.font = "20px Arial"
    ctx.fillStyle = '#fff';
    ctx.fillText(rightBottomPropSmooth, 265, 175);

    ctx.clearRect(5, 110, 35, 35)
    ctx.fillStyle = '#333';
    ctx.fillRect(5, 110, 35, 35)
    ctx.font = "20px Arial"
    ctx.fillStyle = '#fff';
    ctx.fillText(leftTopPropSmooth, 5, 140);


    ctx.clearRect(5, 155, 35, 35)
    ctx.fillStyle = '#333';
    ctx.fillRect(5, 155, 35, 35)
    ctx.font = "20px Arial"
    ctx.fillStyle = '#fff';
    ctx.fillText(leftBottomPropSmooth, 5, 175);

    ctx.clearRect(110, 260, 35, 35)
    ctx.fillStyle = '#333';
    ctx.fillRect(110, 260, 36, 36)
    ctx.font = "20px Arial"
    ctx.fillStyle = '#fff';
    ctx.fillText(leftPropSmooth, leftPropSmooth < 10 ? 135 : 120, 290);

    ctx.clearRect(155, 260, 35, 35)
    ctx.fillStyle = '#333';
    ctx.fillRect(155, 260, 35, 35)
    ctx.font = "20px Arial"
    ctx.fillStyle = '#fff';
    ctx.fillText(rightPropSmooth, 155, 290);
  }

  canvasText2(ctx, width, htmlWidth) {
    ctx.font = `${htmlWidth / 100}px Arial`
    ctx.fillStyle = '#fff';
    ctx.fillText(rightTopPropSmooth, 265 * width / 300, 140 * width / 300);

    ctx.font = `${htmlWidth / 100}px Arial`
    ctx.fillStyle = '#fff';
    ctx.fillText(rightBottomPropSmooth, 265 * width / 300, 175 * width / 300);

    ctx.font = `${htmlWidth / 100}px Arial`
    ctx.fillStyle = '#fff';
    ctx.fillText(leftTopPropSmooth, 5 * width / 300, 140 * width / 300);

    ctx.font = `${htmlWidth / 100}px Arial`
    ctx.fillStyle = '#fff';
    ctx.fillText(leftBottomPropSmooth, 5 * width / 300, 175 * width / 300);

    ctx.font = `${htmlWidth / 100}px Arial`
    ctx.fillStyle = '#fff';
    ctx.fillText(leftPropSmooth, leftPropSmooth < 10 ? 135 * width / 300 : 120 * width / 300, 290 * width / 300);

    ctx.font = `${htmlWidth / 100}px Arial`
    ctx.fillStyle = '#fff';
    ctx.fillText(rightPropSmooth, 155 * width / 300, 290 * width / 300);
  }

  canvasInit1(ctx, width) {
    ctx.clearRect(0, 0, width, width)
    ctx.beginPath()
    // ctx.strokeStyle = '#01F1E3';
    // ctx.strokeRect(1, 1, width - 1, width - 1)
    ctx.fillStyle = "#191932";
    ctx.fillRect(1, 1, width - 1, width - 1)

    ctx.beginPath();
    ctx.strokeStyle = '#5A5A89';
    for (let i = 0; i < 9; i++) {
      ctx.moveTo(1, (i + 1) * 30 * width / 300);
      ctx.lineTo(width - 1, (i + 1) * 30 * width / 300)

    }

    for (let i = 0; i < 9; i++) {

      ctx.moveTo((i + 1) * 30 * width / 300, 1);
      ctx.lineTo((i + 1) * 30 * width / 300, width - 1)

    }
    ctx.stroke();
    ctx.beginPath()
    ctx.moveTo(1 * width / 300, 150 * width / 300);
    ctx.lineTo(299 * width / 300, 150 * width / 300)
    ctx.moveTo(150 * width / 300, 1 * width / 300);
    ctx.lineTo(150 * width / 300, 299 * width / 300)
    ctx.stroke();

    ctx.strokeStyle = '#01F1E3'
    ctx.moveTo(150 * width / 300, 150 * width / 300);
  }

  canvasInit() {
    this.canvasInit1(ctx, canvasWidth)
    if (ctxCircle) ctxCircle.clearRect(0, 0, canvasWidth, canvasWidth);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.matrixName != prevState.matrixName) {
      if (document.getElementById("myCanvasTrack")) {
        var c = document.getElementById("myCanvasTrack");
        ctx = c.getContext("2d");
        var c1 = document.getElementById("myCanvasCircle");
        ctxCircle = c1.getContext("2d");
        canvasWidth = c.getBoundingClientRect().width
        console.log(ctx.width, ctx.height)
        this.canvasInit1(ctx, canvasWidth)
      }
    }

  }

  wsSendObj = (obj) => {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(obj));
    }

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
    return value < 4 ? 0 : value >= 68 ? 31 : Math.round((value - 4) / 2 - 1)
  }

  changeFootValue = (value) => {
    return value < 4 ? 0 : value >= 36 ? 15 : Math.round((value - 4) / 2 - 1)
  }

  changeSelect = (obj, type) => {

    let sit = obj.sit
    let back = obj.back
    // console.log(sit , back , 'length')
    const sitIndex = sit.length ? sit.map((a, index) => {
      if (this.state.matrixName === 'foot') {
        if (index == 0 || index == 1) {
          return this.changeFootValue(a)
        } else {
          return this.changeValue(a)
        }
      } else {
        return this.changeValue(a)
      }

    }) : new Array(4).fill(0)
    const backIndex = back.length ? back.map((a, index) => {
      if (this.state.matrixName === 'foot') {
        if (index == 0 || index == 1) {
          return this.changeFootValue(a)
        } else {
          return this.changeValue(a)
        }
      } else {
        return this.changeValue(a)
      }
    }) : new Array(4).fill(0)
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

  saveCanvasAsImage() {
    ctx.beginPath()
    ctx.fillStyle = '#991BFA'
    ctx.arc(arrSmooth[0] * 300 / 32, arrSmooth[1] * 300 / 32, 5, 0, 2 * Math.PI);
    ctx.fill();

    const canvas = document.getElementById('myCanvasTrack');
    const dataURL = canvas.toDataURL('image/png');

    // 创建一个虚拟链接来下载保存的图片
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas_image.png';
    link.click();
  }

  moveValue(value) {
    return value < 0 ? 0 : value > 580 ? 580 : value
  }

  thrott(fun) {
    if (!this.timer) {
      this.timer = setTimeout(() => {
        fun()
        this.timer = null
      }, 100)
    }
  }

  changePxToValue(value, type) {
    let res

    if (type === 'line') {
      res = Math.floor(((value - 20) / 560) * (this.state.length - 1))
    } else {
      res = Math.floor((value / 580) * (this.state.length - 1))
    }
    return res
  }

  changeLeftProgress(e) {

    if (this.state.leftFlag) {
      const leftX = document.querySelector('.progress').getBoundingClientRect().x
      const right = parseInt(document.querySelector('.rightProgress').style.left)
      var moveX = e.clientX;

      const leftpx = this.moveValue(e.clientX - leftX - 10)


      document.querySelector('.leftProgress').style.left = `${leftpx > right - 20 ? right - 20 : leftpx}px`

      const left = parseInt(document.querySelector('.leftProgress').style.left)

      const lineleft = parseInt(document.querySelector('.progressLine').style.left)


      if (lineleft < e.clientX - leftX + 10) {
        document.querySelector('.progressLine').style.left = `${this.moveValue(left + 20)}px`
        let value = this.changePxToValue(left, 'line')
        this.thrott(() => {
          this.wsSendObj({
            value
          })
        })
      }
      let arr = [this.changePxToValue(left), this.changePxToValue(right)]

      this.thrott(() => {
        this.wsSendObj({
          indexArr: arr
        })
      })
    }

    if (this.state.rightFlag) {
      const leftX = document.querySelector('.progress').getBoundingClientRect().x
      const left = parseInt(document.querySelector('.leftProgress').style.left)

      var moveX = e.clientX;

      const rightpx = this.moveValue(e.clientX - leftX - 10)
      document.querySelector('.rightProgress').style.left = `${rightpx < left + 20 ? left + 20 : rightpx}px`


      const right = parseInt(document.querySelector('.rightProgress').style.left)
      const lineleft = parseInt(document.querySelector('.progressLine').style.left)
      if (lineleft > e.clientX - leftX - 10) {

        document.querySelector('.progressLine').style.left = `${this.moveValue(right)}px`
        let value = this.changePxToValue(right, 'line')
        this.thrott(() => {
          this.wsSendObj({
            value
          })
        })
      }


      let arr = [this.changePxToValue(left), this.changePxToValue(right)]

      this.thrott(() => {
        this.wsSendObj({
          indexArr: arr
        })
      })
    }

    if (this.state.lineFlag) {
      const leftX = document.querySelector('.progress').getBoundingClientRect().x
      var moveX = e.clientX;
      const left = parseInt(document.querySelector('.leftProgress').style.left)
      const right = parseInt(document.querySelector('.rightProgress').style.left)
      document.querySelector('.progressLine').style.left = `${this.moveValue(e.clientX - leftX < left + 20 ? left + 20 : e.clientX - leftX > right ? right : e.clientX - leftX)}px`

      const lineleft = parseInt(document.querySelector('.progressLine').style.left)

      let value = this.changePxToValue(lineleft, 'line')
      this.thrott(() => {
        this.wsSendObj({
          value
        })
      })

      if (this.areaArr) {
        this.data.current?.handleChartsArea(this.areaArr, this.max + 100, value + 1)
      }

      if (this.pressArr && this.state.matrixName == 'car') {
        this.data.current?.handleCharts(this.pressArr, this.pressMax + 100, value + 1)
      }
    }


  }

  changeLeftProgressFalse() {

    this.setState({
      leftFlag: false,
      rightFlag: false,
      lineFlag: false
    })
  }

  changeCenterFlag() { }

  render() {

    return (
      <div className='home'>
        <div className="setIcons">
          <div className="setIconItem setIconItem1">
            <Popover placement="top" title={text} content={content}
            // arrow={mergedArrow}
            >
              <div className='setIcon marginB10' onClick={() => {

                xvalue++

                // 脚型方向旋转
                if (xvalue < 3) {
                  if (this.com.current && this.com.current.changeGroupRotate) {
                    this.com.current?.changeGroupRotate({ x: xvalue })
                  }
                } else {
                  xvalue = 0
                  if (this.com.current && this.com.current.changeGroupRotate) {
                    this.com.current?.changeGroupRotate({ x: xvalue })
                  }
                }

                // 汽车方向旋转

                if (xvalue < 3) {
                  if (this.com.current && this.com.current.changePointRotation) {
                    this.com.current?.changePointRotation({ direction: 'x', value: xvalue, type: this.state.carState })
                  }
                } else {
                  xvalue = 0
                  if (this.com.current && this.com.current.changePointRotation) {
                    this.com.current?.changePointRotation({ direction: 'x', value: xvalue, type: this.state.carState })
                  }
                }

              }}>
                <img src={plus} alt="" />
              </div>
            </Popover>

            <Popover placement="top" title={text} content={content1}
            // arrow={mergedArrow}
            >
              <div className='setIcon' onClick={() => {
                zvalue++
                // 脚型方向旋转
                if (zvalue < 3) {
                  if (this.com.current && this.com.current.changeGroupRotate) {
                    this.com.current?.changeGroupRotate({ z: zvalue })
                  }
                } else {
                  zvalue = 0
                  if (this.com.current && this.com.current.changeGroupRotate) {
                    this.com.current?.changeGroupRotate({ z: zvalue })
                  }
                }

                // 汽车方向旋转
                if (zvalue < 3) {
                  if (this.com.current && this.com.current.changePointRotation) {
                    this.com.current?.changePointRotation({ direction: 'z', value: zvalue, type: this.state.carState })
                  }
                } else {
                  zvalue = 0
                  if (this.com.current && this.com.current.changePointRotation) {
                    this.com.current?.changePointRotation({ direction: 'z', value: zvalue, type: this.state.carState })
                  }
                }

              }}>
                <img src={minus} alt="" />
              </div>
            </Popover>
          </div>
          {this.state.matrixName == 'foot' ? <Popover placement="top" title={'刷新'} content={content3} >
            <div className="setIconItem setIconItem2">
              <div className='setIcon'>
                <img src={refresh} alt="" onClick={() => {
                  this.canvasInit1(ctx, canvasWidth)
                }} />
              </div>
            </div>
          </Popover> : null}

          <div className="setIconItem setIconItem2">
            {this.state.matrixName == 'foot' ? <Popover placement="top" title={'下载'} content={content4} >
              <div className='setIcon marginB10' onClick={() => {
                this.canvasText2(ctx, canvasWidth, window.innerWidth)
                this.saveCanvasAsImage()
                this.canvasInit1(ctx, canvasWidth)
              }}>
                <img src={load} alt="" />
              </div>
            </Popover> : null}
            {/* <div className='setIcon marginB10' onClick={() => {
              console.log('load')
              this.wsSendObj({ flag: false })
            }}>
              <img src={stop} alt="" />
            </div> */}
            <Popover placement="top" title={text2} content={content2} >
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
                    {(this.state.valuej1 / 100 * ((rainbowTextColors.length - 1 - indexs)) / rainbowTextColors.length).toFixed(2)}N/cm^2
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
          history={this.state.history}
          wsSendObj={this.wsSendObj}
          changeMatrix={this.changeMatrix}
          changeLocal={this.changeLocal}
          colFlag={this.state.colFlag}
          changeStateData={this.changeStateData}
          setColValueFlag={this.setColValueFlag}
          canvasInit={this.canvasInit.bind(this)}
          numMatrixFlag={this.state.numMatrixFlag}
          centerFlag={this.state.centerFlag}
          data={this.data}
          dataTime={this.state.dataTime}
        // colNum={colNum}
        // changeDateArr={changeDateArr}
        />
        {/* </TitleCom> */}
        {/* </Com> */}
        <CanvasCom matrixName={this.state.matrixName}>
          <Aside ref={this.data} matrixName={this.state.matrixName} />
        </CanvasCom>


        {this.state.numMatrixFlag == 'num' && (this.state.matrixName == 'foot' || this.state.matrixName == 'hand' || this.state.carState == 'back' || this.state.carState == 'sit') ? <Num ref={this.com} /> :
          this.state.numMatrixFlag == 'heatmap' && (this.state.matrixName == 'foot' || this.state.matrixName == 'hand' || this.state.carState == 'back' || this.state.carState == 'sit') ? <Heatmap ref={this.com} /> :
            this.state.matrixName == 'foot' ? <CanvasCom matrixName={this.state.matrixName}><Canvas ref={this.com} changeSelect={this.changeSelect} /> </CanvasCom>
              : this.state.matrixName == 'hand' ? <CanvasCom matrixName={this.state.matrixName}><CanvasHand ref={this.com} /></CanvasCom>
                : this.state.matrixName == 'car' ? <CanvasCom matrixName={this.state.matrixName}>
                  <CanvasCar ref={this.com} changeSelect={this.changeSelect} />
                </CanvasCom> : <Bed ref={this.com} />
        }
        {/* <Com>
          <CanvasCar ref={this.com} changeSelect={this.changeSelect} />
        </Com> */}

        {this.state.local ?
          // <div style={{ position: "fixed", bottom: 0, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>


          <div style={{ position: "fixed", bottom: 15, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {/* 旧进度条 */}
            {/* <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
              <Slider
                
                min={0}
                max={this.state.length - 2}
                onChange={(value) => {
                  localStorage.setItem("localValuej", value);
                  console.log(value)
                
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
            </div> */}


            {/* 新进度条 */}


            <div style={{
              width: 600, display: 'flex', justifyContent: 'center',
              //  alignItems: 'center', 
              flexDirection: 'column',
              position: 'relative',
              border: '1px #01F1E3 solid',
              borderRadius: '8px',
              overflow: 'hidden',
              height: '30px',
            }}
              className='progress'

              onClick={(e) => {
                const leftX = document.querySelector('.progress').getBoundingClientRect().x
                const left = parseInt(document.querySelector('.leftProgress').style.left)
                const right = parseInt(document.querySelector('.rightProgress').style.left)
                document.querySelector('.progressLine').style.left = `${this.moveValue(e.clientX - leftX < left + 20 ? left + 20 : e.clientX - leftX > right ? right : e.clientX - leftX)}px`

                const lineleft = parseInt(document.querySelector('.progressLine').style.left)

                let value = this.changePxToValue(lineleft, 'line')

                this.wsSendObj({
                  value
                })

                if (this.areaArr) this.data.current?.handleChartsArea(this.areaArr, this.max + 100, value + 1)
                if (this.pressArr && this.state.matrixName == 'car') this.data.current?.handleCharts(this.pressArr, this.pressMax + 100, value + 1)

              }}
            >

              <div style={{ border: this.state.leftFlag ? '1px solid #991BFA' : '0px', position: 'absolute', left: 0, width: 20, height: '30px', backgroundColor: '#01F1E3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                className='leftProgress'
                onMouseDown={(e) => {
                  e.stopPropagation()

                  this.setState({
                    leftFlag: true
                  })
                }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                {/* <div style={{height : 15 , width : 2 , backgroundColor : '#333' , marginRight : 2}}></div>
              <div style={{height : 15 , width : 2 , backgroundColor : '#333'}}></div> */}
              </div>
              <div style={{ border: this.state.rightFlag ? '1px solid #991BFA' : '0px', position: 'absolute', left: 580, width: 20, height: '30px', backgroundColor: '#01F1E3' }}
                className='rightProgress'
                onMouseDown={(e) => {

                  this.setState({
                    rightFlag: true
                  })
                }}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              ></div>
              <div ref={this.line} className='progressLine'
                onMouseDown={(e) => {

                  this.setState({
                    lineFlag: true
                  })
                }}
                style={{
                  position: 'absolute',
                  left: 20,
                  //  left: `${this.state.indexInit / (this.state.length - 2 == 0 ? 1 : this.state.length - 2) * 100}%`, 
                  height: 36, width: 2, transform: `translate('-50%')`, backgroundColor: '#991BFA'
                }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={play} style={{ width: '50px', display: this.state.playflag ? 'none' : 'unset' }}
                onClick={() => { 
                  if(this.state.dataTime){
                    this.playData(true)
                  }else{
                    message.info('请先选择回放数据时间段')
                  }
                  
                 }}
                alt="" />
              <img src={pause} style={{ width: '50px', display: this.state.playflag ? 'unset' : 'none' }}
                onClick={() => { this.playData(false) }}
                alt="" />
              <div style={{ position: 'absolute', right: '40%' }}>
                <Select
                  defaultValue="1.0X"
                  style={{
                    width: 80,
                  }}
                  onChange={(e) => {

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
          </div> : null
        }

        {
          this.state.matrixName == 'foot' ? <CanvasCom matrixName={this.state.matrixName}>
            <canvas id="myCanvasTrack" width={window.innerWidth * 15 / 100} height={window.innerWidth * 15 / 100} style={{ position: 'fixed', top: '6%', right: 'calc(3% + 48px)', borderRadius: '10px' }}></canvas>
            <canvas id="myCanvasCircle" width={window.innerWidth * 15 / 100} height={window.innerWidth * 15 / 100} style={{ position: 'fixed', top: '6%', right: 'calc(3% + 48px)', borderRadius: '10px' }}></canvas>
          </CanvasCom> : null

        }

        {/* <div style={{ position: "fixed", bottom: 15, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            width: 600, display: 'flex', justifyContent: 'center',
            flexDirection: 'column',
            position: 'relative',
            border: '1px #01F1E3 solid',
            height: '30px'
          }}
            className='progress'

            onClick={(e) => {
              const leftX = document.querySelector('.progress').getBoundingClientRect().x
              const left = parseInt(document.querySelector('.leftProgress').style.left)
              const right = parseInt(document.querySelector('.rightProgress').style.left)
              document.querySelector('.progressLine').style.left = `${this.moveValue(e.clientX - leftX < left + 20 ? left + 20 : e.clientX - leftX > right ? right : e.clientX - leftX)}px`

              const lineleft = parseInt(document.querySelector('.progressLine').style.left)

              let value = this.changePxToValue(lineleft, 'line')
              console.log(lineleft, value)

              this.wsSendObj({
                value
              })

            }}
          >

            <div style={{ border: this.state.leftFlag ? '1px solid #991BFA' : '0px', position: 'absolute', left: 0, width: 20, height: '30px', backgroundColor: 'yellow', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              className='leftProgress'
              onMouseDown={(e) => {
                e.stopPropagation()
                console.log('down')
                this.setState({
                  leftFlag: true
                })
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              
            </div>
            <div style={{ border: this.state.rightFlag ? '1px solid #991BFA' : '0px', position: 'absolute', left: 580, width: 20, height: '30px', backgroundColor: 'yellow' }}
              className='rightProgress'
              onMouseDown={(e) => {
                console.log('down')
                this.setState({
                  rightFlag: true
                })
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            ></div>
            <div ref={this.line} className='progressLine'
              onMouseDown={(e) => {
                console.log('down')
                this.setState({
                  lineFlag: true
                })
              }}
              style={{
                position: 'absolute',
                left: 20,
               
                height: 36, width: 2, transform: `translate('-50%')`, backgroundColor: 'red'
              }}></div>
          </div>
        </div> */}
        <div style={{ position: 'fixed', bottom: '20px', color: '#fff' }}>
          <div style={{ border: '1px solid #01F1E3' }} onClick={() => {
            const press = this.state.press
            this.setState({
              press: !press
            })

          }}
          >{this.state.press ? '分压' : '不分压' }</div>
          <div style={{ border: '1px solid #01F1E3' }} 
           onClick={() => {
            const pressNum = this.state.pressNum
            this.setState({
              pressNum: !pressNum
            })

          }}
          >{this.state.pressNum ? '压力算法' : '不压力算法'}</div>
        </div>
      </div >
    )
  }
}

export default Home