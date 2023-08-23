import React from "react";
import Title from "../../components/title/Title";
import "./index.scss";
import CanvasCar from "../../components/three/carnewTest copy";
import Car10 from "../../components/three/car10";
import Canvas from "../../components/three/Three";
import CanvasHand from "../../components/three/hand";
import Bed from "../../components/three/Bed";
import Aside from "../../components/aside/Aside";
import ProgressCom from "../../components/progress/Progress";
import plus from "../../assets/images/Plus.png";
import minus from "../../assets/images/Minus.png";
import load from "../../assets/images/load.png";

import refresh from "../../assets/images/refresh.png";
import {
  findMax,
  findMin,
  rotate180,
  rotate90,
} from "../../assets/util/util";
import { rainbowTextColors } from "../../assets/util/color";
import {
  footLine,
  press,
  calculateY,
  rotateArrayCounter90Degrees,
  calculatePressure,
  objChange,
  arr10to5,
} from "../../assets/util/line";
import { Popover, message } from "antd";
import { SelectOutlined } from "@ant-design/icons";
import { Num } from "../../components/num/Num";
import { calFoot } from "../../assets/util/value";
import { Heatmap } from "../../components/heatmap/canvas";
import FootTrack from "../../components/footTrack/footTrack";
import { sitTypeEvent } from "./util";

let ws,
  ws1,
  xvalue = 0,
  zvalue = 0,
  sitIndexArr = new Array(4).fill(0),
  backIndexArr = new Array(4).fill(0),
  sitPress = 0,
  backPress = 0,
  ctx,
  ctxCircle;
let backTotal = 0,
  backMean = 0,
  backMax = 0,
  backMin = 0,
  backPoint = 0,
  backArea = 0,
  sitTotal = 0,
  sitMean = 0,
  sitMax = 0,
  sitMin = 0,
  sitPoint = 0,
  sitArea = 0,
  clearFlag = false,
  lastArr = [];

class Com extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    console.log(this.props);
    return <>{this.props.children}</>;
  }
}

class CanvasCom extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.matrixName != nextProps.matrixName;
  }
  render() {
    console.log(this.props);
    return <>{this.props.children}</>;
  }
}


let totalArr = [],
  totalPointArr = [],
  wsMatrixName = "foot";
let startPressure = 0, time = 0;
let num = 0,
  colValueFlag = false,
  meanSmooth = 0,
  maxSmooth = 0,
  pointSmooth = 0,
  areaSmooth = 0,
  pressSmooth = 0,
  pressureSmooth = 0,
  sitDataFlag = false,
  arrSmooth = [16, 16],
  totalSmooth = 0,
  leftValueSmooth = 0,
  leftPropSmooth = 0,
  rightValueSmooth = 0,
  rightPropSmooth = 0,
  leftTopPropSmooth = 0,
  rightTopPropSmooth = 0,
  leftBottomPropSmooth = 0,
  rightBottomPropSmooth = 0,
  canvasWidth = 300;

const text = "旋转";
const text2 = "框选";

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
let ctxbig
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      valueg1: localStorage.getItem("carValueg")
        ? JSON.parse(localStorage.getItem("carValueg"))
        : 2,
      valuej1: localStorage.getItem("carValuej")
        ? JSON.parse(localStorage.getItem("carValuej"))
        : 200,
      valuel1: localStorage.getItem("carValuel")
        ? JSON.parse(localStorage.getItem("carValuel"))
        : 2,
      valuef1: localStorage.getItem("carValuef")
        ? JSON.parse(localStorage.getItem("carValuef"))
        : 2,
      value1: localStorage.getItem("carValue")
        ? JSON.parse(localStorage.getItem("carValue"))
        : 2,
      valuelInit1: localStorage.getItem("carValueInit")
        ? JSON.parse(localStorage.getItem("carValueInit"))
        : 2,
      valueMult: localStorage.getItem("valueMult")
        ? JSON.parse(localStorage.getItem("valueMult"))
        : 1,
      port: [{ value: " ", label: " " }],
      portname: "",
      portnameBack: "",
      matrixName: "car10",
      length: 0,
      local: false,
      dataArr: [],
      index: 0,
      playflag: false,
      selectFlag: false,
      colFlag: true,
      colNum: 0,
      history: "now",
      numMatrixFlag: "normal",
      centerFlag: false,
      carState: "all",
      leftFlag: false,
      rightFlag: false,
      lineFlag: false,
      pressNum: false,
      press: false,
      dataTime: "",
      pointFlag: false,
      pressChart: false,
      newArr: [],
      newArr1: [],
      ymax: 200
    };
    this.com = React.createRef();
    this.data = React.createRef();
    this.title = React.createRef();
    this.line = React.createRef();
    this.track = React.createRef();
    this.progress = React.createRef();
  }

  componentDidMount() {
    console.log(window.innerWidth, document.documentElement.style);
    document.documentElement.style.fontSize = `${window.innerWidth / 120}px`;

    var c2 = document.getElementById("myChartBig");
    console.log(c2, 'c2')
    if (c2) ctxbig = c2.getContext("2d");

    // ws = new WebSocket(" ws://192.168.31.114:19999");
    // ws = new WebSocket(" ws://127.0.0.1:19999");
    ws = new WebSocket("ws://192.168.31.124:1880/ws/data")

    ws.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws.onmessage = (e) => {
      sitPress = 0;
      let jsonObject = JSON.parse(e.data);
      //处理空数组
      sitDataFlag = false;
      if (jsonObject.sitData != null) {

        if (this.state.matrixName != 'car10') {
          if (colValueFlag) {
            num++;

            this.title.current?.changeNum(num);
          } else {
            num = 0;
          }
        }
        // console.log(num)

        let selectArr;
        let wsPointData = jsonObject.sitData;
        if (!Array.isArray(wsPointData)) {
          wsPointData = JSON.parse(wsPointData);
        }

        sitTypeEvent[this.state.matrixName]({ that: this, wsPointData })



        // if (this.state.matrixName == "foot") {
        //   const { sitData, backData, arr, realData } = footLine({
        //     wsPointData,
        //     pressFlag: this.state.press,
        //     pressNumFlag: this.state.pressNum,
        //   });

        //   arr[0] = arr[0] ? arr[0] : 0;
        //   arr[1] = arr[1] ? arr[1] : 0;
        //   for (let i = 0; i < arrSmooth.length; i++) {
        //     arrSmooth[i] = arrSmooth[i] + (arr[i] - arrSmooth[i]) / 4;
        //   }

        //   // console.log(arr)
        //   selectArr = [];

        //   for (let j = sitIndexArr[2]; j <= sitIndexArr[3]; j++) {
        //     for (let i = sitIndexArr[0]; i <= sitIndexArr[1]; i++) {
        //       selectArr.push(sitData[j * 16 + i]);
        //     }
        //   }

        //   for (let j = backIndexArr[2]; j <= backIndexArr[3]; j++) {
        //     for (let i = backIndexArr[0]; i <= backIndexArr[1]; i++) {
        //       selectArr.push(backData[j * 16 + i]);
        //     }
        //   }

        //   let DataArr;
        //   if (
        //     sitIndexArr.every((a) => a == 0) &&
        //     backIndexArr.every((a) => a == 0)
        //   ) {
        //     DataArr = [...realData];
        //   } else {
        //     DataArr = [...selectArr];
        //   }

        //   // initData()

        //   // 脚型渲染页面

        //   let totalPress = DataArr.reduce((a, b) => a + b, 0);
        //   let totalPoint = DataArr.filter((a) => a > 10).length;
        //   let totalMean = parseInt(totalPress / (totalPoint ? totalPoint : 1));
        //   let totalMax = findMax(DataArr);
        //   // backMin = findMin(realData.filter((a) => a > 10))

        //   let totalArea = totalPoint * 4;
        //   const sitPressure = (totalMax * 1000) / (totalArea ? totalArea : 1);

        //   // const {press , point , mean , max , area , pressure} = calArr(DataArr)

        //   meanSmooth = parseInt(meanSmooth + (totalMean - meanSmooth) / 10);
        //   maxSmooth = parseInt(maxSmooth + (totalMax - maxSmooth) / 10);
        //   pointSmooth = parseInt(pointSmooth + (totalPoint - pointSmooth) / 10);
        //   areaSmooth = parseInt(areaSmooth + (totalArea - areaSmooth) / 10);
        //   pressSmooth = parseInt(pressSmooth + (totalPress - pressSmooth) / 10);

        //   pressureSmooth = parseInt(
        //     pressureSmooth + (sitPressure - pressureSmooth) / 10
        //   );

        //   const leftValue = sitData.reduce((a, b) => a + b, 0);
        //   const rightValue = backData.reduce((a, b) => a + b, 0);

        //   let leftProp = parseInt((leftValue * 100) / (leftValue + rightValue));
        //   let rightProp = 100 - leftProp;

        //   let leftTop = [...sitData]
        //     .slice(0, 16 * 16)
        //     .reduce((a, b) => a + b, 0);
        //   let leftTopProp = parseInt((leftTop * 100) / leftValue);
        //   let leftBottomProp = 100 - leftTopProp;

        //   let rightTop = [...backData]
        //     .slice(0, 16 * 16)
        //     .reduce((a, b) => a + b, 0);
        //   let rightTopProp = parseInt((rightTop * 100) / rightValue);
        //   let rightBottomProp = 100 - rightTopProp;

        //   const total = DataArr.reduce((a, b) => a + b, 0);
        //   totalSmooth = parseInt(totalSmooth + (total - totalSmooth) / 10);
        //   leftPropSmooth = parseInt(
        //     leftPropSmooth + (leftProp - leftPropSmooth) / 10
        //   );
        //   leftValueSmooth = parseInt(
        //     leftValueSmooth + (leftValue - leftValueSmooth) / 10
        //   );
        //   rightValueSmooth = parseInt(
        //     rightValueSmooth + (rightValue - rightValueSmooth) / 10
        //   );
        //   leftTopPropSmooth = parseInt(
        //     leftTopPropSmooth + (leftTopProp - leftTopPropSmooth) / 10
        //   );
        //   rightTopPropSmooth = parseInt(
        //     rightTopPropSmooth + (rightTopProp - rightTopPropSmooth) / 10
        //   );
        //   rightPropSmooth = 100 - leftPropSmooth;
        //   leftBottomPropSmooth = 100 - leftTopPropSmooth;
        //   rightBottomPropSmooth = 100 - rightTopPropSmooth;

        //   if (
        //     totalPoint < 10 &&
        //     sitIndexArr.every((a) => a == 0) &&
        //     backIndexArr.every((a) => a == 0)
        //   ) {
        //     meanSmooth = 0;
        //     maxSmooth = 0;
        //     pointSmooth = 0;
        //     areaSmooth = 0;
        //     pressSmooth = 0;
        //     pressureSmooth = 0;
        //     totalSmooth = 0;
        //     leftValueSmooth = 0;
        //     rightValueSmooth = 0;
        //     leftPropSmooth = 0;
        //     rightPropSmooth = 0;
        //     leftTopPropSmooth = 0;
        //     leftBottomPropSmooth = 0;
        //     rightTopPropSmooth = 0;
        //     rightBottomPropSmooth = 0;
        //     arrSmooth = [16, 16];
        //     leftProp = 50;
        //     rightProp = 50;
        //     totalPoint = 0;
        //   }

        //   // 数字矩阵 点图
        //   // if (this.state.numMatrixFlag) {
        //   //   this.com.current?.changeWsData(realData)
        //   // } else {
        //   //   this.com.current?.backData({
        //   //     wsPointData: backData,
        //   //   });
        //   //   this.com.current?.sitData({
        //   //     wsPointData: sitData,
        //   //     arr: arrSmooth
        //   //   });
        //   //   this.com.current?.changeDataFlag();
        //   // }

        //   // 数字矩阵 点图 热力图
        //   if (this.state.numMatrixFlag == "num") {
        //     this.com.current?.changeWsData(realData);
        //   } else if (this.state.numMatrixFlag == "normal") {
        //     this.com.current?.backData({
        //       wsPointData: backData,
        //     });
        //     this.com.current?.sitData({
        //       wsPointData: sitData,
        //       arr: arrSmooth,
        //     });
        //     this.com.current?.changeDataFlag();
        //   } else {
        //     this.com.current?.bthClickHandle(realData);
        //   }

        //   this.data.current?.changeData({
        //     meanPres: meanSmooth,
        //     maxPres: maxSmooth,
        //     point: pointSmooth,
        //     area: areaSmooth,
        //     totalPres: pressSmooth,
        //     pressure: pressureSmooth,
        //   });

        //   this.data.current?.canvas.current.initCanvasrotate1(
        //     (rightProp - 50) / 100
        //   );

        //   this.data.current?.canvas.current.changeState({
        //     total: totalSmooth,
        //     leftValue: leftValueSmooth,
        //     rightValue: rightValueSmooth,
        //     leftProp: leftPropSmooth,
        //     rightProp: rightPropSmooth,
        //   });

        //   // 打开脚型轨迹图
        //   if (this.state.centerFlag) {
        //     this.track.current?.circleMove({ arrSmooth, rightTopPropSmooth, leftTopPropSmooth, leftBottomPropSmooth, rightPropSmooth, leftPropSmooth, rightBottomPropSmooth })
        //   }

        //   if (totalArr.length < 20) {
        //     totalArr.push(totalPress);
        //   } else {
        //     totalArr.shift();
        //     totalArr.push(totalPress);
        //   }

        //   if (!this.state.local) {
        //     if (totalPointArr.length < 20) {
        //       totalPointArr.push(totalPoint);
        //     } else {
        //       totalPointArr.shift();
        //       totalPointArr.push(totalPoint);
        //     }

        //     const max1 = findMax(totalPointArr);
        //     this.data.current?.handleChartsArea(totalPointArr, max1 + 100);
        //   }
        // } else if (this.state.matrixName == "hand") {
        //   // wsPointData = handLine(wsPointData)
        //   // wsPointData[31] = 100
        //   // console.log(this.com.current)

        //   if (this.state.press) {
        //     wsPointData = press(wsPointData, 32, 32);
        //   }
        //   if (this.state.pressNum) {
        //     wsPointData = calculateY(wsPointData);
        //   }

        //   if (this.state.numMatrixFlag == "normal") {
        //     this.com.current?.sitData({
        //       wsPointData: wsPointData,
        //     });
        //     // console.log(wsPointData)
        //     let sitData = [],
        //       backData = [];
        //     for (let i = 0; i < 32; i++) {
        //       for (let j = 0; j < 32; j++) {
        //         if (j < 16) {
        //           sitData.push(wsPointData[i * 32 + j]);
        //         } else {
        //           backData.push(wsPointData[i * 32 + j]);
        //         }
        //       }
        //     }

        //     const footLength = calFoot(sitData, 16, 32);
        //     console.log(footLength);
        //   } else if (this.state.numMatrixFlag == "heatmap") {
        //     this.com.current?.bthClickHandle(wsPointData);
        //   }
        // } else if (this.state.matrixName == "car") {
        //   // wsPointData = carSitLine(wsPointData)

        //   // wsPointData[31] = 100

        //   if (this.state.press) {
        //     wsPointData = press(wsPointData, 32, 32);
        //   }
        //   if (this.state.pressNum) {
        //     wsPointData = calculateY(wsPointData);
        //   }

        //   if (
        //     this.state.carState == "sit" &&
        //     this.state.numMatrixFlag == "num"
        //   ) {
        //     this.com.current?.changeWsData(wsPointData);
        //   } else if (
        //     this.state.carState == "sit" &&
        //     this.state.numMatrixFlag == "heatmap"
        //   ) {
        //     this.com.current?.bthClickHandle(wsPointData);
        //   } // if (this.state.numMatrixFlag === 'normal' )
        //   else {
        //     if (this.state.numMatrixFlag == "normal") {
        //       this.com.current?.sitData({
        //         wsPointData: wsPointData,
        //       });
        //     }
        //   }

        //   selectArr = [];

        //   for (let i = sitIndexArr[0]; i < sitIndexArr[1]; i++) {
        //     for (let j = sitIndexArr[2]; j < sitIndexArr[3]; j++) {
        //       selectArr.push(wsPointData[i * 32 + j]);
        //     }
        //   }

        //   let DataArr;

        //   if (sitIndexArr.every((a) => a == 0)) {
        //     DataArr = [...wsPointData];
        //   } else {
        //     DataArr = [...selectArr];
        //   }

        //   // 框选后或者无框选的数据
        //   const total = DataArr.reduce((a, b) => a + b, 0);
        //   const length = DataArr.filter((a, index) => a > 0).length;

        //   sitPoint = DataArr.filter(
        //     (a) => a > this.state.valuej1 * 0.02
        //   ).length;
        //   sitTotal = DataArr.reduce((a, b) => a + b, 0);
        //   sitMean = parseInt(sitTotal / (sitPoint ? sitPoint : 1));
        //   sitMax = findMax(DataArr);
        //   sitMin = findMin(DataArr.filter((a) => a > 10));
        //   sitArea = sitPoint * 4;
        //   if (
        //     sitPoint < 80 &&
        //     sitIndexArr.every((a) => a == 0) &&
        //     backIndexArr.every((a) => a == 0)
        //   ) {
        //     sitMean = 0;
        //     sitMax = 0;
        //     sitTotal = 0;
        //     sitPoint = 0;
        //     sitArea = 0;
        //   }
        // } else if (this.state.matrixName == "bigBed") {
        //   // wsPointData[2047] = 1000


        //   let DataArr;
        //   selectArr = [];
        //   wsPointData = pressBed(wsPointData, 1500);

        //   let bodyArr = []
        //   for (let i = 0; i < 64; i++) {
        //     let num = 0
        //     for (let j = 0; j < 32; j++) {
        //       num += wsPointData[j * 64 + i]
        //     }
        //     bodyArr.push(parseInt(num / 32))
        //   }
        //   this.bodyArr = bodyArr
        //   // console.log(this.bodyArr , this.state.local)
        //   // if (this.state.matrixName == "bigBed" && !this.state.local)
        //   //   this.data.current?.handleChartsBody(bodyArr, 200);

        //   this.com.current?.sitData({
        //     wsPointData: wsPointData,
        //   });

        //   for (let i = sitIndexArr[2]; i < sitIndexArr[3]; i++) {
        //     for (let j = sitIndexArr[0]; j < sitIndexArr[1]; j++) {
        //       selectArr.push(wsPointData[i * 64 + j]);
        //     }
        //   }

        //   if (sitIndexArr.every((a) => a == 0)) {
        //     DataArr = [...wsPointData];
        //   } else {
        //     DataArr = [...selectArr];
        //   }

        //   // 框选后或者无框选的数据
        //   const total = DataArr.reduce((a, b) => a + b, 0);
        //   const length = DataArr.filter((a, index) => a > 0).length;

        //   const newPressure = total / length;
        //   // setRealPress(newPressure);
        //   let pressure = calculatePressure(total / length)
        //   const change = objChange(newPressure, startPressure, 4);
        //   if (change) {
        //     startPressure = newPressure;
        //     time = 0;
        //   } else {
        //     time++;
        //     pressure = calculatePressure(calPress(startPressure, newPressure, time));
        //     if (time > 240 * 13) {
        //       time = 240 * 13;
        //     }
        //   }

        //   // console.log(pressure , total / length)

        //   sitPoint = length
        //   sitTotal = DataArr.reduce((a, b) => a + b, 0);
        //   sitMean = parseInt(sitTotal / (sitPoint ? sitPoint : 1));
        //   sitMax = findMax(DataArr);
        //   sitMin = findMin(DataArr.filter((a) => a > 10));
        //   sitArea = sitPoint * 4;
        //   if (
        //     sitPoint < 80 &&
        //     sitIndexArr.every((a) => a == 0) &&
        //     backIndexArr.every((a) => a == 0)
        //   ) {
        //     sitMean = 0;
        //     sitMax = 0;
        //     sitTotal = 0;
        //     sitPoint = 0;
        //     sitArea = 0;
        //   }

        //   meanSmooth = (meanSmooth + (sitMean - meanSmooth) / 10)
        //     ? (meanSmooth + (sitMean - meanSmooth) / 10)
        //     : 1;
        //   maxSmooth = (maxSmooth + (sitMax - maxSmooth) / 10)
        //     ? (maxSmooth + (sitMax - maxSmooth) / 10)
        //     : 1;
        //   pointSmooth = (pointSmooth + (sitPoint - pointSmooth) / 10)
        //     ? (pointSmooth + (sitPoint - pointSmooth) / 10)
        //     : 1;
        //   areaSmooth = (areaSmooth + (sitArea - areaSmooth) / 10)
        //     ? (areaSmooth + (sitArea - areaSmooth) / 10)
        //     : 1;
        //   pressSmooth = (pressSmooth + (sitTotal - pressSmooth) / 10)
        //     ? (pressSmooth + (sitTotal - pressSmooth) / 10)
        //     : 1;

        //   pressureSmooth = (
        //     pressureSmooth + (pressure - pressureSmooth) / 3
        //   )
        //     ? (pressureSmooth + (pressure - pressureSmooth) / 3)
        //     : 0;
        //   // console.log(pressure,pressureSmooth)
        //   this.data.current?.changeData({
        //     meanPres: meanSmooth.toFixed(0),
        //     maxPres: maxSmooth.toFixed(0),
        //     point: pointSmooth.toFixed(0),
        //     area: areaSmooth.toFixed(0),
        //     totalPres: pressSmooth.toFixed(0),
        //     pressure: pressureSmooth.toFixed(2),
        //   });

        //   if (totalArr.length < 20) {
        //     totalArr.push(sitTotal);
        //   } else {
        //     totalArr.shift();
        //     totalArr.push(sitTotal);
        //   }

        //   const max = findMax(totalArr);

        //   if (this.state.matrixName == "bigBed" && !this.state.local)
        //     this.data.current?.handleCharts(totalArr, max + 1000);

        //   if (totalPointArr.length < 20) {
        //     totalPointArr.push(sitPoint);
        //   } else {
        //     totalPointArr.shift();
        //     totalPointArr.push(sitPoint);
        //   }

        //   const max1 = findMax(totalPointArr);
        //   if (this.state.matrixName == "bigBed" && !this.state.local)
        //     this.data.current?.handleChartsArea(totalPointArr, max1 + 100);
        // }
      }

      if (jsonObject.port != null) {
        const port = [];
        jsonObject.port.forEach((a, index) => {
          port.push({
            value: a.path,
            label: a.path,
          });
        });

        this.setState({
          port: port,
        });
      }
      if (jsonObject.length != null) {
        this.setState({
          length: jsonObject.length,
        });
      }
      if (jsonObject.time != null) {
        this.setState({
          time: jsonObject.time,
        });
      }
      if (jsonObject.timeArr != null) {
        // const arr = []
        const arr = jsonObject.timeArr.map((a, index) => a.date);

        if (this.state.matrixName != 'car10') {
          let obj = [];
          arr.forEach((a, index) => {
            obj.push({
              value: a,
              label: a,
            });
          });
          this.setState({ dataArr: obj });
        }

      }

      if (jsonObject.index != null) {
        this.progress.current?.changeIndex(jsonObject.index)
      }

      if (jsonObject.areaArr != null) {
        const max = findMax(jsonObject.areaArr);
        this.data.current?.handleChartsArea(jsonObject.areaArr, max + 100);
        this.max = max;
        this.areaArr = jsonObject.areaArr;
      }

      if (jsonObject.pressArr != null) {
        const max = findMax(jsonObject.pressArr);
        if (this.state.matrixName == "car" || this.state.matrixName == "bigBed") {
          this.data.current?.handleCharts(jsonObject.pressArr, max + 100);
          this.pressMax = max;
          this.pressArr = jsonObject.pressArr;
        }
      }

      if (jsonObject.download != null) {
        message.info(jsonObject.download);
      }
    };
    ws.onerror = (e) => {
      // an error occurred
    };
    ws.onclose = (e) => {
      // connection closed
    };

    // ws1 = new WebSocket(" ws://127.0.0.1:19998");
    ws1 = new WebSocket("ws://192.168.31.124:1880/ws/data1")
    ws1.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws1.onmessage = (e) => {
      let jsonObject = JSON.parse(e.data);

      if (jsonObject.backData != null && this.state.matrixName == "car") {

        if (this.state.matrixName == 'car10') {
          if (colValueFlag) {
            num++;

            this.title.current?.changeNum(num);
          } else {
            num = 0;
          }
        }

        backPress = 0;
        let wsPointData = jsonObject.backData;

        if (!Array.isArray(wsPointData)) {
          wsPointData = JSON.parse(wsPointData);
        }

        // wsPointData = rotate90(wsPointData,32,32)
        // console.log(wsPointData)
        if (this.state.press) {
          wsPointData = press(wsPointData, 32, 32);
        }
        if (this.state.pressNum) {
          wsPointData = calculateY(wsPointData);
        }

        // wsPointData[31] = 1000
        if (
          this.state.carState == "back" &&
          this.state.numMatrixFlag == "num"
        ) {
          wsPointData = rotate90(wsPointData, 32, 32);
          this.com.current?.changeWsData(wsPointData);
        } else if (
          this.state.carState == "back" &&
          this.state.numMatrixFlag == "heatmap"
        ) {
          wsPointData = rotate180(wsPointData, 32, 32);
          this.com.current?.bthClickHandle(wsPointData);
        }
        // if (this.state.numMatrixFlag == 'normal')
        else {
          if (this.state.numMatrixFlag == "normal")
            this.com.current?.backData({
              wsPointData: wsPointData,
            });
        }

        // console.log(backIndexArr)
        // backIndexArr[2] = Math.round(backIndexArr[2] / 2)
        // backIndexArr[3] = Math.round(backIndexArr[3] / 2)
        const selectArr = [];
        for (let i = backIndexArr[0]; i < backIndexArr[1]; i++) {
          for (let j = 31 - backIndexArr[3]; j < 31 - backIndexArr[2]; j++) {
            selectArr.push(wsPointData[i * 32 + j]);
          }
        }

        let DataArr;
        if (
          sitIndexArr.every((a) => a == 0) &&
          backIndexArr.every((a) => a == 0)
        ) {
          DataArr = [...wsPointData];
        } else {
          DataArr = [...selectArr];
        }
        // console.log(DataArr)

        backTotal = DataArr.reduce((a, b) => a + b, 0);
        backPoint = DataArr.filter((a) => a > 10).length;
        backMean = parseInt(backTotal / (backPoint ? backPoint : 1));
        backMax = findMax(DataArr);
        backMin = findMin(DataArr.filter((a) => a > 10));
        backArea = backPoint * 4;

        if (
          backPoint < 80 &&
          sitIndexArr.every((a) => a == 0) &&
          backIndexArr.every((a) => a == 0)
        ) {
          backMean = 0;
          backMax = 0;
          backTotal = 0;
          backPoint = 0;
          backArea = 0;
        }

        const totalPress = backTotal + sitTotal;
        let totalMean = ((backMean + sitMean) / 2).toFixed(0);
        if (backMean == 0) {
          totalMean = sitMean;
        }
        if (sitMean == 0) {
          totalMean = backMean;
        }
        const totalMax = Math.max(backMax, sitMax);
        const totalPoint = backPoint + sitPoint;
        const totalArea = backArea + sitArea;
        const totalMin = Math.min(backMin, sitMin);
        const sitPressure = (sitMax * 1000) / (sitArea ? sitArea : 1);
        // meanSmooth=0 , maxSmooth=0 , pointSmooth=0 , areaSmooth=0 , pressSmooth =0, pressureSmooth=0
        meanSmooth = parseInt(meanSmooth + (totalMean - meanSmooth) / 10)
          ? parseInt(meanSmooth + (totalMean - meanSmooth) / 10)
          : 1;
        maxSmooth = parseInt(maxSmooth + (totalMax - maxSmooth) / 10)
          ? parseInt(maxSmooth + (totalMax - maxSmooth) / 10)
          : 1;
        pointSmooth = parseInt(pointSmooth + (totalPoint - pointSmooth) / 10)
          ? parseInt(pointSmooth + (totalPoint - pointSmooth) / 10)
          : 1;
        areaSmooth = parseInt(areaSmooth + (totalArea - areaSmooth) / 10)
          ? parseInt(areaSmooth + (totalArea - areaSmooth) / 10)
          : 1;
        pressSmooth = parseInt(pressSmooth + (totalPress - pressSmooth) / 10)
          ? parseInt(pressSmooth + (totalPress - pressSmooth) / 10)
          : 1;
        pressureSmooth = parseInt(
          pressureSmooth + (sitPressure - pressureSmooth) / 10
        )
          ? parseInt(pressureSmooth + (sitPressure - pressureSmooth) / 10)
          : 1;
        if (sitPoint < 100) {
          pressureSmooth = 0;
        }

        this.data.current?.changeData({
          meanPres: meanSmooth,
          maxPres: maxSmooth,
          point: pointSmooth,
          area: areaSmooth,
          totalPres: pressSmooth,
          pressure: pressureSmooth,
        });

        if (totalArr.length < 20) {
          totalArr.push(totalPress);
        } else {
          totalArr.shift();
          totalArr.push(totalPress);
        }

        const max = findMax(totalArr);

        if (this.state.matrixName == "car" && !this.state.local)
          this.data.current?.handleCharts(totalArr, max + 1000);

        if (totalPointArr.length < 20) {
          totalPointArr.push(totalPoint);
        } else {
          totalPointArr.shift();
          totalPointArr.push(totalPoint);
        }

        const max1 = findMax(totalPointArr);
        if (this.state.matrixName == "car" && !this.state.local)
          this.data.current?.handleChartsArea(totalPointArr, max1 + 100);
      }

      if (jsonObject.backData != null && this.state.matrixName == "car10") {

        if (this.state.matrixName == 'car10') {
          if (colValueFlag) {
            num++;

            this.title.current?.changeNum(num);
          } else {
            num = 0;
          }
        }
        backPress = 0;
        let wsPointData = jsonObject.backData;

        if (!Array.isArray(wsPointData)) {
          wsPointData = JSON.parse(wsPointData);
        }



        // const numData = rotateArrayCounter90Degrees([...wsPointData], 10, 10);
        const numData = [...wsPointData]

        const newArr = [];
        for (let i = 0; i < 10; i++) {
          newArr[i] = [];
          for (let j = 0; j < 10; j++) {
            newArr[i].push(numData[i * 10 + j]);
          }
        }

        // console.log(newArr)

        this.setState({ newArr1 : newArr });

        // wsPointData = rotate90(wsPointData,32,32)
        // console.log(wsPointData)
        if (this.state.press) {
          wsPointData = press(wsPointData, 32, 32);
        }
        if (this.state.pressNum) {
          wsPointData = calculateY(wsPointData);
        }

        // wsPointData[31] = 1000
        // if (this.state.carState == 'back' && this.state.numMatrixFlag == 'num') {
        //   wsPointData = rotate90(wsPointData, 32, 32)
        //   this.com.current?.changeWsData(wsPointData);
        // } else if (this.state.carState == 'back' && this.state.numMatrixFlag == 'heatmap') {
        //   wsPointData = rotate180(wsPointData, 32, 32)
        //   this.com.current?.bthClickHandle(wsPointData);
        // } else
        // // if (this.state.numMatrixFlag == 'normal')
        // {
        //   if (this.state.numMatrixFlag == 'normal')
        //     this.com.current?.backData({
        //       wsPointData: wsPointData,
        //     });
        // }

        // wsPointData = arr10to5(wsPointData)

        const dataArr = []
        // for (let i = 0; i < 10; i++) {
        //   dataArr[i] = []
        //   for (let j = 0; j < 10; j++) {
        //     dataArr[i].push(wsPointData[i * 10 + j])
        //   }
        // }

        // this.setState({
        //   newArr1: dataArr
        // })

        this.com.current?.backData({
          wsPointData: wsPointData,
        });

        // console.log(backIndexArr)
        // backIndexArr[2] = Math.round(backIndexArr[2] / 2)
        // backIndexArr[3] = Math.round(backIndexArr[3] / 2)
        const selectArr = [];
        for (let i = backIndexArr[0]; i < backIndexArr[1]; i++) {
          for (let j = 31 - backIndexArr[3]; j < 31 - backIndexArr[2]; j++) {
            selectArr.push(wsPointData[i * 32 + j]);
          }
        }

        let DataArr;
        if (
          sitIndexArr.every((a) => a == 0) &&
          backIndexArr.every((a) => a == 0)
        ) {
          DataArr = [...wsPointData];
        } else {
          DataArr = [...selectArr];
        }
        // console.log(DataArr)

        backTotal = DataArr.reduce((a, b) => a + b, 0);
        backPoint = DataArr.filter((a) => a > 10).length;
        backMean = parseInt(backTotal / (backPoint ? backPoint : 1));
        backMax = findMax(DataArr);
        backMin = findMin(DataArr.filter((a) => a > 10));
        backArea = backPoint * 4;

        if (
          backPoint < 10 &&
          sitIndexArr.every((a) => a == 0) &&
          backIndexArr.every((a) => a == 0)
        ) {
          backMean = 0;
          backMax = 0;
          backTotal = 0;
          backPoint = 0;
          backArea = 0;
        }

        const totalPress = backTotal + sitTotal;
        let totalMean = ((backMean + sitMean) / 2).toFixed(0);
        if (backMean == 0) {
          totalMean = sitMean;
        }
        if (sitMean == 0) {
          totalMean = backMean;
        }
        const totalMax = Math.max(backMax, sitMax);
        const totalPoint = backPoint + sitPoint;
        const totalArea = backArea + sitArea;
        const totalMin = Math.min(backMin, sitMin);
        const sitPressure = (sitMax * 1000) / (sitArea ? sitArea : 1);
        // meanSmooth=0 , maxSmooth=0 , pointSmooth=0 , areaSmooth=0 , pressSmooth =0, pressureSmooth=0
        meanSmooth = parseInt(meanSmooth + (totalMean - meanSmooth) / 10)
          ? parseInt(meanSmooth + (totalMean - meanSmooth) / 10)
          : 1;
        maxSmooth = parseInt(maxSmooth + (totalMax - maxSmooth) / 10)
          ? parseInt(maxSmooth + (totalMax - maxSmooth) / 10)
          : 1;
        pointSmooth = parseInt(pointSmooth + (totalPoint - pointSmooth) / 10)
          ? parseInt(pointSmooth + (totalPoint - pointSmooth) / 10)
          : 1;
        areaSmooth = parseInt(areaSmooth + (totalArea - areaSmooth) / 10)
          ? parseInt(areaSmooth + (totalArea - areaSmooth) / 10)
          : 1;
        pressSmooth = parseInt(pressSmooth + (totalPress - pressSmooth) / 10)
          ? parseInt(pressSmooth + (totalPress - pressSmooth) / 10)
          : 1;
        pressureSmooth = parseInt(
          pressureSmooth + (sitPressure - pressureSmooth) / 10
        )
          ? parseInt(pressureSmooth + (sitPressure - pressureSmooth) / 10)
          : 1;
        if (sitPoint < 100) {
          pressureSmooth = 0;
        }

        this.data.current?.changeData({
          meanPres: meanSmooth,
          maxPres: maxSmooth,
          point: pointSmooth,
          area: areaSmooth,
          totalPres: pressSmooth,
          pressure: pressureSmooth,
        });

        if (totalArr.length < 20) {
          totalArr.push(totalPress);
        } else {
          totalArr.shift();
          totalArr.push(totalPress);
        }

        const max = findMax(totalArr);

        if (this.state.matrixName == "car10" && !this.state.local)
          this.data.current?.handleCharts(totalArr, max + 1000);

        if (totalPointArr.length < 20) {
          totalPointArr.push(totalPoint);
        } else {
          totalPointArr.shift();
          totalPointArr.push(totalPoint);
        }

        const max1 = findMax(totalPointArr);
        if (this.state.matrixName == "car10" && !this.state.local)
          this.data.current?.handleChartsArea(totalPointArr, max1 + 10);
      }

      if (jsonObject.timeArr != null) {
        // const arr = []
        console.log(jsonObject.timeArr)
        const arr = jsonObject.timeArr.map((a, index) => a.date);

        let obj = [];
        arr.forEach((a, index) => {
          obj.push({
            value: a,
            label: a,
          });
        });
        this.setState({ dataArr: obj });

      }

      if (jsonObject.length != null) {
        this.setState({
          length: jsonObject.length,
        });
      }
      if (jsonObject.time != null) {
        this.setState({
          time: jsonObject.time,
        });
      }

      if (jsonObject.index != null) {
        this.progress.current?.changeIndex(jsonObject.index)
      }

      if (jsonObject.areaArr != null) {
        const max = findMax(jsonObject.areaArr);
        this.data.current?.handleChartsArea(jsonObject.areaArr, max + 100);
        this.max = max;
        this.areaArr = jsonObject.areaArr;
      }

      if (jsonObject.pressArr != null) {
        const max = findMax(jsonObject.pressArr);
        if (this.state.matrixName == "car" || this.state.matrixName == "bigBed" || this.state.matrixName == "car10") {
          this.data.current?.handleCharts(jsonObject.pressArr, max + 100);
          this.pressMax = max;
          this.pressArr = jsonObject.pressArr;
        }
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
  };

  changeMatrix = (e) => {
    console.log(e);
    // setMatrixName(e)
    this.setState({ matrixName: e });
    wsMatrixName = e;
  };

  handleChartsBody(arr, max, index) {
    // console.log(first)
    const canvas = document.getElementById('myChartBig')
    // console.log(canvas , ctxbig)
    if (canvas && ctxbig) {
      this.drawChart({ ctx: ctxbig, arr, max, canvas, index })
    }

    // console.log(arr, max)
  }

  initBigCtx() {
    var c2 = document.getElementById("myChartBig");
    console.log(c2, 'c2')
    if (c2) ctxbig = c2.getContext("2d");
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

  changeLocal = (value) => {
    this.setState({ local: value });
    // changeDateArr(matrixName)

    if (ws && ws.readyState === 1) {
      if (value) {
        ws.send(JSON.stringify({ local: true }));
      } else {
        ws.send(JSON.stringify({ local: false }));
      }
    }
  };

  // formatter = (value) => {

  //   return `${value}%`
  // };

  changeValue = (value) => {
    return value < 4 ? 0 : value >= 68 ? 31 : Math.round((value - 4) / 2 - 1);
  };

  changeFootValue = (value) => {
    return value < 4 ? 0 : value >= 36 ? 15 : Math.round((value - 4) / 2 - 1);
  };

  changeBedValue = (value) => {
    return value < 4
      ? 0
      : value >= 4 + 64 * 2
        ? 64 - 1
        : Math.round((value - 4) / 2 - 1);
  };

  changeSelect = (obj, type) => {
    let sit = [...obj.sit];

    const sitIndex = sit.length
      ? sit.map((a, index) => {
        if (this.state.matrixName === "foot") {
          if (index == 0 || index == 1) {
            return this.changeFootValue(a);
          } else {
            return this.changeValue(a);
          }
        } else if (this.state.matrixName === "bigBed") {
          if (index == 0 || index == 1) {
            return this.changeBedValue(a);
          } else {
            return this.changeValue(a);
          }

        } else {
          return this.changeValue(a);
        }
      })
      : new Array(4).fill(0);

    sitIndexArr = sitIndex;

    console.log(sitIndexArr);

    if (obj.back) {
      let back = [...obj.back];
      if (back.length) {
        back[2] = Math.round(back[2] / 2);
        back[3] = Math.round(back[3] / 2);
      }

      const backIndex = back.length
        ? back.map((a, index) => {
          if (this.state.matrixName === "foot") {
            if (index == 0 || index == 1) {
              return this.changeFootValue(a);
            } else {
              return this.changeValue(a);
            }
          } else {
            return this.changeValue(a);
          }
        })
        : new Array(4).fill(0);

      backIndexArr = backIndex;
    }
  };

  changeStateData = (obj) => {
    this.setState(obj);
  };

  setColValueFlag = (value) => {
    colValueFlag = value;
  };

  render() {
    return (
      <div className="home">
        <div className="setIcons">
          <div className="setIconItem setIconItem1">
            <Popover
              placement="top"
              title={text}
              content={content}
            >
              <div
                className="setIcon marginB10"
                onClick={() => {
                  xvalue++;

                  // 脚型方向旋转
                  if (xvalue < 3) {
                    if (
                      this.com.current &&
                      this.com.current.changeGroupRotate
                    ) {
                      this.com.current?.changeGroupRotate({ x: xvalue });
                    }
                  } else {
                    xvalue = 0;
                    if (
                      this.com.current &&
                      this.com.current.changeGroupRotate
                    ) {
                      this.com.current?.changeGroupRotate({ x: xvalue });
                    }
                  }

                  // 汽车方向旋转

                  if (xvalue < 3) {
                    if (
                      this.com.current &&
                      this.com.current.changePointRotation
                    ) {
                      this.com.current?.changePointRotation({
                        direction: "x",
                        value: xvalue,
                        type: this.state.carState,
                      });
                    }
                  } else {
                    xvalue = 0;
                    if (
                      this.com.current &&
                      this.com.current.changePointRotation
                    ) {
                      this.com.current?.changePointRotation({
                        direction: "x",
                        value: xvalue,
                        type: this.state.carState,
                      });
                    }
                  }
                }}
              >
                <img src={plus} alt="" />
              </div>
            </Popover>

            <Popover
              placement="top"
              title={text}
              content={content1}
            // arrow={mergedArrow}
            >
              <div
                className="setIcon"
                onClick={() => {
                  zvalue++;
                  // 脚型方向旋转
                  if (zvalue < 3) {
                    if (
                      this.com.current &&
                      this.com.current.changeGroupRotate
                    ) {
                      this.com.current?.changeGroupRotate({ z: zvalue });
                    }
                  } else {
                    zvalue = 0;
                    if (
                      this.com.current &&
                      this.com.current.changeGroupRotate
                    ) {
                      this.com.current?.changeGroupRotate({ z: zvalue });
                    }
                  }

                  // 汽车方向旋转
                  if (zvalue < 3) {
                    if (
                      this.com.current &&
                      this.com.current.changePointRotation
                    ) {
                      this.com.current?.changePointRotation({
                        direction: "z",
                        value: zvalue,
                        type: this.state.carState,
                      });
                    }
                  } else {
                    zvalue = 0;
                    if (
                      this.com.current &&
                      this.com.current.changePointRotation
                    ) {
                      this.com.current?.changePointRotation({
                        direction: "z",
                        value: zvalue,
                        type: this.state.carState,
                      });
                    }
                  }
                }}
              >
                <img src={minus} alt="" />
              </div>
            </Popover>
          </div>
          {this.state.matrixName == "foot" ? (
            <Popover placement="top" title={"刷新"} content={content3}>
              <div className="setIconItem setIconItem2">
                <div className="setIcon">
                  <img
                    src={refresh}
                    alt=""
                    onClick={() => {
                      this.track.current?.canvasInit()
                    }}
                  />
                </div>
              </div>
            </Popover>
          ) : null}

          <div className="setIconItem setIconItem2">
            {this.state.matrixName == "foot" ? (
              <Popover placement="top" title={"下载"} content={content4}>
                <div
                  className="setIcon marginB10"
                  onClick={() => {
                    this.track.current?.loadImg({ arrSmooth, rightTopPropSmooth, leftTopPropSmooth, leftBottomPropSmooth, rightPropSmooth, leftPropSmooth, rightBottomPropSmooth })
                  }}
                >
                  <img src={load} alt="" />
                </div>
              </Popover>
            ) : null}
            {/* <div className='setIcon marginB10' onClick={() => {
              console.log('load')
              this.wsSendObj({ flag: false })
            }}>
              <img src={stop} alt="" />
            </div> */}
            <Popover placement="top" title={text2} content={content2}>
              <div
                className="setIcon"
                onClick={() => {
                  const flag = this.state.selectFlag;
                  // setSelectFlag(!flag)
                  this.setState({
                    selectFlag: !flag,
                  });
                  this.com.current?.changeSelectFlag(flag);
                }}
              >
                {/* <img src={icon2} alt="" /> */}
                <SelectOutlined
                  style={{
                    color: this.state.selectFlag ? "#fff" : "#4c4671",
                    fontSize: "20px",
                  }}
                  color={this.state.selectFlag ? "#fff" : "#4c4671"}
                />
                {/* <input type="file" id='fileInput' onChange={(e) => getPath(e)}
            /> */}
              </div>
            </Popover>
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            right: "3%",
            height: "55%",
            bottom: "6%",
            boxSizing: "border-box",
          }}
        >
          {rainbowTextColors
            .slice(0, rainbowTextColors.length - 7)
            .map((items, indexs) => {
              return (
                <div
                  key={`${rainbowTextColors[items]}${indexs}`}
                  style={{
                    display: "flex",
                    height: `${100 /
                      rainbowTextColors.slice(0, rainbowTextColors.length - 7)
                        .length
                      }%`,
                    alignItems: "center",
                    padding: "3px",
                    boxSizing: "border-box",
                  }}
                >
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
                      {(
                        ((this.state.valuej1 / 100) *
                          (rainbowTextColors.length - 1 - indexs)) /
                        rainbowTextColors.length
                      ).toFixed(2)}
                      N/cm^2
                    </div>
                    <div className="switchLevels"></div>
                  </div>
                  <div
                    style={{
                      width: 50,
                      height: "100%",
                      backgroundColor: `rgb(${items})`,
                    }}
                  ></div>
                </div>
              );
            })}
        </div>

        <Title
          initBigCtx={this.initBigCtx}
          valueg1={this.state.valueg1}
          value1={this.state.value1}
          valuef1={this.state.valuef1}
          valuel1={this.state.valuel1}
          valuej1={this.state.valuej1}
          valuelInit1={this.state.valuelInit1}
          ymax={this.state.ymax}
          ref={this.title}
          com={this.com}
          track={this.track}
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
          numMatrixFlag={this.state.numMatrixFlag}
          centerFlag={this.state.centerFlag}
          data={this.data}
          dataTime={this.state.dataTime}
          pointFlag={this.state.pointFlag}
          valueMult={this.state.valueMult}
          pressChart={this.state.pressChart}
        />

        <CanvasCom matrixName={this.state.matrixName}>
          <Aside ref={this.data} matrixName={this.state.matrixName} />
        </CanvasCom>

        {this.state.numMatrixFlag == "num" &&
          (this.state.matrixName == "foot" ||
            this.state.matrixName == "hand" ||
            this.state.carState == "back" ||
            this.state.carState == "sit") ? (
          <Num ref={this.com} />
        ) : this.state.numMatrixFlag == "heatmap" &&
          (this.state.matrixName == "foot" ||
            this.state.matrixName == "hand" ||
            this.state.carState == "back" ||
            this.state.carState == "sit") ? (
          <Heatmap ref={this.com} />
        ) : this.state.matrixName == "foot" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <Canvas ref={this.com} changeSelect={this.changeSelect} />
          </CanvasCom>
        ) : this.state.matrixName == "hand" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <CanvasHand ref={this.com} />
          </CanvasCom>
        ) : this.state.matrixName == "car" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <CanvasCar ref={this.com} changeSelect={this.changeSelect} />
          </CanvasCom>
        ) : this.state.matrixName == "bigBed" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <Bed ref={this.com} handleChartsBody={this.handleChartsBody.bind(this)} changeSelect={this.changeSelect} />
          </CanvasCom>
        ) : (
          <CanvasCom matrixName={this.state.matrixName}>
            <Car10 ref={this.com} />
          </CanvasCom>
        )}

        {/* 全床压力曲线 */}
        {this.state.matrixName === 'bigBed' ?
          <div style={{ position: "fixed", visibility: this.state.pressChart ? 'hidden' : 'unset', width: '60%', right: "20%", bottom: "100px" }}>
            <canvas id="myChartBig" style={{ height: '300px', width: '100%' }}></canvas>
          </div>
          : null}

        {/* 进度条 */}
        {this.state.local ?
          <ProgressCom
            ref={this.progress}
            dataTime={this.state.dataTime}
            matrixName={this.state.matrixName}
            data={this.data}
            areaArr={this.areaArr}
            pressArr={this.pressArr}
            length={this.state.length}
            max={this.max}
            pressMax={this.pressMax}
            wsSendObj={this.wsSendObj} />
          : null}
        {/* 脚型重心画图 */}
        {this.state.matrixName == "foot" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <FootTrack ref={this.track} />
          </CanvasCom>
        ) : null}

        {/* <div style={{ position: "fixed", bottom: "20px", color: "#fff" }}>
          <div
            style={{ border: "1px solid #01F1E3" }}
            onClick={() => {
              const press = this.state.press;
              this.setState({
                press: !press,
              });
            }}
          >
            {this.state.press ? "分压" : "不分压"}
          </div>
          <div
            style={{ border: "1px solid #01F1E3" }}
            onClick={() => {
              const pressNum = this.state.pressNum;
              this.setState({
                pressNum: !pressNum,
              });
            }}
          >
            {this.state.pressNum ? "压力算法" : "不压力算法"}
          </div>
        </div> */}
        <div style={{ position: "fixed", right: "20%", bottom: "20px" }}>
          {this.state.newArr.length
            ? this.state.newArr.map((a, indexs) => {
              return (
                <div style={{ display: "flex", color: "#fff" }}>
                  {a.map((b, index) => {
                    return <div style={{ width: 40 }}>{b}</div>;
                  })}
                </div>
              );
            })
            : null}
        </div>

        <div style={{ position: "fixed", right: "20%", bottom: "400px" }}>
          {this.state.newArr1.length
            ? this.state.newArr1.map((a, indexs) => {
              return (
                <div style={{ display: "flex", color: "#fff" }}>
                  {a.map((b, index) => {
                    return <div style={{ width: 40 }}>{b}</div>;
                  })}
                </div>
              );
            })
            : null}
        </div>
      </div>
    );
  }
}

export default Home;
