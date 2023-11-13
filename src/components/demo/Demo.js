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
    const data = [0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,15,13,0,0,0,27,32,25,25,23,18,19,0,0,0,27,32,25,25,23,18,19,0,0,0,18,30,27,27,26,24,0,0,0,0,0,14,11,11,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,0,11,0,0,0,0,0,0,12,12,25,31,30,39,0,0,19,12,18,18,24,27,41,20,0,0,20,0,11,11,16,17,24,20,0,0,20,0,11,11,16,17,24,20,0,0,0,0,0,0,0,11,0,0,0,0,11,15,20,20,18,14,12,20,0,0,19,14,16,16,13,13,13,0,0,0,20,13,21,21,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    const newData= []
    for(let i = 0 ; i < 10 ; i ++ ){
        newData[i] = []
        for(let j= 0 ; j < 32 ;j++){
            newData[i].push(data[j*10 + i])
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
        for (let i = 0; i < 10; i++) {
          arr[i] = [];
          for (let j = 0; j < 10; j++) {
            arr[i][j] = wsPointData[i * 10 + j];
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
