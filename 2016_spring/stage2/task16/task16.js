window.onload = function(){
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var cityName = document.getElementById("aqi-city-input").value.trim();
  var airQuality = document.getElementById("aqi-value-input").value.trim();
	
  if(!cityName.match(/^[A-Za-z\u4E00-\u9FA5]+$/)){
    alert("城市名必须为中英文字符！");
    return;
  }
  if(!airQuality.match(/^\d+$/)){
    alert("空气质量指数必须为整数！");
    return;
  }

	aqiData[cityName] = airQuality;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var newTableHtml = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
  var aqi_table = document.getElementById("aqi-table");
  var counter = 0;
  for(var cityName in aqiData){
    newTableHtml += "<tr><td>"+cityName+"</td><td>"+aqiData[cityName]+"</td><td><button>删除</button></td></tr>"
    counter++;
  }
  if(counter == 0)
    newTableHtml = "";
  aqi_table.innerHTML = newTableHtml;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event) {
  // do sth.
  if(event.target.tagName == "BUTTON"){

      var cityName = event.target.parentNode.parentNode.firstChild.innerHTML;
      var tbody = event.target.parentNode.parentNode.parentNode;
      var tr = event.target.parentNode.parentNode;

      delete aqiData[cityName];
      tbody.removeChild(tr);
      renderAqiList();
  }
}

function init() {
  var add_btn = document.getElementById("add-btn");
  var aqi_table = document.getElementById("aqi-table");
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  add_btn.addEventListener("click", addBtnHandle);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  aqi_table.addEventListener("click", delBtnHandle);
}

init();

}