

fetch('/json/link.json').then(data => data.json()).then(data => {
  li = ''
  for (let i = 0; i < data.length; i++) {
    li += '<h2>' + data[i].class_name + '</h2>'
    if (data[i].class_desc) li += '<div class="flink-desc">' + data[i].class_desc + '</div>'
    li += '<div class="flink-list">';
    for (let j = 0; j < data[i].link_list.length; j++) {
      let item = data[i].link_list[j];
      li += `
      <a class="flink-list-card" href="${item.link}" target="_blank" rel="external nofollow noreferrer" data-title="${item.descr}">
        <div class="wrapper cover">
          <a href="${(item.siteshot || ('https://image.thum.io/get/width/400/crop/800/allowJPG/wait/20/noanimate/' + item.link))}" class="fancybox" data-fancybox="group" data-caption>
            <img class="cover fadeIn" onerror="this.onerror=null;this.src='https://cdn.jsdelivr.net/gh/Eurkon/CDN@master/hexo/images/user/loading.gif'" alt=""/>
          </a>
        </div>
        <div class="info">
          <a href="${item.avatar}" class="fancybox" data-fancybox="group" data-caption>
            <img src="${item.avatar}" onerror="this.onerror=null;this.src='https://cdn.jsdelivr.net/gh/Eurkon/CDN@master/hexo/images/user/loading.gif'" alt=""/>
          </a>
          <span class="flink-sitename">${item.name}</span>
        </div>
      </a>
      `;
    }
    li += '</div>'
  }
  document.getElementById('flink').innerHTML = li
}).catch(function (error) {
  console.log(error);
});