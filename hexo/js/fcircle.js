//默认数据
var fdata = {
  jsonurl: '',
  apiurl: 'https://hexo-circle-of-friends-eurkon.vercel.app/',
  apipubliburl: 'https://circle-of-friends-simple.vercel.app/', //默认公共库
  initnumber: 20,  //首次加载文章数
  stepnumber: 10,  //更多加载文章数
  article_sort: 'created', //文章排序 updated or created
  error_img: 'https://sdn.geekzu.org/avatar/57d8260dfb55501c37dde588e7c3852c'
}
//可通过 var fdataUser 替换默认值
if (typeof (fdataUser) !== 'undefined') {
  for (var key in fdataUser) {
    if (fdataUser[key]) {
      fdata[key] = fdataUser[key]
    }
  }
}
var article_num = '', sortNow = '', UrlNow = '', friends_num = ''
var container = document.createElement('div')
container.id = 'fc-container'
document.getElementById('article-container').appendChild(container)
container.classList.add('article-sort')
container.classList.add('fc-article-sort')

// 获取本地 排序值、加载apiUrl，实现记忆效果
var localSortNow = localStorage.getItem('sortNow')
var localUrlNow = localStorage.getItem('urlNow')
if (localSortNow && localUrlNow) {
  sortNow = localSortNow
  UrlNow = localUrlNow
} else {
  sortNow = fdata.article_sort
  if (fdata.jsonurl) {
    UrlNow = fdata.apipubliburl + 'postjson?jsonlink=' + fdata.jsonurl + '&'
  } else if (fdata.apiurl) {
    UrlNow = fdata.apiurl + 'all?'
  } else {
    UrlNow = fdata.apipubliburl + 'all?'
  }
  console.log('当前模式：' + UrlNow)
  localStorage.setItem('urlNow', UrlNow)
  localStorage.setItem('sortNow', sortNow)
}
// 打印基本信息
function loadStatistical (sdata) {
  article_num = sdata.article_num
  friends_num = sdata.friends_num
  var messageBoard = `
    <div id="fc-state" class="article-sort-item">
      <div class="fc-state-data">
        <div class="fc-data-friends" onclick="openToShow()">
          <span class="fc-label">订阅</span>
          <span class="fc-message">${sdata.friends_num}</span>
        </div>
        <div class="fc-data-active" onclick="changeEgg()">
          <span class="fc-label">活跃</span>
          <span class="fc-message">${sdata.active_num}</span>
        </div>
        <div class="fc-data-article" onclick="clearLocal()">
          <span class="fc-label">日志</span>
          <span class="fc-message">${sdata.article_num}</span>
        </div>
      </div>
      <div id="fc-change">
          <span id="fc-change-created" data-sort="created" onclick="changeSort(event)" class="${sortNow == 'created' ? 'fc-change-now' : ''}">Created</span> | <span id="fc-change-updated" data-sort="updated" onclick="changeSort(event)" class="${sortNow == 'updated' ? 'fc-change-now' : ''}" >Updated</span>
      </div>
    </div>
  `
  var loadMoreBtn = `
      <div id="fc-more" class="article-sort-item" onclick="loadNextArticle()"><i class="fas fa-angle-double-down"></i></div>
      <div id="fc-footer" class="fc-new-add">
        <span id="fc-version-up"></span>
        <span class="fc-data-lastupdated" onclick="checkVersion()"> 更新于：${sdata.last_updated_time}</span>
      </div>
      <div id="fc-overlay" onclick="closeShow()"></div>
      <div id="fc-overshow"></div>
  `
  if (container) {
    container.insertAdjacentHTML('beforebegin', messageBoard)
    container.insertAdjacentHTML('afterend', loadMoreBtn)
  }
}
// 打印文章内容 fc-article
function loadArticleItem (datalist, start, end) {
  var articleItem = ''
  var articleNum = article_num
  var endFor = end
  if (end > articleNum) { endFor = articleNum }
  if (start < articleNum) {
    for (var i = start; i < endFor; i++) {
      var item = datalist[i]
      articleItem += `
      <div class="article-sort-item">
        <a class="article-sort-item-img" onclick="openMeShow(event)" title="${item.author}" data-link="${item.link}" target="_blank" rel="noopener nofollow" href="javascript:;"> 
          <img src="${item.avatar}" alt="${item.title}" onerror="this.onerror=null;this.src='${fdata.error_img}';">
        </a>
        <div class="article-sort-item-info no-lightbox flink-item-icon">
          <a class="article-sort-item-title" href="${item.link}" target="_blank" rel="noopener nofollow" title="${item.title}">${item.title}</a>
          <span class="article-sort-item-index">${item.floor}</span>
          <div class="article-meta-wrap">
            <i class="far fa-user"></i>
            <span class="fc-article-author">${item.author}</span>
            <div class="article-sort-item-time">
              <span class="fc-time-created" style="${sortNow == 'created' ? '' : 'display:none'}"><i class="far fa-calendar-alt"></i> ${item.created} </span>
              <span class="fc-time-updated" style="${sortNow == 'updated' ? '' : 'display:none'}"><i class="fas fa-history"></i> ${item.updated} </span>
            </div>
          </div>
        </div>
      </div>
      `
    }
    container.insertAdjacentHTML('beforeend', articleItem)
    // 预载下一页文章
    fetchNextArticle()
  } else {
    // 文章加载到底
    document.getElementById('fc-more').outerHTML = `<div id="fc-more" class="article-sort-item" onclick="loadNoArticle()"><span>一切皆有尽头！</span></div>`
  }
}
// 打印个人卡片 fc-overshow
function loadFcircleShow (userinfo, articledata) {
  var showHtml = `
      <div class="fc-overshow">
        <div class="fc-overshow-head avatar-img">
          <a class="" target="_blank" rel="noopener nofollow" href="${userinfo.link}"><img src="${userinfo.avatar}" alt="avatar" onerror="this.src='${fdata.error_img}'; this.onerror = null;"></a>
        </div>
        <div>
          <i class="far fa-user"></i>
          <span class="fc-article-author">${userinfo.author}</span>
        </div>
        <div class="fc-overshow-content">
  `
  for (var i = 0; i < userinfo.article_num; i++) {
    var item = articledata[i]
    showHtml += `
      <p><a class="article-sort-item-title" href="${item.link}" target="_blank" rel="noopener nofollow" title="${item.title}">${item.title}</a><span>${item.created}</span></p>
    `
  }
  showHtml += '</div></div>'
  document.getElementById('fc-overshow').insertAdjacentHTML('beforeend', showHtml)
  document.getElementById('fc-overshow').className = 'fc-show-now'
}

// 预载下一页文章，存为本地数据 nextArticle
function fetchNextArticle () {
  var start = document.getElementById('article-container').getElementsByClassName('article-sort-item').length
  var end = start + fdata.stepnumber
  var articleNum = article_num
  if (end > articleNum) {
    end = articleNum
  }
  if (start < articleNum) {
    UrlNow = localStorage.getItem('urlNow')
    var fetchUrl = UrlNow + 'rule=' + sortNow + '&start=' + start + '&end=' + end
    //console.log(fetchUrl)
    fetch(fetchUrl)
      .then(res => res.json())
      .then(json => {
        var nextArticle = eval(json.article_data);
        console.log('已预载' + '?rule=' + sortNow + '&start=' + start + '&end=' + end)
        localStorage.setItem('nextArticle', JSON.stringify(nextArticle))
      })
  } else if (start = articleNum) {
    document.getElementById('fc-more').outerHTML = `<div id="fc-more" class="article-sort-item" onclick="loadNoArticle()"><small>一切皆有尽头！</small></div>`
  }
}
// 显示下一页文章，从本地缓存 nextArticle 中获取
function loadNextArticle () {
  var nextArticle = JSON.parse(localStorage.getItem('nextArticle'));
  var articleItem = ''
  for (var i = 0; i < nextArticle.length; i++) {
    var item = nextArticle[i]
    articleItem += `
    <div class="article-sort-item">
      <a class="article-sort-item-img" onclick="openMeShow(event)" title="${item.author}" data-link="${item.link}" target="_blank" rel="noopener nofollow" href="javascript:;"> 
        <img src="${item.avatar}" alt="${item.title}" onerror="this.onerror=null;this.src='${fdata.error_img}';">
      </a>
      <div class="article-sort-item-info no-lightbox flink-item-icon">
        <a class="article-sort-item-title" href="${item.link}" target="_blank" rel="noopener nofollow" title="${item.title}">${item.title}</a>
        <span class="article-sort-item-index">${item.floor}</span>
        <div class="article-meta-wrap">
          <i class="far fa-user"></i>
          <span class="fc-article-author">${item.author}</span>
          <div class="article-sort-item-time">
            <span class="fc-time-created" style="${sortNow == 'created' ? '' : 'display:none'}"><i class="far fa-calendar-alt"></i> 发表于 ${item.created} </span>
            <span class="fc-time-updated" style="${sortNow == 'updated' ? '' : 'display:none'}"><i class="fas fa-history"></i> 更新于 ${item.updated} </span>
          </div>
        </div>
      </div>
    </div>
    `
  }
  container.insertAdjacentHTML('beforeend', articleItem)
  // 同时预载下一页文章
  fetchNextArticle()
}
// 没有更多文章
function loadNoArticle () {
  var articleSortData = sortNow + 'ArticleData'
  localStorage.removeItem(articleSortData)
  localStorage.removeItem('statisticalData')
  //localStorage.removeItem('sortNow')
  document.getElementById('fc-more').remove()
  window.scrollTo(0, document.getElementsByClassName('fc-state').offsetTop)
}
// 清空本地数据
function clearLocal () {
  localStorage.removeItem('updatedArticleData')
  localStorage.removeItem('createdArticleData')
  localStorage.removeItem('nextArticle')
  localStorage.removeItem('statisticalData')
  localStorage.removeItem('sortNow')
  localStorage.removeItem('urlNow')
  location.reload()
}
//
function checkVersion () {
  var url = fdata.apiurl + 'version'
  fetch(url)
    .then(res => res.json())
    .then(json => {
      var nowStatus = json.status, nowVersion = json.current_version, newVersion = json.latest_version
      var versionID = document.getElementById('fc-version-up')
      if (nowStatus == 0) {
        versionID.innerHTML = '当前版本：v' + nowVersion
      } else if (nowStatus == 1) {
        versionID.innerHTML = '发现新版本：v' + nowVersion + ' ↦ ' + newVersion
      } else {
        versionID.innerHTML = '网络错误，检测失败！'
      }
    })
}
// 切换为公共全库
function changeEgg () {
  //有自定义json或api执行切换
  if (fdata.jsonurl || fdata.apiurl) {
    document.querySelectorAll('.article-sort-item').forEach(el => el.remove())
    localStorage.removeItem('updatedArticleData')
    localStorage.removeItem('createdArticleData')
    localStorage.removeItem('nextArticle')
    localStorage.removeItem('statisticalData')
    container.innerHTML = ''
    document.getElementById('fc-footer').remove()
    document.getElementById('fc-overlay').remove()
    document.getElementById('fc-overshow').remove()
    UrlNow = localStorage.getItem('urlNow')
    //console.log('新'+UrlNow)
    var UrlNowPublic = fdata.apipubliburl + 'all?'
    if (UrlNow !== UrlNowPublic) { //非完整默认公开库
      changeUrl = fdata.apipubliburl + 'all?'
    } else {
      if (fdata.jsonurl) {
        changeUrl = fdata.apipubliburl + 'postjson?jsonlink=' + fdata.jsonurl + '&'
      } else if (fdata.apiurl) {
        changeUrl = fdata.apiurl + 'all?'
      }
    }
    localStorage.setItem('urlNow', changeUrl)
    FetchFriendCircle(sortNow, changeUrl)
  } else {
    clearLocal()
  }
}
// 首次加载文章
function FetchFriendCircle (sortNow, changeUrl) {
  var end = fdata.initnumber
  var fetchUrl = UrlNow + 'rule=' + sortNow + '&start=0&end=' + end
  if (changeUrl) {
    fetchUrl = changeUrl + 'rule=' + sortNow + '&start=0&end=' + end
  }
  //console.log(fetchUrl)
  fetch(fetchUrl)
    .then(res => res.json())
    .then(json => {
      var statisticalData = json.statistical_data
      var articleData = eval(json.article_data)
      var articleSortData = sortNow + 'ArticleData'
      loadStatistical(statisticalData)
      loadArticleItem(articleData, 0, end)
      localStorage.setItem('statisticalData', JSON.stringify(statisticalData))
      localStorage.setItem(articleSortData, JSON.stringify(articleData))
    })
}
// 点击切换排序
function changeSort (event) {
  sortNow = event.currentTarget.dataset.sort
  localStorage.setItem('sortNow', sortNow)
  document.querySelectorAll('.article-sort-item').forEach(el => el.remove())
  container.innerHTML = ''
  document.getElementById('fc-footer').remove()
  document.getElementById('fc-overlay').remove()
  document.getElementById('fc-overshow').remove()
  changeUrl = localStorage.getItem('urlNow')
  initFriendCircle(sortNow, changeUrl)
}
//查询个人文章列表
function openMeShow (event) {
  event.preventDefault()
  var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
  var meLink = event.currentTarget.dataset.link.replace(parse_url, '$1:$2$3')
  var UrlNow = localStorage.getItem('urlNow')
  var UrlNowPublic = fdata.apipubliburl + 'all?'
  var fetchUrl = ''
  // if (fdata.apiurl) {
  //   fetchUrl = fdata.apiurl + 'post?link=' + meLink
  // } else {
  //   fetchUrl = fdata.apipubliburl + 'post?link=' + meLink
  // }
  if (UrlNow === UrlNowPublic) { //非完整默认公开库
    fetchUrl = fdata.apipubliburl + 'post?link=' + meLink + '&num=10'
  } else {
    fetchUrl = fdata.apiurl + 'post?link=' + meLink + '&num=10'
  }
  if (noClick == 'ok') {
    noClick = 'no'
    fetchShow(fetchUrl)
  }
}
// 关闭 show
function closeShow () {
  document.getElementById('fc-overlay').className -= 'fc-show-now'
  document.getElementById('fc-overshow').className -= 'fc-show-now'
  document.getElementById('fc-overshow').innerHTML = ''
}
// 点击开往
var noClick = 'ok'
function openToShow () {
  var UrlNow = localStorage.getItem('urlNow')
  var UrlNowPublic = fdata.apipubliburl + 'all?'
  var fetchUrl = ''
  // if (fdata.apiurl) {
  //   fetchUrl = fdata.apiurl + 'post'
  // } else {
  //   fetchUrl = fdata.apipubliburl + 'post'
  // }
  if (UrlNow === UrlNowPublic) { //非完整默认公开库
    fetchUrl = fdata.apipubliburl + 'post?num=10'
  } else {
    fetchUrl = fdata.apiurl + 'post?num=10'
  }

  if (noClick == 'ok') {
    noClick = 'no'
    fetchShow(fetchUrl)
  }
}
// 展示个人文章列表
function fetchShow (url) {
  var closeHtml = `
    <div class="fc-overshow-close" onclick="closeShow()"></div>
  `
  document.getElementById('fc-overlay').className = 'fc-show-now'
  document.getElementById('fc-overshow').insertAdjacentHTML('afterbegin', closeHtml)
  fetch(url)
    .then(res => res.json())
    .then(json => {
      //console.log(json)
      noClick = 'ok'
      var statisticalData = json.statistical_data
      var articleData = eval(json.article_data)
      loadFcircleShow(statisticalData, articleData)
    })
}
// 初始化方法，如有本地数据首先调用
function initFriendCircle (sortNow, changeUrl) {
  var articleSortData = sortNow + 'ArticleData'
  var localStatisticalData = JSON.parse(localStorage.getItem('statisticalData'))
  var localArticleData = JSON.parse(localStorage.getItem(articleSortData))
  container.innerHTML = ''
  if (localStatisticalData && localArticleData) {
    loadStatistical(localStatisticalData)
    loadArticleItem(localArticleData, 0, fdata.initnumber)
    console.log('本地数据加载成功')
    var fetchUrl = UrlNow + 'rule=' + sortNow + '&start=0&end=' + fdata.initnumber
    fetch(fetchUrl)
      .then(res => res.json())
      .then(json => {
        var statisticalData = json.statistical_data
        var articleData = eval(json.article_data)
        //获取文章总数与第一篇文章标题
        var localSnum = localStatisticalData.article_num
        var newSnum = statisticalData.article_num
        var localAtile = localArticleData[0].title
        var newAtile = articleData[0].title
        //判断文章总数或文章标题是否一致，否则热更新
        if (localSnum !== newSnum || localAtile !== newAtile) {
          document.getElementById('fc-state').remove()
          document.getElementById('fc-more').remove()
          document.getElementById('fc-footer').remove()
          container.innerHTML = ''
          var articleSortData = sortNow + 'ArticleData'
          loadStatistical(statisticalData)
          loadArticleItem(articleData, 0, fdata.initnumber)
          localStorage.setItem('statisticalData', JSON.stringify(statisticalData))
          localStorage.setItem(articleSortData, JSON.stringify(articleData))
          console.log('热更新完成')
        } else {
          console.log('API数据未更新')
        }
      })
  } else {
    FetchFriendCircle(sortNow, changeUrl)
    console.log('第一次加载完成')
  }
}
// 执行初始化
initFriendCircle(sortNow)