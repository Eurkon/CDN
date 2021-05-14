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
  var title = document.title.replace(" | ", "").replace("Eurkon", "");
  document.getElementById("page-name-text").innerHTML = title

  if (document.getElementById("post-comment")) {
    document.getElementById("comment-button").style.display = "inline"
  } else {
    document.getElementById("comment-button").style.display = "none"
  }
})()

document.addEventListener("copy", function () { copyContentFn(this) })
document.getElementById("mode-button").addEventListener("click", function () { switchDarkMode() })
document.getElementById("top-button").addEventListener("click", function () { scrollToTop() })
document.getElementById("page-name-text").addEventListener("click", function () { scrollToTop() })
if (document.getElementById("post-url-copy")) document.getElementById("post-url-copy").addEventListener("click", function () { postUrlCopyFn(this) })