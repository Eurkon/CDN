var myDate = new Date();

var myMonth = myDate.getMonth() + 1;
getMonth = myMonth < 10 ? ("0" + String(myMonth)) : String(myMonth);

var getDate = String(myDate.getDate());
getDate = getDate < 10 ? ("0" + String(getDate)) : String(getDate);

var getMonthDate = "S" + getMonth + getDate;
var geturl = "https://cdn.jsdelivr.net/gh/empty-hyh/cdn/hexo/json/history/" + getMonth + ".json";

btf.isJqueryLoad(() => {
  $(function () {
    $.ajax({
      //请求方式
      type: "GET",
      //文件位置
      url: geturl,
      //返回数据格式为json,也可以是其他格式
      dataType: "json",
      //请求成功后要执行的函数，拼接html
      success: function (data) {
        var str = '<ul style="list-style: none;padding-inline-start: 0px;">';
        $.each(data[getMonthDate], function (i, n) {
          str += '<li style="list-style: none;height:100px;">';
          str += '<p style="color:#858585; Font-style:italic; font-weight:lighter; float:left; width:100%; font-size: 14px; margin:0px; padding:0px; display:inline-block">';
          str += "<i >A.D.</i>" + n.year + "</p>";
          str += '<p style="width:100%; float:left; margin:0px; padding:0px; display:inline-block">';
          str += n.title + '<i style="Font-style:normal;">。</i>';
          str += "</p>" + "</li>";
        });
        str += "</ul>";
        $("#history-card").append(str);
      }
    });
  });
});