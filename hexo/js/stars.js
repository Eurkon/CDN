function init (url) {
  fetch(url).then(data => data.json()).then(data => {
    for (let className in data) {
      let classData = data[className]
      this.render(classData, className)
    }
  })
}

function render (data, name) {
  let li = ''
  for (let i = 0; i < data.length; i++) {
    li +=
      '<div class="card-star" title="' + data[i].content + '" onclick="window.open(\'' + data[i].site + '\')" >' +
      '<div class="star-header">' + '<div>' + data[i].nickname + '</div>' + '</div>' +
      '<div class="star-content">' + '<div>' + data[i].content + '</div>' + '</div>' +
      '</div>'
  }
  let div = document.createElement("div");
  div.innerHTML = li;
  document.getElementById(name).append(div);
}

// 传入json文件的路径
init('/json/stars/stars.json');