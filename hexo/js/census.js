btf.isJqueryLoad(() => {
  init()
})

async function init () {
  const source = $('#sources-chart')
  const trend = $('#trends-chart')
  const map = $('#map-chart')

  if (source.length > 0 || trend.length > 0 || map.length > 0) {
    $('head').after('<style>#map-chart,#sources-chart,#trends-chart{width: 100%;height: 300px;margin: 0.5rem auto;padding: 0.5rem;overflow-x: hidden;overflow-y: hidden;}</style>')
    if (source.length > 0 && $('#sourcesChart').length === 0) {
      source.after(await sourcesChart())
    }
    if (trend.length > 0 && $('#trendsChart').length === 0) {
      trend.after(await trendsChart())
    }
    if (map.length > 0 && $('#mapChart').length === 0) {
      map.after(await mapChart())
    }
  }
}

const apiKey = 'oTe3eg0Ggy1AKYBTmNIrO0Cm'
const secretKey = 'Ygpg5sERFfOuV6LTUorWYy8kpXbMhseH'
const redirectUri = 'oob'
const siteName = 'blog.eurkon.com'
const authCode = '973770653c16c611c830151d570e7c92'
const accessToken = '121.b76d7c44c513f7f7728d950407a1b910.YmEPY_Di3if1SZ_x9QNrxknsdyipVO_pW_nvbFO.fIYlwQ'
const siteId = '16265874'
const siteUrl = 'https://openapi.baidu.com/rest/2.0/tongji/config/getSiteList?access_token=' + accessToken;
const dataUrl = 'https://openapi.baidu.com/rest/2.0/tongji/report/getData?access_token=' + accessToken + '&site_id=' + siteId;
const tokenUrl = 'http://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code=' + authCode + '&client_id=' + apiKey + '&client_secret=' + secretKey + '&redirect_uri=' + redirectUri;

function getToday () {
  var now = new Date();
  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日
  var clock = year;
  if (month < 10)
    clock += "0";
  clock += month;
  if (day < 10)
    clock += "0";
  clock += day;
  return clock;
}

// 浏览器打开链接通过身份验证，获取AuthCode
function getAuthCode () {
  let authorizeUrl = 'http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=' + apiKey + '&redirect_uri=' + redirectUri + '&scope=basic&display=popup';
  console.log(authorizeUrl);
}

// 获取AccessToken
function getAccessToken () {
  $.cors(tokenUrl)
    .then(data => data.json())
    .then(data => {
      console.log(data);
    }).catch(function (error) {
      console.log(error);
    });
}

// 获取网站Id
function getSiteId () {
  $.cors(siteUrl)
    .then(data => data.json())
    .then(data => {
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].domain === siteName) {
          return data.list[i].site_id;
        }
      }
    }).catch(function (error) {
      console.log(error);
    });
}

// 访问次数（PV）月份趋势
function trendsChart () {
  return new Promise(resolve => {
    const paramUrl = '&start_date=20210101&end_date=' + getToday() + '&metrics=pv_count&method=trend/time/a&gran=month'
    $.cors(dataUrl + paramUrl)
      .then(data => data.json())
      .then(data => {
        // const monthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        // const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        // const yearNum = data.result.total / 12
        const monthArr = []
        const monthValueArr = []
        const monthName = data.result.items[0]
        const monthValue = data.result.items[1]
        for (let i = Math.min(monthName.length, 12) - 1; i >= 0; i--) {
          monthArr.push(monthName[i][0].substring(0, 7).replace('/', '-'))
          if (monthValue[i][0] !== '--') {
            monthValueArr.push(monthValue[i][0])
          } else {
            monthValueArr.push(null)
          }
        }

        const monthArrJson = JSON.stringify(monthArr)
        const monthValueArrJson = JSON.stringify(monthValueArr)

        resolve(`
          <script id="trendsChart">
            var trendsChart = echarts.init(document.getElementById('trends-chart'), 'light');
            var trendsOption = {
              textStyle: {
                color: '#FFF'
              },
              title: {
                text: '博客访问量统计图',
                x: 'center',
                textStyle: {
                  color: '#FFF'
                }
              },
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                name: '日期',
                type: 'category',
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#FFF'
                  }
                },
                data: ${monthArrJson}
              },
              yAxis: {
                name: '访问次数',
                type: 'value',
                splitLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#FFF'
                  }
                }
              },
              series: [{
                name: '访问次数',
                type: 'line',
                smooth: true,
                lineStyle: {
                    width: 0
                },
                showSymbol: false,
                itemStyle: {
                  opacity: 1,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(128, 255, 165)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(1, 191, 236)'
                  }])
                },
                areaStyle: {
                  opacity: 1,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(128, 255, 165)'
                  }, {
                    offset: 1,
                    color: 'rgba(1, 191, 236)'
                  }])
                },
                data: ${monthValueArrJson},
                markLine: {
                  data: [{
                    name: '平均值',
                    type: 'average'
                  }]
                }
              }]
            };
            trendsChart.setOption(trendsOption);
            window.addEventListener("resize", () => { 
              trendsChart.resize();
            });
          </script>`)
      }).catch(function (error) {
        console.log(error);
      });
  })
}

// 访问次数（PV）来源
function sourcesChart () {
  return new Promise(resolve => {
    const paramUrl = '&start_date=20210101&end_date=' + getToday() + '&metrics=pv_count&method=source/all/a';
    $.cors(dataUrl + paramUrl)
      .then(data => console.log(data))
      .then(data => {
        monthArr = [];
        let sourcesName = data.result.items[0]
        let sourcesValue = data.result.items[1]
        let sourcesArr = []
        for (let i = 0; i < sourcesName.length; i++) {
          sourcesArr.push({ name: sourcesName[i][0].name, value: sourcesValue[i][0] })
        }
        const sourcesArrJson = JSON.stringify(sourcesArr)
        resolve(`
          <script id="sourcesChart">
            var sourcesChart = echarts.init(document.getElementById('sources-chart'), 'light');
            var sourcesOption = {
              textStyle: {
                color: '#FFF'
              },
              title: {
                text: '博客访问来源统计图',
                x: 'center',
                textStyle: {
                  color: '#FFF'
                }
              },
              legend: {
                top: 'bottom',
                textStyle: {
                  color: '#FFF'
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: [{
                name: '访问次数',
                type: 'pie',
                radius: [30, 80],
                center: ['50%', '50%'],
                roseType: 'area',
                label: {
                  formatter: "{b} : {c} \\n ({d}%)"
                },
                data: ${sourcesArrJson},
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }
              }]
            };
          sourcesChart.setOption(sourcesOption);
          window.addEventListener("resize", () => { 
            sourcesChart.resize();
          });
          </script>`);
      }).catch(function (error) {
        console.log(error);
      });
  })
}

// 访问次数（PV）来源
function mapChart () {
  return new Promise(resolve => {
    const paramUrl = '&start_date=20210101&end_date=' + getToday() + '&metrics=pv_count&method=visit/district/a';
    $.cors(dataUrl + paramUrl)
      .then(data => data.json())
      .then(data => {
        monthArr = [];
        let mapName = data.result.items[0]
        let mapValue = data.result.items[1]
        let mapArr = []
        let max = mapValue[0][0]
        for (let i = 0; i < mapName.length; i++) {
          mapArr.push({ name: mapName[i][0].name, value: mapValue[i][0] })
        }
        const mapArrJson = JSON.stringify(mapArr)
        resolve(`
          <script id="mapChart">
            var mapChart = echarts.init(document.getElementById('map-chart'), 'light');
            var mapOption = {
              textStyle: {
                color: '#FFF'
              },
              title: {
                text: '博客访问来源地图',
                x: 'center',
                textStyle: {
                  color: '#FFF'
                }
              },
              tooltip: {
                trigger: 'item'
              },
              visualMap: {
                min: 0,
                max: 1000,
                left: 'left',
                top: 'bottom',
                text: ['高','低'],
                color: ['#1E90FF', '#AAFAFA'],
                textStyle: {
                  color: '#FFF'
                },
                calculable: true
              },
              series: [{
                name: '访问次数',
                type: 'map',
                mapType: 'china',
                showLegendSymbol: false,
                label: {
                  emphasis: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    areaColor: '#111',
                    borderColor: '#20232a'
                  },
                  emphasis: {
                    areaColor: 'gold'
                  }
                },
                data: ${mapArrJson}
                }]
            };
          mapChart.setOption(mapOption);
          window.addEventListener("resize", () => { 
            mapChart.resize();
          });
          </script>`);
      }).catch(function (error) {
        console.log(error);
      });
  })
}
