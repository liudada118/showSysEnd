import React, { useEffect, useState } from 'react'
import { findMax } from '../../assets/util/util'
import { carBackLine } from '../../assets/util/line'
let data = []

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
let ws

export default function Demo() {
    const [data, setData] = useState([])
    const [max, setMax] = useState(0)
    const [maxCol, setMaxCol] = useState(0)
    useEffect(() => {
        ws = new WebSocket(" ws://localhost:19999");
        ws.onopen = () => {
            // connection opened
            console.info("connect success");
        };
        ws.onmessage = (e) => {
            let jsonObject = JSON.parse(e.data);
            //处理空数组

            if (jsonObject.sitData != null) {
                let wsPointData = jsonObject.sitData;
                
                wsPointData = wsPointData.map((a) => a < 10 ? 0 : a)
                let a = wsPointData.splice(0, 1 * 32)
                let b = wsPointData.splice(0, 15 * 32)
                wsPointData = a.concat(wsPointData, b)

                let newArr = []
                for (let i = 0; i < 32; i++) {
                    for (let j = 0; j < 1; j++) {
                        newArr[i * 32 + j] = (wsPointData[(i * 32 + j)])
                    }
                }
                for (let i = 0; i < 32; i++) {
                    for (let j = 16; j < 32; j++) {
                        newArr[i * 32 + j] = (wsPointData[(i * 32 + j - 15)])
                    }
                }
                for (let i = 0; i < 32; i++) {
                    for (let j = 1; j < 16; j++) {
                        newArr[i * 32 + j] = (wsPointData[(i * 32 + 16 + j)])
                    }
                }

                wsPointData = newArr
                let colArr = [], rowArr = []
                for (let i = 0; i < 32; i++) {
                    let coltotal = 0, rowtotal = 0
                    for (let j = 0; j < 32; j++) {
                        coltotal += wsPointData[j * 32 + i]
                        rowtotal += wsPointData[i * 32 + j]
                    }
                    colArr.push(coltotal)
                    rowArr.push(rowtotal)
                }

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



                // let colArr = []
                // for (let i = 0; i < 32; i++) {
                //     let total = 0
                //     for (let j = 0; j < 32; j++) {
                //         total += wsPointData[j * 32 + i]
                //     }
                //     colArr.push(total)
                // }

                let max = findMax(wsPointData)
                let maxIndex = wsPointData.indexOf(max)
                let colNum = maxIndex % 32
                let colTotalNum = colArr[colNum]
                setMax(max)
                setMaxCol(colTotalNum)

                // for (let i = 0; i < 32; i++) {
                //     for (let j = 0; j < 32; j++) {
                //         wsPointData[j*32 + i] = parseInt((wsPointData[j*32 + i] /(1245 - colArr[i] ==0 ? 1 : 1245 - colArr[i]))*1000 )
                //     }
                // }



                let arr = []
                for (let i = 0; i < 32; i++) {
                    arr[i] = []
                    for (let j = 0; j < 32; j++) {
                        arr[i][j] = wsPointData[i * 32 + j]
                    }
                }
                // console.log(arr) 
                setData(arr)
            }
        };
        ws.onerror = (e) => {
            // an error occurred
        };
        ws.onclose = (e) => {
            // connection closed
        };
    }, [])
    return (
        <>
            <div>{
                data.map((a, indexs) => {
                    return (
                        <div style={{ display: 'flex' }}>{a.map((b, index) => {
                            return <div style={{ width: '30px' }}>{b}</div>
                        })}</div>
                    )
                })
            }</div>
            <div style={{ fontSize: '30px' }}>{max}</div>
            <div style={{ fontSize: '30px' }}>{maxCol}</div>
        </>
    )
}
