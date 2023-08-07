import React, { useEffect, useState } from 'react'
import { findMax } from '../../assets/util/util'
import { calculateY, carBackLine, press } from '../../assets/util/line'
let data = []

let ws

export default function Demo() {
    const [data, setData] = useState([])
    const [max, setMax] = useState(0)
    const [maxCol, setMaxCol] = useState(0)
    const [press , setPress] = useState(false)
    const [pressNum , setPressNum] = useState(false)
    const [pressuse , setPressuse] = useState(false)
    const [total , setTotal] = useState(false)
    const [length , setLength] = useState(false)
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


                // wsPointData = newArr

                if (press) {
                    wsPointData = press(wsPointData, 64, 32)
                }
                if (pressNum) {
                    wsPointData = calculateY(wsPointData)
                }

                let colArr = [], rowArr = []
                for (let i = 0; i < 32; i++) {
                    let coltotal = 0, rowtotal = 0
                    for (let j = 0; j < 64; j++) {
                        coltotal += wsPointData[j * 32 + i]
                        // rowtotal += wsPointData[i * 64 + j]
                    }
                    colArr.push(coltotal)
                    // rowArr.push(rowtotal)
                }

                for (let i = 0; i < 64; i++) {
                    let coltotal = 0, rowtotal = 0
                    for (let j = 0; j < 32; j++) {
                        // coltotal += wsPointData[j * 32 + i]
                        rowtotal += wsPointData[i * 32 + j]
                    }
                    // colArr.push(coltotal)
                    rowArr.push(rowtotal)
                }

                let max = findMax(wsPointData)
                let maxIndex = wsPointData.indexOf(max)
                let colNum = maxIndex % 32
                let colTotalNum = colArr[colNum]
                setMax(max)
                setMaxCol(colTotalNum)

                const total = wsPointData.reduce((a,b) => a+b , 0)
                const length = wsPointData.filter((a,index) => a>0).length
                setTotal(total)
                setLegnth(length)
                setPressuse(
                     (total / length).toFixed(2)
                )

                let arr = []
                for (let i = 0; i < 32; i++) {
                    arr[i] = []
                    for (let j = 0; j < 64; j++) {
                        arr[i][j] = wsPointData[i * 64 + j]
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
                        <div key={indexs} style={{ display: 'flex' }}>{a.map((b, index) => {
                            return <div key={index} style={{ width: '30px' }}>{b}</div>
                        })}</div>
                    )
                })
            }</div>
            <div style={{ fontSize: '30px' }}>{max}</div>
            <div style={{ fontSize: '30px' }}>{maxCol}</div>
            <div style={{ fontSize: '30px' }}>压力总和:{total}</div>
            <div style={{ fontSize: '30px' }}>压力面积:{length}</div>
            <div style={{ fontSize: '30px' }}>压强:{pressuse}</div>
            <div style={{ position: 'fixed', bottom: '20px', color: '#000' }}>
          <div style={{ border: '1px solid #01F1E3' }} onClick={() => {
            const press1 = press
            this.setState({
              press: !press1
            })

          }}
          >{press ? '分压' : '不分压'}</div>
          <div style={{ border: '1px solid #01F1E3' }}
            onClick={() => {
              const pressNum1 = pressNum
              this.setState({
                pressNum: !pressNum1
              })

            }}
          >{pressNum ? '压力算法' : '不压力算法'}</div>
        </div>
        </>
    )
}
