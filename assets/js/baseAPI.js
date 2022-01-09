$.ajaxPrefilter(function (options) {
  // console.log(options.url)
  options.url = 'http://api-breakingnews-web.itheima.net'+ options.url
  // console.log(options.url);
  if(options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization:localStorage.getItem('token') || ''
    }
  }
  options.complete= function(res) {
    // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token')
      location.href = '/login.html'
    }
  }
})
