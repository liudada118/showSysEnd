import React from 'react'
import {  Menu,   Slider, Button, Select } from 'antd';
import exchange from '../../assets/images/exchange.png'
import option from '../../assets/images/Option.png'
import './title.scss'

const navItems = [
  {
    label: '实时',
    key: 'now',
  },
  {
    label: '回放',
    key: 'playback',
  },
];

const carItems = [
  {
    label: '整体',
    key: 'all',
  },
  {
    label: '靠背',
    key: 'back',
  },
  {
    label: '座椅',
    key: 'sit',
  },
];

const sensorArr = [
  { label: '脚型检测', value: 'foot' },
  { label: '手部检测', value: 'hand' },
  { label: '汽车座椅', value: 'car' },
]




// const [current, setCurrent] = useState('now');
// const [carCurrent, setCarCurrent] = useState('all');
// const [show, setShow] = useState(false)
class Title extends React.Component {
  constructor() {
    super()
    this.state = {
      current: 'now',
      carCurrent: 'all',
      show: false,
      num : 0
    }
  }

  componentDidMount() {

  }

  onClick = (e) => {
    console.log('click ', e.key);
    if (e.key === 'now') {
      this.props.changeLocal(false)
    } else {
      this.props.changeLocal(true)
      this.props.changeStateData({index : 0})
    }
    this.setState({
      current: e.key
    })
    // setCurrent(e.key);
  };

  onCarClick = (e) => {
    if (e.key === 'sit') {
      this.setState({
        carCurrent: 'sit'
      })
      this.props.com.current?.actionSit()
    } else if (e.key === 'back') {
      this.setState({
        carCurrent: 'back'
      })
      this.props.com.current?.actionBack()
    } else {
      this.setState({
        carCurrent: 'all'
      })
      this.props.com.current?.actionAll()
    }
  }

  changeNum = (num) => {
    this.setState({
      num : num
    })
  }

  render() {
    // console.log('title')
    return <div className="title">
      <h2>bodyta</h2>
      <div className="titleItems">
        <Select
          // value={sensorArr}
          // defaultValue={'汽车座椅'}
          placeholder="请选择对应传感器"
          onChange={(e) => {
            // this.props.handleChangeCom(e);
            console.log(e.info);
            this.props.wsSendObj({ file: e.info })
            this.props.changeMatrix(e.info)
            // this.props.changeDateArr(e.info)
            // if (ws && ws.readyState === 1)
            //   ws.send(JSON.stringify({ sitPort: e }));
          }}
          options={sensorArr}
        />



        <Menu className='menu' onClick={this.onClick} selectedKeys={[this.state.current]} mode="horizontal" items={navItems} />
        {!this.props.local ? <><Select
          // value={this.props.portname}
          style={{ marginRight: 20, width: 160 }}
          placeholder="请选择座椅串口"
          onChange={(e) => {

            console.log(e);
            this.props.wsSendObj({ sitPort: e })
            this.props.changeStateData({portname : e})

          }}
          options={this.props.port}
        >
        </Select>

          <img src={exchange} onClick={() => {
            if (this.props.portname && this.props.portnameBack) {
              this.props.changeStateData({portname : this.props.portnameBack})
              this.props.changeStateData({portnameBack : this.props.portname})
              
              this.props.wsSendObj({ exchange: true })
            }
          }} style={{ height: "30px", marginRight: 20 }} alt="" />

          <Select
            // value={this.props.portnameBack}
            placeholder={"请选择靠背串口"}
            style={{ width: 160 }}
            onChange={(e) => {
              // this.props.handleChangeCom(e);
              console.log(e);
              this.props.wsSendObj({ backPort: e })
              // this.props.setPortnameBack(e)
              this.props.changeStateData({portnameBack : e})
              // if (ws && ws.readyState === 1)
              //   ws.send(JSON.stringify({ sitPort: e }));
            }}
            options={this.props.port}
          >
          </Select>

        </> : <Select
          // value={this.props.dataArr}
          placeholder={"请选择回放数据时间"}
          onChange={(e) => {
            // this.props.handleChangeCom(e);
            console.log(e);
            this.props.wsSendObj({ getTime: e, index: 0 })
            // this.props.wsSendObj({port : e})
            // if (ws && ws.readyState === 1)
            //   ws.send(JSON.stringify({ sitPort: e }));
          }}
          options={this.props.dataArr}
        >
          {/* {this.props.dataArr.map((el) => {
          return (
            <Select.Option
              key={el}
              label={el}
              value={el}
            />
          );
        })} */}
        </Select>}

        {this.props.matrixName == 'car' ?

          // <div style={{ display: 'flex' }}>
          //   <div className='aniButton' onClick={() => this.props.com.current?.actionBack()}>back</div>
          //   <div className='aniButton' onClick={() => this.props.com.current?.actionSit()}>sit</div>
          //   <div className='aniButton' onClick={() => this.props.com.current?.actionAll()}>all</div>
          // </div> 
          <Menu className='menu' onClick={this.onCarClick} selectedKeys={[this.state.carCurrent]} mode="horizontal" items={carItems} />
          : null}
        <Button onClick={() => {
          const flag = this.props.colFlag
          const date = new Date(Date.now());
          const formattedDate = date.toLocaleString();
          if (flag) {
            this.props.wsSendObj({ flag: true, time: formattedDate })
          } else {
            this.props.wsSendObj({ flag: flag })
          }
          console.log(flag)
          // this.props.setColFlag(!flag)
          this.props.changeStateData({colFlag : !flag})
          this.props.setColValueFlag(flag)
        }}>{this.props.colFlag ? '采集' : '停止'}{this.state.num ? this.state.num : null}</Button>
      </div>
      <div style={{ position: 'relative' }}>
        <img onClick={() => { 
          const show = this.state.show
          this.setState({
            show : !show
          })
          // setShow(!show) 
          }} className='optionImg' src={option} alt="" />
        {
          this.state.show ? <div className='slideContent' style={{ position: 'absolute', width: '300px', padding: '20px', backgroundColor: 'rgba(21,18,42,0.8)', borderRadius: '20px', right: 0, zIndex: 100 }}>
            <div
              className="flexcenter"
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >

              <div
                className="progerssSlide"
                style={{
                  display: "flex",

                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#468493",
                    minWidth: "80px",
                    textAlign: "left",
                  }}
                >
                  润滑
                </div>
                <Slider
                  min={0.1}
                  max={8}
                  onChange={(value) => {
                    localStorage.setItem("carValueg", value);
                    // this.props.setValueg1(value);
                    this.props.changeStateData({valueg1 : value})
                    this.props.com.current?.sitValue({
                      valueg: value,
                    });
                    this.props.com.current?.backValue({
                      valueg: value,
                    });
                  }}
                  value={this.props.valueg1}
                  step={0.1}
                  // value={this.props.}
                  style={{ width: '200px' }}
                />
              </div>
              <div
                className="progerssSlide"
                style={{
                  display: "flex",
                  alignItems: "center",
                  //   padding : '5px',
                  //   borderRadius : 10,
                  //   backgroundColor : '#72aec9'
                }}
              >
                <div
                  style={{
                    color: "#468493",
                    minWidth: "80px",
                    textAlign: "left",
                    // backgroundColor : '#6397ae' ,
                    //  padding : 5,borderRadius : '5px 10px',
                  }}
                >
                  颜色
                </div>
                <Slider
                  min={5}
                  max={2000}
                  onChange={(value) => {
                    localStorage.setItem("carValuej", value);
                    // this.props.setValuej1(value);
                    this.props.changeStateData({valuej1 : value})
                    this.props.com.current?.sitValue({
                      valuej: value,
                    });
                    this.props.com.current?.backValue({
                      valuej: value,
                    });
                  }}
                  value={this.props.valuej1}
                  step={10}
                  // value={this.props.}
                  style={{ width: '200px' }}
                />
              </div>
              <div
                className="progerssSlide"
                style={{
                  display: "flex",

                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#468493",
                    minWidth: "80px",
                    textAlign: "left",
                  }}
                >
                  过滤值{" "}
                </div>
                <Slider
                  min={1}
                  max={500}
                  onChange={(value) => {
                    localStorage.setItem("carValuef", value);
                    // this.props.setValuef1(value);
                    this.props.changeStateData({valuef1 : value})
                    this.props.com.current?.sitValue({
                      valuef: value,
                    });
                    this.props.com.current?.backValue({
                      valuef: value,
                    });
                  }}
                  value={this.props.valuef1}
                  step={2}
                  // value={this.props.}
                  style={{ width: '200px' }}
                />
              </div>

              <div
                className="progerssSlide"
                style={{
                  display: "flex",

                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#468493",
                    minWidth: "80px",
                    textAlign: "left",
                  }}
                >
                  高度
                </div>
                <Slider
                  min={0.1}
                  max={15}
                  onChange={(value) => {
                    localStorage.setItem("carValue", value);
                    // this.props.setValue1(value);
                    this.props.changeStateData({value1 : value})
                    this.props.com.current?.sitValue({
                      value: value,
                    });
                    this.props.com.current?.backValue({
                      value: value,
                    });
                  }}
                  value={this.props.value1}
                  step={0.02}
                  // value={this.props.}
                  style={{ width: '200px' }}
                />
              </div>
              <div
                className="progerssSlide"
                style={{
                  display: "flex",

                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#468493",
                    minWidth: "80px",
                    textAlign: "left",
                  }}
                >
                  数据连贯性{" "}
                </div>
                <Slider
                  min={1}
                  max={20}
                  onChange={(value) => {
                    localStorage.setItem("carValuel", value);
                    // this.props.setValuel1(value);
                    this.props.changeStateData({valuel1 : value})
                    this.props.com.current?.sitValue({
                      valuel: value,
                    });
                    this.props.com.current?.backValue({
                      valuel: value,
                    });
                  }}
                  value={this.props.valuel1}
                  step={1}
                  // value={this.props.}
                  style={{ width: '200px' }}
                />
              </div>

              <div
                className="progerssSlide"
                style={{
                  display: "flex",

                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "#468493",
                    minWidth: "80px",
                    textAlign: "left",
                  }}
                >
                  初始值{" "}
                </div>
                <Slider
                  min={1}
                  max={10000}
                  onChange={(value) => {
                    localStorage.setItem("carValueInit", value);
                    // this.props.setValuelInit1(value);
                    this.props.changeStateData({valuelInit1 : value})
                    this.props.com.current?.sitValue({
                      valuelInit: value,
                    });
                    this.props.com.current?.backValue({
                      valuelInit: value,
                    });
                  }}
                  value={this.props.valuelInit1}
                  step={500}
                  // value={this.props.}
                  style={{ width: '200px' }}
                />
              </div>
            </div>
          </div> : <div></div>
        }
      </div>




    </div>
      ;
  };
}
export default Title;