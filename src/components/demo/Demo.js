import React, { useEffect, useState } from "react";
import { findMax } from "../../assets/util/util";
import { carBackLine, pressNew } from "../../assets/util/line";
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
    const data = [0,0,28,0,0,0,0,33,38,34,34,25,28,38,30,42,29,51,49,65,53,46,60,56,25,49,33,29,51,50,49,54,23,38,49,37,52,39,48,50,52,38,40,48,45,56,40,41,30,44,32,31,33,22,29,46,30,26,0,0,0,22,20,0,0,0,22,0,0,0,21,38,39,32,33,25,28,38,35,40,38,59,57,64,54,42,43,59,25,32,50,28,48,49,55,46,38,51,58,35,35,39,61,41,41,44,48,45,37,62,41,50,33,47,55,31,33,29,31,46,28,36,0,0,24,20,21,25,0,0,20,0,0,0,21,34,34,32,33,37,29,33,41,40,38,77,46,48,43,43,46,57,23,40,54,43,50,55,51,56,39,37,53,45,48,46,47,42,41,37,43,45,38,53,59,51,36,43,41,33,31,28,35,37,33,36,0,0,21,25,0,26,0,27,31,0,0,0,0,42,35,27,28,27,32,46,38,33,38,72,56,47,43,44,59,47,25,34,32,52,49,70,54,37,34,37,53,47,52,42,43,41,44,48,45,37,41,48,50,54,34,49,33,33,40,36,27,46,35,30,0,0,32,28,21,25,0,21,35,0,0,0,0,36,31,36,37,41,37,36,34,40,50,63,53,50,46,47,49,33,25,28,37,43,46,49,60,36,40,45,35,44,46,33,48,41,48,52,53,46,40,49,54,46,40,45,33,35,40,32,28,48,43,43,0,0,0,25,24,0,0,21,31,0,0,0,24,28,25,45,46,32,33,31,35,39,51,51,64,41,39,56,42,47,24,47,31,41,45,49,53,30,39,55,35,63,39,39,45,47,59,44,40,48,47,56,58,44,34,39,33,33,33,31,28,52,32,33,20,0,0,23,0,22,0,23,26,23,0,0,34,30,26,37,37,36,37,26,40,50,37,43,40,60,60,51,35,40,37,42,37,58,33,61,52,37,44,46,45,53,51,36,47,34,53,49,39,57,41,54,48,54,30,32,28,28,31,40,36,41,40,32,20,0,0,27,20,20,0,22,30,0,0,0,30,27,30,36,37,28,41,29,37,55,27,34,47,69,48,40,36,42,35,58,34,49,28,48,65,51,50,57,44,41,41,39,50,40,35,47,43,38,37,57,46,42,28,43,39,28,36,31,29,40,42,30,0,0,0,39,32,0,0,24,21,0,0,0,30,40,28,41,41,32,38,36,33,45,24,33,36,60,45,42,50,35,32,47,31,45,39,43,67,56,48,49,47,33,40,40,39,35,32,54,53,39,50,45,47,47,37,42,39,35,34,33,38,30,43,31,22,0,0,30,25,0,0,0,21,0,0,0,42,42,22,42,43,35,37,31,31,45,25,38,41,65,45,35,45,39,40,53,35,46,37,49,55,47,39,40,42,49,44,32,44,33,37,60,42,48,46,48,41,52,43,37,42,35,32,33,30,34,40,33,28,0,0,34,20,0,0,27,0,20,0,0,54,43,20,42,43,26,33,45,31,36,32,31,34,70,37,38,45,31,45,42,38,47,36,55,57,36,28,40,36,55,43,29,50,34,37,43,47,39,52,50,41,55,38,50,37,34,35,39,32,38,38,29,22,0,0,26,23,23,0,22,0,30,0,0,41,37,0,43,44,25,39,36,28,41,22,35,48,51,40,33,41,34,41,46,33,52,22,56,68,36,32,40,49,38,42,39,38,42,35,49,48,37,53,57,53,58,42,43,36,39,31,43,34,29,39,33,0,0,0,35,23,22,0,31,25,37,0,0,39,30,0,36,37,24,32,32,34,47,28,48,39,43,39,34,37,32,41,29,42,57,34,66,54,36,40,42,44,24,46,44,33,49,36,53,47,35,55,50,45,63,43,40,37,43,29,41,35,33,36,31,21,0,0,23,26,25,0,28,28,26,0,0,51,35,0,32,32,29,28,37,32,43,29,33,44,34,29,35,38,40,33,29,46,54,39,69,51,40,41,44,57,30,44,42,50,43,43,42,58,44,48,45,40,49,32,37,43,35,37,41,34,37,41,34,22,0,0,0,0,0,0,0,25,27,0,0,42,34,21,27,27,24,33,27,38,40,23,31,45,29,41,36,34,35,37,40,50,53,42,63,57,37,48,62,36,32,53,44,41,47,43,43,49,52,62,40,30,43,31,39,44,35,35,43,34,34,30,28,0,0,0,0,0,23,0,0,0,29,0,0,31,30,22,22,23,27,40,30,26,43,32,27,38,32,35,52,46,46,37,41,60,40,45,64,65,43,60,52,45,39,53,37,57,44,36,45,44,42,42,42,31,48,32,44,43,42,40,38,31,35,26,31,23,0,0,23,26,0,0,0,26,20,0,0,30,28,29,36,37,28,32,34,35,41,21,34,38,44,49,47,50,44,36,52,40,29,51,74,47,39,57,58,42,30,43,34,50,42,41,58,48,41,39,44,42,46,31,47,46,49,35,36,31,28,30,22,24,0,0,0,23,21,0,23,0,20,0,0,35,36,34,36,37,30,33,30,36,38,0,26,38,38,36,37,39,41,44,51,37,30,37,85,53,42,55,37,35,27,48,27,54,60,39,44,48,42,54,41,44,45,34,39,49,46,46,53,39,36,27,27,30,0,0,0,26,0,0,22,20,0,0,0,47,34,28,32,32,32,35,30,40,41,30,26,34,37,30,37,45,52,46,46,40,24,34,85,47,37,36,34,30,31,45,41,49,45,41,53,48,45,58,42,42,48,37,44,44,42,37,49,51,41,31,32,24,0,0,0,27,24,0,0,21,0,0,0,46,36,23,29,29,40,34,35,35,40,27,0,35,33,31,50,49,45,50,46,47,30,38,66,51,39,26,40,29,44,30,37,55,53,38,69,50,50,58,50,40,45,42,50,41,38,36,47,44,34,35,27,35,0,0,0,22,24,0,21,21,27,0,0,43,34,25,32,33,33,31,27,41,38,30,0,36,35,36,38,58,50,50,44,46,31,50,57,46,42,26,49,40,36,36,44,50,53,50,59,47,47,42,48,41,54,45,42,49,35,38,39,33,32,29,30,26,0,0,0,32,22,0,22,24,26,0,0,36,36,20,30,31,32,29,34,39,36,35,22,41,51,42,40,56,54,40,53,39,28,48,54,48,35,27,61,40,31,61,51,50,49,41,55,42,40,45,41,42,45,36,42,39,32,39,36,35,35,29,30,39,0,0,25,30,0,0,0,30,33,0,0,36,36,24,31,32,32,26,46,40,28,29,20,44,40,41,48,43,40,50,40,41,41,26,49,59,43,34,54,34,20,50,41,58,55,48,60,47,53,46,48,44,61,33,37,49,32,40,29,34,28,32,27,31,0,0,21,24,0,0,0,24,20,0,0,25,36,31,32,33,36,28,37,37,28,26,21,41,51,40,59,43,45,48,43,40,38,24,52,62,49,38,43,40,24,55,44,55,47,46,48,44,40,46,52,50,57,37,45,46,32,51,33,32,32,36,23,26,0,0,0,21,0,0,23,27,0,0,0,31,44,40,26,27,34,24,37,39,31,35,27,34,42,32,57,49,39,60,49,42,44,30,48,59,35,53,61,50,34,46,36,55,56,44,41,49,51,45,43,33,42,36,44,45,39,42,35,27,28,32,22,23,0,0,0,22,29,0,0,21,0,0,0,34,48,31,27,28,28,28,28,44,38,47,27,39,46,38,47,45,42,53,47,39,49,0,46,52,30,40,45,46,29,51,39,54,39,47,48,48,60,46,40,41,39,40,45,39,76,88,43,32,27,29,24,22,0,0,0,0,25,0,0,21,0,0,0,27,47,27,25,27,26,24,30,42,37,49,26,40,35,45,55,47,39,51,54,52,42,36,47,46,29,31,40,41,43,54,40,47,42,42,43,43,34,47,42,40,39,41,39,37,112,109,79,20,25,38,27,26,0,0,0,23,21,0,24,28,20,0,0,28,44,27,29,29,36,33,39,31,44,49,28,51,44,37,55,41,41,48,43,54,39,37,59,41,32,25,43,44,41,37,39,49,51,43,44,52,38,45,44,41,47,30,37,40,110,141,71,20,28,26,22,0,0,0,0,20,22,0,0,29,0,0,0,30,33,28,28,29,31,29,49,30,39,39,29,46,41,37,48,39,45,52,45,50,42,37,46,49,29,39,54,37,42,33,33,49,44,43,44,42,46,39,49,42,46,37,47,42,78,57,60,27,30,40,24,0,0,0,0,24,21,0,22,22,0,0,0,0,29,25,40,41,26,37,46,32,34,36,38,41,38,47,50,42,54,56,49,62,37,36,40,44,38,50,36,42,23,38,29,53,47,39,41,56,41,50,39,41,42,35,50,42,39,39,43,32,40,32,0,0,0,20,0,0,22,0,0,25,23,0,0,0,29,28,37,37,31,41,33,28,40,36,28,37,32,38,44,42,57,52,47,48,41,38,40,35,35,39,41,42,22,32,24,46,49,52,40,52,38,58,42,52,41,39,36,38,33,36,43,37,37,24,0,0,0,21,0,21,22,0,24,35,34,27,0,0,0,34,38,39,45,35,0,0,21,0,0,0,20,22,24,24,27,28,25,40,28,21,53,38,41,38,46,37,24,33,39,54,43,43,53,41,32,38,49,34,29,28,35,38,31,40,30,33,32,0,0,0,24,25,25,20,0]
    const newData= []
    for(let i = 0 ; i < 64 ; i ++ ){
        newData[i] = []
        for(let j= 0 ; j < 32 ;j++){
            newData[i].push(data[i*32 + j])
        }
    }
    setData(newData)
    ws = new WebSocket(" ws://localhost:19998");
    ws.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws.onmessage = (e) => {
      let jsonObject = JSON.parse(e.data);
      //处理空数组

      if (jsonObject.sitData != null) {
        wsPointData = jsonObject.sitData;

        wsPointData = wsPointData.map((a) => (a < 5 ? 0 : a));

        if (colFalg) {
          collection.push([[...wsPointData], name]);
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
        const point = wsPointData.filter((a, index) => a > 5).length;
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
            arr[i][j] = wsPointData[i * 32 + j];
          }
        }
        // console.log(arr)
        setData(arr);
      }

      if (jsonObject.backData != null) {
        wsPointData = jsonObject.backData;
        console.log(eval(objArea) , eval)
        wsPointData = wsPointData.map((a) => (a < 10 ? 0 : a));
        const length = wsPointData.filter((a) => a > 0).length;
        const total = wsPointData.reduce((a, b) => a + b, 0);
        const area = (total / length).toFixed(2);
        if (colFalg) {
          collection.push([JSON.stringify(wsPointData), area, name , eval(name), objArea , eval(objArea)]);
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
            arr[i][j] = wsPointData[i * 32 + j];
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
                return <div style={{ width: "30px" }}>{b}</div>;
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
            collection.push([JSON.stringify(wsPointData), area, name ,eval(name), objArea , eval(objArea)]);
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
