let rainbowColors = [
    // "#FF0000", // 红
    // "#FF3300",
    // "#FF6600",
    // "#FF9900",
    // "#FFCC00",
    "#FFFF00", // 黄
    "#CCFF00",
    "#99FF00",
    "#66FF00",
    "#33FF00",
    "#00FF00", // 绿
    "#00FF33",
    "#00FF66",
    "#00FF99",
    "#00FFCC",
    "#00FFFF", // 蓝
    "#00CCFF",
    "#0099FF",
    "#0066FF",
    ...new Array(2).fill("#0066FF"),
    ...new Array(3).fill("#ffffff"),
    // "#0033FF",
    '#ffffff'
    // "#0000FF", // 靛
    // "#3300FF",
    // "#6600FF",
    // "#9900FF",
    // "#CC00FF",
    // "#FF00FF", // 紫
    // "#FF33FF",
    // "#FF66FF",
    // "#FF99FF",
    // "#FFCCFF"
  ];

  rainbowColors = rainbowColors.map((a) => JSON.parse(colorRgb(a)) )
  console.log(rainbowColors)
   function colorRgb(sColor){
    sColor = sColor.toLowerCase();
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i=1; i<4; i+=1) {
                sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));    
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i=1; i<7; i+=2) {
            sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));    
        }
        return "[" + sColorChange.join(",") + "]";
    }
    return sColor;
  };