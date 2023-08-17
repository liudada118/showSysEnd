import {
    footLine,
    press,
    calculateY,
    rotateArrayCounter90Degrees,
    pressBed,
    objChange,
    calPress,
    calculatePressure,
  } from "../../assets/util/line";

export const sitTypeEvent = {
    foot : ({that , wsPointData}) => {
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
          // backMin = findMin(realData.filter((a) => a > 10))

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
    bigBed : () => {

    },
    car : () => {

    },
    car10 : () => {

    },
    hand : () => {

    }
}

export const backTypeEvent = {
    car : () => {

    },
    car10 : () => {

    },
}