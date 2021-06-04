function init (url) {
  fetch(url).then(data => data.json()).then(data => {
    for (let className in data) {
      let classData = data[className]
      this.render(className, classData)
    }
  })
}

function render (name, data) {
  let li = ''
  for (let i = 0; i < data.length; i++) {
    li +=
      '<div class="star-list-item"> <a href="' + data[i].site + '" target="_blank" rel="external nofollow noreferrer" title="' + data[i].name + '" >' +
      '<span class="star-item-name">' + data[i].name + '</span>' +
      '<span class="star-item-desc" title="' + data[i].content + '">' + data[i].content +
      '</span></a></div>'
  }
  document.getElementById(name).innerHTML = li
}

// 传入json文件的路径
init('/json/stars/stars.json');