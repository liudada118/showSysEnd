export function footLine({ wsPointData, pressFlag, pressNumFlag }) {
  // console.log(wsPointData)

  let a = wsPointData.splice(0, 1 * 32);
  let b = wsPointData.splice(0, 15 * 32);
  wsPointData = a.concat(wsPointData, b);

  let newArr = [];
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 1; j++) {
      newArr[i * 32 + j] = wsPointData[i * 32 + j];
    }
  }
  for (let i = 0; i < 32; i++) {
    for (let j = 16; j < 32; j++) {
      newArr[i * 32 + j] = wsPointData[i * 32 + j - 15];
    }
  }
  for (let i = 0; i < 32; i++) {
    for (let j = 1; j < 16; j++) {
      newArr[i * 32 + j] = wsPointData[i * 32 + 16 + j];
    }
  }
  wsPointData = newArr;
  wsPointData = zeroLine(wsPointData);

  const arr = graCenter(wsPointData, 32, 32);

  let colArr = [],
    rowArr = [];
  for (let i = 0; i < 32; i++) {
    let coltotal = 0,
      rowtotal = 0;
    for (let j = 0; j < 32; j++) {
      coltotal += wsPointData[j * 32 + i];
      rowtotal += wsPointData[i * 32 + j];
    }
    colArr.push(coltotal);
    rowArr.push(rowtotal);
  }

  // if (pressFlag) {
  //   wsPointData = press(wsPointData);
  // }
  // if (pressNumFlag) {
  //   wsPointData = calculateY(wsPointData);
  // }
  wsPointData = pressNew({ arr: wsPointData, width: 32, height: 32, type: 'column', value: 1621})
  // wsPointData[1023] = 100
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
  // console.log(arr)
  return { sitData, backData, arr, realData: wsPointData };
}

export function handLine(arr, flag) {
  let wsPointData = [...arr];
  // let b = wsPointData.splice(0, 17 * 32)
  // wsPointData = wsPointData.concat(b)

  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 9; j++) {
      [wsPointData[i * 32 + 15 + j], wsPointData[i * 32 + 15 + 16 - j]] = [
        wsPointData[i * 32 + 15 + 16 - j],
        wsPointData[i * 32 + 15 + j],
      ];
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 32; j++) {
      [wsPointData[i * 32 + j], wsPointData[(15 - i) * 32 + j]] = [
        wsPointData[(15 - i) * 32 + j],
        wsPointData[i * 32 + j],
      ];
    }
  }

  if (flag) {
    wsPointData = press(wsPointData);
  }
  wsPointData = rotateMatrixsit180(wsPointData, 32, 32);
  return wsPointData;
}

export function zeroLine(arr) {
  let wsPointData = [...arr];
  let colArr = [],
    rowArr = [];
  for (let i = 0; i < 32; i++) {
    let coltotal = 0,
      rowtotal = 0;
    for (let j = 0; j < 32; j++) {
      coltotal += wsPointData[j * 32 + i];
      rowtotal += wsPointData[i * 32 + j];
    }
    colArr.push(coltotal);
    rowArr.push(rowtotal);
  }

  for (let i = 1; i < 31; i++) {
    if (rowArr[i + 1] > 100 && rowArr[i] < 40 && rowArr[i - 1] > 100) {
      for (let j = 0; j < 32; j++) {
        wsPointData[i * 32 + j] =
          (wsPointData[(i - 1) * 32 + j] + wsPointData[(i + 1) * 32 + j]) / 2;
      }
    }
  }

  for (let i = 0; i < 32; i++) {
    if (colArr[i + 1] > 100 && colArr[i] < 40 && colArr[i - 1] > 100) {
      for (let j = 1; j < 31; j++) {
        wsPointData[j * 32 + i] =
          (wsPointData[(j - 1) * 32 + i] + wsPointData[(j + 1) * 32 + i]) / 2;
      }
    }
  }
  return wsPointData;
}

// press
export function calculateY(arr) {
  const coefficient5 = 1.0572246920183572 * Math.pow(10, -10);
  const coefficient4 = -5.855702965038056 * Math.pow(10, -8);
  const coefficient3 = 1.0252295732636972 * Math.pow(10, -5);
  const coefficient2 = 0.00023350459149557124;
  const coefficient1 = -0.01396799876544018;
  const constant = 0.0;

  // const y = coefficient5 * Math.pow(x, 5) + coefficient4 * Math.pow(x, 4) + coefficient3 * Math.pow(x, 3) + coefficient2 * Math.pow(x, 2) + coefficient1 * x + constant;
  const wsPointData = arr.map((x, index) => {
    return (
      coefficient5 * Math.pow(x, 5) +
      coefficient4 * Math.pow(x, 4) +
      coefficient3 * Math.pow(x, 3) +
      coefficient2 * Math.pow(x, 2) +
      coefficient1 * x +
      constant
    );
  });
  return wsPointData;
}

export function calculatePressure(x) {
  // if (x < 40) {
  //   return 0
  // }
  const coefficient2 = -0.005051;
  const coefficient1 = 1.198526;
  const constant = -38.228519;

  // const y = coefficient5 * Math.pow(x, 5) + coefficient4 * Math.pow(x, 4) + coefficient3 * Math.pow(x, 3) + coefficient2 * Math.pow(x, 2) + coefficient1 * x + constant;
  const value = (coefficient2 * Math.pow(x, 2) + coefficient1 * x + constant).toFixed(
    2
  )
  return value < 0 ? 0 : value;
}

export function pressBed(arr, value) {
  let left = [],
    right = [];
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 32; j++) {
      left.push(arr[i * 64 + j]);
      right.push(arr[i * 64 + 32 + j]);
    }
  }
  left = pressNew({ arr: left, height: 32, width: 32, value: value });
  right = pressNew({ arr: right, height: 32, width: 32, value: value });
  const newArr = [];
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 64; j++) {
      if (j < 32) {
        newArr.push(left[i * 32 + j] * 1.2);
      } else {
        newArr.push(
          right[i * 32 + j - 32]
          // 50
        );
      }
    }
  }
  return newArr;
}

export function press(arr, width, height, type = "row") {
  let wsPointData = [...arr];

  if (type == "row") {
    let colArr = [];
    for (let i = 0; i < height; i++) {
      let total = 0;
      for (let j = 0; j < width; j++) {
        total += wsPointData[i * width + j];
      }
      colArr.push(total);
    }
    // //////okok
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        wsPointData[i * width + j] = parseInt(
          (wsPointData[i * width + j] /
            (1245 - colArr[i] == 0 ? 1 : 1245 - colArr[i])) *
          1000
        );
      }
    }
  } else {
    let colArr = [];
    for (let i = 0; i < height; i++) {
      let total = 0;
      for (let j = 0; j < width; j++) {
        total += wsPointData[j * height + i];
      }
      colArr.push(total);
    }
    // //////okok
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        wsPointData[j * height + i] = parseInt(
          (wsPointData[j * height + i] /
            (1245 - colArr[i] == 0 ? 1 : 1245 - colArr[i])) *
          1000
        );
      }
    }
  }

  //////

  // wsPointData = wsPointData.map((a,index) => {return calculateY(a)})
  return wsPointData;
}

export function pressSmallBed({arr, width, height, type = 'row' , num = 100}) {
  
  let wsPointData = [...arr];
  if(num === 0){
    return wsPointData
  }
  if (type == "row") {
    let colArr = [];
    for (let i = 0; i < height; i++) {
      let total = 0;
      for (let j = 0; j < width; j++) {
        total += wsPointData[i * width + j];
      }
      colArr.push(total);
    }
    // //////okok
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        wsPointData[i * width + j] = parseInt(
          (wsPointData[i * width + j] /
            (num - colArr[i] == 0 ? 1 : num - colArr[i])) *
          100
        );
      }
    }
  } else {
    let colArr = [];
    for (let i = 0; i < height; i++) {
      let total = 0;
      for (let j = 0; j < width; j++) {
        total += wsPointData[j * height + i];
      }
      colArr.push(total);
    }
    // console.log(colArr)
    // //////okok
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        wsPointData[j * height + i] = parseInt(
          (wsPointData[j * height + i] /
            (num - colArr[i] == 0 ? 1 : num - colArr[i])) *
          100
        );
      }
    }
  }

  //////

  // wsPointData = wsPointData.map((a,index) => {return calculateY(a)})
  return wsPointData;
}

export function pressNew({ arr, width, height, type = "row", value }) {
  let wsPointData = [...arr];
  if (type == "row") {
    let colArr = [];
    for (let i = 0; i < height; i++) {
      let total = 0;
      for (let j = 0; j < width; j++) {
        total += wsPointData[i * width + j];
      }
      colArr.push(total);
    }
    // //////okok
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        wsPointData[i * width + j] = parseInt(
          (wsPointData[i * width + j] /
            (value - colArr[i] == 0 ? 1 : value - colArr[i])) *
          1000
        );
      }
    }
  } else {
    let colArr = [];
    for (let i = 0; i < height; i++) {
      let total = 0;
      for (let j = 0; j < width; j++) {
        total += wsPointData[j * height + i];
      }
      colArr.push(total);
    }
    // //////okok
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        wsPointData[j * height + i] = parseInt(
          (wsPointData[j * height + i] /
            (value - colArr[i] == 0 ? 1 : value - colArr[i])) *
          1000
        );
      }
    }
  }

  //////

  // wsPointData = wsPointData.map((a,index) => {return calculateY(a)})
  return wsPointData;
}

export function carSitLine(arr) {
  let wsPointData = [...arr];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 32; j++) {
      [wsPointData[i * 32 + j], wsPointData[(15 - i) * 32 + j]] = [
        wsPointData[(15 - i) * 32 + j],
        wsPointData[i * 32 + j],
      ];
    }
  }

  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 8; j++) {
      [wsPointData[i * 32 + j + 15], wsPointData[i * 32 + 16 - j + 15]] = [
        wsPointData[i * 32 + 16 - j + 15],
        wsPointData[i * 32 + j + 15],
      ];
    }
  }
  wsPointData = getLineOk(wsPointData);
  wsPointData = rotateMatrixsit180(wsPointData, 32, 32);
  return wsPointData;
}

export function carBackLine(arr) {
  let wsPointData = [...arr];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 32; j++) {
      [wsPointData[i * 32 + j], wsPointData[(14 - i) * 32 + j]] = [
        wsPointData[(14 - i) * 32 + j],
        wsPointData[i * 32 + j],
      ];
    }
  }

  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 8; j++) {
      [wsPointData[i * 32 + j + 15], wsPointData[i * 32 + 16 - j + 15]] = [
        wsPointData[i * 32 + 16 - j + 15],
        wsPointData[i * 32 + j + 15],
      ];
    }
  }

  let b = wsPointData.splice(0, 15 * 32);

  wsPointData = wsPointData.concat(b);

  wsPointData = rotateMatrix(wsPointData, 32, 32);
  wsPointData = getLineOk(wsPointData);
  wsPointData = rotateMatrixback180(wsPointData, 32, 32);
  return wsPointData;
}

function rotateMatrix(matrix, m, n) {
  const rotatedMatrix = new Array(n);

  for (let i = 0; i < n; i++) {
    rotatedMatrix[i] = new Array(m);
    for (let j = 0; j < m; j++) {
      rotatedMatrix[i][j] = matrix[(m - 1 - j) * n + i];
    }
  }
  const rotatedArray = rotatedMatrix.flat();
  return rotatedArray;
}

function rotateMatrixsit180(matrix, m, n) {
  const wsPointData = [...matrix];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n / 2; j++) {
      [wsPointData[i * m + j], wsPointData[i * m + n - 1 - j]] = [
        wsPointData[i * m + n - 1 - j],
        wsPointData[i * m + j],
      ];
    }
  }
  return wsPointData;
}

function rotateMatrixback180(matrix, m, n) {
  const wsPointData = [...matrix];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n / 2; j++) {
      [wsPointData[i * m + j], wsPointData[i * m + n - 1 - j]] = [
        wsPointData[i * m + n - 1 - j],
        wsPointData[i * m + j],
      ];
    }
  }

  for (let i = 0; i < m / 2; i++) {
    for (let j = 0; j < n; j++) {
      [wsPointData[i * m + j], wsPointData[(m - 1 - i) * m + j]] = [
        wsPointData[(m - 1 - i) * m + j],
        wsPointData[i * m + j],
      ];
    }
  }

  return wsPointData;
}

function getLineOk(arr) {
  const wsPointData = [...arr];
  // let colArr = [], rowArr = []
  // for (let i = 0; i < 32; i++) {
  //     let coltotal = 0, rowtotal = 0
  //     for (let j = 0; j < 32; j++) {
  //         coltotal += wsPointData[j * 32 + i]
  //         rowtotal += wsPointData[i * 32 + j]
  //     }
  //     colArr.push(coltotal)
  //     rowArr.push(rowtotal)
  // }

  // for (let i = 1; i < 31; i++) {
  //     if (rowArr[i + 1] > 70 && rowArr[i] < 40 && rowArr[i - 1] > 70) {
  //         for (let j = 0; j < 32; j++) {
  //             wsPointData[i * 32 + j] = parseInt((wsPointData[(i - 1) * 32 + j] + wsPointData[(i + 1) * 32 + j])/2)
  //         }
  //     }
  // }

  // for(let i = 0; i < 32; i++){
  //     if (colArr[i + 1] > 70 && colArr[i] < 40 && colArr[i - 1] > 70) {
  //         for (let j = 1; j < 31; j++) {
  //             wsPointData[i * 32 + j] = parseInt((wsPointData[i * 32 + j + 1] + wsPointData[i * 32 + j - 1])/2)
  //         }
  //     }
  // }

  for (let i = 1; i < 31; i++) {
    for (let j = 1; j < 31; j++) {
      if (wsPointData[i * 32 + j] < 10) {
        if (
          wsPointData[i * 32 + j + 1] > 10 &&
          wsPointData[i * 32 + j - 1] > 10
        ) {
          wsPointData[i * 32 + j] = parseInt(
            (wsPointData[i * 32 + j + 1] + wsPointData[i * 32 + j - 1]) / 2
          );
        } else if (
          wsPointData[(i + 1) * 32 + j] > 10 &&
          wsPointData[(i - 1) * 32 + j] > 10
        ) {
          wsPointData[i * 32 + j] = parseInt(
            (wsPointData[(i + 1) * 32 + j] + wsPointData[(i - 1) * 32 + j]) / 2
          );
        }
      }
    }
  }
  return wsPointData;
}

// 寻找重心
export function graCenter(matrix, width, height) {
  const arr = [...matrix].map((a) => (a < 10 ? 0 : a));
  let rowTotal = [];
  let cloumnTotal = [];
  for (let i = 0; i < height; i++) {
    let a = 0,
      b = 0;
    for (let j = 0; j < width; j++) {
      a += arr[i * width + j];
      b += arr[i + height * j];
    }
    rowTotal.push(a);
    cloumnTotal.push(b);
  }
  // const x = findMedian(rowTotal, 0, 32)
  // const y = findMedian(cloumnTotal, 0, 32)
  let x = findGroup(rowTotal);
  let y = findGroup(cloumnTotal);
  x = x ? x : 0
  y = y ? y : 0
  return [y, x];
}

function findGroup(arr) {
  const groupArr = findNonZeroSubarrays(arr);
  const indexArr = findNonZeroSubarraysWithIndex(arr);

  const res = [{ value: 1, index: 0 }],
    resValue = [];
  for (let i = 0; i < groupArr.length; i++) {
    const value = groupArr[i].reduce((a, b) => a + b, 0);
    const index = findMedian(groupArr[i], indexArr[i].start, indexArr[i].end);
    res.push({ value, index });
    // resValue.push(value, index)
  }
  // console.log(resValue)
  res.push({ value: 1, index: 31 });
  const index = calCenter(res);
  return index;
}

function calCenter(arr) {
  let res = arr;
  while (res.length > 1) {
    const data = [];
    for (let i = 0; i < res.length - 1; i++) {
      const value =
        res[i].value -
        ((res[i].value - res[i + 1].value) * res[i + 1].value) /
        (res[i].value + res[i + 1].value);
      const index =
        res[i].index +
        (Math.abs(res[i].index - res[i + 1].index) * res[i + 1].value) /
        (res[i].value + res[i + 1].value);
      data.push({ value, index });
    }
    res = data;
  }

  return res[0]?.index;
}

function findMedian(arr, start, end) {
  if (start === end) {
    return start;
  }
  const total = arr.reduce((a, b) => a + b, 0);
  let numLeft = 0,
    numRight = 0,
    left,
    right;
  for (let i = start; i < end;) {
    numLeft += arr[i];
    if (numLeft < total / 2) {
      i++;
    } else {
      left = i;
      break;
    }
  }

  for (let i = end - 1; i >= start;) {
    numRight += arr[i];
    if (numRight < total / 2) {
      i--;
    } else {
      right = i;
      break;
    }
  }
  return parseInt((right + left) / 2) ? parseInt((right + left) / 2) : 1;
}

function findNonZeroSubarrays(arr) {
  const result = [];
  let start = -1; // 记录连续子数组的起始位置

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      // 当找到非零数字时，记录连续子数组的起始位置
      if (start === -1) {
        start = i;
      }
    } else {
      // 当遇到0或者数组遍历结束时，结束记录
      if (start !== -1) {
        result.push(arr.slice(start, i));
        start = -1;
      }
    }
  }

  // 处理连续子数组在数组末尾的情况
  if (start !== -1) {
    result.push(arr.slice(start));
  }

  return result;
}

function findNonZeroSubarraysWithIndex(arr) {
  const result = [];
  let start = -1; // 记录连续子数组的起始位置

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      // 当找到非零数字时，记录连续子数组的起始位置
      if (start === -1) {
        start = i;
      }
    } else {
      // 当遇到0或者数组遍历结束时，记录结束位置，并将连续子数组的起始和结束索引添加到结果中
      if (start !== -1) {
        result.push({ start, end: i - 1 });
        start = -1;
      }
    }
  }

  // 处理连续子数组在数组末尾的情况
  if (start !== -1) {
    result.push({ start, end: arr.length - 1 });
  }

  return result;
}

export function rotateArray90Degrees(array) {
  const length = array.length;

  // 计算生成二维数组的行数和列数
  const rows = Math.sqrt(length);
  const cols = rows;

  if (rows % 1 !== 0) {
    console.error("输入数组长度不适合生成正方形二维数组。");
    return;
  }

  // 将一维数组转换为二维数组
  const originalMatrix = [];
  for (let i = 0; i < rows; i++) {
    originalMatrix.push(array.slice(i * cols, (i + 1) * cols));
  }

  // 创建一个新的旋转后的矩阵
  const rotatedMatrix = new Array(cols).fill().map(() => []);

  // 进行矩阵转置和行翻转
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotatedMatrix[col][rows - 1 - row] = originalMatrix[row][col];
    }
  }

  // 将旋转后的矩阵转换为一维数组
  const rotatedArray = rotatedMatrix.flat();

  return rotatedArray;
}

export function rotateArrayCounter90Degrees(array, rows, cols) {
  const length = array.length;

  if (length !== rows * cols) {
    console.error("输入数组长度与给定的行数和列数不匹配。");
    return;
  }

  // 将一维数组转换为二维数组
  const originalMatrix = [];
  for (let i = 0; i < rows; i++) {
    originalMatrix.push(array.slice(i * cols, (i + 1) * cols));
  }

  // 创建一个新的旋转后的矩阵
  const rotatedMatrix = new Array(rows).fill().map(() => []);

  // 进行矩阵转置和行翻转
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotatedMatrix[cols - 1 - col][row] = originalMatrix[row][col];
    }
  }

  // 将旋转后的矩阵转换为一维数组
  const rotatedArray = rotatedMatrix.flat();

  return rotatedArray;
}

// 计算压强
export function calPress(startValue, relValue, time) {
  let value;
  if (time < 60 * 13) {
    value = relValue - (startValue * 0.05 * time) / 60 / 13;
  } else if (time < 120 * 13) {
    value =
      relValue -
      startValue * 0.05 -
      (startValue * 0.03 * (time - 60 * 13)) / 60 / 13;
  } else {
    value =
      relValue -
      startValue * 0.08 -
      (startValue * 0.02 * (time - 120 * 13)) / 120 / 13;
  }
  return value;
}

// 判断物体坐标
export function findObj(arr, width, height) {
  // 找到所有物体坐标
  let coorArr = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (arr[i * width + j] > 0) {
        coorArr.push([i, j]);
      }
    }
  }
  // 找到相邻的点,每个点在周围两点就算连着
  let coorAdjArr = [];
  for (let i = 0; i < coorArr.length; i++) {
    coorAdjArr[i] = [coorArr[i]];
    for (let j = 0; j < coorArr.length; j++) {
      for (let k = coorArr[i][0] - 2; k <= coorArr[i][0] + 2; k++) {
        for (let z = coorArr[i][1] - 2; z <= coorArr[i][1] + 2; z++) {
          if (coorArr[j][0] === k && coorArr[j][1] === z) {
            coorAdjArr[i].push(coorArr[j]);
          }
        }
      }
    }
  }

  //   每个点找到相邻之后，求交集
  let objArr = [coorAdjArr[0]];
  //   for(let i = 1,j=0 ; i < coorAdjArr.length ; i ++){
  //     for(let )
  //   }
}

// 返回两个数的差值是否小于valueFlag
export function objChange(newValue, oldValue, valueFlag) {
  if (newValue > oldValue - valueFlag && newValue < oldValue + valueFlag) {
    return false;
  } else {
    return true;
  }
}

export function arr10to5(arr) {
  const newDataArr = []

  for (let i = 0; i < 5; i++) {

    for (let j = 0; j < 5; j++) {
      let num = 0

      for (let k = 0; k < 2; k++) {
        for (let z = 0; z < 2; z++) {
          num += arr[(i * 2 + k) * 10 + j * 2 + z]
          // console.log(i + k, j + z)
        }
      }

      newDataArr.push(Number((num / 4).toFixed(1)))
    }

  }
  const wsPointData = []
  for (let i = 0; i < 5; i++) {

    for (let j = 0; j < 5; j++) {
      let num = 0

      for (let k = 0; k < 2; k++) {
        for (let z = 0; z < 2; z++) {
          // num += ndata[(i*2 + k) * 10 + j*2 + z]
          wsPointData[(i * 2 + k) * 10 + j * 2 + z] = newDataArr[i * 5 + j]
          // console.log(i + k, j + z)
        }
      }
    }
  }
  return wsPointData
}
