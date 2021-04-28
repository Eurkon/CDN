var requests_url = 'https://hexo-circle-of-friends.vercel.app/api'; //api地址
var orign_data = []; //api请求所得到的源数据
var maxnumber = 20; //页面展示文章数量
var addnumber = 10; //每次加载增加的篇数
var opentype = '_blank';  //'_blank'打开新标签,'_self'本窗口打开
var nofollow = true; //禁止搜索引擎抓取
// 自定义loading图 例如: var loadingCutom = '<i class="fa fa-spinner fa-spin"></i>'
// 自定义loading图 例如: var loadingCutom = '<img src="你的图片地址" alt="加载中...">'
var loadingCutom = ''

//处理数据

if (document.getElementById('article-container')) {
  //添加加载动画
  var loading_pic = document.getElementById('article-container');

  // 判断loadingCutom值是否为空
  if (typeof loadingCutom == "undefined" || loadingCutom == null || loadingCutom === "") {
    loading_pic.innerHTML = '<span id="article_loading"><center><i class="fa fa-spinner fa-spin"></i></center></span>';
  } else {
    loading_pic.innerHTML = '<span id="article_loading">' + loadingCutom + '</span>';
  }

  fetch(requests_url).then(
    data => data.json()
  ).then(
    data => {
      orign_data = data;
      data_handle(nofollow, orign_data, maxnumber)
    }
  )
}

var data_handle = (nofollow, data, maxnumber) => {
  var today = todaypost();
  var Datetody = new Date(today);
  for (var item = 0; item < data[1].length; item++) {
    var Datedate = new Date(data[1][item][1]);
    if (Datedate > Datetody) {
      data[1].splice(item--, 1);
    }
  }
  var today_post = 0;
  var error = 0;
  var unique_live_link;
  var datalist = data[1].slice(0, maxnumber);
  var listlenth = data[1].length;
  var user_lenth = data[0].length;
  var datalist_slice = slice_month(datalist);
  var last_update_time = timezoon(datalist_slice);
  var link_list = [];
  for (var item of data[1]) {
    if (item[1] === today) {
      today_post += 1;
    }
    link_list.push(item[3]);
  }
  var arr = unique(link_list);
  unique_live_link = arr.length;
  for (var item of data[0]) {
    if (item[3] === 'true') {
      error += 1;
    }
  }
  var html_item = '<div class="article-sort-title">统计信息</div>';
  html_item += '<div class="article-sort">'
  html_item += '<div id="info_user_pool" class="article-sort-item">';
  html_item += '<div class="friend-chart"><span class="friend-post-info-title">当前友链数：</span><span class="friend-post-info-number">' + user_lenth + ' 个</span><br><span class="friend-post-info-title">失败数：</span><span class="friend-post-info-number">' + error + ' 个</span><br></div>';
  html_item += '<div class="friend-chart"><span class="friend-post-info-title">活跃友链数：</span><span class="friend-post-info-number">' + unique_live_link + ' 个</span><br><span class="friend-post-info-title">当前库存：</span><span class="friend-post-info-number">' + listlenth + ' 篇</span><br></div>';
  html_item += '<div class="friend-chart"><span class="friend-post-info-title">今日更新：</span><span class="friend-post-info-number">' + today_post + ' 篇</span><br><span class="friend-post-info-title">最近更新：</span><span class="friend-post-info-number">' + last_update_time + '</span><br></div>';
  html_item += '</div></div>';

  for (var month_item of datalist_slice) {
    html_item += '<div class="article-sort-title">' + month_item[0] + '</div> <div class="article-sort">';
    for (var post_item of month_item[1]) {
      var rel = '';
      if (nofollow && opentype == '_blank') {
        rel = 'noopener nofollow';
      } else if (nofollow) {
        rel = 'nofollow';
      } else if (opentype == '_blank') {
        rel = 'noopener';
      } else {
        rel = '';
      }
      html_item += '<div class="article-sort-item">';
      html_item += '<a target="' + opentype + '" class="article-sort-item-img" href="' + post_item[2] + '" title="' + post_item[0] + '"rel="' + rel + '">';
      html_item += '<img onerror="this.onerror=null,this.src="/img/404.png" src="' + post_item[4] + '"></a>';
      html_item += '<div class="article-sort-item-info">';
      html_item += `<a target="${opentype}" class="article-sort-item-title" href="${post_item[2]}" title="${post_item[0]}"rel="${rel}">${post_item[0]}</a>`;
      html_item += '<div class="article-meta-wrap">'
      html_item += '<i class="far fa-user"></i><span style="padding:0 .2rem;">' + post_item[3] + '</span>';
      html_item += '<div class="article-sort-item-time"><i class="far fa-calendar-alt"></i>' + '<time datetime="' + post_item[1] + '" title="' + post_item[1] + '">' + post_item[1] + '</time></div>';
      html_item += '</div></div></div>';
    }
    html_item += '</div>'
  }
  if (data[1].length - maxnumber > 0) {
    html_item += '<a class="button--animated" style="display:block;margin-top:0.7rem;background-color:var(--btn-bg);color:var(--btn-color);text-align:center;line-height:2.4;" onclick="load_more_post()">加载更多</a></div>'
  }
  html_item += '<style>.friend-post-info-title{font-weight:700}.friend-post-info-number{float:right}.friend-chart{align-items:flex-start;flex:1;width:100px;height:60px;margin:10px}@media screen and (max-width:500px){#info_user_pool{flex-direction:column;max-height:200px}.friend-chart{flex:0;width:100%;height:160px;margin:0}}</style>'

  var article_container = document.getElementById('article-container');
  append_div(article_container, html_item)
};

var load_more_post = () => {
  if (document.getElementById('article-container')) {
    maxnumber = maxnumber + addnumber;
    document.getElementById('article-container').innerHTML = "";
    data_handle(nofollow, orign_data, maxnumber)
  }
};

//加载更多文章
//将html放入指定id的div容器
var append_div = (parent, text) => {
  if (document.getElementById('article-container')) {
    loading_pic.innerHTML = ``;
  };
  if (typeof text === 'string') {
    var temp = document.createElement('div');
    temp.innerHTML = text;
    // 防止元素太多 进行提速
    var frag = document.createDocumentFragment();
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    parent.appendChild(frag);
  } else {
    parent.appendChild(text);
  }
};

//去重
var unique = (arr) => {
  return Array.from(new Set(arr))
};

//时区优化
var formatDate = (strDate) => {
  try {
    var date = new Date(Date.parse(strDate.replace(/-/g, "/")));
    var gettimeoffset;
    if (new Date().getTimezoneOffset()) {
      gettimeoffset = new Date().getTimezoneOffset();
    } else {
      gettimeoffset = 8;
    }
    var timeoffset = gettimeoffset * 60 * 1000;
    var len = date.getTime();
    var date2 = new Date(len - timeoffset);
    var sec = date2.getSeconds().toString();
    var min = date2.getMinutes().toString();
    if (sec.length === 1) {
      sec = "0" + sec;
    }
    if (min.length === 1) {
      min = "0" + min;
    }
    return date2.getFullYear().toString() + "/" + (date2.getMonth() + 1).toString() + "/" + date2.getDate().toString() + " " + date2.getHours().toString() + ":" + min + ":" + sec
  } catch (e) {
    return ""
  }
};

var timezoon = (datalist_slice) => {
  var time = datalist_slice[0][1][0][5];
  return formatDate(time)
};

//今日时间
var todaypost = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString();
  var day = (date.getDate()).toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day
};

//月份切片
var slice_month = (data) => {
  var monthlist = [];
  var datalist = [];
  var data_slice = data;
  for (var item in data_slice) {
    data_slice[item].push(item);
    if (data_slice[item][1].lenth !== 10) {
      var list = data_slice[item][1].split('-');
      if (list[1].length < 2) {
        list[1] = "0" + list[1]
      }
      if (list[2].length < 2) {
        list[2] = "0" + list[2]
      }
      data_slice[item][1] = list.join('-')
    }
    var month = data_slice[item][1].slice(0, 7);
    if (monthlist.indexOf(month) !== -1) {
      datalist[monthlist.length - 1][1].push(data_slice[item])
    } else {
      monthlist.push(month);
      datalist.push([month, [data_slice[item]]])
    }
  }
  for (var mounthgroup of datalist) {
    mounthgroup.push(mounthgroup[1][0][6]);
  }
  return datalist
};
