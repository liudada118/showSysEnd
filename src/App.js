import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";

// import Local from "./components/local/Car";
// import Back from "./components/playBack/Car";
// import Foot from './components/foot/Car'
// import Local from './components/foot/Num32DetectLocal'
import Home from './page/home/Home'
import Demo from "./components/demo/Demo";
import { Heatmap } from "./components/heatmap/canvas";
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/heatmap" element={<Heatmap />} />
        <Route exact path="/num" element={<Demo />} />
        {/* <Route exact path="/local" element={<Local />} /> */}
        {/* <Route exact path="/back" element={<Back />} /> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
