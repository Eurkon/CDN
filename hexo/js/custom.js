// // 滚动条自动隐藏
// var t1 = 0;
// var t2 = 0;
// var timer = null; // 定时器
// document.styleSheets[0].addRule('::-webkit-scrollbar-thumb', 'display:none;');

// // scroll监听
// document.onscroll = function () {
//   clearTimeout(timer);
//   timer = setTimeout(isScrollEnd, 1000);
//   t1 = document.documentElement.scrollTop || document.body.scrollTop;
//   document.styleSheets[0].addRule('::-webkit-scrollbar-thumb', 'display:block;');
// }

// function isScrollEnd () {
//   t2 = document.documentElement.scrollTop || document.body.scrollTop;
//   if (t2 == t1) {
//     document.styleSheets[0].addRule('::-webkit-scrollbar-thumb', 'display:none;');
//   }
// }

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

function switchReadMode () { // read-mode
  const $body = document.body
  $body.classList.add('read-mode')
  const newEle = document.createElement('button')
  newEle.type = 'button'
  newEle.className = 'fas fa-sign-out-alt exit-readmode'
  $body.appendChild(newEle)

  function clickFn () {
    $body.classList.remove('read-mode')
    newEle.remove()
    newEle.removeEventListener('click', clickFn)
  }
  newEle.addEventListener('click', clickFn)
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
  btf.scrollToDest(0, 500)
}

function hideAsideBtn () { // Hide aside
  const $htmlDom = document.documentElement.classList
  $htmlDom.contains('hide-aside')
    ? saveToLocal.set('aside-status', 'show', 2)
    : saveToLocal.set('aside-status', 'hide', 2)
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

(function navSet () {
  document.getElementById("page-name-text").innerHTML = GLOBAL_CONFIG_SITE.title.replace("Eurkon", "")

  if (document.getElementById("post-comment")) {
    document.getElementById("comment-button").style.display = "inline"
  } else {
    document.getElementById("comment-button").style.display = "none"
  }
})()

function switchPostChart () {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
  if (document.getElementById('posts-chart')) {
    let postsOptionNew = postsOption
    postsOptionNew.textStyle.color = color
    postsOptionNew.title.textStyle.color = color
    postsOptionNew.xAxis.axisLine.lineStyle.color = color
    postsOptionNew.yAxis.axisLine.lineStyle.color = color
    postsChart.setOption(postsOptionNew)
  }
  if (document.getElementById('tags-chart')) {
    let tagsOptionNew = tagsOption
    tagsOptionNew.textStyle.color = color
    tagsOptionNew.title.textStyle.color = color
    tagsOptionNew.xAxis.axisLine.lineStyle.color = color
    tagsOptionNew.yAxis.axisLine.lineStyle.color = color
    tagsChart.setOption(tagsOptionNew)
  }
  if (document.getElementById('categories-chart')) {
    let categoriesOptionNew = categoriesOption
    categoriesOptionNew.textStyle.color = color
    categoriesOptionNew.title.textStyle.color = color
    categoriesOptionNew.legend.textStyle.color = color
    categoriesChart.setOption(categoriesOptionNew)
  }
}

function switchVisitChart () {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
  if (document.getElementById('map-chart')) {
    let mapOptionNew = mapOption
    mapOptionNew.title.textStyle.color = color
    mapOptionNew.visualMap.textStyle.color = color
    mapChart.setOption(mapOptionNew)
  }
  if (document.getElementById('trends-chart')) {
    let trendsOptionNew = trendsOption
    trendsOptionNew.title.textStyle.color = color
    trendsOptionNew.xAxis.axisLine.lineStyle.color = color
    trendsOptionNew.yAxis.axisLine.lineStyle.color = color
    trendsOptionNew.textStyle.color = color
    trendsChart.setOption(trendsOptionNew)
  }
  if (document.getElementById('sources-chart')) {
    let sourcesOptionNew = sourcesOption
    sourcesOptionNew.title.textStyle.color = color
    sourcesOptionNew.legend.textStyle.color = color
    sourcesOptionNew.textStyle.color = color
    sourcesChart.setOption(sourcesOptionNew)
  }
}

document.getElementById("mode-button").addEventListener("click", function () { setTimeout(switchPostChart, 100) })
document.getElementById("darkmode").addEventListener("click", function () { setTimeout(switchPostChart, 100) })
document.getElementById("mode-button").addEventListener("click", function () { setTimeout(switchVisitChart, 100) })
document.getElementById("darkmode").addEventListener("click", function () { setTimeout(switchVisitChart, 100) })

document.addEventListener("copy", function () { copyContentFn(this) })
document.getElementById("mode-button").addEventListener("click", function () { switchDarkMode() })
document.getElementById("top-button").addEventListener("click", function () { scrollToTop() })
document.getElementById("page-name-text").addEventListener("click", function () { scrollToTop() })
if (document.getElementById("post-url-copy")) document.getElementById("post-url-copy").addEventListener("click", function () { postUrlCopyFn(this) })