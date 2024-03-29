if (GLOBAL_CONFIG_SITE.title.replace('Eurkon', '') === '') {
  document.getElementById('page-name-text').style.display = 'none'
} else {
  document.querySelector('#page-name-text>span').innerHTML = GLOBAL_CONFIG_SITE.title.replace('Eurkon', '')
}

if (!document.getElementById('post-comment') && document.getElementById('comment-button')) {
  document.getElementById('comment-button').style.display = 'none'
}

var theme_color = '#1677B3'
var theme_r = parseInt('0x' + theme_color.slice(1, 3))
var theme_g = parseInt('0x' + theme_color.slice(3, 5))
var theme_b = parseInt('0x' + theme_color.slice(5, 7))

if (document.getElementById('post-cover-img')) {
  let list = []
  for (let i = 0; i <= 20; i++) {
    for (let j = 0; j <= 20; j++) {
      for (let k = 0; k <= 20; k++) {
        list.push(`rgb(${i},${j},${k})`)
        list.push(`rgb(${255 - i},${255 - j},${255 - k})`)
      }
    }
  }
  RGBaster.colors(document.getElementById('post-cover-img').getAttribute('src'), {
    paletteSize: 30,
    exclude: list,
    success: function (payload) {
      // const c = payload.dominant.match(/\d+/g)
      // const grayLevel = c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114
      [theme_r, theme_g, theme_b] = payload.dominant.match(/\d+/g)
      document.documentElement.style.setProperty('--r', theme_r);
      document.documentElement.style.setProperty('--g', theme_g);
      document.documentElement.style.setProperty('--b', theme_b);
      document.documentElement.style.setProperty('--second', theme_r * 0.299 + theme_g * 0.587 + theme_b * 0.114 >= 192 ? '#000' : '#FFF');
      document.documentElement.style.setProperty('--cover-text', theme_r * 0.299 + theme_g * 0.587 + theme_b * 0.114 >= 192 ? '#4C4948' : '#EEE');
      // document.styleSheets[0].addRule(':root', `
      //   --r: ${theme_r};
      //   --g: ${theme_g};
      //   --b: ${theme_b};
      //   --second: ${theme_r * 0.299 + theme_g * 0.587 + theme_b * 0.114 >= 192 ? '#000' : '#FFF'};
      //   --cover-text: ${theme_r * 0.299 + theme_g * 0.587 + theme_b * 0.114 >= 192 ? '#4C4948' : '#EEE'};
      // `)
    }
  })
} else {
  document.documentElement.style.setProperty('--r', theme_r);
  document.documentElement.style.setProperty('--g', theme_g);
  document.documentElement.style.setProperty('--b', theme_b);
  document.documentElement.style.setProperty('--second', theme_r * 0.299 + theme_g * 0.587 + theme_b * 0.114 >= 192 ? '#000' : '#FFF');
  document.documentElement.style.setProperty('--cover-text', theme_r * 0.299 + theme_g * 0.587 + theme_b * 0.114 >= 192 ? '#4C4948' : '#EEE');
}

function catalogActive (type) {
  let xscroll = document.getElementById('catalog-list')
  if (xscroll) {
    // 鼠标滚轮滚动
    xscroll.addEventListener('mousewheel', function (e) {
      // 计算鼠标滚轮滚动的距离
      xscroll.scrollLeft -= e.wheelDelta / 2
      // 阻止浏览器默认方法
      e.preventDefault()
    }, false)

    // 高亮当前页面对应的分类或标签
    let path = window.location.pathname
    path = decodeURIComponent(path)
    let pattern = type == 'tags' ? /\/tags\/.*?\// : /\/categories\/.*?\//
    if (pattern.test(path)) {
      document.getElementById(type + '-' + path.split('/')[2]).classList.add('selected')
    }
  }
}
catalogActive('categories')
catalogActive('tags')

function copyFn (text) {
  navigator.clipboard.writeText(text)
  btf.snackbarShow(GLOBAL_CONFIG.copy.success)
}

function commentSelect (text) {
  window.location.href = window.location.href.split('#')[0] + '#post-comment'
  let $comment = document.querySelector('#twikoo>.tk-comments>.tk-submit textarea.el-textarea__inner')
  $comment.focus()
  let event = document.createEvent('HTMLEvents')
  event.initEvent('input', false, false)
  $comment.value = '> ' + text + '\n\n'
  $comment.dispatchEvent(event)
  btf.snackbarShow('引用内容成功，欢迎留言评论...', false, 5000)
}

function imageToBlob (imageURL) {
  const img = new Image; const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  img.crossOrigin = "";
  img.src = imageURL;
  return new Promise(resolve => {
    img.onload = function () {
      c.width = this.naturalWidth;
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);
      c.toBlob(blob => {
        resolve(blob)
      }, "image/png", .75)
    }
  })
}

async function copyImage (imageURL) {
  const blob = await imageToBlob(imageURL);
  const item = new ClipboardItem({ "image/png": blob });
  navigator.clipboard.write([item])
  btf.snackbarShow('复制图片成功')
}

function downloadImage (src, name) {
  let a = document.createElement('a')
  a.href = src
  a.download = name || 'image.png'
  a.dispatchEvent(new MouseEvent('click'))
  btf.snackbarShow('正在下载图片...', false, 5000)
}

function switchReadMode () { // read-mode
  const $body = document.body
  if ($body.classList.contains('read-mode')) {
    $body.classList.remove('read-mode')
    document.querySelector('#menu-readmode>span').innerHTML = '阅读模式'
    btf.snackbarShow('已关闭阅读模式')
    return
  }
  $body.classList.add('read-mode')
  document.querySelector('#menu-readmode>span').innerHTML = '退出阅读'
  btf.snackbarShow('已开启阅读模式')

  // const newEle = document.createElement('button')
  // newEle.type = 'button'
  // newEle.className = 'fas fa-sign-out-alt exit-readmode'
  // $body.appendChild(newEle)

  // function clickFn () {
  //   $body.classList.remove('read-mode')
  //   newEle.remove()
  //   newEle.removeEventListener('click', clickFn)
  // }
  // newEle.addEventListener('click', clickFn)
}

function switchDarkMode () { // Switch Between Light And Dark Mode
  const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  if (nowMode === 'light') {
    activateDarkMode()
    saveToLocal.set('theme', 'dark', 2)
    GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
  } else {
    activateLightMode()
    saveToLocal.set('theme', 'light', 2)
    GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
  }
  // handle some cases
  typeof utterancesTheme === 'function' && utterancesTheme()
  typeof FB === 'object' && window.loadFBComment()
  window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
}

function showOrHideBtn () { // rightside 點擊設置 按鈕 展開
  document.getElementById('rightside-config-hide').classList.toggle('show')
}

function scrollToTop () { // Back to top
  let rocket = document.createElement('div');
  rocket.id = 'top-rocket'
  document.body.append(rocket)
  btf.scrollToDest(0, 500)
  $rocket = document.getElementById('top-rocket')
  let i = 0;
  interval = setInterval(function () {
    i++
    $rocket.style.bottom = i + '%'
    if (i > 100) {
      clearInterval(interval);
      $rocket.remove()
    }
  }, 5)
}

function hideAsideBtn () { // Hide aside
  const $htmlDom = document.documentElement.classList
  if ($htmlDom.contains('hide-aside')) {
    saveToLocal.set('aside-status', 'show', 2)
    document.querySelector('#menu-hideside>span').innerHTML = '隐藏侧栏'
    btf.snackbarShow('已显示侧边栏')
  } else {
    saveToLocal.set('aside-status', 'hide', 2)
    document.querySelector('#menu-hideside>span').innerHTML = '显示侧栏'
    btf.snackbarShow('已隐藏侧边栏')
  }
  $htmlDom.toggle('hide-aside')
  setTimeout(resizePostChart, 200)
  setTimeout(resizeVisitChart, 200)
}

function adjustFontSize (plus) {
  const fontSizeVal = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--global-font-size'))
  let newValue = ''
  if (plus) {
    if (fontSizeVal >= 20) return
    newValue = fontSizeVal + 1
    document.documentElement.style.setProperty('--global-font-size', newValue + 'px')
    !document.getElementById('nav').classList.contains('hide-menu') && adjustMenu(true)
  } else {
    if (fontSizeVal <= 10) return
    newValue = fontSizeVal - 1
    document.documentElement.style.setProperty('--global-font-size', newValue + 'px')
    document.getElementById('nav').classList.contains('hide-menu') && adjustMenu(true)
  }

  saveToLocal.set('global-font-size', newValue, 2)
  // document.getElementById('font-text').innerText = newValue
}

function resizePostChart () {
  if (document.getElementById('posts-chart')) postsChart.resize()
  if (document.getElementById('tags-chart')) tagsChart.resize()
  if (document.getElementById('categories-chart')) categoriesChart.resize()
}

function resizeVisitChart () {
  if (document.getElementById('date-chart')) dateChart.resize()
  if (document.getElementById('map-chart')) mapChart.resize()
  if (document.getElementById('trends-chart')) trendsChart.resize()
  if (document.getElementById('sources-chart')) sourcesChart.resize()
}

function switchPostChart () {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
  if (document.getElementById('posts-chart') && postsOption) {
    try {
      let postsOptionNew = postsOption
      postsOptionNew.title.textStyle.color = color
      postsOptionNew.xAxis.nameTextStyle.color = color
      postsOptionNew.yAxis.nameTextStyle.color = color
      postsOptionNew.xAxis.axisLabel.color = color
      postsOptionNew.yAxis.axisLabel.color = color
      postsOptionNew.xAxis.axisLine.lineStyle.color = color
      postsOptionNew.yAxis.axisLine.lineStyle.color = color
      postsOptionNew.series[0].markLine.data[0].label.color = color
      postsChart.setOption(postsOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
  if (document.getElementById('tags-chart') && tagsOption) {
    try {
      let tagsOptionNew = tagsOption
      tagsOptionNew.title.textStyle.color = color
      tagsOptionNew.xAxis.nameTextStyle.color = color
      tagsOptionNew.yAxis.nameTextStyle.color = color
      tagsOptionNew.xAxis.axisLabel.color = color
      tagsOptionNew.yAxis.axisLabel.color = color
      tagsOptionNew.xAxis.axisLine.lineStyle.color = color
      tagsOptionNew.yAxis.axisLine.lineStyle.color = color
      tagsOptionNew.series[0].markLine.data[0].label.color = color
      tagsChart.setOption(tagsOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
  if (document.getElementById('categories-chart') && categoriesOption) {
    try {
      let categoriesOptionNew = categoriesOption
      categoriesOptionNew.title.textStyle.color = color
      categoriesOptionNew.legend.textStyle.color = color
      categoriesOptionNew.series[0].label.color = color
      categoriesChart.setOption(categoriesOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
}

function switchVisitChart () {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
  if (document.getElementById('date-chart') && dateOption) {
    try {
      let dateOptionNew = dateOption
      dateOptionNew.title.textStyle.color = color
      dateOptionNew.visualMap.textStyle.color = color
      dateChart.setOption(dateOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
  if (document.getElementById('map-chart') && mapOption) {
    try {
      let mapOptionNew = mapOption
      mapOptionNew.title.textStyle.color = color
      mapOptionNew.visualMap.textStyle.color = color
      mapChart.setOption(mapOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
  if (document.getElementById('trends-chart') && trendsOption) {
    try {
      let trendsOptionNew = trendsOption
      trendsOptionNew.title.textStyle.color = color
      trendsOptionNew.xAxis.nameTextStyle.color = color
      trendsOptionNew.yAxis.nameTextStyle.color = color
      trendsOptionNew.xAxis.axisLabel.color = color
      trendsOptionNew.yAxis.axisLabel.color = color
      trendsOptionNew.xAxis.axisLine.lineStyle.color = color
      trendsOptionNew.yAxis.axisLine.lineStyle.color = color
      trendsOptionNew.series[0].markLine.data[0].label.color = color
      trendsChart.setOption(trendsOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
  if (document.getElementById('sources-chart') && sourcesOption) {
    try {
      let sourcesOptionNew = sourcesOption
      sourcesOptionNew.title.textStyle.color = color
      sourcesOptionNew.legend.textStyle.color = color
      sourcesOptionNew.series[0].label.color = color
      sourcesChart.setOption(sourcesOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
}

function showRightMenu (isTrue) {
  document.getElementById('rightmenu-mask').style.display = (isTrue ? 'block' : 'none')
  document.getElementById('rightmenu').style.display = (isTrue ? 'block' : 'none')
}

var browser = {
  versions: function () {
    var u = navigator.userAgent
    var app = navigator.appVersion
    return {
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
      mobile: !!u.match(/Mobile/i), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') == -1 // 是否web应该程序，没有头部与底部
    }
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}


var rightMenuContext = {
  text: '',
  href: '',
  src: '',
}

window.oncontextmenu = function (event) {
  if (event.ctrlKey || browser.versions.mobile || document.body.clientWidth < 900) return
  if (!saveToLocal.get('notice-rightmenu')) {
    btf.snackbarShow('唤醒原系统菜单请使用：<kbd>Ctrl</kbd> + <kbd>右键</kbd>', false, 5000)
    saveToLocal.set('notice-rightmenu', true, 2)
  }
  rightMenuContext.text = event.target.href ? event.target.innerText : (document.selection ? document.selection.createRange().text : window.getSelection().toString())
  rightMenuContext.href = event.target.href
  rightMenuContext.src = event.target.currentSrc

  document.getElementById('menu-copy').style.display = (rightMenuContext.text || rightMenuContext.href) ? 'flex' : 'none'
  document.getElementById('menu-comment').style.display = (document.getElementById('post-comment') && rightMenuContext.text) ? 'flex' : 'none'
  document.getElementById('menu-link').style.display = (rightMenuContext.href || rightMenuContext.src) ? 'flex' : 'none'
  document.getElementById('menu-copy-image').style.display = rightMenuContext.src ? 'flex' : 'none'
  document.getElementById('menu-download-image').style.display = rightMenuContext.src ? 'flex' : 'none'
  document.getElementById('menu-window').style.display = (rightMenuContext.href || rightMenuContext.src) ? 'flex' : 'none'
  document.getElementById('menu-search').style.display = (rightMenuContext.text || rightMenuContext.href) ? 'flex' : 'none'
  document.getElementById('menu-baidu').style.display = (rightMenuContext.text || rightMenuContext.href) ? 'flex' : 'none'
  document.getElementById('menu-share').style.display = (rightMenuContext.text || rightMenuContext.href || rightMenuContext.src) ? 'none' : 'flex'

  document.getElementById('rightmenu-mode').style.display = (rightMenuContext.text || rightMenuContext.href || rightMenuContext.src) ? 'none' : 'block'
  document.getElementById('rightmenu-post').style.display = (rightMenuContext.text || rightMenuContext.href || rightMenuContext.src) ? 'none' : 'block'

  showRightMenu(true)
  $rightMenu = document.getElementById('rightmenu')
  let rmWidth = $rightMenu.clientWidth
  let rmHeight = $rightMenu.clientHeight
  let pageX = event.clientX + 10 // 加10是为了防止显示时鼠标遮在菜单上
  let pageY = event.clientY
  // 菜单默认显示在鼠标右下方，当鼠标靠右或靠下时，将菜单显示在鼠标左方\上方
  if (pageX + rmWidth > window.innerWidth) { pageX -= rmWidth + 10 }
  if (pageY + rmHeight > window.innerHeight) { pageY -= pageY + rmHeight - window.innerHeight }
  $rightMenu.style.left = pageX + 'px'
  $rightMenu.style.top = pageY + 'px'
  return false
}

// 监控复制事件
document.addEventListener('copy', function () { btf.snackbarShow(GLOBAL_CONFIG.copy.success) })

// 右键菜单按钮
window.addEventListener('click', function () { showRightMenu(false) }) // 隐藏菜单

// document.getElementById('menu-home').onclick = function () { window.location.href = window.location.origin }
document.getElementById('menu-backward').onclick = function () { window.history.back() }
document.getElementById('menu-forward').onclick = function () { window.history.forward() }
document.getElementById('menu-refresh').onclick = function () { window.location.reload() }
document.getElementById('menu-top').onclick = scrollToTop

document.getElementById('menu-copy').onclick = function () { copyFn(rightMenuContext.text) }
document.getElementById('menu-comment').onclick = function () { commentSelect(rightMenuContext.text) }
document.getElementById('menu-baidu').onclick = function () { window.open('https://www.baidu.com/s?wd=' + rightMenuContext.text) }
document.getElementById('menu-share').onclick = function () { copyFn(window.location.href.split('#')[0]) }
document.getElementById('menu-link').onclick = function () { copyFn(rightMenuContext.href || rightMenuContext.src) }
document.getElementById('menu-window').onclick = function () { window.open(rightMenuContext.href || rightMenuContext.src) }
document.getElementById('menu-copy-image').onclick = function () { copyImage(rightMenuContext.src) }
document.getElementById('menu-download-image').onclick = function () { downloadImage(rightMenuContext.src, rightMenuContext.src.split('/').pop()) }

document.getElementById('menu-hideside').onclick = hideAsideBtn
document.getElementById('menu-readmode').onclick = switchReadMode
document.querySelector('#menu-readmode>span').innerHTML = document.body.classList.contains('read-mode') ? '退出阅读' : '阅读模式'
document.querySelector('#menu-hideside>span').innerHTML = document.documentElement.classList.contains('hide-aside') ? '显示侧栏' : '隐藏侧栏'

// 明暗模式切换统计图
document.getElementById('mode-button').addEventListener('click', function () { setTimeout(switchVisitChart, 100) })
document.getElementById('mode-button').addEventListener('click', function () { setTimeout(switchPostChart, 100) })
document.getElementById('darkmode').addEventListener('click', function () { setTimeout(switchVisitChart, 100) })
document.getElementById('darkmode').addEventListener('click', function () { setTimeout(switchPostChart, 100) })

// 顶部菜单按钮
document.getElementById('mode-button').addEventListener('click', switchDarkMode)
document.getElementById('top-button').onclick = scrollToTop
document.getElementById('page-name-text').onclick = scrollToTop

// 文章分享复制链接按钮
if (document.getElementById('post-url-copy')) document.getElementById('post-url-copy').onclick = function () { copyFn(document.getElementById('post-url').text) }
