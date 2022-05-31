if (GLOBAL_CONFIG_SITE.title.replace('Eurkon', '') === '') {
  document.getElementById('page-name-text').style.display = 'none'
} else {
  document.querySelector('#page-name-text>span').innerHTML = GLOBAL_CONFIG_SITE.title.replace('Eurkon', '')
}
if (!document.getElementById('post-comment') && document.getElementById('comment-button')) document.getElementById('comment-button').style.display = 'none'

if (document.getElementById('post-cover-img')) {
  let list = []
  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 5; j++) {
      for (let k = 0; k <= 5; k++) {
        list.push(`rgb(${i},${j},${k})`)
        list.push(`rgb(${255 - i},${255 - j},${255 - k})`)
      }
    }
  }
  RGBaster.colors(document.getElementById('post-cover-img').getAttribute('src'), {
    paletteSize: 30,
    exclude: list,
    success: function (payload) {
      const c = payload.dominant.match(/\d+/g)
      const grayLevel = c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114
      document.styleSheets[0].addRule(':root', `
        --main: ${payload.dominant};
        --second: ${grayLevel >= 192 ? '#000' : '#FFF'};
        --main-light: rgba(${c[0]}, ${c[1]}, ${c[2]}, .4);
        --main-shadow: 0 2px 3px 1px rgba(${c[0]}, ${c[1]}, ${c[2]}, .2);
        --cover-text: ${grayLevel >= 192 ? '#4C4948' : '#EEE'};
        --cover-bg: rgba(${c[0]}, ${c[1]}, ${c[2]});
      `)
    }
  })
} else {
  document.styleSheets[0].addRule(':root', `
    --main: #49B1F5;
    --second: #FFF;
    --main-light: rgba(73, 177, 245, .4);
    --main-shadow: 0 2px 3px 1px rgba(73, 177, 245, .2);
    --cover-text: #EEE;
    --cover-bg: #49B1F5;
  `)
}

document.styleSheets[0].addRule('[data-theme="dark"]', `
  --main: #5C5C5C !important;
  --second: #EEE !important;
  --main-light: rgba(92, 92, 92, .4) !important;
  --main-shadow: 0 2px 3px 1px rgba(92, 92, 92, .2) !important;
`)

function catalogActive (type) {
  let xscroll = document.getElementById('catalog-list')
  if (xscroll) {
    // 鼠标滚轮滚动
    xscroll.addEventListener('mousewheel', function (e) {
      //计算鼠标滚轮滚动的距离
      xscroll.scrollLeft -= e.wheelDelta / 2
      //阻止浏览器默认方法
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

function copyContentFn (ctx) {
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    if (GLOBAL_CONFIG.Snackbar !== undefined) {
      btf.snackbarShow(GLOBAL_CONFIG.copy.success)
    } else {
      const prevEle = ctx.previousElementSibling
      prevEle.innerText = GLOBAL_CONFIG.copy.success
      prevEle.style.opacity = 1
      setTimeout(() => { prevEle.style.opacity = 0 }, 700)
    }
  } else {
    if (GLOBAL_CONFIG.Snackbar !== undefined) {
      btf.snackbarShow(GLOBAL_CONFIG.copy.noSupport)
    } else {
      ctx.previousElementSibling.innerText = GLOBAL_CONFIG.copy.noSupport
    }
  }
}

function copyClickFn (text, ctx) {
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    document.execCommand('copy')
    if (GLOBAL_CONFIG.Snackbar !== undefined) {
      btf.snackbarShow(GLOBAL_CONFIG.copy.success)
    } else {
      const prevEle = ctx.previousElementSibling
      prevEle.innerText = GLOBAL_CONFIG.copy.success
      prevEle.style.opacity = 1
      setTimeout(() => { prevEle.style.opacity = 0 }, 700)
    }
  } else {
    if (GLOBAL_CONFIG.Snackbar !== undefined) {
      btf.snackbarShow(GLOBAL_CONFIG.copy.noSupport)
    } else {
      ctx.previousElementSibling.innerText = GLOBAL_CONFIG.copy.noSupport
    }
  }
}

function postUrlCopyFn (ele) {
  const $buttonParent = ele.parentNode
  $buttonParent.classList.add('copy-true')
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents($buttonParent.querySelectorAll('#post-url')[0])
  selection.removeAllRanges()
  selection.addRange(range)
  const text = selection.toString()
  copyClickFn(text, ele.prevEle)
  selection.removeAllRanges()
  $buttonParent.classList.remove('copy-true')
}

var rightMenuContext = {
  text: '',
  href: '',
  src: '',
}

function copyFn (text) {
  $('body').after('<input id="copyText"></input>')
  const copyText = document.getElementById('copyText')
  copyText.value = text
  copyText.select()
  document.execCommand('copy')
  copyText.remove()
  copyContentFn(this)
}

function commentSelect (text) {
  window.location.href = window.location.href.split('#')[0] + '#post-comment'
  let $comment = document.querySelector('#twikoo>.tk-comments>.tk-submit textarea.el-textarea__inner')
  $comment.focus()
  let event = document.createEvent('HTMLEvents')
  event.initEvent('input', false, false)
  $comment.value = '> ' + text + '\n\n'
  $comment.dispatchEvent(event)
}

function downloadImage (src, name) {
  setTimeout(function () {
    let image = new Image
    image.src = src
    image.setAttribute("crossOrigin", "anonymous")
    image.onload = function () {
      let canvas = document.createElement("canvas")
      canvas.width = image.width
      canvas.height = image.height
      canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height)
      let ele = document.createElement("a")
      ele.download = name || "image"
      ele.href = canvas.toDataURL("image/png")
      ele.dispatchEvent(new MouseEvent("click"))
    }
  }, 500)
}

function switchReadMode () { // read-mode
  const $body = document.body
  if ($body.classList.contains('read-mode')) {
    $body.classList.remove('read-mode')
    document.querySelector('#menu-readmode>span').innerHTML = '阅读模式'
    return
  }
  $body.classList.add('read-mode')
  document.querySelector('#menu-readmode>span').innerHTML = '退出阅读'

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
  } else {
    saveToLocal.set('aside-status', 'hide', 2)
    document.querySelector('#menu-hideside>span').innerHTML = '显示侧栏'
  }
  $htmlDom.toggle('hide-aside')
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
  if (document.getElementById('map-chart')) {
    try {
      let mapOptionNew = mapOption
      mapOptionNew.title.textStyle.color = color
      mapOptionNew.visualMap.textStyle.color = color
      mapChart.setOption(mapOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
  if (document.getElementById('trends-chart')) {
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
  if (document.getElementById('sources-chart')) {
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
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/Mobile/i), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    }
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

if (!browser.versions.mobile) {
  window.oncontextmenu = function (event) {
    showRightMenu(true)
    rightMenuContext.text = event.target.href ? event.target.innerText : (document.selection ? document.selection.createRange().text : window.getSelection().toString())
    rightMenuContext.href = event.target.href
    rightMenuContext.src = event.target.currentSrc

    document.getElementById('menu-copy').style.display = (rightMenuContext.text || rightMenuContext.href) ? 'flex' : 'none'
    document.getElementById('menu-comment').style.display = (document.getElementById('post-comment') && rightMenuContext.text) ? 'flex' : 'none'
    document.getElementById('menu-link').style.display = (rightMenuContext.href || rightMenuContext.src) ? 'flex' : 'none'
    document.getElementById('menu-image').style.display = rightMenuContext.src ? 'flex' : 'none'
    document.getElementById('menu-window').style.display = (rightMenuContext.href || rightMenuContext.src) ? 'flex' : 'none'
    document.getElementById('menu-search').style.display = (rightMenuContext.text || rightMenuContext.href) ? 'flex' : 'none'
    document.getElementById('menu-baidu').style.display = (rightMenuContext.text || rightMenuContext.href) ? 'flex' : 'none'
    document.getElementById('menu-share').style.display = (rightMenuContext.text || rightMenuContext.href || rightMenuContext.src) ? 'none' : 'flex'

    document.getElementById('rightmenu-mode').style.display = (rightMenuContext.text || rightMenuContext.href || rightMenuContext.src) ? 'none' : 'block'
    document.getElementById('rightmenu-post').style.display = (rightMenuContext.text || rightMenuContext.href || rightMenuContext.src) ? 'none' : 'block'

    $rightMenu = document.getElementById('rightmenu')
    let rmWidth = $rightMenu.clientWidth
    let rmHeight = $rightMenu.clientHeight
    let pageX = event.clientX + 10	//加10是为了防止显示时鼠标遮在菜单上
    let pageY = event.clientY
    // 菜单默认显示在鼠标右下方，当鼠标靠右或靠下时，将菜单显示在鼠标左方\上方
    if (pageX + rmWidth > window.innerWidth) { pageX -= rmWidth + 10 }
    if (pageY + rmHeight > window.innerHeight) { pageY -= pageY + rmHeight - window.innerHeight }
    $rightMenu.style.left = pageX + 'px'
    $rightMenu.style.top = pageY + 'px'
    return false
  }
}

document.addEventListener('copy', function () { copyContentFn(this) })
// 右键菜单按钮
window.addEventListener('click', function () { showRightMenu(false) })	//隐藏菜单

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
document.getElementById('menu-image').onclick = function () { downloadImage(rightMenuContext.src, rightMenuContext.src.split('/').pop()) }

// document.getElementById('menu-darkmode').addEventListener('click', switchDarkMode )
document.getElementById('menu-hideside').onclick = hideAsideBtn
document.getElementById('menu-readmode').onclick = switchReadMode

// 明暗模式切换统计图
// document.getElementById('menu-darkmode').addEventListener('click', function () { setTimeout(switchVisitChart, 100) })
// document.getElementById('menu-darkmode').addEventListener('click', function () { setTimeout(switchPostChart, 100) })
document.getElementById('mode-button').addEventListener('click', function () { setTimeout(switchVisitChart, 100) })
document.getElementById('mode-button').addEventListener('click', function () { setTimeout(switchPostChart, 100) })
document.getElementById('darkmode').addEventListener('click', function () { setTimeout(switchVisitChart, 100) })
document.getElementById('darkmode').addEventListener('click', function () { setTimeout(switchPostChart, 100) })

// 顶部菜单按钮
document.getElementById('mode-button').addEventListener('click', switchDarkMode)
document.getElementById('top-button').onclick = scrollToTop
document.getElementById('page-name-text').onclick = scrollToTop
if (document.getElementById('post-url-copy')) document.getElementById('post-url-copy').onclick = function () { postUrlCopyFn(this) }
document.querySelector('#menu-readmode>span').innerHTML = document.body.classList.contains('read-mode') ? '退出阅读' : '阅读模式'
document.querySelector('#menu-hideside>span').innerHTML = document.documentElement.classList.contains('hide-aside') ? '显示侧栏' : '隐藏侧栏'