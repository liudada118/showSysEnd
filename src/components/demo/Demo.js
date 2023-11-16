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
    // const data = [0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,15,13,0,0,0,27,32,25,25,23,18,19,0,0,0,27,32,25,25,23,18,19,0,0,0,18,30,27,27,26,24,0,0,0,0,0,14,11,11,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,0,11,0,0,0,0,0,0,12,12,25,31,30,39,0,0,19,12,18,18,24,27,41,20,0,0,20,0,11,11,16,17,24,20,0,0,20,0,11,11,16,17,24,20,0,0,0,0,0,0,0,11,0,0,0,0,11,15,20,20,18,14,12,20,0,0,19,14,16,16,13,13,13,0,0,0,20,13,21,21,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const data =[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 3, 6, 12, 13, 22, 36, 27, 29, 20, 11, 7, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 4, 8, 7, 14, 23, 24, 31, 39, 38, 30, 23, 19, 12, 10, 5, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 13, 13, 12, 33, 23, 24, 24, 54, 38, 31, 27, 43, 33, 42, 31, 31, 33, 37, 46, 66, 29, 16, 8, 2, 2, 1, 0, 0, 0, 0, 2, 4, 26, 26, 34, 35, 23, 24, 33, 42, 31, 37, 34, 29, 46, 40, 32, 40, 31, 26, 34, 35, 29, 49, 30, 19, 9, 3, 0, 0, 0, 1, 5, 17, 15, 15, 14, 17, 28, 37, 29, 40, 31, 44, 42, 36, 44, 38, 50, 37, 41, 36, 48, 31, 45, 18, 19, 24, 18, 5, 0, 0, 1, 2, 18, 25, 6, 5, 3, 9, 19, 23, 20, 21, 41, 39, 36, 49, 41, 57, 74, 36, 37, 30, 44, 20, 18, 3, 4, 17, 29, 7, 0, 0, 2, 5, 43, 24, 4, 4, 2, 2, 5, 17, 26, 21, 46, 33, 42, 32, 48, 53, 47, 45, 43, 44, 28, 9, 3, 2, 3, 8, 40, 84, 17, 0, 2, 5, 18, 3, 1, 1, 1, 1, 2, 7, 11, 15, 22, 31, 56, 45, 38, 45, 56, 49, 42, 27, 17, 3, 1, 0, 0, 1, 4, 15, 1, 0, 5, 3, 4, 2, 1, 1, 1, 1, 2, 3, 8, 26, 45, 47, 37, 31, 30, 33, 35, 31, 45, 33, 8, 2, 0, 0, 0, 0, 1, 3, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 3, 15, 28, 30, 26, 24, 13, 38, 38, 26, 37, 16, 3, 1, 0, 0, 0, 0, 2, 2, 0, 0, 3, 1, 3, 3, 1, 1, 1, 1, 1, 2, 9, 13, 37, 22, 22, 12, 6, 24, 18, 30, 19, 29, 10, 3, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 3, 10, 23, 20, 23, 21, 35, 31, 42, 23, 29, 17, 32, 18, 5, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 2, 3, 21, 22, 45, 22, 21, 30, 41, 30, 16, 22, 36, 35, 35, 17, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 0, 1, 2, 6, 31, 50, 36, 31, 39, 51, 69, 51, 26, 23, 26, 31, 28, 15, 4, 1, 0, 0, 0, 1, 2, 0, 0, 1, 0, 1, 2, 3, 4, 16, 23, 43, 63, 32, 54, 50, 31, 42, 44, 42, 47, 43, 52, 47, 31, 45, 29, 3, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 2, 2, 11, 77, 47, 45, 30, 33, 41, 46, 52, 28, 24, 30, 57, 50, 32, 40, 53, 36, 5, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 2, 3, 12, 35, 75, 32, 49, 38, 47, 61, 35, 28, 53, 31, 34, 28, 32, 37, 26, 41, 13, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2, 16, 46, 34, 58, 50, 40, 31, 45, 36, 26, 43, 53, 40, 32, 44, 44, 42, 22, 3, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 2, 2, 16, 25, 62, 45, 56, 51, 29, 23, 18, 6, 14, 33, 34, 56, 35, 48, 31, 24, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 14, 21, 36, 26, 44, 24, 7, 5, 3, 1, 1, 2, 7, 23, 25, 26, 20, 28, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 2, 21, 22, 14, 18, 31, 11, 3, 1, 1, 0, 1, 1, 2, 18, 16, 12, 22, 18, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 11, 26, 17, 32, 27, 6, 1, 1, 0, 0, 0, 0, 1, 10, 14, 12, 13, 11, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 9, 27, 29, 16, 6, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 17, 16, 9, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 12, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 15, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 3, 2, 1, 1, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 26, 25, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 20, 10, 4, 1, 0, 0, 0, 0, 1, 2, 7, 19, 69, 69, 9, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 10, 53, 62, 45, 22, 6, 2, 0, 0, 3, 18, 85, 93, 115, 115, 16, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 32, 76, 92, 119, 104, 36, 7, 0, 0, 5, 45, 108, 118, 139, 139, 19, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 22, 66, 79, 141, 121, 62, 13, 0, 1]
    const newData= []
    for(let i = 0 ; i < 32 ; i ++ ){
        newData[i] = []
        for(let j= 0 ; j < 32 ;j++){
            newData[i].push(data[j*32 + i])
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

        wsPointData = wsPointData.map((a) => (a < 5 ? 0 : a));

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
