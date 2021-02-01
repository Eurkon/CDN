btf.isJqueryLoad(() => {
  // 采用一个多对象JSON文件存储所有数据的方式
  stars = {
    init: function (url) {
      var that = this
      $.getJSON(url, function (data) {
        for (var className in data) {
          var classData = data[className]
          that.render(classData, className)
        }
      })
    },
    render: function (data, name) {
      var nickname,
        site,
        li = ''
      for (var i = 0; i < data.length; i++) {
        nickname = data[i].nickname
        site = data[i].site
        content = data[i].content
        li +=
          '<div class="card-star" title="' + content + '" onclick="window.open(\'' + site + '\')" >' +
          '<div class="star-header">' + '<div>' + nickname + '</div>' + '</div>' +
          '<div class="star-content">' + '<div>' + content + '</div>' + '</div>' +
          '</div>'
      }
      $(name).append(li)
    },
  }
  // 传入json文件的路径
  stars.init('/json/stars/stars.json');
});