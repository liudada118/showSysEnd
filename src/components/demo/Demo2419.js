import React, { useEffect, useState } from "react";
import { findMax, jetWhite3 } from "../../assets/util/util";
import { carBackLine, handLine, pressNew, zeroLine } from "../../assets/util/line";
import { Button, Input, Slider } from "antd";
import { CSVLink } from "react-csv";
let data = [];

// for (let i = 0; i < 32; i++) {
//     for (let j = 0; j < 32; j++) {
//         data[i * 32 + j] = j
//     }
// }
// const newData = [...data]
// let b = data.splice(0, 16 * 32)
// data = data.concat(b)
// console.log(newData, data)
// for (let i = 0; i < 32; i++) {
//     for (let j = 0; j < 8; j++) {
//         // let a = data[i * 32 + j]
//         // data[i * 32 + j] = data[i * 32 + 15 - j]
//         // data[i * 32 + 15 - j] = a
//         [data[i * 32 + j], data[i * 32 + 15 - j]] = [data[i * 32 + 15 - j], data[i * 32 + j]];
//         // data[i * 32 + j]  = 0
//     }
// }

// let res = []
// for (let i = 0; i < 32; i++) {
//     res[i] = []
//     for (let j = 0; j < 32; j++) {
//         res[i].push(data[i * 32 + j])
//     }
// }
let ws,
  pressValue = localStorage.getItem("carValuePress")
    ? JSON.parse(localStorage.getItem("carValuePress"))
    : 1000;

let collection = JSON.parse(localStorage.getItem("collection"))
  ? JSON.parse(localStorage.getItem("collection"))
  : [["data", "name"]];
let colFalg = false,
  wsPointData;

function colRowArr(arr) {
  const resArr = [];
  for (let i = 0; i < 32; i++) {
    let num = 0;
    for (let j = 0; j < 32; j++) {
      num += arr[i * 32 + j];
    }
    resArr.push(num);
  }
  return resArr;
}

function jet(min, max, x) {
  let red, g, blue;
  let dv;
  red = 1.0;
  g = 1.0;
  blue = 1.0;
  if (x < min) {
    x = min;
  }
  if (x > max) {
    x = max;
  }
  dv = max - min;
  if (x < min + 0.25 * dv) {
    // red = 0;
    // g = 0;
    // blue = 0;

    red = 0;
    g = (4 * (x - min)) / dv;
  } else if (x < min + 0.5 * dv) {
    red = 0;
    blue = 1 + (4 * (min + 0.25 * dv - x)) / dv;
  } else if (x < min + 0.75 * dv) {
    red = (4 * (x - min - 0.5 * dv)) / dv;
    blue = 0;
  } else {
    g = 1 + (4 * (min + 0.75 * dv - x)) / dv;
    blue = 0;
  }
  var rgb = new Array();
  rgb[0] = parseInt(255 * red + '');
  rgb[1] = parseInt(255 * g + '');
  rgb[2] = parseInt(255 * blue + '');
  return rgb;
}


function jet1(min, max, x) {
  let red, g, blue;
  let dv;
  red = 1.0;
  g = 1.0;
  blue = 1.0;
  if (x < min) {
    x = min;
  }
  if (x > max) {
    x = max;
  }
  dv = max - min;
  if (x < min + 0.2 * dv) {
    red = 1;
    g = 1;
    blue = 1;

    // red = 0;
    // g = (4 * (x - min)) / dv;
  } else if (x < min + 0.4 * dv) {
    // red = 0;
    // g = 0;
    // blue = 0;

    red = 0;
    g = (5 * (x - min - 0.2 * dv)) / dv;
  } else if (x < min + 0.6 * dv) {
    red = 0;
    blue = 1 + (4 * (min + 0.4 * dv - x)) / dv;
  } else if (x < min + 0.8 * dv) {
    red = (4 * (x - min - 0.6 * dv)) / dv;
    blue = 0;
  } else {
    g = 1 + (4 * (min + 0.8 * dv - x)) / dv;
    blue = 0;
  }
  var rgb = new Array();
  rgb[0] = parseInt(255 * red + '');
  rgb[1] = parseInt(255 * g + '');
  rgb[2] = parseInt(255 * blue + '');
  return rgb;
}

export default function Demo() {
  const [data, setData] = useState([]);
  const [max, setMax] = useState(0);
  const [maxCol, setMaxCol] = useState(0);
  const [valuePress, setValuePress] = useState(
    localStorage.getItem("carValuePress")
      ? JSON.parse(localStorage.getItem("carValuePress"))
      : 1000
  );
  const [csvData, setCsvData] = useState(
    JSON.parse(localStorage.getItem("collection"))
      ? JSON.parse(localStorage.getItem("collection"))
      : [["data", "name"]]
  );
  const [length, setLength] = useState(
    JSON.parse(localStorage.getItem("collection"))
      ? JSON.parse(localStorage.getItem("collection")).length
      : 1
  );
  const [flag, setFlag] = useState(false);
  const [name, setName] = useState("");
  const [objArea, setArea] = useState("");
  useEffect(() => {
    // const data = [0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,15,13,0,0,0,27,32,25,25,23,18,19,0,0,0,27,32,25,25,23,18,19,0,0,0,18,30,27,27,26,24,0,0,0,0,0,14,11,11,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,0,11,0,0,0,0,0,0,12,12,25,31,30,39,0,0,19,12,18,18,24,27,41,20,0,0,20,0,11,11,16,17,24,20,0,0,20,0,11,11,16,17,24,20,0,0,0,0,0,0,0,11,0,0,0,0,11,15,20,20,18,14,12,20,0,0,19,14,16,16,13,13,13,0,0,0,20,13,21,21,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    // const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 6, 12, 13, 22, 36, 27, 29, 20, 11, 7, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 4, 8, 7, 14, 23, 24, 31, 39, 38, 30, 23, 19, 12, 10, 5, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 13, 13, 12, 33, 23, 24, 24, 54, 38, 31, 27, 43, 33, 42, 31, 31, 33, 37, 46, 66, 29, 16, 8, 2, 2, 1, 0, 0, 0, 0, 2, 4, 26, 26, 34, 35, 23, 24, 33, 42, 31, 37, 34, 29, 46, 40, 32, 40, 31, 26, 34, 35, 29, 49, 30, 19, 9, 3, 0, 0, 0, 1, 5, 17, 15, 15, 14, 17, 28, 37, 29, 40, 31, 44, 42, 36, 44, 38, 50, 37, 41, 36, 48, 31, 45, 18, 19, 24, 18, 5, 0, 0, 1, 2, 18, 25, 6, 5, 3, 9, 19, 23, 20, 21, 41, 39, 36, 49, 41, 57, 74, 36, 37, 30, 44, 20, 18, 3, 4, 17, 29, 7, 0, 0, 2, 5, 43, 24, 4, 4, 2, 2, 5, 17, 26, 21, 46, 33, 42, 32, 48, 53, 47, 45, 43, 44, 28, 9, 3, 2, 3, 8, 40, 84, 17, 0, 2, 5, 18, 3, 1, 1, 1, 1, 2, 7, 11, 15, 22, 31, 56, 45, 38, 45, 56, 49, 42, 27, 17, 3, 1, 0, 0, 1, 4, 15, 1, 0, 5, 3, 4, 2, 1, 1, 1, 1, 2, 3, 8, 26, 45, 47, 37, 31, 30, 33, 35, 31, 45, 33, 8, 2, 0, 0, 0, 0, 1, 3, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 3, 15, 28, 30, 26, 24, 13, 38, 38, 26, 37, 16, 3, 1, 0, 0, 0, 0, 2, 2, 0, 0, 3, 1, 3, 3, 1, 1, 1, 1, 1, 2, 9, 13, 37, 22, 22, 12, 6, 24, 18, 30, 19, 29, 10, 3, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 3, 10, 23, 20, 23, 21, 35, 31, 42, 23, 29, 17, 32, 18, 5, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 2, 3, 21, 22, 45, 22, 21, 30, 41, 30, 16, 22, 36, 35, 35, 17, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 0, 1, 2, 6, 31, 50, 36, 31, 39, 51, 69, 51, 26, 23, 26, 31, 28, 15, 4, 1, 0, 0, 0, 1, 2, 0, 0, 1, 0, 1, 2, 3, 4, 16, 23, 43, 63, 32, 54, 50, 31, 42, 44, 42, 47, 43, 52, 47, 31, 45, 29, 3, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 2, 2, 11, 77, 47, 45, 30, 33, 41, 46, 52, 28, 24, 30, 57, 50, 32, 40, 53, 36, 5, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 3, 12, 35, 75, 32, 49, 38, 47, 61, 35, 28, 53, 31, 34, 28, 32, 37, 26, 41, 13, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2, 16, 46, 34, 58, 50, 40, 31, 45, 36, 26, 43, 53, 40, 32, 44, 44, 42, 22, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 2, 2, 16, 25, 62, 45, 56, 51, 29, 23, 18, 6, 14, 33, 34, 56, 35, 48, 31, 24, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 14, 21, 36, 26, 44, 24, 7, 5, 3, 1, 1, 2, 7, 23, 25, 26, 20, 28, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 2, 21, 22, 14, 18, 31, 11, 3, 1, 1, 0, 1, 1, 2, 18, 16, 12, 22, 18, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 11, 26, 17, 32, 27, 6, 1, 1, 0, 0, 0, 0, 1, 10, 14, 12, 13, 11, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 9, 27, 29, 16, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 17, 16, 9, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 12, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 15, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 3, 2, 1, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 26, 25, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 20, 10, 4, 1, 0, 0, 0, 0, 1, 2, 7, 19, 69, 69, 9, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 10, 53, 62, 45, 22, 6, 2, 0, 0, 3, 18, 85, 93, 115, 115, 16, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 32, 76, 92, 119, 104, 36, 7, 0, 0, 5, 45, 108, 118, 139, 139, 19, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 22, 66, 79, 141, 121, 62, 13, 0, 1]
    // const data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34,33,30,34,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,60,54,61,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,68,73,59,65,55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,104,75,59,49,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,77,100,103,76,66,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,75,80,93,113,89,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,91,93,96,116,99,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,91,92,94,116,104,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,41,29,0,43,39,35,0,0,0,0,0,0,0,0,22,52,26,0,0,0,0,0,0,0,0,0,0,0,0,112,112,116,145,146,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33,34,0,0,33,36,57,41,27,70,56,45,36,0,0,0,0,0,0,0,31,47,23,0,0,0,0,0,0,0,0,0,0,0,0,132,137,136,195,163,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,49,26,21,28,32,67,32,46,81,49,47,33,28,0,0,0,0,0,0,34,52,27,0,0,0,0,0,0,0,0,0,0,0,0,168,162,161,204,203,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,52,38,26,0,0,50,32,50,74,35,45,36,36,0,0,0,0,24,0,51,46,25,0,0,0,0,0,0,0,0,0,0,0,0,172,171,173,205,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,42,44,36,20,0,0,23,20,36,66,33,34,40,22,0,0,0,0,0,0,41,56,26,0,0,0,0,0,0,0,0,0,0,0,0,183,177,183,191,178,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,41,43,23,0,0,0,0,0,0,35,0,0,0,0,0,0,0,0,0,0,31,37,21,0,0,0,0,0,0,0,0,0,0,0,0,189,175,165,203,178,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,45,0,0,0,0,0,0,0,25,0,0,0,0,0,0,0,0,0,0,0,38,0,0,0,0,0,0,0,0,0,0,0,0,0,184,178,170,200,177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,52,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,178,178,181,203,178,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,88,27,0,0,21,24,0,0,41,34,0,0,0,0,0,0,0,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0,0,0,177,169,181,198,190,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,72,73,29,0,25,44,41,31,39,57,52,33,31,0,0,0,0,0,0,0,30,22,20,0,0,0,0,0,0,0,0,0,0,0,0,183,180,186,206,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35,37,32,0,41,32,41,21,43,62,62,49,46,0,0,0,0,0,0,0,41,35,35,0,0,0,0,0,0,0,0,0,0,0,0,176,186,167,192,179,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29,30,36,65,60,46,57,27,0,0,0,0,26,26,37,42,37,0,0,0,0,0,0,0,0,0,0,0,0,179,172,160,194,172,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,52,57,57,33,33,0,0,0,0,34,39,56,68,45,0,0,0,0,0,0,0,0,0,0,0,0,164,159,155,176,164,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,27,20,0,0,0,0,0,0,0,0,32,53,49,0,0,0,0,0,0,0,0,0,0,0,0,133,130,135,152,134,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,41,57,0,0,0,0,0,0,0,0,0,0,0,0,115,113,113,132,116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,37,0,0,0,0,0,0,0,0,0,0,0,0,105,101,101,119,104,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0,0,0,92,90,90,106,91,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,85,85,88,101,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,82,87,90,111,74,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,84,72,71,45,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,93,79,64,52,39,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,123,82,48,49,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,56,41,45,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    // const data =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const data = [8, 7, 6, 4, 3, 2, 1, 0, 0, 0, 1, 2, 3, 5, 5, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 5, 5, 4, 2, 2, 1, 1, 2, 2, 2, 3, 7, 13, 14, 12, 9, 6, 3, 1, 0, 0, 0, 0, 0, 0, 1, 1, 3, 4, 3, 2, 1, 5, 4, 3, 2, 1, 0, 1, 3, 4, 4, 5, 12, 23, 25, 22, 20, 16, 10, 4, 1, 1, 1, 1, 2, 3, 5, 8, 10, 10, 9, 6, 4, 2, 2, 2, 1, 0, 0, 1, 3, 4, 4, 5, 11, 20, 26, 31, 37, 38, 29, 15, 6, 3, 3, 4, 7, 13, 22, 29, 29, 24, 20, 18, 13, 1, 1, 0, 0, 0, 0, 2, 4, 5, 5, 6, 10, 18, 28, 41, 56, 61, 48, 25, 10, 6, 6, 8, 14, 25, 41, 52, 51, 40, 32, 28, 22, 0, 0, 0, 0, 0, 0, 1, 4, 5, 7, 9, 12, 21, 35, 51, 65, 65, 47, 26, 12, 8, 9, 13, 20, 31, 47, 59, 56, 43, 31, 27, 23, 1, 1, 0, 0, 0, 0, 2, 4, 6, 9, 11, 16, 26, 41, 59, 70, 63, 43, 23, 12, 9, 12, 17, 24, 35, 49, 60, 57, 43, 30, 24, 24, 2, 2, 2, 1, 0, 0, 2, 4, 6, 9, 12, 16, 23, 34, 46, 52, 43, 27, 14, 8, 7, 9, 13, 19, 27, 36, 43, 42, 34, 26, 22, 22, 5, 5, 4, 2, 0, 0, 2, 4, 7, 10, 13, 17, 23, 29, 34, 35, 26, 13, 6, 4, 5, 7, 10, 14, 18, 23, 29, 31, 29, 26, 22, 20, 7, 7, 5, 2, 1, 1, 3, 5, 8, 11, 17, 25, 32, 35, 35, 30, 20, 10, 5, 4, 7, 8, 9, 11, 14, 18, 27, 34, 34, 29, 21, 15, 9, 8, 6, 3, 1, 1, 4, 6, 9, 13, 21, 33, 42, 45, 41, 32, 20, 10, 6, 6, 9, 10, 10, 10, 11, 17, 30, 42, 42, 33, 21, 12, 5, 5, 4, 2, 1, 2, 4, 6, 9, 15, 23, 31, 39, 44, 40, 30, 19, 10, 6, 6, 7, 7, 6, 6, 8, 14, 25, 37, 38, 30, 19, 12, 1, 2, 2, 1, 1, 2, 4, 6, 10, 18, 26, 31, 37, 44, 41, 30, 18, 9, 6, 5, 5, 5, 3, 3, 6, 13, 23, 34, 35, 27, 19, 16, 0, 1, 1, 1, 0, 2, 4, 8, 13, 19, 27, 35, 41, 46, 44, 32, 19, 10, 6, 5, 5, 4, 3, 3, 7, 14, 25, 34, 34, 28, 23, 24, 0, 0, 0, 0, 0, 1, 4, 9, 15, 20, 28, 39, 47, 51, 48, 36, 22, 11, 6, 5, 5, 5, 4, 4, 9, 19, 30, 38, 38, 32, 29, 32, 0, 1, 1, 1, 0, 1, 3, 7, 11, 14, 21, 32, 41, 44, 43, 36, 25, 14, 7, 5, 5, 5, 6, 8, 15, 26, 38, 44, 43, 37, 32, 33, 1, 1, 2, 1, 0, 1, 2, 4, 6, 9, 16, 27, 36, 40, 41, 38, 30, 18, 10, 7, 6, 6, 8, 12, 23, 36, 47, 53, 51, 44, 37, 34, 3, 3, 3, 1, 1, 2, 3, 4, 6, 11, 20, 33, 40, 42, 42, 41, 34, 23, 16, 11, 8, 7, 8, 14, 30, 45, 53, 56, 56, 50, 39, 29, 5, 4, 3, 2, 1, 3, 4, 5, 7, 13, 27, 41, 46, 46, 45, 44, 37, 27, 20, 14, 10, 7, 8, 16, 36, 53, 58, 60, 62, 57, 42, 27, 5, 5, 3, 2, 1, 2, 3, 4, 6, 11, 22, 34, 40, 41, 39, 35, 28, 19, 14, 10, 8, 6, 7, 14, 30, 44, 51, 55, 57, 51, 38, 25, 5, 5, 4, 2, 0, 1, 2, 4, 5, 9, 16, 27, 34, 36, 33, 28, 19, 11, 7, 6, 5, 5, 6, 11, 24, 36, 45, 51, 53, 46, 35, 25, 5, 5, 3, 1, 0, 0, 1, 3, 5, 7, 13, 20, 25, 29, 29, 23, 14, 7, 4, 3, 3, 3, 4, 10, 20, 31, 37, 41, 44, 40, 32, 24, 5, 4, 3, 1, 0, 0, 1, 3, 5, 6, 11, 15, 18, 23, 25, 20, 12, 5, 2, 1, 1, 1, 3, 8, 18, 26, 30, 32, 35, 34, 28, 22, 2, 2, 2, 1, 0, 0, 1, 2, 2, 3, 6, 8, 9, 12, 13, 11, 6, 3, 1, 0, 0, 0, 1, 4, 10, 14, 16, 18, 20, 20, 17, 14, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 2, 1, 1, 0, 0, 0, 0, 0, 1, 2, 3, 5, 6, 8, 8, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 1, 1, 1, 2, 3, 3, 2, 1, 1, 1, 1, 5, 5, 4, 3, 2, 2, 1, 0, 0, 0, 1, 4, 8, 14, 16, 14, 9, 4, 2, 2, 2, 2, 3, 4, 8, 11, 12, 8, 4, 3, 2, 1, 10, 9, 8, 5, 3, 3, 2, 0, 0, 0, 2, 8, 16, 26, 31, 27, 17, 8, 4, 4, 4, 5, 6, 9, 16, 22, 23, 15, 8, 5, 4, 2, 12, 11, 8, 4, 2, 2, 1, 0, 0, 1, 5, 11, 20, 30, 36, 31, 21, 12, 6, 5, 5, 6, 8, 13, 22, 30, 30, 22, 13, 9, 6, 4, 13, 11, 8, 3, 1, 1, 0, 0, 1, 3, 7, 15, 25, 35, 40, 35, 25, 17, 10, 7, 6, 8, 12, 19, 29, 37, 37, 29, 20, 13, 9, 6, 7, 6, 4, 2, 0, 0, 1, 2, 3, 5, 10, 19, 29, 38, 41, 37, 31, 25, 17, 11, 9, 11, 17, 24, 32, 39, 40, 35, 27, 19, 12, 7, 2, 2, 1, 1, 0, 1, 2, 3, 5, 8, 15, 25, 36, 44, 45, 41, 38, 34, 25, 17, 14, 17, 24, 32, 37, 42, 44, 42, 35, 25, 16, 9, 3, 3, 2, 1, 1, 2, 3, 5, 7, 12, 21, 34, 44, 50, 49, 45, 41, 38, 32, 27, 23, 26, 34, 43, 45, 44, 43, 42, 37, 28, 17, 9, 6, 5, 4, 2, 3, 4, 6, 7, 10, 17, 29, 43, 54, 58, 56, 51, 47, 44, 40, 37, 34, 36, 46, 56, 55, 49, 45, 43, 40, 32, 20, 10, 10, 9, 8, 6, 6, 8, 10, 11, 15, 24, 34, 45, 54, 58, 57, 56, 53, 48, 42, 39, 38, 43, 52, 57, 55, 51, 48, 46, 44, 37, 24, 13, 14, 13, 11, 9, 9, 12, 14, 15, 21, 31, 38, 46, 55, 59, 59, 61, 61, 54, 47, 43, 44, 52, 59, 60, 58, 57, 55, 53, 53, 45, 30, 17, 12, 12, 10, 7, 8, 12, 13, 16, 21, 30, 38, 45, 50, 52, 54, 56, 58, 56, 53, 51, 51, 58, 64, 62, 61, 63, 61, 60, 59, 51, 35, 20, 10, 10, 8, 5, 7, 11, 13, 17, 23, 31, 40, 46, 48, 49, 51, 54, 57, 60, 63, 62, 62, 67, 72, 68, 67, 70, 70, 69, 68, 59, 41, 24, 7, 7, 6, 4, 6, 10, 14, 19, 27, 37, 45, 46, 45, 48, 51, 52, 57, 64, 69, 69, 68, 70, 71, 67, 64, 65, 66, 67, 68, 61, 42, 25, 5, 5, 4, 3, 5, 10, 15, 21, 32, 45, 53, 50, 48, 51, 55, 56, 61, 71, 77, 77, 76, 74, 71, 67, 63, 63, 65, 67, 70, 64, 45, 26, 3, 3, 2, 2, 4, 8, 13, 19, 28, 41, 52, 56, 55, 54, 56, 59, 63, 70, 75, 74, 71, 66, 60, 57, 57, 59, 60, 61, 64, 61, 45, 27, 3, 3, 3, 2, 3, 7, 12, 19, 28, 41, 56, 67, 66, 61, 62, 66, 69, 73, 77, 75, 69, 61, 53, 52, 56, 58, 59, 60, 63, 63, 48, 30, 12, 12, 9, 6, 6, 10, 16, 25, 38, 53, 67, 77, 73, 65, 65, 69, 73, 78, 82, 79, 72, 63, 57, 56, 56, 55, 55, 58, 63, 63, 50, 33, 20, 20, 16, 11, 9, 13, 19, 31, 47, 65, 80, 87, 80, 71, 70, 73, 80, 87, 90, 87, 80, 71, 67, 67, 62, 56, 54, 59, 66, 65, 52, 36, 15, 14, 12, 8, 7, 10, 15, 23, 36, 53, 69, 77, 74, 69, 66, 68, 77, 85, 86, 84, 80, 73, 70, 73, 68, 58, 53, 54, 57, 55, 42, 28, 7, 8, 7, 4, 3, 6, 10, 15, 24, 40, 57, 67, 70, 68, 65, 67, 76, 84, 85, 85, 83, 78, 77, 80, 75, 64, 56, 52, 50, 46, 33, 20, 5, 5, 4, 2, 2, 4, 7, 10, 17, 30, 47, 59, 64, 64, 63, 64, 70, 76, 79, 83, 83, 79, 77, 76, 70, 60, 53, 48, 44, 39, 27, 17, 5, 4, 2, 1, 2, 4, 6, 8, 14, 25, 40, 54, 60, 61, 62, 65, 68, 72, 78, 83, 85, 83, 78, 73, 66, 59, 52, 47, 42, 35, 25, 17, 5, 4, 3, 1, 2, 4, 6, 8, 12, 19, 30, 41, 47, 49, 51, 56, 61, 65, 69, 73, 73, 70, 66, 62, 60, 56, 50, 45, 39, 31, 21, 14, 7, 6, 5, 3, 4, 8, 11, 13, 15, 18, 25, 33, 38, 41, 45, 51, 58, 63, 65, 66, 65, 63, 59, 58, 59, 58, 52, 46, 39, 29, 19, 13, 12, 12, 10, 9, 13, 22, 29, 29, 27, 27, 32, 39, 42, 43, 46, 52, 58, 62, 62, 63, 65, 65, 64, 63, 63, 59, 51, 44, 37, 27, 18, 13, 19, 19, 17, 16, 24, 40, 51, 50, 43, 38, 43, 49, 50, 50, 52, 57, 62, 65, 65, 67, 71, 73, 73, 74, 71, 64, 53, 45, 37, 27, 19, 15, 22, 22, 20, 22, 35, 57, 69, 66, 55, 44, 41, 44, 46, 46, 49, 55, 60, 63, 64, 67, 71, 72, 72, 71, 68, 62, 53, 43, 33, 24, 18, 15, 26, 25, 24, 27, 46, 74, 87, 82, 68, 50, 39, 38, 41, 43, 47, 55, 62, 65, 67, 70, 73, 74, 72, 71, 67, 63, 56, 45, 33, 24, 18, 16, 29, 29, 28, 30, 49, 77, 91, 87, 72, 52, 37, 33, 37, 40, 45, 54, 63, 67, 67, 66, 69, 72, 72, 68, 63, 59, 54, 45, 34, 25, 20, 18, 32, 32, 30, 32, 50, 78, 94, 92, 78, 57, 39, 33, 36, 41, 46, 57, 67, 72, 70, 67, 68, 73, 75, 69, 63, 59, 55, 48, 39, 30, 25, 23, 22, 23, 22, 24, 40, 64, 79, 81, 75, 61, 45, 38, 39, 42, 47, 55, 64, 70, 69, 66, 65, 68, 70, 66, 62, 59, 55, 49, 43, 38, 35, 34, 12, 13, 13, 15, 29, 50, 65, 71, 71, 64, 52, 44, 44, 46, 50, 55, 63, 70, 72, 69, 66, 66, 68, 66, 64, 63, 59, 53, 50, 49, 49, 50, 5, 6, 6, 8, 17, 32, 46, 54, 57, 54, 47, 43, 43, 46, 48, 53, 59, 65, 68, 66, 61, 61, 63, 63, 61, 60, 56, 52, 52, 57, 62, 64, 1, 1, 2, 3, 9, 20, 33, 42, 46, 45, 43, 43, 44, 47, 50, 54, 59, 65, 68, 65, 60, 59, 63, 63, 61, 60, 57, 54, 57, 66, 76, 79, 0, 0, 0, 2, 7, 16, 29, 38, 41, 40, 40, 41, 43, 45, 48, 52, 57, 62, 65, 62, 57, 56, 60, 60, 59, 57, 54, 52, 56, 65, 76, 79, 0, 0, 0, 2, 6, 15, 26, 35, 38, 37, 37, 38, 40, 42, 44, 48, 52, 57, 61, 58, 53, 52, 56, 56, 55, 53, 50, 49, 52, 60, 70, 74, 0, 0, 0, 1, 3, 8, 14, 19, 21, 20, 20, 20, 22, 23, 24, 26, 28, 31, 33, 32, 29, 28, 30, 30, 30, 29, 27, 26, 28, 33, 38, 40]
    const newData = []
    for (let i = 0; i < 32; i++) {
      newData[i] = []
      for (let j = 0; j < 32; j++) {
        newData[i].push(data[i * 32 + j])
      }
    }
    setData(newData)
    ws = new WebSocket(" ws://localhost:19999");
    ws.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws.onmessage = (e) => {
      let jsonObject = JSON.parse(e.data);
      //处理空数组

      if (jsonObject.sitData != null) {
        wsPointData = jsonObject.sitData;


        // wsPointData = handLine(wsPointData);
        // wsPointData = zeroLine(wsPointData , 30, 5);

        // wsPointData = wsPointData.map((a) => (a < 5 ? 0 : a));

        if (colFalg) {
          collection.push([[...wsPointData], name]);
          setLength(collection.length - 1);
          setCsvData(collection);
          localStorage.setItem("collection", JSON.stringify(collection));
        }


        const press = wsPointData.reduce((a, b) => a + b, 0);
        const point = wsPointData.filter((a, index) => a > 5).length;
        // setMaxCol(colTotalNum)
        // console.log(press,point)
        setMax((press / point).toFixed(2));

        const newArr = []
        for (let i = 0; i < 10; i++) {
          for (let j = 22; j < 32; j++) {
            newArr.push(wsPointData[i * 32 + j])
          }
        }

        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 10; j++) {
            [newArr[i*10 + j] ,newArr[(4-i)*10 + j] ] = [newArr[(4-i)*10 + j],newArr[i*10 + j] , ]
          }
        }


        let arr = [];
        for (let i = 0; i < 10; i++) {
          arr[i] = [];
          for (let j = 0; j < 10; j++) {
            arr[i][j] = Math.floor(newArr[i * 10 + j]);
          }
          arr[i][10] = i
        }
        arr[10] = []
        for (let i = 0; i < 10; i++) {
          arr[10][i] = i
        }
        // console.log(arr)
        setData(arr);
      }

      if (jsonObject.backData != null) {
        wsPointData = jsonObject.backData;

        wsPointData = wsPointData.map((a) => (a < 10 ? 0 : a));
        const length = wsPointData.filter((a) => a > 0).length;
        const total = wsPointData.reduce((a, b) => a + b, 0);
        const area = (total / length).toFixed(2);
        if (colFalg) {
          collection.push([JSON.stringify(wsPointData), area, name, eval(name), objArea, eval(objArea)]);
          setLength(collection.length - 1);
          setCsvData(collection);
          localStorage.setItem("collection", JSON.stringify(collection));
        }

        // let a = wsPointData.splice(0, 1 * 32)
        // let b = wsPointData.splice(0, 15 * 32)
        // wsPointData = a.concat(wsPointData, b)

        // let newArr = []
        // for (let i = 0; i < 32; i++) {
        //     for (let j = 0; j < 1; j++) {
        //         newArr[i * 32 + j] = (wsPointData[(i * 32 + j)])
        //     }
        // }
        // for (let i = 0; i < 32; i++) {
        //     for (let j = 16; j < 32; j++) {
        //         newArr[i * 32 + j] = (wsPointData[(i * 32 + j - 15)])
        //     }
        // }
        // for (let i = 0; i < 32; i++) {
        //     for (let j = 1; j < 16; j++) {
        //         newArr[i * 32 + j] = (wsPointData[(i * 32 + 16 + j)])
        //     }
        // }

        // wsPointData = newArr
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

        // wsPointData = carBackLine(wsPointData)

        // for (let i = 1; i < 31; i++) {
        //     if (rowArr[i + 1] > 100 && rowArr[i] < 40 && rowArr[i - 1] > 100) {
        //         for (let j = 0; j < 32; j++) {
        //             wsPointData[i * 32 + j] = parseInt((wsPointData[(i - 1) * 32 + j] + wsPointData[(i + 1) * 32 + j])/2)
        //         }
        //     }
        // }

        // for(let i = 0; i < 32; i++){
        //     if (colArr[i + 1] > 100 && colArr[i] < 40 && colArr[i - 1] > 100) {
        //         for (let j = 1; j < 31; j++) {
        //             wsPointData[j * 32 + i] = parseInt((wsPointData[(j - 1) * 32 + i] + wsPointData[(j + 1) * 32 + i])/2)
        //         }
        //     }
        // }

        // wsPointData = pressNew({ arr: wsPointData, width: 32, height: 32, type: 'column', value: pressValue})

        // let colArr = []
        // for (let i = 0; i < 32; i++) {
        //     let total = 0
        //     for (let j = 0; j < 32; j++) {
        //         total += wsPointData[j * 32 + i]
        //     }
        //     colArr.push(total)
        // }

        // let max = findMax(wsPointData)
        // let maxIndex = wsPointData.indexOf(max)
        // let colNum = maxIndex % 32
        // let colTotalNum = colArr[colNum]
        // setMax(max)
        const press = wsPointData.reduce((a, b) => a + b, 0);
        const point = wsPointData.filter((a, index) => a > 10).length;
        // setMaxCol(colTotalNum)
        // console.log(press,point)
        setMax((press / point).toFixed(2));
        // for (let i = 0; i < 32; i++) {
        //     for (let j = 0; j < 32; j++) {
        //         wsPointData[j*32 + i] = parseInt((wsPointData[j*32 + i] /(1245 - colArr[i] ==0 ? 1 : 1245 - colArr[i]))*1000 )
        //     }
        // }

        let arr = [];
        for (let i = 0; i < 32; i++) {
          arr[i] = [];
          for (let j = 0; j < 32; j++) {
            arr[i][j] = Math.floor(wsPointData[i * 32 + j]);
          }
        }
        // console.log(arr)
        setData(arr);
      }
    };
    ws.onerror = (e) => {
      // an error occurred
    };
    ws.onclose = (e) => {
      // connection closed
    };
  }, [flag]);
  return (
    <>
      <div>
        {data.map((a, indexs) => {
          return (
            <div style={{ display: "flex" }}>
              {a.map((b, index) => {
                return <div style={{ width: "30px", backgroundColor: `rgb(${jet1(0, 40, b)})`, border: '1px solid', textAlign: 'center' }}>{b}</div>;
              })}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: "50px" }}>{max}</div>
      <div style={{ fontSize: "30px" }}>{maxCol}</div>

      <Slider
        min={1}
        max={10000}
        onChange={(value) => {
          localStorage.setItem("carValuePress", value);
          setValuePress(value);
          pressValue = value;
        }}
        value={valuePress}
        step={5}
        // value={this.props.}
        style={{ width: "200px" }}
      />
      <div style={{ display: "flex" }}>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          value={objArea}
          onChange={(e) => {
            setArea(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            const res = !flag;
            setFlag(res);
            colFalg = !colFalg;
          }}
        >
          采集{length - 1}
        </Button>
        <Button
          onClick={() => {
            const length = wsPointData.filter((a) => a > 0).length;
            const total = wsPointData.reduce((a, b) => a + b, 0);
            const area = (total / length).toFixed(2);
            const arr = [...wsPointData].filter(a => a > 0)
            let resarr = [...arr]
            let res
            if ([...resarr].length == 3) {
              res = resarr
            } else {
              res = resarr.filter((a) => a > resarr.reduce((a, b) => a + b, 0) / resarr.length)
            }
            // collection.push([JSON.stringify(wsPointData), area, name, eval(name), objArea, eval(objArea)]);
            console.log(collection)
            collection.push([res[0], res[1], res[2], collection.length >= 3 ? res[0] - collection[collection.length - 1][0] : null, collection.length >= 3 ? res[1] - collection[collection.length - 1][1] : null, collection.length >= 3 ? res[2] - collection[collection.length - 1][2] : null]);
            localStorage.setItem("collection", JSON.stringify(collection));
            setCsvData(collection);
            setLength(collection.length);
          }}
        >
          单次采集{length - 1}
        </Button>
        <Button
          onClick={() => {
            // const res = !flag
            // setFlag(res)
            collection = [["data", "name"]];
            localStorage.setItem("collection", JSON.stringify(collection));
            setLength(1);
          }}
        >
          删除
        </Button>
        <CSVLink
          // ref={downloadRef}

          filename={`${new Date().getTime()}.csv`}
          data={csvData}
          style={{ color: "#5A5A89", textDecoration: "none" }}
        >
          下载
        </CSVLink>
      </div>
    </>
  );
}
