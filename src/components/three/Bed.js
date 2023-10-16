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
  findMax
} from "../../assets/util/util";

import './index.scss'

const group = new THREE.Group();
const sitInit = 0;
const backInit = 0;
var newDiv, smoothValue = 0
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
var ndata = new Array(backnum1 * backnum2).fill(0), newData = new Array(backnum1 * backnum2).fill(0), newData1 = new Array(sitnum1 * sitnum2).fill(0), ndata1 = new Array(sitnum1 * sitnum2).fill(0), centerFlag = true;

var valuej1 = localStorage.getItem('carValuej') ? JSON.parse(localStorage.getItem('carValuej')) : 200,
  valueg1 = localStorage.getItem('carValueg') ? JSON.parse(localStorage.getItem('carValueg')) : 2,
  value1 = localStorage.getItem('carValue') ? JSON.parse(localStorage.getItem('carValue')) : 2,
  valuel1 = localStorage.getItem('carValuel') ? JSON.parse(localStorage.getItem('carValuel')) : 2,
  valuef1 = localStorage.getItem('carValuef') ? JSON.parse(localStorage.getItem('carValuef')) : 2,
  ymax1 = localStorage.getItem('ymax') ? JSON.parse(localStorage.getItem('ymax')) : 200,
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
    ).fill(0),
    bigArrg1new = new Array(
      (backnum1 * backInterp + 2 * backOrder) *
      (backnum2 * backInterp + 2 * backOrder)
    ).fill(0),
    smoothBig1 = new Array(
      (backnum1 * backInterp + 2 * backOrder) *
      (backnum2 * backInterp + 2 * backOrder)
    ).fill(0),
    ndata1Num,
    ndataNum;

  let bigArr = new Array(sitnum1 * sitInterp * sitnum2 * sitInterp).fill(1);
  let bigArrg = new Array(
    (sitnum1 * sitInterp + sitOrder * 2) *
    (sitnum2 * sitInterp + sitOrder * 2)
  ).fill(0),
    bigArrgnew = new Array(
      (sitnum1 * sitInterp + sitOrder * 2) *
      (sitnum2 * sitInterp + sitOrder * 2)
    ).fill(0),
    smoothBig = new Array(
      (sitnum1 * sitInterp + sitOrder * 2) *
      (sitnum2 * sitInterp + sitOrder * 2)
    ).fill(0);
  let i = 0;
  let ws,
    wsPointData,
    ws1

  let bodyArr
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
      selectStartArr = []
      selectEndArr = []
      sitIndexArr = []
      backIndexArr = []

      selectStartArr = [(event.clientX), event.clientY]


      // group.position.x = -10
      // group.position.y = 110
      // group.position.z =5


      sitArr = getPointCoordinate({ particles, camera, position: { x: group.position.x, y: group.position.y, z: group.position.z } })
      // backArr = getPointCoordinateback({ particles: particles1, camera, position: { x: -10, y: 110, z: 5 }, width: AMOUNTX1 })

      sitMatrix = [sitArr[0].x, sitArr[0].y, sitArr[1].x, sitArr[1].y]
      // backMatrix = [backArr[1].x, backArr[0].y, backArr[0].x, backArr[1].y]


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


      // if (!controlsFlag && selectHelper.isDown) {
      //   const sitInterArr = checkRectangleIntersection(selectMatrix, sitMatrix)
      //   // const backInterArr = checkRectangleIntersection(selectMatrix, backMatrix)

      //   if (sitInterArr) sitIndexArr = checkRectIndex(sitMatrix, sitInterArr, AMOUNTX, AMOUNTY)
      //   console.log(sitIndexArr)
      //   // if (backInterArr) backIndexArr = checkRectIndex(backMatrix, backInterArr, AMOUNTX1, AMOUNTY1)
      //   props.changeSelect({ sit: sitIndexArr,
      //     //  back: backIndexArr
      //     })
      // }

    }
  }

  function pointUp(event) {
    console.log('up')
    const sitInterArr = checkRectangleIntersection(selectMatrix, sitMatrix)
    // const backInterArr = checkRectangleIntersection(selectMatrix, backMatrix)

    if (sitInterArr) sitIndexArr = checkRectIndex(sitMatrix, sitInterArr, AMOUNTX, AMOUNTY)
    console.log(sitIndexArr)
    // if (backInterArr) backIndexArr = checkRectIndex(backMatrix, backInterArr, AMOUNTX1, AMOUNTY1)
    props.changeSelect({
      sit: [...sitIndexArr],
      //  back: backIndexArr
    })
    // if (selectHelper.isShiftPressed) {
    //   selectStartArr = []
    //   selectEndArr = []
    // }
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
    const material = new THREE.MeshBasicMaterial({ color: 0x991BFA, map: spite, transparent: true, });
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

    const realArr = []
    for (let i = 0; i < 64; i++) {
      let num = 0
      for (let j = 0; j < 32; j++) {
        num += ndata1[j * 64 + i]
      }
      smoothValue = smoothValue + (num / 32 - smoothValue) / 3
      realArr.push(smoothValue)
    }

    props.handleChartsBody1(realArr, ymax1 / 2)

    ndata1Num = ndata1.reduce((a, b) => a + b, 0);
    if (ndata1Num < valuelInit1) {
      ndata1 = new Array(sitnum1 * sitnum2).fill(0);
    }

    // ndata1 = [0,0,0,0,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,20,30,29,50,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,36,32,40,30,59,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,54,34,36,41,26,39,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,62,53,50,42,25,26,0,0,0,0,0,0,0,0,0,27,30,0,24,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,71,43,39,45,22,20,0,0,0,0,0,0,0,27,21,31,36,23,40,25,0,0,0,0,0,0,0,0,0,0,21,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,54,40,37,40,33,36,0,0,0,0,0,0,28,38,31,24,51,34,38,36,25,21,0,0,0,0,0,0,28,0,32,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,0,0,0,0,0,22,36,48,38,41,58,36,50,0,29,30,21,25,22,41,57,40,26,55,46,28,31,35,29,25,21,0,0,0,0,0,0,23,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,39,36,49,35,43,50,50,29,26,26,23,27,39,33,46,47,33,51,54,37,31,40,29,40,22,0,22,0,0,0,0,34,49,23,25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,34,42,38,50,50,43,27,33,34,22,31,37,34,45,38,46,57,59,38,44,35,25,22,30,21,20,0,0,0,0,60,76,53,33,26,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,33,47,50,46,55,43,40,31,31,22,34,43,39,57,40,58,44,43,36,32,28,28,22,0,0,24,0,20,0,0,66,101,58,25,43,36,37,33,23,0,21,29,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34,30,39,40,40,54,45,34,28,29,26,42,48,39,47,38,48,54,43,35,32,32,22,20,0,0,28,0,20,33,0,71,96,78,28,46,46,39,31,31,0,40,45,61,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,35,52,37,42,51,40,38,30,31,21,40,32,44,46,36,51,41,47,64,32,26,25,27,0,20,0,0,23,0,0,67,111,75,25,40,45,38,29,21,22,50,62,65,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,33,46,36,41,40,36,44,35,37,28,36,38,36,49,37,35,48,53,47,50,26,26,0,0,20,0,0,0,0,0,74,75,62,0,37,41,41,0,0,20,53,64,62,0,0,0,0,0,0,0,0,0,0,23,0,0,0,0,0,0,0,0,27,27,40,42,41,42,38,36,44,36,37,26,29,46,37,54,36,38,51,65,57,41,28,23,0,0,0,0,0,0,0,0,64,67,56,0,0,0,22,0,0,31,40,73,52,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,23,25,33,40,35,39,43,42,40,46,47,28,40,31,38,51,33,35,53,61,53,47,31,23,0,0,0,0,0,0,0,0,37,37,31,0,0,0,0,0,0,20,33,34,27,0,0,0,0,0,0,0,0,0,0,33,0,0,0,0,0,0,0,0,33,31,38,36,37,39,55,37,25,30,30,27,32,32,30,43,42,45,50,55,43,49,36,33,0,23,0,0,0,0,0,0,50,32,22,0,0,0,0,0,0,0,31,34,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,29,37,34,41,37,47,34,0,27,28,33,27,35,32,38,38,36,54,47,53,59,37,31,35,21,32,0,24,20,0,0,57,51,35,24,23,0,0,0,0,40,59,84,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,40,39,49,32,32,40,29,0,27,28,25,26,25,44,32,34,46,50,52,62,42,54,32,22,26,34,0,26,25,0,0,59,64,42,22,42,37,37,24,0,52,66,84,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29,41,43,36,23,36,28,27,0,0,0,21,0,22,30,34,38,61,57,66,65,36,44,26,21,30,24,0,0,26,0,0,61,65,57,0,69,41,47,43,0,44,65,64,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,48,40,24,25,23,0,0,0,0,0,0,0,23,28,43,54,62,58,55,46,40,33,30,0,21,25,0,22,0,0,58,61,65,0,61,39,67,38,0,22,41,67,44,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,40,35,28,28,0,0,0,0,0,0,0,0,0,21,25,32,51,63,50,55,50,39,31,0,0,22,0,22,0,0,47,70,72,20,44,37,51,27,0,0,0,45,27,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,41,34,29,33,35,26,0,0,0,0,0,0,0,0,0,0,27,42,50,35,45,37,27,26,0,0,0,0,0,0,0,36,69,62,32,24,25,26,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,25,35,30,21,42,39,31,0,0,0,0,0,0,0,0,0,0,27,34,22,30,0,0,0,0,0,0,0,22,0,0,0,26,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,0,0,0,0,0,0,0,20,0,22,51,36,48,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,0,0,0,0,0,0,0,0,0,0,0,0,22,45,37,41,0,0,0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,0,0,0,0,0,0,0,0,0,0,0,0,32,28,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    // ndata1 = [0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29,28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,27,29,48,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,33,28,38,28,54,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,42,57,33,32,37,23,37,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,64,53,48,34,20,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,47,77,45,38,41,0,0,0,0,0,0,0,0,0,0,0,0,27,20,33,0,0,0,0,0,0,0,0,0,0,0,22,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,50,61,42,39,38,28,25,0,0,0,0,0,0,23,33,24,0,47,35,39,35,22,0,0,0,0,0,0,0,24,0,31,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,24,36,54,42,43,57,32,38,22,30,29,0,0,0,33,50,37,0,54,51,30,33,33,21,0,0,0,0,0,0,0,0,23,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,40,39,51,35,42,40,47,30,26,26,20,25,40,30,45,49,33,53,61,42,34,41,23,23,0,0,0,0,0,0,0,33,48,22,25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,34,41,38,49,47,41,28,37,38,21,31,38,33,45,37,46,61,67,43,45,31,22,0,22,0,0,0,0,0,0,60,76,52,33,26,22,0,0,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,32,47,51,47,56,40,39,33,34,24,33,42,42,54,45,60,50,47,37,33,28,23,22,0,0,0,0,0,0,0,65,101,57,25,44,36,40,36,24,0,26,31,38,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35,30,39,41,41,55,43,34,29,30,28,43,49,41,50,41,50,59,45,38,34,30,0,21,0,0,20,0,0,28,0,69,95,78,28,45,45,39,30,32,20,46,46,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,35,52,37,42,52,41,41,32,33,24,41,34,47,48,41,53,46,50,65,31,25,0,23,0,0,0,0,0,0,0,67,110,75,24,39,45,38,29,21,24,50,66,65,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,33,45,37,44,40,39,46,35,36,29,41,41,40,52,45,40,54,56,49,42,23,0,0,0,0,0,0,0,0,0,72,73,63,0,35,41,40,0,0,21,53,64,64,0,0,0,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,0,29,27,39,42,43,44,37,37,44,35,36,30,32,47,41,58,42,45,58,66,57,38,23,0,22,0,0,0,0,0,0,0,60,66,57,0,0,20,22,0,0,34,45,73,53,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,26,32,42,36,39,43,44,41,49,50,29,41,33,38,56,40,37,57,64,53,45,28,0,0,0,0,0,0,0,0,0,33,35,33,0,0,0,0,0,0,21,36,38,28,0,0,0,0,0,0,0,0,0,0,31,0,0,0,0,0,0,0,0,34,33,39,37,37,40,55,39,25,32,33,27,33,31,33,49,49,47,58,57,42,47,32,22,0,0,0,0,0,0,0,0,44,32,22,0,0,0,0,0,0,0,33,35,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,32,39,36,41,36,46,35,0,30,31,31,29,36,34,43,42,41,59,49,52,55,31,21,32,0,29,0,0,0,0,0,53,51,36,24,22,0,0,0,0,39,61,84,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,45,43,51,32,32,36,28,0,27,28,25,25,27,34,33,38,51,53,55,60,38,51,28,0,0,31,0,23,0,0,0,58,64,42,23,40,34,36,26,0,53,68,84,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,47,49,39,24,33,24,27,0,0,0,0,0,24,27,32,39,62,59,68,61,35,42,20,0,0,22,0,0,20,0,0,61,65,56,0,67,39,47,45,0,45,66,63,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,42,55,44,25,22,0,0,0,0,0,0,0,0,0,24,32,50,62,58,55,43,34,27,22,0,0,0,0,0,0,0,57,61,64,0,58,38,67,41,20,23,47,66,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,37,46,39,29,22,0,0,0,0,0,0,0,0,0,0,0,29,50,59,49,46,39,31,28,0,0,0,0,0,0,0,46,69,71,20,41,36,50,34,0,0,22,47,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,38,32,34,32,27,0,0,0,0,0,0,0,0,0,0,22,37,38,29,30,29,0,0,0,0,0,0,0,0,0,34,68,61,32,22,24,30,0,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,38,33,21,39,42,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,21,50,39,55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,43,38,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,27,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    //  ndata1 = [0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29,28,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,27,29,48,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,33,28,38,28,54,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,42,57,33,32,37,23,37,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,64,53,48,34,20,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,47,77,45,38,41,0,0,0,0,0,0,0,0,0,0,0,0,27,20,33,0,0,0,0,0,0,0,0,0,0,0,22,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,50,61,42,39,38,28,25,0,0,0,0,0,0,23,33,24,0,47,35,39,35,22,0,0,0,0,0,0,0,24,0,31,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,24,36,54,42,43,57,32,38,22,30,29,0,0,0,33,50,37,0,54,51,30,33,33,21,0,0,0,0,0,0,0,0,23,23,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,40,39,51,35,42,40,47,30,26,26,20,25,40,30,45,49,33,53,61,42,34,41,23,23,0,0,0,0,0,0,0,33,48,22,25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36,34,41,38,49,47,41,28,37,38,21,31,38,33,45,37,46,61,67,43,45,31,22,0,22,0,0,0,0,0,0,60,76,52,33,26,22,0,0,0,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,32,47,51,47,56,40,39,33,34,24,33,42,42,54,45,60,50,47,37,33,28,23,22,0,0,0,0,0,0,0,65,101,57,25,44,36,40,36,24,0,26,31,38,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35,30,39,41,41,55,43,34,29,30,28,43,49,41,50,41,50,59,45,38,34,30,0,21,0,0,20,0,0,28,0,69,95,78,28,45,45,39,30,32,20,46,46,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,35,52,37,42,52,41,41,32,33,24,41,34,47,48,41,53,46,50,65,31,25,0,23,0,0,0,0,0,0,0,67,110,75,24,39,45,38,29,21,24,50,66,65,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,33,45,37,44,40,39,46,35,36,29,41,41,40,52,45,40,54,56,49,42,23,0,0,0,0,0,0,0,0,0,72,73,63,0,35,41,40,0,0,21,53,64,64,0,0,0,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,0,29,27,39,42,43,44,37,37,44,35,36,30,32,47,41,58,42,45,58,66,57,38,23,0,22,0,0,0,0,0,0,0,60,66,57,0,0,20,22,0,0,34,45,73,53,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23,26,32,42,36,39,43,44,41,49,50,29,41,33,38,56,40,37,57,64,53,45,28,0,0,0,0,0,0,0,0,0,33,35,33,0,0,0,0,0,0,21,36,38,28,0,0,0,0,0,0,0,0,0,0,31,0,0,0,0,0,0,0,0,34,33,39,37,37,40,55,39,25,32,33,27,33,31,33,49,49,47,58,57,42,47,32,22,0,0,0,0,0,0,0,0,44,32,22,0,0,0,0,0,0,0,33,35,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,32,39,36,41,36,46,35,0,30,31,31,29,36,34,43,42,41,59,49,52,55,31,21,32,0,29,0,0,0,0,0,53,51,36,24,22,0,0,0,0,39,61,84,37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,45,43,51,32,32,36,28,0,27,28,25,25,27,34,33,38,51,53,55,60,38,51,28,0,0,31,0,23,0,0,0,58,64,42,23,40,34,36,26,0,53,68,84,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,47,49,39,24,33,24,27,0,0,0,0,0,24,27,32,39,62,59,68,61,35,42,20,0,0,22,0,0,20,0,0,61,65,56,0,67,39,47,45,0,45,66,63,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,42,55,44,25,22,0,0,0,0,0,0,0,0,0,24,32,50,62,58,55,43,34,27,22,0,0,0,0,0,0,0,57,61,64,0,58,38,67,41,20,23,47,66,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,37,46,39,29,22,0,0,0,0,0,0,0,0,0,0,0,29,50,59,49,46,39,31,28,0,0,0,0,0,0,0,46,69,71,20,41,36,50,34,0,0,22,47,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,38,32,34,32,27,0,0,0,0,0,0,0,0,0,0,22,37,38,29,30,29,0,0,0,0,0,0,0,0,0,34,68,61,32,22,24,30,0,0,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,38,33,21,39,42,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,0,21,50,39,55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,43,38,47,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,27,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
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

    bodyArr = []
    // for (let i = 0; i < 64; i++) {
    //   let num = 0
    //   for (let j = 0; j < 32; j++) {
    //     num += ndata1[j * 64 + i]
    //   }
    //   bodyArr.push(parseInt(num / 32))
    // }

    for (let ix = 0; ix < AMOUNTX; ix++) {
      let num = 0
      for (let iy = 0; iy < AMOUNTY; iy++) {
        num += bigArrg[ix * AMOUNTY + iy]
      }
      bodyArr.push(parseInt(num / AMOUNTY))
    }

    props.handleChartsBody(bodyArr, ymax1)


    // for(let i = sitIndexArr[2] ; i < sitIndexArr[3] ; i++){
    //   for(let j = sitIndexArr[0] ; j < sitIndexArr[1] ; j++){
    //     dataArr.push(bigArrg[i*AMOUNTY + j])
    //   }
    // }
    //
    // if(!sitIndexArr.length||sitIndexArr.every((a) => a == 0)){
    //   dataArr = bigArrg
    // }

    // console.log(dataArr)
    let dataArr = []


    let k = 0,
      l = 0;

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const value = bigArrg[l] * 10;

        //柔化处理smooth
        smoothBig[l] = smoothBig[l] + (value - smoothBig[l]) / valuel1;

        positions[k] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
        positions[k + 1] = smoothBig[l] / value1; // y
        positions[k + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
        let rgb

        if (sitIndexArr && !sitIndexArr.every((a) => a == 0)) {

          if (ix >= sitIndexArr[0] && ix < sitIndexArr[1] && iy >= sitIndexArr[2] && iy < sitIndexArr[3]) {
            // rgb = [255, 0, 0];
            rgb = jet(0, valuej1, smoothBig[l]);
            // scales1[l] = 2;
            // positions1[k + 1] = smoothBig[l] / value2 - 1000
            dataArr.push(bigArrg[l])
          } else {
            rgb = jetgGrey(0, valuej1, smoothBig[l]);
            // scales1[l] = 1;
          }
        } else {
          rgb = jet(0, valuej1, smoothBig[l]);
          // scales1[l] = 1;
        }

        colors[k] = rgb[0] / 255;
        colors[k + 1] = rgb[1] / 255;
        colors[k + 2] = rgb[2] / 255;

        k += 3;
        l++;
      }
    }
    if (!sitIndexArr.length || sitIndexArr.every((a) => a == 0)) {
      dataArr = bigArrg
    }

    dataArr = dataArr.filter((a) => a > valuej1 * 0.025)
    const max = findMax(dataArr)
    const point = dataArr.filter((a) => a > 0).length
    const press = dataArr.reduce((a, b) => a + b, 0)
    const mean = press / (point == 0 ? 1 : point)
    console.log(dataArr, press)
    props.data.current?.changeData({
      meanPres: mean.toFixed(2),
      maxPres: max,
      point: point,
      // area: areaSmooth.toFixed(0),
      totalPres: press,
      // pressure: pressureSmooth.toFixed(2),
    });

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
    if (centerFlag) {
      particlesPoint.visible = false
    } else {
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

  function logData() {
    console.log(JSON.stringify(bodyArr))
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

    const { valuej, valueg, value, valuel, valuef, valuelInit, ymax } = prop;
    if (valuej) valuej1 = valuej;
    if (valueg) valueg1 = valueg;
    if (value) value1 = value;
    if (valuel) valuel1 = valuel;
    if (valuef) valuef1 = valuef;
    if (valuelInit) valuelInit1 = valuelInit;
    if (ymax) ymax1 = ymax;

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
      group.rotation.x = -((obj.x) * 6) / 12
    }
    if (typeof obj.z === 'number') {
      group.rotation.z = (obj.z) * 6 / 12
    }
  }

  function changeCenterFlag(value) {
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
    logData,
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
