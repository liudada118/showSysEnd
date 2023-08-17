import { footLine, pressBed,
  press,
  calculateY,
  rotateArrayCounter90Degrees,
  calculatePressure,
  objChange,
  calPress,} from "../../assets/util/line";
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
    const { sitData, backData, arr, realData } = footLine({
      wsPointData,
      pressFlag: that.state.press,
      pressNumFlag: that.state.pressNum,
    });

    arr[0] = arr[0] ? arr[0] : 0;
    arr[1] = arr[1] ? arr[1] : 0;
    for (let i = 0; i < arrSmooth.length; i++) {
      arrSmooth[i] = arrSmooth[i] + (arr[i] - arrSmooth[i]) / 4;
    }

    // console.log(arr)
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

    pressureSmooth = parseInt(
      pressureSmooth + (sitPressure - pressureSmooth) / 10
    );

    const leftValue = sitData.reduce((a, b) => a + b, 0);
    const rightValue = backData.reduce((a, b) => a + b, 0);

    let leftProp = parseInt((leftValue * 100) / (leftValue + rightValue));
    let rightProp = 100 - leftProp;

    let leftTop = [...sitData]
      .slice(0, 16 * 16)
      .reduce((a, b) => a + b, 0);
    let leftTopProp = parseInt((leftTop * 100) / leftValue);
    let leftBottomProp = 100 - leftTopProp;

    let rightTop = [...backData]
      .slice(0, 16 * 16)
      .reduce((a, b) => a + b, 0);
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

    // console.log(pressure , total / length)

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
  car10: () => {

  },
  hand: ({ that, wsPointData }) => {
    if (that.state.numMatrixFlag == "normal") {
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