import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
// import { SelectionBox } from 'three/addons/interactive/SelectionBox.js';
// import { SelectionHelper } from 'three/addons/interactive/SelectionHelper.js';
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { TextureLoader } from "three";
import { checkRectIndex, checkRectangleIntersection, getPointCoordinate, getPointCoordinateback } from "./threeUtil1";
import { SelectionHelper } from './SelectionHelper.js';
import {
  addSide,
  gaussBlur_1,
  interp1016,
  jet,
  jetWhite2,
  jetgGrey,
} from "../../assets/util/util";
import './index.scss'

const group = new THREE.Group();
const sitInit = 0;
const backInit = 0;
var newDiv
var animationRequestId
const sitnum1 = 64;
const sitnum2 = 32;
const sitInterp = 2;
const sitOrder = 4;
const backnum1 = 16;
const backnum2 = 32;
const backInterp = 2;
const backOrder = 4;
let controlsFlag = true;
var ndata = new Array(backnum1 * backnum2).fill(0), newData = new Array(backnum1 * backnum2).fill(0), newData1 = new Array(sitnum1 * sitnum2).fill(0), ndata1 = new Array(sitnum1 * sitnum2).fill(0) , centerFlag = true;

var valuej1 = localStorage.getItem('carValuej') ? JSON.parse(localStorage.getItem('carValuej')) : 200,
  valueg1 = localStorage.getItem('carValueg') ? JSON.parse(localStorage.getItem('carValueg')) : 2,
  value1 = localStorage.getItem('carValue') ? JSON.parse(localStorage.getItem('carValue')) : 2,
  valuel1 = localStorage.getItem('carValuel') ? JSON.parse(localStorage.getItem('carValuel')) : 2,
  valuef1 = localStorage.getItem('carValuef') ? JSON.parse(localStorage.getItem('carValuef')) : 2,
  valuej2 = localStorage.getItem('carValuej') ? JSON.parse(localStorage.getItem('carValuej')) : 200,
  valueg2 = localStorage.getItem('carValueg') ? JSON.parse(localStorage.getItem('carValueg')) : 2,
  value2 = localStorage.getItem('carValue') ? JSON.parse(localStorage.getItem('carValue')) : 2,
  valuel2 = localStorage.getItem('carValuel') ? JSON.parse(localStorage.getItem('carValuel')) : 2,
  valuef2 = localStorage.getItem('carValuef') ? JSON.parse(localStorage.getItem('carValuef')) : 2,
  valuelInit1 = localStorage.getItem('carValueInit') ? JSON.parse(localStorage.getItem('carValueInit')) : 2,
  valuelInit2 = localStorage.getItem('carValueInit') ? JSON.parse(localStorage.getItem('carValueInit')) : 2;
let enableControls = true;
let isShiftPressed = false;


const Canvas = React.forwardRef((props, refs) => {

  var newDiv, newDiv1, selectStartArr = [], selectEndArr = [], sitArr, backArr, sitMatrix = [], backMatrix = [], selectMatrix = [], selectHelper, cooArr = [0, 0]
  let sitIndexArr = [], backIndexArr = []
  let dataFlag = false;
  const changeDataFlag = () => {
    dataFlag = true;

  };
  let particles,
    particles1,
    particlesPoint,
    material,
    backGeometry,
    sitGeometry,

    bigArr1 = new Array(backnum1 * backInterp * backnum2 * backInterp).fill(1),
    bigArrg1 = new Array(
      (backnum1 * backInterp + 2 * backOrder) *
      (backnum2 * backInterp + 2 * backOrder)
    ).fill(1),
    bigArrg1new = new Array(
      (backnum1 * backInterp + 2 * backOrder) *
      (backnum2 * backInterp + 2 * backOrder)
    ).fill(1),
    smoothBig1 = new Array(
      (backnum1 * backInterp + 2 * backOrder) *
      (backnum2 * backInterp + 2 * backOrder)
    ).fill(1),
    ndata1Num,
    ndataNum;

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
  let i = 0;
  let ws,
    wsPointData,
    ws1


  let container, stats;

  let camera, scene, renderer;
  let controls;
  let cube, chair, mixer, clips;
  const clock = new THREE.Clock();
  const ALT_KEY = 18;
  const CTRL_KEY = 17;
  const CMD_KEY = 91;
  const AMOUNTX = sitnum1 * sitInterp + sitOrder * 2;
  const AMOUNTY = sitnum2 * sitInterp + sitOrder * 2;
  const AMOUNTX1 = backnum1 * backInterp + backOrder * 2;
  const AMOUNTY1 = backnum2 * backInterp + backOrder * 2;
  const SEPARATION = 100;
  let group = new THREE.Group();

  let positions1;
  let colors1, scales1;
  let positions;
  let colors, scales;

  function init() {
    container = document.getElementById(`canvas`);
    // camera

    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      150000
    );


    camera.position.z = 10;
    camera.position.y = 200;
    // camera.position.z = 1;
    // camera.position.y = 50;
    // camera.position.x = 100;

    // scene



    scene = new THREE.Scene();

    // model
    const loader = new GLTFLoader();
    // points  座椅

    initSet();

    initPoint();
    // scene.add(group);
    // group.rotation.x = Math.PI / 3
    group.position.x = 3  
    group.position.y = 110
    group.position.z = 5
    scene.add(group);
    const helper = new THREE.GridHelper(2000, 100);
    helper.position.y = -199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    // lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 10);
    scene.add(dirLight);
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(0, 10, 200);
    scene.add(dirLight1);

    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outputEncoding = THREE.sRGBEncoding;
    if (container.childNodes.length == 0) {
      container.appendChild(renderer.domElement);
    }

    renderer.setClearColor(0x000000);

    //FlyControls
    controls = new TrackballControls(camera, renderer.domElement);
    controls.dynamicDampingFactor = 0.2;
    controls.domElement = container;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
      MIDDLE: THREE.MOUSE.ZOOM,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.keys = [
      ALT_KEY, // orbit
      CTRL_KEY, // zoom
      CMD_KEY, // pan
    ];

    window.addEventListener("resize", onWindowResize);

    renderer.domElement.addEventListener(
      "click",
      () => {

      },
      false
    );


    selectHelper = new SelectionHelper(renderer, controls, 'selectBox');

    document.addEventListener('pointerdown', pointDown);

    document.addEventListener('pointermove', pointMove);

    document.addEventListener('pointerup', pointUp);



  }

  function pointDown(event) {
    if (selectHelper.isShiftPressed) {
      sitIndexArr = []
      backIndexArr = []
      props.changeSelect({ sit: sitIndexArr, back: backIndexArr })
      selectStartArr = [(event.clientX), event.clientY]


      // group.position.x = -10
      // group.position.y = 110
      // group.position.z =5 


      sitArr = getPointCoordinate({ particles, camera, position: { x: -10, y: 110, z: 5 } })
      backArr = getPointCoordinateback({ particles: particles1, camera, position: { x: -10, y: 110, z: 5 }, width: AMOUNTX1 })

      sitMatrix = [sitArr[0].x, sitArr[0].y, sitArr[1].x, sitArr[1].y]
      backMatrix = [backArr[1].x, backArr[0].y, backArr[0].x, backArr[1].y]


      // const newDiv = document.createElement('div');

      // newDiv.classList.add('my-class');
      // // 设置 <div> 的属性、内容或样式
      // newDiv.style.backgroundColor = 'lightblue';
      // // newDiv.style.padding = '10px';
      // newDiv.style.width = `${100}px`
      // newDiv.style.height = `${100}px`
      // // newDiv.style.left = `${viewportPosition.x}px`
      // // newDiv.style.top = `${viewportPosition.y}px`
      // // newDiv.style.left = `${vector.x}px`
      // // newDiv.style.top = `${vector.y}px`
      // newDiv.style.left = `${backMatrix[2]}px`
      // newDiv.style.top = `${backMatrix[3]}px`

      // // 将 <div> 元素添加到页面中的某个元素中
      // document.body?.appendChild(newDiv);

    }
  }

  function pointMove(event) {
    if (selectHelper.isShiftPressed) {


      selectEndArr = [(event.clientX), event.clientY,]



      selectMatrix = [...selectStartArr, ...selectEndArr]

      if (selectStartArr[0] > selectEndArr[0]) {
        // selectMatrix = [...selectEndArr , ...selectStartArr]
        selectMatrix[0] = selectEndArr[0]
        selectMatrix[2] = selectStartArr[0]
      } else {
        selectMatrix[0] = selectStartArr[0]
        selectMatrix[2] = selectEndArr[0]
      }

      if (selectStartArr[1] > selectEndArr[1]) {
        selectMatrix[1] = selectEndArr[1]
        selectMatrix[3] = selectStartArr[1]
      } else {
        selectMatrix[1] = selectStartArr[1]
        selectMatrix[3] = selectEndArr[1]
      }


      if (!controlsFlag) {
        const sitInterArr = checkRectangleIntersection(selectMatrix, sitMatrix)
        const backInterArr = checkRectangleIntersection(selectMatrix, backMatrix)

        if (sitInterArr) sitIndexArr = checkRectIndex(sitMatrix, sitInterArr, AMOUNTX, AMOUNTY)
        if (backInterArr) backIndexArr = checkRectIndex(backMatrix, backInterArr, AMOUNTX1, AMOUNTY1)

        props.changeSelect({ sit: sitIndexArr, back: backIndexArr })
      }

    }
  }

  function pointUp(event) {
    if (selectHelper.isShiftPressed) {
      selectStartArr = []
      selectEndArr = []
    }
  }

  //   初始化座椅
  function initSet() {
    // const AMOUNTX = 1
    // const AMOUNTY = 1
    const numParticles = AMOUNTX * AMOUNTY;
    positions = new Float32Array(numParticles * 3);
    scales = new Float32Array(numParticles);
    colors = new Float32Array(numParticles * 3);
    let i = 0,
      j = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2 + ix * 20; // x
        positions[i + 1] = 0; // y
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

        scales[j] = 1;
        colors[i] = 0 / 255;
        colors[i + 1] = 0 / 255;
        colors[i + 2] = 255 / 255;
        i += 3;
        j++;
      }
    }

    sitGeometry = new THREE.BufferGeometry();
    sitGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    function getTexture() {
      return new TextureLoader().load("");
    }
    // require("../../assets/images/circle.png")
    const spite = new THREE.TextureLoader().load("./circle.png");
    material = new THREE.PointsMaterial({
      vertexColors: true,
      transparent: true,
      //   color: 0xffffff,
      map: spite,
      size: 1,
    });
    sitGeometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    sitGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particles = new THREE.Points(sitGeometry, material);

    particles.scale.x = 0.0062;
    particles.scale.y = 0.0062;
    particles.scale.z = 0.0062;
    // particles.rotation.x = Math.PI / 3

    // particles.rotation.x = Math.PI / 4;
    // particles.rotation.y = 0; //-Math.PI / 2;
    // particles.rotation.y = Math.PI 
    // particles.rotation.z = Math.PI
    // scene.add(particles);
    group.add(particles);


    // 
    // const position = particles.geometry.attributes.position;

    // const screenCoordinates = [];
    // const dataArr = [0, 2879]
    // for (let i = 0; i < dataArr.length; i++) {
    //   const vertex = new THREE.Vector3();
    //   vertex.fromBufferAttribute(position, dataArr[i]); // 获取顶点的世界坐标
    //   const geometry = new THREE.BufferGeometry();
    //   const vertices = new Float32Array([vertex.x, vertex.y, vertex.z])
    //   const colors = new Float32Array([1, 0, 0])
    //   console.log(vertices, 'vertices')
    //   geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    //   geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    //   const point = new THREE.Points(geometry, material);

    //   group.add(point);
    //   point.scale.x = 0.0062;
    //   point.scale.y = 0.0062;
    //   point.scale.z = 0.0062;
    //   point.position.x = -15
    //   point.position.y = -1000
    //   point.position.z = 230

    //   const vector = new THREE.Vector3();
    //   var widthHalf = 0.5 * window.innerWidth;  //此处应使用画布长和宽
    //   var heightHalf = 0.5 * window.innerHeight;

    //   point.updateMatrixWorld(); // 函数updateMatrix()和updateMatrixWorld(force)将根据position，rotation或quaternion，scale参数更新matrix和matrixWorld。updateMatrixWorld还会更新所有后代元素的matrixWorld，如果force值为真则调用者本身的matrixWorldNeedsUpdate值为真。

    //   //getPositionFromMatrix()方法已经删除,使用setFromMatrixPosition()替换, setFromMatrixPosition方法将返回从矩阵中的元素得到的新的向量值的向量
    //   vector.setFromMatrixPosition(point.matrixWorld);

    //   //projectOnVector方法在将当前三维向量(x,y,z)投影一个向量到另一个向量,参数vector(x,y,z). 
    //   vector.project(camera);

    //   vector.x = (vector.x * widthHalf) + widthHalf;
    //   vector.y = -(vector.y * heightHalf) + heightHalf;
    //   console.log(vector.x, vector.y,)
    // }
    // console.log(group)
  }
  // 初始化靠背
 

  function initPoint() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const spite = new THREE.TextureLoader().load("./circle.png");
    const material = new THREE.MeshBasicMaterial({ color: 0x991BFA,map: spite,transparent: true, });
    particlesPoint = new THREE.Mesh(geometry, material);

    particlesPoint.rotation.x = -Math.PI / 2
    particlesPoint.position.y = 10

    particlesPoint.position.x = -10 + 48
    particlesPoint.position.z = -19 + 38.5
    group.add(particlesPoint);

  }
  //

  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;

    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  //模型动画

  function animate() {
    animationRequestId = requestAnimationFrame(animate);
    const date = new Date().getTime();

    render();
  }


  //  更新靠背数据
 

  //  更新座椅数据
  function sitRenew() {

    ndata1 = [...newData1].map((a, index) => (a - valuef1 < 0 ? 0 : a));

    ndata1Num = ndata1.reduce((a, b) => a + b, 0);
    if (ndata1Num < valuelInit1) {
      ndata1 = new Array(sitnum1 * sitnum2).fill(0);
    } else {
      ndata1 = [...newData1]
    }

    interp1016(ndata1, bigArr, sitnum1, sitnum2, sitInterp);
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

    let k = 0,
      l = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const value = bigArrg[l] * 10;

        //柔化处理smooth
        smoothBig[l] = smoothBig[l] + (value - smoothBig[l] + 0.5) / valuel1;

        positions[k] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
        positions[k + 1] = smoothBig[l] / value1; // y
        positions[k + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
        let rgb

        if (sitIndexArr && !sitIndexArr.every((a) => a == 0)) {

          if (ix >= sitIndexArr[0] && ix < sitIndexArr[1] && iy >= sitIndexArr[2] && iy < sitIndexArr[3]) {
            // rgb = [255, 0, 0];
            rgb = jet(0, valuej2, smoothBig[l]);
            // scales1[l] = 2;
            // positions1[k + 1] = smoothBig[l] / value2 - 1000
          } else {
            rgb = jetgGrey(0, valuej2, smoothBig[l]);
            // scales1[l] = 1;
          }
        } else {
          rgb = jet(0, valuej2, smoothBig[l]);
          // scales1[l] = 1;
        }

        colors[k] = rgb[0] / 255;
        colors[k + 1] = rgb[1] / 255;
        colors[k + 2] = rgb[2] / 255;

        k += 3;
        l++;
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;

    sitGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    sitGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }

  function render() {
    // particlesPoint.position.x = -10 + 48
    // particlesPoint.position.z = -19 + 38.5
    if (particlesPoint) {
      particlesPoint.position.x = -10 + (48) * cooArr[0] / 32
      particlesPoint.position.z = -19 + (38.5) * cooArr[1] / 32
    }
    if(centerFlag){
      particlesPoint.visible = false
    }else{
      particlesPoint.visible = true
    }


    sitRenew();
    if (controlsFlag) {
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      controls.keys = [
        ALT_KEY, // orbit
        CTRL_KEY, // zoom
        CMD_KEY, // pan
      ];
      controls.update();
    } else if (!controlsFlag) {
      // console.log('111')
      controls.keys = [];
      controls.mouseButtons = [];
    }

    renderer.render(scene, camera);
  }

  //   靠背数据
  function backData(prop) {
    const {
      wsPointData: wsPointData,
    } = prop;
    newData = wsPointData

    // 修改线序 坐垫
    
  }
  function backValue(prop) {
    const { valuej, valueg, value, valuel, valuef, valuelInit } = prop;
    if (valuej) valuej2 = valuej;
    if (valueg) valueg2 = valueg;
    if (value) value2 = value;
    if (valuel) valuel2 = valuel;
    if (valuef) valuef2 = valuef;

    if (valuelInit) valuelInit2 = valuelInit;
    

  }
  // 座椅数据
  function sitValue(prop) {

    const { valuej, valueg, value, valuel, valuef, valuelInit } = prop;
    if (valuej) valuej1 = valuej;
    if (valueg) valueg1 = valueg;
    if (value) value1 = value;
    if (valuel) valuel1 = valuel;
    if (valuef) valuef1 = valuef;
    if (valuelInit) valuelInit1 = valuelInit;


  }
  function sitData(prop) {


    const {
      wsPointData: wsPointData,
      arr
    } = prop;
    if (arr) cooArr = arr
    newData1 = wsPointData;

    

  }

  function changeGroupRotate(obj) {

    if (typeof obj.x === 'number') {
      group.rotation.x = -( (obj.x) * 6) / 12
    }
    if (typeof obj.z === 'number') {
      group.rotation.z = (obj.z) * 6 / 12
    }
  }

  function changeCenterFlag(value){
    centerFlag = value
  }

  function changeSelectFlag(value) {
    controlsFlag = value
    selectHelper.isShiftPressed = !value
  }

  function reset() {

    camera.position.z = 300;
    camera.position.y = 200;
    camera.position.x = 0;
    camera.rotation._x = 0;
    camera.rotation._y = 0;
    camera.rotation._z = 0;

    // camera = new THREE.PerspectiveCamera(
    //   40,
    //   window.innerWidth / window.innerHeight,
    //   1,
    //   150000
    // );


    // camera.position.z = 300;
    // camera.position.y = 200;

    // camera.position.set(0,200,300)

    // renderer.render(scene, camera);

    group.rotation.x = -(Math.PI * 2) / 12
    group.rotation.y = 0
    group.position.x = -15
    group.position.y = 150
    group.position.z = 230
  }

  useImperativeHandle(refs, () => ({
    backData: backData,
    sitData: sitData,
    changeDataFlag: changeDataFlag,
    sitValue,
    
    sitRenew,
    changeGroupRotate,
    reset,
    changeSelectFlag,
    changeCenterFlag
    // actionAll: actionAll,
    // actionSit: actionSit,
    // actionBack: actionBack,
  }));
  //   视图数据

  function onKeyDown(event) {
    if (event.key === 'Shift') {
      // enableControls = false;
      // isShiftPressed = true;

      controls.mouseButtons = null
      controls.keys = null
    }
  }

  // 按键放开事件处理函数
  function onKeyUp(event) {
    if (event.key === 'Shift') {
      // enableControls = true;
      // isShiftPressed = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      };
      controls.keys = [
        ALT_KEY, // orbit
        CTRL_KEY, // zoom
        CMD_KEY, // pan
      ];
    }
  }





  const changeValue = (obj) => { };
  useEffect(() => {
    // 靠垫数据

    init();
    // window.addEventListener("mousemove", () => {}, false);
    animate();


    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      cancelAnimationFrame(animationRequestId);
      document.removeEventListener('pointerdown', pointDown)
      document.removeEventListener('pointermove', pointMove)
      document.removeEventListener('pointup', pointUp)
      selectHelper.dispose()
    };
  }, []);
  return (
    <div>
      <div
      
        id={`canvas`}
      ></div>
    </div>
  );
});
export default Canvas;
