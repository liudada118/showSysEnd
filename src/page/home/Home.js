import React from "react";
import Title from "../../components/title/Title";
import "./index.scss";
import CanvasCar from "../../components/three/carnewTest copy";
import Car10 from "../../components/three/car10";
import Canvas from "../../components/three/Three";
import CanvasHand from "../../components/three/hand";
import Bed from "../../components/three/Bed";
import SmallBed from "../../components/three/smallBed";
import SmallM from "../../components/three/smallM";
import SmallRect from "../../components/three/smallRect";
import SmallShort from "../../components/three/Short";
import Sit10 from "../../components/three/sit10";
import Aside from "../../components/aside/Aside";
import ProgressCom from "../../components/progress/Progress";
import plus from "../../assets/images/Plus.png";
import minus from "../../assets/images/Minus.png";
import load from "../../assets/images/load.png";

import refresh from "../../assets/images/refresh.png";
import { findMax, findMin, initValue, rotate180, rotate90 } from "../../assets/util/util";
import { rainbowTextColors } from "../../assets/util/color";
import {
  footLine,
  press,
  calculateY,
  rotateArrayCounter90Degrees,
  calculatePressure,
  objChange,
  arr10to5,
} from "../../assets/util/line";
import { Input, Popover, message } from "antd";
import { SelectOutlined } from "@ant-design/icons";
import { Num } from "../../components/num/Num";
import { calFoot } from "../../assets/util/value";
import { Heatmap } from "../../components/heatmap/canvas";
import FootTrack from "../../components/footTrack/footTrack";
import {
  backTypeEvent,
  carFitting,
  mmghToPress,
  pointToN,
  sitTypeEvent,
  totalToN,
} from "./util";
let controlFlag = true;
const controlArr = [
  { name: "座椅向前", info: "座椅向前" },
  { name: "靠背向后", info: "靠背向后" },
  { name: "靠背向前", info: "靠背向前" },
  { name: "靠背气囊充气", info: "靠背气囊充气" },
  { name: "靠背气囊放气", info: "靠背气囊放气" },
  { name: "坐垫向下移动", info: "坐垫向下移动腿部气囊放气" },
  { name: "腿部气囊放气", info: "坐垫向下移动腿部气囊放气" },
  { name: "坐垫向上移动", info: "坐垫向上移动腿部气囊充气" },
  { name: "腿部气囊充气", info: "坐垫向上移动腿部气囊充气" },
  { name: "侧翼右侧气囊充气", info: "侧翼右侧气囊充气" },
  { name: "侧翼左侧气囊充气", info: "侧翼左侧气囊充气" },
  { name: "侧翼右侧气囊放气", info: "侧翼右侧气囊放气" },
  { name: "侧翼左侧气囊放气", info: "侧翼左侧气囊放气" },
];

let collection = JSON.parse(localStorage.getItem("collection"))
  ? JSON.parse(localStorage.getItem("collection"))
  : [["hunch", "front", "flank", "标签", "座椅", "靠背"]];

let ws,
  ws1,
  wsControl,
  xvalue = localStorage.getItem('bedx') ? Number(localStorage.getItem('bedx')) : 0,
  zvalue = localStorage.getItem('bedz') ? Number(localStorage.getItem('bedz')) : 0,
  sitIndexArr = new Array(4).fill(0),
  backIndexArr = new Array(4).fill(0),
  sitPress = 0,
  backPress = 0,
  ctx,
  ctxCircle;
let backTotal = 0,
  backMean = 0,
  backMax = 0,
  backMin = 0,
  backPoint = 0,
  backArea = 0,
  sitTotal = 0,
  sitMean = 0,
  sitMax = 0,
  sitMin = 0,
  sitPoint = 0,
  sitArea = 0,
  clearFlag = false,
  lastArr = [];

class Com extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  render() {
    return <>{this.props.children}</>;
  }
}

class CanvasCom extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.matrixName != nextProps.matrixName;
  }
  render() {
    return <>{this.props.children}</>;
  }
}

let totalArr = [],
  totalPointArr = [],
  wsMatrixName = "foot";
let startPressure = 0,
  time = 0;
let num = 0,
  wsPointDataSit = [],
  wsPointDataBack = [],
  colValueFlag = false,
  meanSmooth = 0,
  maxSmooth = 0,
  pointSmooth = 0,
  areaSmooth = 0,
  pressSmooth = 0,
  pressureSmooth = 0,
  sitDataFlag = false,
  arrSmooth = [16, 16],
  totalSmooth = 0,
  leftValueSmooth = 0,
  leftPropSmooth = 0,
  rightValueSmooth = 0,
  rightPropSmooth = 0,
  leftTopPropSmooth = 0,
  rightTopPropSmooth = 0,
  leftBottomPropSmooth = 0,
  rightBottomPropSmooth = 0,
  canvasWidth = 300;

const text = "旋转";
const text2 = "框选";

const content = (
  <div>
    <p>绕x轴旋转30°</p>
  </div>
);

const content1 = (
  <div>
    <p>绕y轴旋转30°</p>
  </div>
);

const content2 = (
  <div>
    <p>框选一个矩形区域</p>
  </div>
);

const content3 = (
  <div>
    <p>刷新轨迹图</p>
  </div>
);

const content4 = (
  <div>
    <p>下载轨迹图</p>
  </div>
);
let ctxbig,
  ctxsit,
  ctxback,
  ctxbig1,
  oneFlag = false;
let timer;
const thrott = (fun) => {
  if (!timer) {
    timer = setTimeout(() => {
      fun();
      timer = null;
    }, 1000);
  }
};

let timer1;
const thrott1 = (fun) => {
  if (!timer1) {
    timer1 = setTimeout(() => {
      fun();
      timer1 = null;
    }, 100);
  }
};

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      valueg1: initValue.valueg1,
      valuej1: initValue.valuej1,
      valuel1: initValue.valuel1,
      valuef1: initValue.valuef1,
      value1: initValue.value1,
      valuelInit1: initValue.valuelInit1,
      valueMult: initValue.valueMult,
      compen: initValue.compen,
      press: initValue.press,
      port: [{ value: " ", label: " " }],
      portname: "",
      portnameBack: "",
      matrixName: "smallBed",
      length: 0,
      local: false,
      dataArr: [],
      index: 0,
      playflag: false,
      selectFlag: false,
      colFlag: true,
      colNum: 0,
      history: "now",
      numMatrixFlag: "normal",
      centerFlag: false,
      carState: "all",
      leftFlag: false,
      rightFlag: false,
      lineFlag: false,
      pressNum: false,
      press: false,
      dataTime: "",
      pointFlag: false,
      pressChart: false,
      newArr: [],
      newArr1: [],
      ymax: 200,
      control: "",
      hunch: "",
      front: "",
      flank: "",
      pressValue: '',
      colWebFlag: false,
      colOneFlag: false,
      csvData: JSON.parse(localStorage.getItem("collection"))
        ? JSON.parse(localStorage.getItem("collection"))
        : [["hunch", "front", "flank", "标签", "座椅", "靠背"]],
      length: JSON.parse(localStorage.getItem("collection"))
        ? JSON.parse(localStorage.getItem("collection")).length
        : 1,
      dataName: "",
      width: "",
      height: "",
      pressToArea: 0,
      newValue: 0,
      welFlag: false,
      leg: 0,
      butt: 0,
    };
    this.com = React.createRef();
    this.data = React.createRef();
    this.title = React.createRef();
    this.line = React.createRef();
    this.track = React.createRef();
    this.progress = React.createRef();
    this.sitIndexArr = new Array(4).fill(0);
    this.backIndexArr = new Array(4).fill(0);
  }

  componentDidMount() {
    document.documentElement.style.fontSize = `${window.innerWidth / 120}px`;

    var c2 = document.getElementById("myChartBig");

    if (c2) ctxbig = c2.getContext("2d");

    var c1 = document.getElementById("myChartBig1");

    if (c1) ctxbig1 = c1.getContext("2d");
    const ip = "k2.bodyta.com";
    if (this.state.matrixName === 'localCar') {
      ws = new WebSocket(`ws://${ip}:23001/ws/data`)
      ws1 = new WebSocket(`ws://${ip}:23001/ws/data1`)
    } else {
      ws = new WebSocket(" ws://127.0.0.1:19999");
      ws1 = new WebSocket(" ws://127.0.0.1:19998");
    }


    // ws = new WebSocket(" ws://192.168.31.114:19999");
    // ws = new WebSocket(`ws://${ip}:1880/ws/data`)

    // ws = new WebSocket("ws://192.168.31.124:1880/ws/data")
    ws.onopen = () => {
      // connection opened
      console.info("connect success");
      this.wsSendObj({
        file: this.state.matrixName,
        sitClose: true,
        backClose: true
      })
    };
    ws.onmessage = (e) => {
      this.wsData(e);
    };
    ws.onerror = (e) => {
      // an error occurred
    };
    ws.onclose = (e) => {
      // connection closed
    };

    // ws1 = new WebSocket("ws://192.168.31.124:1880/ws/data1")
    ws1.onopen = () => {
      // connection opened
      console.info("connect success");
      this.wsSendObj({
        file: this.state.matrixName,
        sitClose: true,
        backClose: true
      })
    };
    ws1.onmessage = (e) => {
      this.ws1Data(e);
    };
    ws1.onerror = (e) => {
      // an error occurred
    };
    ws1.onclose = (e) => {
      // connection closed
    };

    if (this.state.matrixName === "localCar") {
      wsControl = new WebSocket(`ws://${ip}:23001/ws/msg`);
      // wsControl = new WebSocket(`ws://${ip}:1880/ws/msg`)
      wsControl.onopen = () => {
        // connection opened
        console.info("connect success");
      };
      wsControl.onmessage = (e) => {
        // that.ws1Data(e)

        let jsonObject = e.data;

        if (jsonObject[0] == 1) {
          const data = jsonObject.split(" ")[1];

          this.setState({
            hunch: data,
          });
        } else if (jsonObject[0] == 3) {
          const data = jsonObject.split(" ")[1];

          this.setState({
            flank: data,
          });
        }
        else if (jsonObject[0] == 4) {
          const data = jsonObject.split(" ")[1];

          this.setState({
            pressToArea: data,
          });
        }



        else if (jsonObject[0] == 2) {
          const data = jsonObject.split(" ")[1];

          this.setState({
            front: data,
          });
          if (
            oneFlag &&
            this.state.hunch &&
            this.state.front &&
            this.state.flank
          ) {
            collection.push([
              this.state.hunch,
              this.state.front,
              this.state.flank,
              "迎宾结束",
            ]);
            localStorage.setItem("collection", JSON.stringify(collection));
            this.setState({ csvData: collection, length: collection.length });
            oneFlag = false;
          }
        } else {
          if (jsonObject === "迎宾结束") {
            // collection.push([this.state.hunch, this.state.front, '迎宾结束']);
            // localStorage.setItem('collection', JSON.stringify(collection))
            // this.setState({ csvData: collection, length: collection.length });
            oneFlag = true;
            this.setState({
              welFlag: true
            })
          }

          if (controlFlag && jsonObject === "靠背气囊充气") {
            this.setState({
              control: [jsonObject, "侧翼左侧气囊充气", "侧翼右侧气囊充气"],
            });
            controlFlag = false;
          } else {
            if (jsonObject === "侧翼左侧气囊充气") {
              this.setState({
                control: [jsonObject, "侧翼右侧气囊放气"],
              });
            } else if (jsonObject === "侧翼右侧气囊充气") {
              this.setState({
                control: [jsonObject, "侧翼左侧气囊放气"],
              });
            } else {
              this.setState({
                control: [jsonObject],
              });
            }
          }
        }
        const sitArr = []
        for (let i = 0; i < 10; i++) {
          sitArr[i] = 0
          for (let j = 0; j < 10; j++) {
            sitArr[i] += wsPointDataSit[i * 10 + j]
          }
        }

        const backArr = []
        for (let i = 0; i < 10; i++) {
          backArr[i] = 0
          for (let j = 0; j < 10; j++) {
            backArr[i] += wsPointDataBack[i * 10 + j]
          }
        }

        // console.log(sitArr ,backArr)
        if (this.state.colWebFlag) {


          collection.push([
            this.state.hunch,
            this.state.front,
            this.state.flank,
            this.state.dataName,
            JSON.stringify(wsPointDataSit),
            JSON.stringify(wsPointDataBack),
            'sit',
            ...sitArr,
            'back',
            ...backArr
          ]);
          localStorage.setItem("collection", JSON.stringify(collection));
          this.setState({ csvData: collection, length: collection.length });
        }
      };
      wsControl.onerror = (e) => {
        // an error occurred
      };
      wsControl.onclose = (e) => {
        // connection closed
      };
    }


  }

  colPushData() {
    collection.push([
      this.state.hunch,
      this.state.front,
      this.state.flank,
      this.state.dataName,
      JSON.stringify(wsPointDataSit),
      JSON.stringify(wsPointDataBack),
    ]);
    localStorage.setItem("collection", JSON.stringify(collection));
    this.setState({ csvData: collection, length: collection.length });
  }

  delPushData() {
    collection = [["hunch", "front", "flank", "标签", "座椅", "靠背"]];
    localStorage.removeItem("collection");
    this.setState({
      collection: [["hunch", "front", "flank", "标签", "座椅", "靠背"]],
      length: 1,
    });
  }

  changeWs(ip) {
    if (ws) {
      ws.close();
    }
    if (ws1) {
      ws1.close();
    }
    this.initCar();
    const that = this;

    // ws = new WebSocket(`ws://${ip}:1880/ws/data`)
    ws = new WebSocket(`ws://${ip}:23001/ws/data`);
    ws.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws.onmessage = (e) => {
      that.wsData(e);
    };
    ws.onerror = (e) => {
      // an error occurred
    };
    ws.onclose = (e) => {
      // connection closed
    };
    // ws1 = new WebSocket(`ws://${ip}:1880/ws/data1`)
    ws1 = new WebSocket(`ws://${ip}:23001/ws/data1`);
    // ws1 = new WebSocket(" ws://127.0.0.1:19998");
    // ws1 = new WebSocket("ws://192.168.31.124:1880/ws/data1")
    ws1.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws1.onmessage = (e) => {
      that.ws1Data(e);
    };
    ws1.onerror = (e) => {
      // an error occurred
    };
    ws1.onclose = (e) => {
      // connection closed
    };

    wsControl = new WebSocket(`ws://${ip}:23001/ws/msg`);
    // wsControl = new WebSocket(`ws://${ip}:1880/ws/msg`)
    wsControl.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    wsControl.onmessage = (e) => {
      // that.ws1Data(e)
      let jsonObject = e.data;
      if (jsonObject[0] == 1) {
        const data = jsonObject.split(" ")[1];

        this.setState({
          hunch: data,
        });
      } else if (jsonObject[0] == 3) {
        const data = jsonObject.split(" ")[1];

        this.setState({
          flank: data,
        });
      } else if (jsonObject[0] == 2) {
        const data = jsonObject.split(" ")[1];

        this.setState({
          front: data,
        });

        if (this.state.colWebFlag) {
          collection.push([
            this.state.hunch,
            this.state.front,
            this.state.flank,
            this.state.dataName,
            JSON.stringify(wsPointDataSit),
            JSON.stringify(wsPointDataBack),
          ]);
          localStorage.setItem("collection", JSON.stringify(collection));
          this.setState({ csvData: collection, length: collection.length });
        }
      } else {
        if (controlFlag && jsonObject === "靠背气囊充气") {
          this.setState({
            control: [jsonObject, "侧翼气囊充气"],
          });
          controlFlag = false;
        } else {
          this.setState({
            control: [jsonObject],
          });
        }
      }
    };
    wsControl.onerror = (e) => {
      // an error occurred
    };
    wsControl.onclose = (e) => {
      // connection closed
    };
  }

  wsData = (e) => {
    sitPress = 0;
    let jsonObject = JSON.parse(e.data);
    //处理空数组
    sitDataFlag = false;
    let backFlag;
    if (jsonObject.backFlag != null) {
      backFlag = jsonObject.backFlag;
    }

    if (jsonObject.sitData != null) {
      if (this.state.matrixName != "car10") {
        if (colValueFlag) {
          num++;

          this.title.current?.changeNum(num);
        } else {
          num = 0;
        }
      }

      let selectArr;
      let wsPointData = jsonObject.sitData;

      if (!Array.isArray(wsPointData)) {
        wsPointData = JSON.parse(wsPointData);
      }
      wsPointDataSit = wsPointData;
      wsPointDataSit = wsPointDataSit.map((a) => Math.round(a));
      sitTypeEvent[this.state.matrixName]({
        that: this,
        wsPointData,
        backFlag,
        local: this.state.local,
        press: this.state.press,
        // compen : this.state.compen
      });
    }

    if (jsonObject.port != null) {
      const port = [];
      jsonObject.port.forEach((a, index) => {
        port.push({
          value: a.path,
          label: a.path,
        });
      });

      this.setState({
        port: port,

      });
    }
    if (jsonObject.length != null) {
      this.setState({
        length: jsonObject.length,
      });
    }
    if (jsonObject.time != null) {
      this.setState({
        time: jsonObject.time,
      });
    }
    if (jsonObject.timeArr != null) {
      // const arr = []
      const arr = jsonObject.timeArr; //.map((a, index) => a.date);

      // if (this.state.matrixName == "car") {
        let obj = [];
        arr.forEach((a, index) => {
          obj.push({
            value: a.info,
            label: a.name,
          });
        });

        this.setState({ dataArr: obj });
      // } else {
      //   let obj = [];
      //   arr.forEach((a, index) => {
      //     obj.push({
      //       value: a.date,
      //       label: a.name,
      //     });
      //   });

      //   this.setState({ dataArr: obj });
      // }
    }

    if (jsonObject.index != null) {
      this.progress.current?.changeIndex(jsonObject.index);
    }

    if (jsonObject.areaArr != null) {
      const max = findMax(jsonObject.areaArr);
      this.data.current?.handleChartsArea(jsonObject.areaArr, max + 100);
      this.max = max;
      this.areaArr = jsonObject.areaArr;
      this.setState({
        areaArr: jsonObject.areaArr,
      });
    }

    if (jsonObject.pressArr != null) {
      const max = findMax(jsonObject.pressArr);
      if (this.state.matrixName == "car" || this.state.matrixName == "bigBed" || this.state.matrixName == "sit10" || this.state.matrixName == "smallBed") {
        this.data.current?.handleCharts(jsonObject.pressArr, max + 100);
        this.pressMax = max;
        this.pressArr = jsonObject.pressArr;
        this.setState({
          pressArr: jsonObject.pressArr,
        });
      }
    }

    if (jsonObject.download != null) {
      message.info(jsonObject.download);
    }
  };

  ws1Data = (e) => {
    let jsonObject = JSON.parse(e.data);
    // let wsPointData = jsonObject.backData;
    // if (!Array.isArray(wsPointData)) {
    //   wsPointData = JSON.parse(wsPointData);
    // }
    let sitFlag;
    if (jsonObject.sitFlag != null) {
      sitFlag = jsonObject.sitFlag;
    }

    if (jsonObject.backData != null) {
      if (this.state.matrixName == "car" && !sitFlag) {
        if (colValueFlag) {
          num++;

          this.title.current?.changeNum(num);
        } else {
          num = 0;
        }
      }
      wsPointDataBack = jsonObject.backData;
      if (!Array.isArray(wsPointDataBack)) {
        wsPointDataBack = JSON.parse(wsPointDataBack);
      }
      if (
        this.state.matrixName !== "bigBed" &&
        this.state.matrixName !== "foot"
      ) {
        backTypeEvent[this.state.matrixName]({
          that: this,
          jsonObject,
          sitFlag,
          local: this.state.local,
        });
      }
    }

    if (jsonObject.timeArr != null) {
      // const arr = []

      const arr = jsonObject.timeArr; //.map((a, index) => a.date);

      let obj = [];
      arr.forEach((a, index) => {
        obj.push({
          value: a.info,
          label: a.name,
        });
      });
      this.setState({ dataArr: obj });
    }

    if (jsonObject.length != null) {
      this.setState({
        length: jsonObject.length,
      });
    }
    if (jsonObject.time != null) {
      this.setState({
        time: jsonObject.time,
      });
    }

    if (jsonObject.index != null) {
      this.progress.current?.changeIndex(jsonObject.index);
    }

    if (jsonObject.areaArr != null) {
      const max = findMax(jsonObject.areaArr);
      this.data.current?.handleChartsArea(jsonObject.areaArr, max + 100);
      this.max = max;
      this.areaArr = jsonObject.areaArr;
      this.setState({
        areaArr: jsonObject.areaArr,
      });
    }

    if (jsonObject.pressArr != null) {
      const max = findMax(jsonObject.pressArr);

      if (
        this.state.matrixName == "car" ||
        this.state.matrixName == "bigBed" ||
        this.state.matrixName == "car10"
      ) {
        this.data.current?.handleCharts(jsonObject.pressArr, max + 100);
        this.pressMax = max;
        this.pressArr = jsonObject.pressArr;
        this.setState({
          pressArr: jsonObject.pressArr,
        });
      }
    }
  };

  wsSendObj = (obj) => {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(obj));
    }
  };

  changeMatrix = (e) => {
    // setMatrixName(e)
    this.setState({ matrixName: e });
    wsMatrixName = e;
  };

  handleChartsBody(arr, max, index) {
    const canvas = document.getElementById("myChartBig");

    if (canvas && ctxbig) {
      this.drawChart({ ctx: ctxbig, arr, max, canvas, index });
    }
  }

  handleChartsBody1(arr, max, index) {
    const canvas = document.getElementById("myChartBig1");

    if (canvas && ctxbig1) {
      this.drawChart({ ctx: ctxbig1, arr, max, canvas, index });
    }
  }

  initBigCtx() {
    var c2 = document.getElementById("myChartBig");

    if (c2) ctxbig = c2.getContext("2d");

    var c1 = document.getElementById("myChartBig1");

    if (c1) ctxbig1 = c1.getContext("2d");
  }

  initCar() {
    var c2 = document.getElementById("myChartsit");

    if (c2) ctxsit = c2.getContext("2d");
    var c1 = document.getElementById("myChartback");

    if (c1) ctxback = c1.getContext("2d");
  }

  handleChartsSit(arr, max, index) {
    const canvas = document.getElementById("myChartsit");

    if (canvas && ctxsit) {
      this.drawChart({ ctx: ctxsit, arr, max, canvas });
    }
  }

  handleChartsBack(arr, max, index) {
    const canvas = document.getElementById("myChartback");

    if (canvas && ctxback) {
      this.drawChart({ ctx: ctxback, arr, max, canvas });
    }
  }

  drawChart({ ctx, arr, max, canvas, index }) {
    // 清空画布
    const data = arr.map((a) => (a * 150) / max);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 计算数据点之间的间距
    var gap = canvas.width / (data.length + 1);

    // 绘制曲线
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(gap, canvas.height - data[0]);

    for (var i = 1; i < data.length - 2; i++) {
      var xMid = (gap * (i + 1) + gap * (i + 2)) / 2;
      var yMid =
        (canvas.height - data[i + 1] + canvas.height - data[i + 2]) / 2;
      ctx.quadraticCurveTo(
        gap * (i + 1),
        canvas.height - data[i + 1],
        xMid,
        yMid
      );
    }

    // 连接最后两个数据点
    ctx.quadraticCurveTo(
      gap * (data.length - 1),
      canvas.height - data[data.length - 1],
      gap * data.length,
      canvas.height - data[data.length - 1]
    );

    // 设置曲线样式
    ctx.strokeStyle = "#991BFA";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (index != null) {
      ctx.beginPath();
      ctx.moveTo(gap * index, canvas.height);
      ctx.lineTo(gap * index, 0);
      ctx.strokeStyle = "#01F1E3";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
    }
  }

  changeLocal = (value) => {
    this.setState({ local: value });
    // changeDateArr(matrixName)

    if (ws && ws.readyState === 1) {
      if (value) {
        ws.send(JSON.stringify({ local: true }));
      } else {
        ws.send(JSON.stringify({ local: false }));
      }
    }
  };

  // formatter = (value) => {

  //   return `${value}%`
  // };

  changeValue = (value) => {
    return value < 4 ? 0 : value >= 68 ? 31 : Math.round((value - 4) / 2 - 1);
  };

  changeFootValue = (value) => {
    return value < 4 ? 0 : value >= 36 ? 15 : Math.round((value - 4) / 2 - 1);
  };

  changeBedValue = (value) => {
    return value < 4
      ? 0
      : value >= 4 + 64 * 2
        ? 64 - 1
        : Math.round((value - 4) / 2 - 1);
  };

  changeSmallBedValue = (value) => {
    return value < 4
      ? 0
      : value >= 4 + 64 * 2
        ? 32 - 1
        : Math.round((value - 4) / 4 - 1);
  };

  changeSelect = (obj, type) => {
    let sit = [...obj.sit];
    // console.log(sit)
    if (!sit.every((a) => a == 0) && this.state.carState != "back") {
      const sitIndex = sit.length
        ? sit.map((a, index) => {
          if (this.state.matrixName === "foot") {
            if (index == 0 || index == 1) {
              return this.changeFootValue(a);
            } else {
              return this.changeValue(a);
            }
          } else if (this.state.matrixName === "bigBed") {
            if (index == 0 || index == 1) {
              return this.changeBedValue(a);
            } else {
              return this.changeValue(a);
            }
          } else if (this.state.matrixName === "smallBed") {
            if (index == 0 || index == 1) {
              return this.changeSmallBedValue(a);
            } else {
              return this.changeValue(a);
            }
          } else {
            return this.changeValue(a);
          }
        })
        : new Array(4).fill(0);

      this.sitIndexArr = sitIndex;

      if (!sitIndex.every((a) => a == 0) && this.state.carState != "back") {
        // thrott(this.wsSendObj.bind(this, { sitIndex }))
        this.wsSendObj({ sitIndex });
      }

      const selectArr = [];

      for (let i = this.sitIndexArr[0]; i <= this.sitIndexArr[1]; i++) {
        for (let j = this.sitIndexArr[2]; j <= this.sitIndexArr[3]; j++) {
          selectArr.push(wsPointDataSit[i * 32 + j]);
        }
      }

      let DataArr;

      if (this.sitIndexArr.every((a) => a == 0)) {
        DataArr = [...wsPointDataSit];
      } else {
        DataArr = [...selectArr];
      }
      // DataArr = DataArr.map((a) => (a < 5 ? 0 : a));
      // 框选后或者无框选的数据
      const total = DataArr.reduce((a, b) => a + b, 0);
      const length = DataArr.filter((a, index) => a > 0).length;

      sitPoint = DataArr.filter((a) => a > 10).length;
      const sitTotalvalue = DataArr.reduce((a, b) => a + b, 0);
      sitMax = findMax(DataArr);
      sitArea = sitPoint;
      const sitPressure = carFitting(sitTotal / (sitPoint ? sitPoint : 1));
      // sitTotal = mmghToPress(sitPressure, sitArea)
      // sitTotal = totalToN(sitTotal)
      sitTotal = [...DataArr]
        .map((a) => pointToN(a))
        .reduce((a, b) => a + b, 0);
      sitMax = (sitMax / (sitTotalvalue ? sitTotalvalue : 1)) * sitTotal;
      sitMean = sitTotal / (sitPoint ? sitPoint : 1);

      this.data.current?.changeData({
        meanPres: sitMean.toFixed(2),
        maxPres: sitMax.toFixed(2),
        totalPres: sitTotal.toFixed(2),
        point: sitPoint,
        area: sitArea,
        pressure: sitPressure,
      });
    }

    if (
      obj.back &&
      !obj.back.every((a) => a == 0) &&
      this.state.carState != "sit"
    ) {
      let back = [...obj.back];
      if (back.length) {
        back[2] = Math.round(back[2] / 2);
        back[3] = Math.round(back[3] / 2);
      }

      const backIndex = back.length
        ? back.map((a, index) => {
          if (this.state.matrixName === "foot") {
            if (index == 0 || index == 1) {
              return this.changeFootValue(a);
            } else {
              return this.changeValue(a);
            }
          } else {
            return this.changeValue(a);
          }
        })
        : new Array(4).fill(0);

      this.backIndexArr = backIndex;
      if (!backIndex.every((a) => a == 0) && this.state.carState != "sit") {
        // thrott1(this.wsSendObj.bind(this, { backIndex }))
        this.wsSendObj({ backIndex });
      }

      const selectArr = [];
      for (let i = this.backIndexArr[0]; i <= this.backIndexArr[1]; i++) {
        for (
          let j = 31 - this.backIndexArr[3];
          j <= 31 - this.backIndexArr[2];
          j++
        ) {
          selectArr.push(wsPointDataBack[i * 32 + j]);
        }
      }

      let DataArr;
      if (
        this.sitIndexArr.every((a) => a == 0) &&
        this.backIndexArr.every((a) => a == 0)
      ) {
        DataArr = [...wsPointDataBack];
      } else {
        DataArr = [...selectArr];
      }

      // DataArr = DataArr.map((a) => (a < 5 ? 0 : a));
      const backTotalvalue = DataArr.reduce((a, b) => a + b, 0);
      backTotal = DataArr.reduce((a, b) => a + b, 0);
      backPoint = DataArr.filter((a) => a > 10).length;
      // backMean = parseInt(backTotal / (backPoint ? backPoint : 1));
      backMax = findMax(DataArr);
      backArea = backPoint;
      const backPressure = carFitting(backTotal / (backPoint ? backPoint : 1));
      // backTotal = mmghToPress(backPressure, backArea)
      // backTotal = totalToN(backTotal, 1.3)
      console.log(DataArr);
      backTotal = [...DataArr]
        .map((a) => pointToN(a))
        .reduce((a, b) => a + b, 0);
      backMax = (backMax / (backTotalvalue ? backTotalvalue : 1)) * backTotal;
      backMean = backTotal / (backPoint ? backPoint : 1);
      console.log(backTotal)
      this.data.current?.changeData({
        meanPres: backMean.toFixed(2),
        maxPres: backMax.toFixed(2),
        totalPres: backTotal.toFixed(2),
        point: backPoint,
        area: backArea,
        pressure: backPressure,
      });
    }
  };

  changeStateData = (obj) => {
    this.setState(obj);
  };

  setColValueFlag = (value) => {
    colValueFlag = value;
  };

  render() {
    return (
      <div className="home">
        <div className="setIcons">
          <div className="setIconItem setIconItem1">
            <div
              className="setIconItem setIconItem2"
              style={{
                position: "absolute",
                width: "60px",
                right: 60,
                color: "#5A5A89",
                fontWeight: "bold",
              }}
            >
              <div style={{ display: "flex" }}>
                <span>x</span>
                <Input
                  value={this.state.width}
                  onChange={(e) => {
                    this.setState({
                      width: e.target.value,
                    });
                    this.com.current.changeBox({
                      width: e.target.value,
                      height: this.state.height,
                    });
                  }}
                />
              </div>
              <div style={{ display: "flex" }}>
                <span>y</span>
                <Input
                  value={this.state.height}
                  onChange={(e) => {
                    this.setState({
                      height: e.target.value,
                    });
                    this.com.current.changeBox({
                      height: e.target.value,
                      width: this.state.width,
                    });
                  }}
                />
              </div>
            </div>

            <Popover placement="top" title={text} content={content}>
              <div
                className="setIcon marginB10"
                onClick={() => {
                  xvalue++;

                  // 脚型方向旋转
                  if (xvalue < 3) {
                    if (
                      this.com.current &&
                      this.com.current.changeGroupRotate
                    ) {
                      this.com.current?.changeGroupRotate({ x: xvalue });
                    }
                  } else {
                    xvalue = 0;
                    if (
                      this.com.current &&
                      this.com.current.changeGroupRotate
                    ) {
                      this.com.current?.changeGroupRotate({ x: xvalue });
                    }
                  }

                  localStorage.setItem('bedx', xvalue)
                  // 汽车方向旋转

                  if (xvalue < 3) {
                    if (
                      this.com.current &&
                      this.com.current.changePointRotation
                    ) {
                      this.com.current?.changePointRotation({
                        direction: "x",
                        value: xvalue,
                        type: this.state.carState,
                      });
                    }
                  } else {
                    xvalue = 0;
                    if (
                      this.com.current &&
                      this.com.current.changePointRotation
                    ) {
                      this.com.current?.changePointRotation({
                        direction: "x",
                        value: xvalue,
                        type: this.state.carState,
                      });
                    }
                  }
                }}
              >
                <img src={plus} alt="" />
              </div>
            </Popover>

            <Popover
              placement="top"
              title={text}
              content={content1}
            // arrow={mergedArrow}
            >
              <div
                className="setIcon"
                onClick={() => {
                  zvalue++;
                  // 脚型方向旋转
                  if (zvalue < 3) {
                    if (
                      this.com.current &&
                      this.com.current.changeGroupRotate
                    ) {
                      this.com.current?.changeGroupRotate({ z: zvalue });
                    }
                  } else {
                    zvalue = 0;
                    if (
                      this.com.current &&
                      this.com.current.changeGroupRotate
                    ) {
                      this.com.current?.changeGroupRotate({ z: zvalue });
                    }
                  }
                  localStorage.setItem('bedz', zvalue)
                  // 汽车方向旋转
                  if (zvalue < 3) {
                    if (
                      this.com.current &&
                      this.com.current.changePointRotation
                    ) {
                      this.com.current?.changePointRotation({
                        direction: "z",
                        value: zvalue,
                        type: this.state.carState,
                      });
                    }
                  } else {
                    zvalue = 0;
                    if (
                      this.com.current &&
                      this.com.current.changePointRotation
                    ) {
                      this.com.current?.changePointRotation({
                        direction: "z",
                        value: zvalue,
                        type: this.state.carState,
                      });
                    }
                  }
                }}
              >
                <img src={minus} alt="" />
              </div>
            </Popover>

            {/* <div>
              <input type="text" onChange={(e) => {

                let wsPointData = (e.target.value)

                if (!Array.isArray(wsPointData)) {
                  wsPointData = JSON.parse(wsPointData);
                }
                wsPointDataSit = wsPointData
                wsPointDataSit = wsPointDataSit.map((a) => Math.round(a))
                sitTypeEvent[this.state.matrixName]({ that: this, wsPointData, local: this.state.local })
              }} />
            </div>

            <input type="text"
              onChange={(e) => {
                wsPointDataBack = (e.target.value)
                if (!Array.isArray(wsPointDataBack)) {
                  wsPointDataBack = JSON.parse(wsPointDataBack);
                }
                const jsonObject = {
                  backData : wsPointDataBack
                }
                backTypeEvent[this.state.matrixName]({ that: this, jsonObject, local: this.state.local })
              }}
            /> */}
          </div>
          {this.state.matrixName == "foot" ? (
            <Popover placement="top" title={"刷新"} content={content3}>
              <div className="setIconItem setIconItem2">
                <div className="setIcon">
                  <img
                    src={refresh}
                    alt=""
                    onClick={() => {
                      this.track.current?.canvasInit();
                    }}
                  />
                </div>
              </div>
            </Popover>
          ) : null}

          <div className="setIconItem setIconItem2">
            {this.state.matrixName == "foot" ? (
              <Popover placement="top" title={"下载"} content={content4}>
                <div
                  className="setIcon marginB10"
                  onClick={() => {
                    const that = this;

                    this.track.current?.loadImg({
                      arrSmooth: that.arrSmooth,
                      rightTopPropSmooth: that.rightTopPropSmooth,
                      leftTopPropSmooth: that.leftTopPropSmooth,
                      leftBottomPropSmooth: that.leftBottomPropSmooth,
                      rightPropSmooth: that.rightPropSmooth,
                      leftPropSmooth: that.leftPropSmooth,
                      rightBottomPropSmooth: that.rightBottomPropSmooth,
                    });
                  }}
                >
                  <img src={load} alt="" />
                </div>
              </Popover>
            ) : null}
            {/* <div className='setIcon marginB10' onClick={() => {
           
              this.wsSendObj({ flag: false })
            }}>
              <img src={stop} alt="" />
            </div> */}
            <Popover placement="top" title={text2} content={content2}>
              <div
                className="setIcon"
                onClick={() => {
                  const flag = this.state.selectFlag;
                  // setSelectFlag(!flag)
                  this.setState({
                    selectFlag: !flag,
                  });
                  this.com.current?.changeSelectFlag(flag, this.state.local);
                  // this.setState({
                  //   sitIndexArr : new Array(4).fill(0),
                  //   backIndexArr : new Array(4).fill(0)
                  // })
                  if (flag && this.state.carState === "all") {
                    this.setState({ width: 0, height: 0 });
                    this.sitIndexArr = new Array(4).fill(0);
                    this.backIndexArr = new Array(4).fill(0);
                  }
                }}
              >
                {/* <img src={icon2} alt="" /> */}
                <SelectOutlined
                  style={{
                    color: this.state.selectFlag ? "#fff" : "#4c4671",
                    fontSize: "20px",
                  }}
                  color={this.state.selectFlag ? "#fff" : "#4c4671"}
                />
                {/* <input type="file" id='fileInput' onChange={(e) => getPath(e)}
            /> */}
              </div>
            </Popover>
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            right: "3%",
            height: "55%",
            bottom: "6%",
            boxSizing: "border-box",
          }}
        >
          {rainbowTextColors
            .slice(0, rainbowTextColors.length - 7)
            .map((items, indexs) => {
              return (
                <div
                  key={`${rainbowTextColors[items]}${indexs}`}
                  style={{
                    display: "flex",
                    height: `${100 /
                      rainbowTextColors.slice(0, rainbowTextColors.length - 7)
                        .length
                      }%`,
                    alignItems: "center",
                    padding: "3px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      padding: "0px 10px",
                    }}
                  >
                    <div
                      className="switch"
                      style={{
                        color: "#ccc",
                        // minWidth: "80px",
                        textAlign: "left",
                      }}
                    >
                      {(
                        ((this.state.valuej1 / 100) *
                          (rainbowTextColors.length - 1 - indexs)) /
                        rainbowTextColors.length
                      ).toFixed(2)}
                      N/cm^2
                    </div>
                    <div className="switchLevels"></div>
                  </div>
                  <div
                    style={{
                      width: 50,
                      height: "100%",
                      backgroundColor: `rgb(${items})`,
                    }}
                  ></div>
                </div>
              );
            })}
        </div>

        <Title
          initBigCtx={this.initBigCtx}
          valueg1={this.state.valueg1}
          value1={this.state.value1}
          valuef1={this.state.valuef1}
          valuel1={this.state.valuel1}
          valuej1={this.state.valuej1}
          valuelInit1={this.state.valuelInit1}
          compen={this.state.compen}
          ymax={this.state.ymax}
          ref={this.title}
          com={this.com}
          track={this.track}
          port={this.state.port}
          portname={this.state.portname}
          portnameBack={this.state.portnameBack}
          local={this.state.local}
          dataArr={this.state.dataArr}
          matrixName={this.state.matrixName}
          history={this.state.history}
          wsSendObj={this.wsSendObj}
          changeMatrix={this.changeMatrix}
          changeLocal={this.changeLocal}
          colFlag={this.state.colFlag}
          changeStateData={this.changeStateData}
          setColValueFlag={this.setColValueFlag}
          numMatrixFlag={this.state.numMatrixFlag}
          centerFlag={this.state.centerFlag}
          data={this.data}
          dataTime={this.state.dataTime}
          pointFlag={this.state.pointFlag}
          valueMult={this.state.valueMult}
          pressChart={this.state.pressChart}
          changeWs={this.changeWs.bind(this)}
          hunch={this.state.hunch}
          front={this.state.front}
          csvData={this.state.csvData}
          length={this.state.length}
          colWebFlag={this.state.colWebFlag}
          colPushData={this.colPushData.bind(this)}
          delPushData={this.delPushData.bind(this)}
        />

        <CanvasCom matrixName={this.state.matrixName}>
          <Aside ref={this.data} matrixName={this.state.matrixName} />
        </CanvasCom>

        {this.state.numMatrixFlag == "num" &&
          (this.state.matrixName == "foot" ||
            this.state.matrixName == "hand" ||
            this.state.carState == "back" ||
            this.state.carState == "sit") ? (
          <Num ref={this.com} />
        ) : this.state.numMatrixFlag == "heatmap" &&
          (this.state.matrixName == "foot" ||
            this.state.matrixName == "hand" ||
            this.state.carState == "back" ||
            this.state.carState == "sit") ? (
          <Heatmap ref={this.com} />
        ) : this.state.matrixName == "foot" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <Canvas ref={this.com} changeSelect={this.changeSelect} />
          </CanvasCom>
        ) : this.state.matrixName == "hand" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <CanvasHand ref={this.com} />
          </CanvasCom>
        ) : this.state.matrixName == "car" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <CanvasCar
              ref={this.com}
              changeSelect={this.changeSelect}
              changeStateData={this.changeStateData}
            />
          </CanvasCom>
        ) : this.state.matrixName == "bigBed" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <Bed
              ref={this.com}
              data={this.data}
              handleChartsBody={this.handleChartsBody.bind(this)}
              handleChartsBody1={this.handleChartsBody1.bind(this)}
              changeSelect={this.changeSelect}
            />
          </CanvasCom>
        ) : this.state.matrixName == "sit10" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <Sit10
              ref={this.com}
              handleChartsBody={this.handleChartsBody.bind(this)}
              handleChartsBody1={this.handleChartsBody1.bind(this)}
              changeSelect={this.changeSelect}
            />
          </CanvasCom>
        ) : this.state.matrixName == "smallBed" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <SmallBed
              ref={this.com}
              data={this.data}
              local={this.state.local}
              handleChartsBody={this.handleChartsBody.bind(this)}
              handleChartsBody1={this.handleChartsBody1.bind(this)}
              changeSelect={this.changeSelect}
            />
          </CanvasCom>
        ) : this.state.matrixName == "smallM" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <SmallM
              ref={this.com}
              data={this.data}
              local={this.state.local}

              handleChartsBody={this.handleChartsBody.bind(this)}
              handleChartsBody1={this.handleChartsBody1.bind(this)}
              changeSelect={this.changeSelect}
            />
          </CanvasCom>
        ) : this.state.matrixName == "rect" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <SmallRect
              ref={this.com}
              data={this.data}
              local={this.state.local}

              handleChartsBody={this.handleChartsBody.bind(this)}
              handleChartsBody1={this.handleChartsBody1.bind(this)}
              changeSelect={this.changeSelect}
            />
          </CanvasCom>
        ) : this.state.matrixName == "short" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <SmallShort
              ref={this.com}
              data={this.data}
              local={this.state.local}

              handleChartsBody={this.handleChartsBody.bind(this)}
              handleChartsBody1={this.handleChartsBody1.bind(this)}
              changeSelect={this.changeSelect}
            />
          </CanvasCom>
        ) :

          (
            <CanvasCom matrixName={this.state.matrixName}>
              <Car10 ref={this.com} changeSelect={this.changeSelect} />
            </CanvasCom>
          )}

        {/* 全床压力曲线 */}
        {this.state.matrixName === "bigBed" ? (
          <div
            style={{
              position: "fixed",
              visibility: this.state.pressChart ? "hidden" : "unset",
              width: "60%",
              right: "20%",
              bottom: "100px",
            }}
          >
            <canvas
              id="myChartBig1"
              style={{ height: "300px", width: "100%" }}
            ></canvas>
            {/* <canvas id="myChartBig" style={{ height: '300px', width: '100%' }}></canvas> */}
          </div>
        ) : null}

        {/* {this.state.matrixName === 'localCar' ?
          <div style={{ position: "fixed", display : 'flex' ,visibility: this.state.pressChart ? 'hidden' : 'unset', width: '60%', right: "20%", bottom: "100px" }}>
            <canvas id="myChartsit" style={{ height: '300px',flex : 1 }}></canvas>
            <canvas id="myChartback" style={{ height: '300px',flex : 1 }}></canvas>
          </div>
          : null} */}

        {/* 进度条 */}
        {this.state.local ? (
          <ProgressCom
            ref={this.progress}
            dataTime={this.state.dataTime}
            matrixName={this.state.matrixName}
            data={this.data}
            areaArr={this.state.areaArr}
            pressArr={this.state.pressArr}
            length={this.state.length}
            max={this.max}
            time={this.state.time}
            pressMax={this.pressMax}
            wsSendObj={this.wsSendObj}
          />
        ) : null}
        {/* 脚型重心画图 */}
        {this.state.matrixName == "foot" ? (
          <CanvasCom matrixName={this.state.matrixName}>
            <FootTrack ref={this.track} />
          </CanvasCom>
        ) : null}

        {this.state.matrixName == "localCar" ? (
          <div
            style={{
              position: "fixed",
              bottom: "6%",
              right: "20%",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "1.5rem",
            }}
          >
            {controlArr.map((a, index) => {
              return (
                <p
                  style={{
                    color: this.state.control.includes(a.info)
                      ? "#0cf862"
                      : "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {a.name}
                </p>
              );
            })}
            <p>hunch : {this.state.hunch}</p>
            <p>front : {this.state.front}</p>
            <p>flank : {this.state.flank}</p>
            <p>sitValue : {this.state.pressToArea}</p>
            {/* wsPointData.filter(a => a > 40).length > 45 ? 2 : wsPointData.filter(a => a > 40).length <10  ? 0 : 1 */}
            <p>体型类型 : {this.state.newValue > 45 ? 2 : this.state.newValue < 10 ? 0 : 1} -- {this.state.newValue}</p>
            <p>leg : {this.state.leg < 600 ? 0 : this.state.leg} </p>
            <p>butt : {this.state.butt < 600 ? 0 : this.state.butt}</p>
          </div>
        ) : null}

        <div style={{ position: "fixed", bottom: "20px", color: "#fff" }}>
          <div
            style={{ border: "1px solid #01F1E3" }}
            onClick={() => {
              const press = this.state.press;
              this.setState({
                press: !press,
              });
            }}
          >
            {this.state.press ? "分压" : "不分压"}
          </div>
          <div
            style={{ border: "1px solid #01F1E3" }}
            onClick={() => {
              const pressNum = this.state.pressNum;
              this.setState({
                pressNum: !pressNum,
              });
            }}
          >
            {this.state.pressNum ? "压力算法" : "不压力算法"}
          </div>
        </div>
        {/* <div style={{ position: "fixed", right: "20%", bottom: "20px" }}>
          {this.state.newArr.length
            ? this.state.newArr.map((a, indexs) => {
              return (
                <div style={{ display: "flex", color: "#fff" }}>
                  {a.map((b, index) => {
                    return <div style={{ width: 40 }}>{b}</div>;
                  })}
                </div>
              );
            })
            : null}
        </div>

        <div style={{ position: "fixed", right: "20%", bottom: "400px" }}>
          {this.state.newArr1.length
            ? this.state.newArr1.map((a, indexs) => {
              return (
                <div style={{ display: "flex", color: "#fff" }}>
                  {a.map((b, index) => {
                    return <div style={{ width: 40 }}>{b}</div>;
                  })}
                </div>
              );
            })
            : null}
        </div> */}
      </div>
    );
  }
}

export default Home;
