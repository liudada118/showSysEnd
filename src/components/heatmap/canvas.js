import React, { useEffect, useState, useImperativeHandle } from 'react'
import { addSide, gaussBlur_1, interp } from '../../assets/util/util'
// import { Intensity } from '../../assets/util/heatmap'

var data = []
var options = {
    min: 0,
    max: localStorage.getItem('carValuej') ? JSON.parse(localStorage.getItem('carValuej')) : 200,
    size: 24
}
var isShadow = true
var canvas, context,
valueg1 = localStorage.getItem('carValueg') ? JSON.parse(localStorage.getItem('carValueg')) : 2,
valuef1 = localStorage.getItem('carValuef') ? JSON.parse(localStorage.getItem('carValuef')) : 2,
valuelInit1 = localStorage.getItem('carValueInit') ? JSON.parse(localStorage.getItem('carValueInit')) : 2,
valuel1 = localStorage.getItem('carValuel') ? JSON.parse(localStorage.getItem('carValuel')) : 2
const sitnum1 = 32;
const sitnum2 = 32;
const sitInterp = 2;
const sitOrder = 4;

const AMOUNTX = sitnum1 * sitInterp + sitOrder * 2;
const AMOUNTY = sitnum2 * sitInterp + sitOrder * 2;

let bigArr = new Array(sitnum1 * sitInterp * sitnum2 * sitInterp).fill(1);
let bigArrg = new Array(
    (sitnum1 * sitInterp + sitOrder * 2) *
    (sitnum2 * sitInterp + sitOrder * 2)
).fill(1),
    bigArrgnew = new Array(
        (sitnum1 * sitInterp + sitOrder * 2) *
        (sitnum2 * sitInterp + sitOrder * 2)
    ).fill(1),
    smoothBig = new Array(
        (sitnum1 * sitInterp + sitOrder * 2) *
        (sitnum2 * sitInterp + sitOrder * 2)
    ).fill(1);

export const Heatmap = React.forwardRef((porps, refs) => {

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 生成随机数据
    function generateData(arr) {
        // const resData = [0, 1, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 6, 4, 4, 9, 3, 1, 1, 1, 2, 2, 1, 1, 1, 1, 0, 2, 1, 1, 1, 2, 1, 2, 2, 2, 2, 1, 3, 1, 2, 2, 8, 16, 18, 20, 14, 29, 15, 3, 1, 3, 3, 1, 1, 2, 3, 1, 1, 2, 2, 1, 2, 3, 2, 2, 2, 2, 2, 2, 4, 2, 3, 4, 16, 14, 28, 23, 16, 13, 18, 5, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 3, 2, 3, 5, 15, 17, 24, 18, 27, 15, 41, 12, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 3, 10, 11, 11, 14, 16, 11, 35, 8, 2, 3, 6, 2, 2, 2, 2, 2, 1, 2, 2, 1, 1, 3, 2, 2, 2, 2, 1, 2, 4, 2, 4, 17, 19, 18, 17, 15, 17, 17, 16, 3, 11, 12, 10, 11, 3, 3, 5, 6, 1, 3, 3, 3, 2, 3, 3, 2, 3, 2, 2, 2, 4, 4, 5, 20, 10, 13, 18, 19, 20, 18, 20, 3, 13, 21, 23, 36, 21, 11, 6, 5, 4, 6, 5, 5, 5, 6, 5, 6, 4, 5, 5, 6, 10, 13, 12, 16, 16, 17, 20, 17, 18, 8, 10, 4, 24, 39, 48, 47, 23, 18, 14, 6, 5, 11, 6, 7, 6, 8, 7, 8, 6, 6, 8, 9, 14, 12, 15, 24, 20, 21, 15, 18, 22, 18, 9, 2, 19, 18, 16, 11, 13, 13, 12, 8, 3, 5, 4, 3, 3, 4, 4, 4, 4, 4, 4, 6, 9, 7, 11, 11, 12, 14, 11, 9, 10, 8, 6, 1, 55, 39, 32, 31, 15, 16, 17, 17, 14, 10, 14, 8, 8, 10, 8, 14, 9, 10, 12, 15, 17, 18, 22, 19, 18, 29, 27, 20, 22, 13, 7, 1, 21, 51, 42, 34, 22, 23, 27, 23, 15, 18, 14, 11, 10, 13, 10, 12, 14, 17, 20, 20, 26, 18, 25, 24, 23, 27, 19, 20, 26, 13, 9, 3, 23, 25, 24, 37, 26, 32, 30, 21, 16, 19, 23, 31, 20, 26, 20, 18, 20, 24, 27, 30, 34, 40, 46, 39, 21, 23, 22, 29, 19, 19, 6, 2, 13, 29, 30, 33, 34, 37, 30, 28, 21, 32, 32, 35, 25, 29, 26, 21, 26, 25, 25, 32, 34, 34, 38, 34, 28, 41, 32, 28, 31, 14, 8, 3, 6, 20, 30, 18, 27, 24, 31, 27, 25, 24, 36, 35, 38, 39, 31, 34, 32, 28, 32, 37, 34, 44, 39, 35, 34, 23, 22, 27, 22, 10, 6, 3, 7, 13, 29, 28, 30, 28, 29, 29, 29, 30, 33, 32, 36, 52, 45, 39, 35, 33, 45, 40, 41, 31, 45, 34, 44, 30, 30, 27, 30, 13, 7, 3, 7, 15, 25, 34, 51, 40, 45, 38, 35, 31, 38, 46, 51, 65, 50, 51, 51, 42, 45, 38, 67, 31, 43, 35, 33, 27, 23, 26, 23, 10, 11, 4, 6, 12, 15, 18, 28, 41, 32, 44, 26, 39, 48, 48, 58, 66, 51, 49, 48, 45, 48, 42, 51, 28, 39, 38, 32, 23, 23, 26, 19, 9, 6, 4, 6, 13, 20, 16, 41, 34, 29, 37, 25, 36, 38, 41, 52, 52, 49, 42, 41, 48, 47, 40, 44, 32, 40, 37, 28, 21, 25, 23, 18, 9, 6, 3, 6, 12, 14, 15, 28, 35, 32, 35, 33, 32, 39, 35, 55, 45, 42, 45, 45, 61, 46, 62, 46, 34, 36, 35, 27, 31, 19, 18, 17, 8, 5, 4, 5, 9, 12, 12, 33, 29, 32, 24, 25, 32, 34, 35, 39, 37, 36, 45, 44, 53, 33, 56, 37, 28, 31, 30, 26, 19, 20, 16, 13, 7, 8, 11, 3, 7, 9, 9, 20, 25, 31, 30, 28, 31, 32, 27, 27, 26, 31, 37, 42, 37, 46, 30, 30, 19, 26, 21, 19, 18, 15, 12, 10, 4, 4, 3, 3, 6, 7, 8, 19, 20, 26, 27, 25, 30, 24, 31, 20, 26, 26, 38, 34, 29, 30, 21, 27, 23, 25, 24, 15, 10, 14, 10, 9, 4, 3, 3, 2, 4, 5, 6, 9, 20, 24, 22, 23, 22, 18, 28, 14, 19, 18, 21, 27, 18, 19, 12, 15, 10, 13, 10, 8, 7, 7, 6, 6, 3, 3, 12, 0, 1, 2, 2, 2, 3, 4, 11, 4, 7, 7, 13, 7, 8, 7, 10, 13, 8, 6, 5, 6, 3, 3, 3, 3, 2, 2, 2, 2, 0, 1, 1, 0, 2, 3, 2, 3, 3, 5, 10, 12, 16, 11, 16, 10, 7, 8, 10, 9, 7, 6, 6, 6, 3, 4, 3, 4, 3, 3, 3, 2, 1, 1, 1, 0, 1, 1, 1, 2, 3, 4, 3, 2, 22, 12, 10, 8, 6, 7, 9, 5, 4, 3, 4, 5, 2, 3, 3, 3, 2, 1, 2, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, 10, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 3, 2, 3, 0, 7, 4, 1, 1, 4, 1, 1, 5, 2, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 7, 4, 1, 0]

        const newArr = [...arr].map((a, index) => a > valuef1 ? a : 0)
        let resArr
        const newArrTotal = newArr.reduce((a, b) => a + b, 0)
        if(newArrTotal < valuelInit1){
            resArr = new Array(1024).fill(0)
        }else{
            resArr = newArr
        }

        interp(resArr, bigArr, sitnum1, sitInterp);
        // console.log(first)
        let bigArrs = addSide(
            bigArr,
            sitnum2 * sitInterp,
            sitnum1 * sitInterp,
            sitOrder,
            sitOrder
        );

        gaussBlur_1(
            bigArrs,
            bigArrg,
            sitnum2 * sitInterp + sitOrder * 2,
            sitnum1 * sitInterp + sitOrder * 2,
            valueg1
        );

        for (let ix = 0, l = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
              const value = bigArrg[l] * 10;
              //柔化处理smooth
              smoothBig[l] = smoothBig[l] + (value - smoothBig[l] + 0.5) / valuel1;

              let obj = {}
              obj.x = ix * canvas.width / AMOUNTX
              obj.y = iy * canvas.height / AMOUNTY
              obj.value = smoothBig[ix * AMOUNTY + iy]
              data.push(obj)

              l++;
            }
          }



        data = []
        const count = 72
        // console.log(arr.length)
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                let obj = {}
                obj.x = i * canvas.width / count
                obj.y = j * canvas.height / count
                obj.value = bigArrg[i * count + j]
                data.push(obj)
            }

        }
    }

    // 构造一个离屏canvas
    function Canvas(width, height) {
        let canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        return canvas
    }

    // 画圆
    function createCircle(size) {
        let shadowBlur = size / 2
        let r2 = size + shadowBlur
        let offsetDistance = 10000

        let circle = new Canvas(r2 * 2, r2 * 2)
        let context = circle.getContext('2d')

        if (isShadow) context.shadowBlur = shadowBlur;
        context.shadowColor = 'black'
        context.shadowOffsetX = context.shadowOffsetY = offsetDistance

        context.beginPath()
        context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true)
        context.closePath()
        context.fill()
        return circle
    }

    function draw(context, data) {
        let circle = createCircle(options.size)
        let circleHalfWidth = circle.width / 2
        let circleHalfHeight = circle.height / 2

        // 按透明度分类
        let dataOrderByAlpha = {}
        data.forEach((item, index) => {
            let alpha = Math.min(1, item.value / options.max).toFixed(2)
            dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || []
            dataOrderByAlpha[alpha].push(item)
        })

        // 绘制不同透明度的圆形
        for (let i in dataOrderByAlpha) {
            if (isNaN(i)) continue;
            let _data = dataOrderByAlpha[i]
            context.beginPath()
            context.globalAlpha = i
            _data.forEach(item => {
                context.drawImage(circle, item.x - circleHalfWidth, item.y - circleHalfHeight)
            })
        }
        // 圆形着色
        let intensity = new Intensity()
        let colored = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
        colorize(colored.data, intensity.getImageData())

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillStyle = '#666'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        // console.log(colored)
        context.putImageData(colored, 0, 0)
    }

    function colorize(pixels, gradient) {

        // console.log(gradient)

        var max = options.max;
        var min = options.min;
        var diff = max - min;
        var range = options.range || null;

        var jMin = 0;
        var jMax = 1024;
        if (range && range.length === 2) {
            jMin = (range[0] - min) / diff * 1024;
        }

        if (range && range.length === 2) {
            jMax = (range[1] - min) / diff * 1024;
        }

        var maxOpacity = options.maxOpacity || 10;
        var range = options.range;
        // console.log(pixels.length)
        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i]*4; // get gradient color from opacity value

            if (pixels[i] / 256 > maxOpacity) {
                pixels[i] = 256 * maxOpacity;
            }
            if (pixels[i] / 256 < 0.7) {
                pixels[i] = 256 * 0.7;
            }
            const value = jet()
            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            } else {
                pixels[i] = 0;
            }
            // pixels[i] = 256 *0
        }
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
        var rgba = new Array();
        rgba[0] = 255 * red;
        rgba[1] = 255 * g;
        rgba[2] = 255 * blue;
        rgba[3] = 1;
        return rgba;
    }


    function bthClickHandle(arr) {
        generateData(arr)
        let context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)
        isShadow = true
        draw(context, data)
        isShadow = false
    }

    function sitValue(prop) {
        const { valuej, valueg, value, valuel, valuef, valuelInit } = prop;
        if (valuej) options.max = valuej;
        if (valueg) valueg1 = valueg;
        // if (value) value1 = value;
        if (valuel) valuel1 = valuel;
        if (valuef) valuef1 = valuef;
        if (valuelInit) valuelInit1 = valuelInit;
    }

    window.onload = function () {
        // bthClickHandle()
    }

    function Intensity(options) {

        options = options || {};
        this.gradient = options.gradient || {
            0: "rgba(0, 0, 0, 1)",
            // 0: "rgba(255, 255, 255, 1)",
            0.05: "rgba(90, 0, 255, 1)",
            0.28: "rgba(0, 0, 255, 1)",
            0.42: "rgba(0, 255, 255, 1)",
            0.56: "rgba(0, 128, 0, 1)",
            0.70: "rgba(255, 255, 0, 1)",
            0.84 : "rgba(255, 165, 0, 1)",
            1: "rgba(255, 0, 0, 1)"
        };
        this.maxSize = options.maxSize || 35;
        this.minSize = options.minSize || 0;
        this.max = options.max || 100;
        this.min = options.min || 0;
        this.initPalette();
    }

    Intensity.prototype.setMax = function (value) {
        this.max = value || 100;
    }

    Intensity.prototype.setMin = function (value) {
        this.min = value || 0;
    }

    Intensity.prototype.setMaxSize = function (maxSize) {
        this.maxSize = maxSize || 35;
    }

    Intensity.prototype.setMinSize = function (minSize) {
        this.minSize = minSize || 0;
    }

    Intensity.prototype.initPalette = function () {

        var gradient = this.gradient;

        var canvas = new Canvas(256, 1);

        var paletteCtx = this.paletteCtx = canvas.getContext('2d', { willReadFrequently: true });

        var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);

        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }

        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, 256, 1);

    }

    // Intensity.prototype.getColor = function (value) {

    //     var imageData = this.getImageData(value);

    //     return "rgba(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ", " + imageData[3] / 256 + ")";

    // }

    Intensity.prototype.getImageData = function (value) {
        // console.log(this.paletteCtx.getImageData(0, 0, 256, 1).data)
        var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

        if (value === undefined) {
            return imageData;
        }

        var max = this.max;
        var min = this.min;

        if (value > max) {
            value = max;
        }

        if (value < min) {
            value = min;
        }

        var index = Math.floor((value - min) / (max - min) * (256 - 1));

        return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
    }

    /**
     * @param Number value 
     * @param Number max of value
     * @param Number max of size
     * @param Object other options
     */
    Intensity.prototype.getSize = function (value) {

        var size = 0;
        var max = this.max;
        var min = this.min;
        var maxSize = this.maxSize;
        var minSize = this.minSize;

        if (value > max) {
            value = max;
        }

        if (value < min) {
            value = min;
        }

        size = minSize + (value - min) / (max - min) * (maxSize - minSize);

        return size;

    }

    Intensity.prototype.getLegend = function (options) {
        var gradient = this.gradient;


        var width = options.width || 20;
        var height = options.height || 180;

        var canvas = new Canvas(width, height);

        var paletteCtx = canvas.getContext('2d');

        var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);

        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }

        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, width, height);

        return canvas;
    }



    const drawContent = () => { }

    useImperativeHandle(refs, () => ({
        // sitData  
        bthClickHandle,
        sitValue
    }));



    useEffect(() => {


        canvas = document.getElementById('heatmapcanvas')
        canvas.width = window.innerHeight *0.8
        canvas.height = window.innerHeight *0.8
        context = canvas.getContext('2d')


        // const ws = new WebSocket(" ws://localhost:19999");
        // ws.onopen = () => {
        //     // connection opened
        //     console.info("connect success");
        // };
        // ws.onmessage = (e) => {
        //     let jsonObject = JSON.parse(e.data);
        //     //处理空数组

        //     if (jsonObject.sitData != null) {
        //         // sitData(jsonObject.sitData)
        //         if (jsonObject.sitData.length === 1024) {
        //             bthClickHandle(jsonObject.sitData)
        //         }
        //     }
        // };
        // ws.onerror = (e) => {
        //     // an error occurred
        // };
        // ws.onclose = (e) => {
        //     // connection closed
        // };

    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas id="heatmapcanvas"></canvas>
        </div>

    );
})