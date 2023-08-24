import {
  footLine, pressBed,
  press,
  calculateY,
  rotateArrayCounter90Degrees,
  calculatePressure,
  objChange,
  calPress,
  arr10to5,
  handLine,
} from "../../assets/util/line";
import { findMax, } from "../../assets/util/util";
import { calFoot } from "../../assets/util/value";
let totalArr = [],
  totalPointArr = []
let selectArr;
let sitIndexArr = new Array(4).fill(0),
  backIndexArr = new Array(4).fill(0)
let startPressure = 0, time = 0;
let num = 0
let meanSmooth = 0,
  maxSmooth = 0,
  pointSmooth = 0,
  areaSmooth = 0,
  pressSmooth = 0,
  pressureSmooth = 0,
  arrSmooth = [16, 16],
  totalSmooth = 0,
  leftValueSmooth = 0,
  leftPropSmooth = 0,
  rightValueSmooth = 0,
  rightPropSmooth = 0,
  leftTopPropSmooth = 0,
  rightTopPropSmooth = 0,
  leftBottomPropSmooth = 0,
  rightBottomPropSmooth = 0


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
export const sitTypeEvent = {
  foot: ({ that, wsPointData }) => {

    let resData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 10, 25, 28, 31, 5, 1, 0, 0, 0, 0, 0, 0, 63, 53, 21, 20, 5, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 10, 22, 21, 5, 3, 1, 0, 0, 0, 0, 0, 0, 35, 61, 29, 14, 6, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 5, 11, 18, 6, 1, 1, 0, 0, 0, 0, 0, 0, 0, 5, 30, 34, 16, 13, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 18, 24, 11, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 10, 20, 17, 13, 3, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 15, 31, 27, 22, 12, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 5, 19, 20, 24, 11, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 6, 34, 48, 27, 27, 4, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 3, 25, 33, 29, 12, 7, 2, 1, 1, 0, 0, 0, 0, 0, 0, 36, 67, 51, 54, 35, 7, 4, 2, 3, 1, 0, 0, 0, 0, 0, 0, 1, 4, 34, 24, 51, 38, 18, 3, 2, 0, 0, 0, 0, 0, 0, 1, 84, 86, 62, 63, 44, 13, 5, 4, 6, 2, 0, 0, 0, 0, 0, 0, 3, 6, 43, 63, 65, 81, 57, 6, 4, 0, 0, 0, 0, 0, 0, 6, 76, 85, 53, 58, 82, 12, 5, 4, 7, 2, 0, 0, 0, 0, 0, 0, 3, 7, 44, 55, 80, 100, 67, 8, 4, 0, 0, 0, 0, 0, 0, 16, 63, 77, 53, 63, 86, 7, 5, 4, 6, 2, 0, 0, 0, 0, 0, 0, 3, 14, 60, 57, 55, 55, 75, 17, 4, 0, 0, 0, 0, 0, 0, 1, 24, 57, 65, 52, 16, 5, 4, 3, 6, 2, 0, 0, 0, 0, 0, 0, 3, 11, 64, 59, 57, 84, 69, 6, 4, 0, 0, 0, 0, 0, 0, 0, 1, 4, 6, 5, 3, 2, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 2, 4, 23, 65, 74, 71, 14, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 26, 15, 17, 20, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 1, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 2, 5, 40, 46, 45, 28, 57, 8, 5, 1, 0, 0, 0, 0, 0, 0, 2, 4, 4, 16, 37, 23, 34, 49, 5, 2, 0, 0, 0, 0, 0, 0, 1, 4, 51, 53, 36, 10, 19, 52, 7, 1, 0, 0, 0, 0, 0, 0, 2, 4, 6, 16, 15, 15, 36, 72, 30, 0, 0, 0, 0, 0, 0, 0, 0, 2, 16, 18, 28, 4, 21, 14, 5, 0, 0, 0, 0, 0, 0, 0, 1, 2, 20, 21, 3, 4, 17, 52, 11, 0, 0, 0, 0, 0, 0, 0, 0, 5, 18, 19, 21, 33, 23, 22, 21, 1, 0, 0, 0, 0, 0, 0, 1, 11, 17, 23, 4, 4, 24, 23, 15, 0, 0, 0, 0, 0, 0, 0, 3, 35, 58, 44, 46, 62, 64, 22, 15, 2, 0, 0, 0, 0, 0, 0, 2, 13, 12, 25, 44, 33, 32, 25, 19, 0, 0, 0, 0, 0, 0, 0, 5, 77, 56, 54, 65, 88, 62, 60, 39, 4, 0, 0, 0, 0, 0, 0, 5, 16, 44, 40, 53, 61, 45, 50, 86, 3, 1, 0, 0, 0, 0, 0, 5, 70, 41, 46, 60, 76, 60, 55, 54, 8, 0, 0, 0, 0, 0, 1, 13, 36, 45, 77, 54, 57, 63, 48, 89, 12, 0, 0, 0, 0, 0, 0, 0, 46, 55, 43, 54, 60, 53, 54, 62, 0, 0, 0, 0, 0, 0, 0, 26, 46, 53, 69, 59, 62, 63, 50, 72, 0, 0, 0, 0, 0, 0, 0, 3, 22, 70, 41, 48, 45, 46, 54, 70, 36, 0, 0, 0, 0, 0, 1, 40, 57, 61, 61, 65, 67, 64, 53, 56, 2, 0, 0, 0, 0, 0, 0, 1, 2, 4, 4, 12, 34, 44, 39, 69, 33, 0, 0, 0, 0, 0, 20, 65, 76, 51, 38, 18, 24, 21, 8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 13, 34, 29, 48, 5, 0, 0, 0, 0, 0, 10, 53, 43, 24, 28, 11, 5, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 10, 16, 27, 21, 2, 0, 0, 0, 0, 0, 2, 46, 45, 26, 16, 3, 2, 2, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 3, 1, 4, 22, 34, 35, 12, 1, 0, 0, 0, 0, 0, 1, 41, 56, 26, 14, 3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 14, 32, 26, 5, 1, 0, 0, 0, 0, 0, 0, 41, 51, 28, 19, 6, 2, 2, 2, 1, 0, 0, 0]
    const { sitData, backData, arr, realData } = footLine({
      wsPointData: resData,
      pressFlag: that.state.press,
      pressNumFlag: that.state.pressNum,
    });

    const leftArr = []
    for (let i = 0; i < 32; i++) {
      let num = 0
      for (let j = 0; j < 16; j++) {
        num += sitData[i * 16 + j]
      }
      leftArr.push(num)
    }

    const leftFoot = leftArr.filter((a) => a > 50)
    const leftLength = leftFoot.length
    const leftFootValue = leftFoot.reduce((a,b) => a+b)

    console.log(leftFoot,leftLength)

    const leftCenter = leftArr.slice(parseInt(leftLength / 3), parseInt(leftLength * 2 / 3)).reduce((a,b) => a+b)
    console.log(leftCenter/leftFootValue)

    const newArr = []
    for (let i = 0; i < 32; i++) {
      newArr[i] = []
      for (let j = 0; j < 32; j++) {
        newArr[i].push(realData[i * 32 + j])
      }
    }



    that.setState({
      newArr: newArr
    })

    for (let i = 0; i < arrSmooth.length; i++) {
      arrSmooth[i] = arrSmooth[i] + (arr[i] - arrSmooth[i]) / 4;
    }

    selectArr = [];

    for (let j = sitIndexArr[2]; j <= sitIndexArr[3]; j++) {
      for (let i = sitIndexArr[0]; i <= sitIndexArr[1]; i++) {
        selectArr.push(sitData[j * 16 + i]);
      }
    }

    for (let j = backIndexArr[2]; j <= backIndexArr[3]; j++) {
      for (let i = backIndexArr[0]; i <= backIndexArr[1]; i++) {
        selectArr.push(backData[j * 16 + i]);
      }
    }

    let DataArr;
    if (
      sitIndexArr.every((a) => a == 0) &&
      backIndexArr.every((a) => a == 0)
    ) {
      DataArr = [...realData];
    } else {
      DataArr = [...selectArr];
    }

    // initData()

    // 脚型渲染页面

    let totalPress = DataArr.reduce((a, b) => a + b, 0);
    let totalPoint = DataArr.filter((a) => a > 10).length;
    let totalMean = parseInt(totalPress / (totalPoint ? totalPoint : 1));
    let totalMax = findMax(DataArr);


    let totalArea = totalPoint * 4;
    const sitPressure = (totalMax * 1000) / (totalArea ? totalArea : 1);

    // const {press , point , mean , max , area , pressure} = calArr(DataArr)

    meanSmooth = parseInt(meanSmooth + (totalMean - meanSmooth) / 10);
    maxSmooth = parseInt(maxSmooth + (totalMax - maxSmooth) / 10);
    pointSmooth = parseInt(pointSmooth + (totalPoint - pointSmooth) / 10);
    areaSmooth = parseInt(areaSmooth + (totalArea - areaSmooth) / 10);
    pressSmooth = parseInt(pressSmooth + (totalPress - pressSmooth) / 10);

    pressureSmooth = parseInt(pressureSmooth + (sitPressure - pressureSmooth) / 10);

    const leftValue = sitData.reduce((a, b) => a + b, 0);
    const rightValue = backData.reduce((a, b) => a + b, 0);

    let leftProp = parseInt((leftValue * 100) / (leftValue + rightValue));
    let rightProp = 100 - leftProp;

    let leftTop = [...sitData].slice(0, 16 * 16).reduce((a, b) => a + b, 0);
    let leftTopProp = parseInt((leftTop * 100) / leftValue);
    let leftBottomProp = 100 - leftTopProp;

    let rightTop = [...backData].slice(0, 16 * 16).reduce((a, b) => a + b, 0);
    let rightTopProp = parseInt((rightTop * 100) / rightValue);
    let rightBottomProp = 100 - rightTopProp;

    const total = DataArr.reduce((a, b) => a + b, 0);
    totalSmooth = parseInt(totalSmooth + (total - totalSmooth) / 10);
    leftPropSmooth = parseInt(
      leftPropSmooth + (leftProp - leftPropSmooth) / 10
    );
    leftValueSmooth = parseInt(
      leftValueSmooth + (leftValue - leftValueSmooth) / 10
    );
    rightValueSmooth = parseInt(
      rightValueSmooth + (rightValue - rightValueSmooth) / 10
    );
    leftTopPropSmooth = parseInt(
      leftTopPropSmooth + (leftTopProp - leftTopPropSmooth) / 10
    );
    rightTopPropSmooth = parseInt(
      rightTopPropSmooth + (rightTopProp - rightTopPropSmooth) / 10
    );
    rightPropSmooth = 100 - leftPropSmooth;
    leftBottomPropSmooth = 100 - leftTopPropSmooth;
    rightBottomPropSmooth = 100 - rightTopPropSmooth;

    if (
      totalPoint < 10 &&
      sitIndexArr.every((a) => a == 0) &&
      backIndexArr.every((a) => a == 0)
    ) {
      meanSmooth = 0;
      maxSmooth = 0;
      pointSmooth = 0;
      areaSmooth = 0;
      pressSmooth = 0;
      pressureSmooth = 0;
      totalSmooth = 0;
      leftValueSmooth = 0;
      rightValueSmooth = 0;
      leftPropSmooth = 0;
      rightPropSmooth = 0;
      leftTopPropSmooth = 0;
      leftBottomPropSmooth = 0;
      rightTopPropSmooth = 0;
      rightBottomPropSmooth = 0;
      arrSmooth = [16, 16];
      leftProp = 50;
      rightProp = 50;
      totalPoint = 0;
    }

    // 数字矩阵 点图
    // if (that.state.numMatrixFlag) {
    //   that.com.current?.changeWsData(realData)
    // } else {
    //   that.com.current?.backData({
    //     wsPointData: backData,
    //   });
    //   that.com.current?.sitData({
    //     wsPointData: sitData,
    //     arr: arrSmooth
    //   });
    //   that.com.current?.changeDataFlag();
    // }

    // 数字矩阵 点图 热力图
    if (that.state.numMatrixFlag == "num") {
      that.com.current?.changeWsData(realData);
    } else if (that.state.numMatrixFlag == "normal") {
      that.com.current?.backData({
        wsPointData: backData,
      });
      that.com.current?.sitData({
        wsPointData: sitData,
        arr: arrSmooth,
      });
      that.com.current?.changeDataFlag();
    } else {
      that.com.current?.bthClickHandle(realData);
    }

    that.data.current?.changeData({
      meanPres: meanSmooth,
      maxPres: maxSmooth,
      point: pointSmooth,
      area: areaSmooth,
      totalPres: pressSmooth,
      pressure: pressureSmooth,
    });

    that.data.current?.canvas.current.initCanvasrotate1(
      (rightProp - 50) / 100
    );

    that.data.current?.canvas.current.changeState({
      total: totalSmooth,
      leftValue: leftValueSmooth,
      rightValue: rightValueSmooth,
      leftProp: leftPropSmooth,
      rightProp: rightPropSmooth,
    });

    // 打开脚型轨迹图
    if (that.state.centerFlag) {
      that.track.current?.circleMove({ arrSmooth, rightTopPropSmooth, leftTopPropSmooth, leftBottomPropSmooth, rightPropSmooth, leftPropSmooth, rightBottomPropSmooth })
    }

    if (totalArr.length < 20) {
      totalArr.push(totalPress);
    } else {
      totalArr.shift();
      totalArr.push(totalPress);
    }

    if (!that.state.local) {
      if (totalPointArr.length < 20) {
        totalPointArr.push(totalPoint);
      } else {
        totalPointArr.shift();
        totalPointArr.push(totalPoint);
      }

      const max1 = findMax(totalPointArr);
      that.data.current?.handleChartsArea(totalPointArr, max1 + 100);
    }
  },
  bigBed: ({ that, wsPointData }) => {
    let DataArr;
    selectArr = [];
    wsPointData = pressBed(wsPointData, 1500);

    let bodyArr1 = []
    for (let i = 0; i < 64; i++) {
      let num = 0
      for (let j = 0; j < 32; j++) {
        num += wsPointData[j * 64 + i]
      }
      bodyArr1.push(parseInt(num / 32))
    }
    that.bodyArr = bodyArr1
    // console.log(that.bodyArr , that.state.local)
    // if (that.state.matrixName == "bigBed" && !that.state.local)
    //   that.data.current?.handleChartsBody(bodyArr, 200);

    that.com.current?.sitData({
      wsPointData: wsPointData,
    });

    for (let i = sitIndexArr[2]; i < sitIndexArr[3]; i++) {
      for (let j = sitIndexArr[0]; j < sitIndexArr[1]; j++) {
        selectArr.push(wsPointData[i * 64 + j]);
      }
    }

    if (sitIndexArr.every((a) => a == 0)) {
      DataArr = [...wsPointData];
    } else {
      DataArr = [...selectArr];
    }

    // 框选后或者无框选的数据
    const total = DataArr.reduce((a, b) => a + b, 0);
    const length = DataArr.filter((a, index) => a > 0).length;

    const newPressure = total / length;
    // setRealPress(newPressure);
    let pressure = calculatePressure(total / length)
    const change = objChange(newPressure, startPressure, 4);
    if (change) {
      startPressure = newPressure;
      time = 0;
    } else {
      time++;
      pressure = calculatePressure(calPress(startPressure, newPressure, time));
      if (time > 240 * 13) {
        time = 240 * 13;
      }
    }
    sitPoint = length
    sitTotal = DataArr.reduce((a, b) => a + b, 0);
    sitMean = parseInt(sitTotal / (sitPoint ? sitPoint : 1));
    sitMax = findMax(DataArr);
    sitArea = sitPoint * 4;
    if (
      sitPoint < 80 &&
      sitIndexArr.every((a) => a == 0) &&
      backIndexArr.every((a) => a == 0)
    ) {
      sitMean = 0;
      sitMax = 0;
      sitTotal = 0;
      sitPoint = 0;
      sitArea = 0;
    }

    meanSmooth = (meanSmooth + (sitMean - meanSmooth) / 10)
      ? (meanSmooth + (sitMean - meanSmooth) / 10)
      : 1;
    maxSmooth = (maxSmooth + (sitMax - maxSmooth) / 10)
      ? (maxSmooth + (sitMax - maxSmooth) / 10)
      : 1;
    pointSmooth = (pointSmooth + (sitPoint - pointSmooth) / 10)
      ? (pointSmooth + (sitPoint - pointSmooth) / 10)
      : 1;
    areaSmooth = (areaSmooth + (sitArea - areaSmooth) / 10)
      ? (areaSmooth + (sitArea - areaSmooth) / 10)
      : 1;
    pressSmooth = (pressSmooth + (sitTotal - pressSmooth) / 10)
      ? (pressSmooth + (sitTotal - pressSmooth) / 10)
      : 1;

    pressureSmooth = (
      pressureSmooth + (pressure - pressureSmooth) / 3
    )
      ? (pressureSmooth + (pressure - pressureSmooth) / 3)
      : 0;
    // console.log(pressure,pressureSmooth)
    that.data.current?.changeData({
      meanPres: meanSmooth.toFixed(0),
      maxPres: maxSmooth.toFixed(0),
      point: pointSmooth.toFixed(0),
      area: areaSmooth.toFixed(0),
      totalPres: pressSmooth.toFixed(0),
      pressure: pressureSmooth.toFixed(2),
    });

    if (totalArr.length < 20) {
      totalArr.push(sitTotal);
    } else {
      totalArr.shift();
      totalArr.push(sitTotal);
    }

    const max = findMax(totalArr);

    if (that.state.matrixName == "bigBed" && !that.state.local)
      that.data.current?.handleCharts(totalArr, max + 1000);

    if (totalPointArr.length < 20) {
      totalPointArr.push(sitPoint);
    } else {
      totalPointArr.shift();
      totalPointArr.push(sitPoint);
    }

    const max1 = findMax(totalPointArr);
    if (that.state.matrixName == "bigBed" && !that.state.local)
      that.data.current?.handleChartsArea(totalPointArr, max1 + 100);
  },
  car: ({ that, wsPointData }) => {

    if (
      that.state.carState == "sit" &&
      that.state.numMatrixFlag == "num"
    ) {
      that.com.current?.changeWsData(wsPointData);
    } else if (
      that.state.carState == "sit" &&
      that.state.numMatrixFlag == "heatmap"
    ) {
      that.com.current?.bthClickHandle(wsPointData);
    } // if (that.state.numMatrixFlag === 'normal' )
    else {
      if (that.state.numMatrixFlag == "normal") {
        that.com.current?.sitData({
          wsPointData: wsPointData,
        });
      }
    }

    selectArr = [];

    for (let i = sitIndexArr[0]; i < sitIndexArr[1]; i++) {
      for (let j = sitIndexArr[2]; j < sitIndexArr[3]; j++) {
        selectArr.push(wsPointData[i * 32 + j]);
      }
    }

    let DataArr;

    if (sitIndexArr.every((a) => a == 0)) {
      DataArr = [...wsPointData];
    } else {
      DataArr = [...selectArr];
    }

    // 框选后或者无框选的数据
    const total = DataArr.reduce((a, b) => a + b, 0);
    const length = DataArr.filter((a, index) => a > 0).length;

    sitPoint = DataArr.filter(
      (a) => a > that.state.valuej1 * 0.02
    ).length;
    sitTotal = DataArr.reduce((a, b) => a + b, 0);
    sitMean = parseInt(sitTotal / (sitPoint ? sitPoint : 1));
    sitMax = findMax(DataArr);
    sitArea = sitPoint * 4;
    if (
      sitPoint < 80 &&
      sitIndexArr.every((a) => a == 0) &&
      backIndexArr.every((a) => a == 0)
    ) {
      sitMean = 0;
      sitMax = 0;
      sitTotal = 0;
      sitPoint = 0;
      sitArea = 0;
    }
  },
  car10: ({ that, wsPointData }) => {

    // const arr = arr10to5(wsPointData)

    that.com.current?.sitData({
      wsPointData: wsPointData,
    });
    const dataArr = []
    for (let i = 0; i < 10; i++) {
      dataArr[i] = []
      for (let j = 0; j < 10; j++) {
        dataArr[i].push(wsPointData[i * 10 + j])
      }
    }

    that.setState({
      newArr: dataArr
    })

  },
  hand: ({ that, wsPointData }) => {
    if (that.state.numMatrixFlag == "normal") {

      // wsPointData = handLine(wsPointData)

      that.com.current?.sitData({
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

      const footLength = calFoot(sitData, 16, 32);
      console.log(footLength);
    } else if (that.state.numMatrixFlag == "heatmap") {
      that.com.current?.bthClickHandle(wsPointData);
    }
  }
}

export const backTypeEvent = {
  car: () => {

  },
  car10: () => {

  },
}