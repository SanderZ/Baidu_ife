window.onload = function(){
/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

var citySelector = document.getElementById("city-select");

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

function getWidth(){
  return window.innerWidth * 0.8;
}

/**
 * 渲染图表
 */
function renderChart() {
  var chartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
  var color = ""
  var newHtmlText = "";

  currentChartData = chartData[pageState.nowGraTime][pageState.nowSelectCity];
  var count = 0;

  for (var item in currentChartData) {
    count++;
  }

  var width = getWidth() / count;

  for (var item in currentChartData) {
    color = '#' + Math.floor((Math.random() + 0.3) / 1.3 * 0xFFFFFF).toString(16);
    newHtmlText += '<div title="' + item + ":" + currentChartData[item] + '" style="height:' + currentChartData[item] + 'px; background-color:' + color + '; display: inline-block; width:' + width + 'px"></div>';
  }
  chartWrap.innerHTML = newHtmlText;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据
  var radios = document.getElementsByName("gra-time");
  for(var i = 0; i <　radios.length; i++){
    if(radios[i].checked){
      pageState.nowGraTime = radios[i].value;
      break;
    }
  }
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据
  pageState.nowSelectCity = citySelector.options[citySelector.selectedIndex].id;
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var form = document.getElementById("form-gra-time");
  form.addEventListener("change", graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  pageState.nowSelectCity = "北京";
  var newHtmlText = "";
  for(var city in aqiSourceData){
    newHtmlText += "<option id=\"" + city + "\">" + city + "</option>";
  }
  citySelector.innerHTML = newHtmlText;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelector.addEventListener("change",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  var weekData = {};
  var monthData = {};

  for(var city in aqiSourceData){
    var weekAvg = {};
    var monthAvg = {};
    var weekCount = [//一个月最多五周，记录数据中各个月各周各有几天
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
    ];
    var monthCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//一年12个月，记录数据中各个月各有几天
    var weekSum = [//一个月最多五周，记录数据中各个月各周空气质量指数之和
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0],
    ];
    var monthSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//一年12个月，记录数据中各个月空气质量指数之和
    //遍历当前城市中各日的数据
    for(var date in aqiSourceData[city]){
      var tempDate = date.split("-");
      var month = parseInt(tempDate[1]);
      var day = parseInt(tempDate[2]);
    
      var firstMondayDate = [4, 1, 7, 4, 2, 6, 4, 1, 5, 3, 7, 5];//2016年每个月的第一个周一分别为几号     
      var weekIndex = 0;
      if(day >= firstMondayDate[month - 1])
        weekIndex = Math.floor((day - firstMondayDate[month - 1]) / 7) + 1;

      weekCount[month - 1][weekIndex]++;
      weekSum[month - 1][weekIndex] += aqiSourceData[city][date];

      monthCount[month - 1]++;
      monthSum[month - 1] += aqiSourceData[city][date];
      
    }

    for(var i = 0; i < monthCount.length; i++){
      var monthKey = "2016年" + (i + 1) + "月";
      if(monthCount[i] != 0)
        monthAvg[monthKey] = monthSum[i] / monthCount[i];
      for(var j = 0; j < 5; j++){
        weekKey = "2016年" + (i + 1) + "月 第" + (j + 1) + "周"
        if(weekCount[i][j] != 0)
          weekAvg[weekKey] = weekSum[i][j] / weekCount[i][j];
      }
    }

    weekData[city] = weekAvg;
    monthData[city] = monthAvg;
  }
  // 处理好的数据存到 chartData 中
  chartData.day = aqiSourceData;
  chartData.week = weekData;
  chartData.month = monthData;

  renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();

}