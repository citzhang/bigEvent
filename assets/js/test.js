$(function() {
  var layer = layui.layer
  getUserInfo()
  function getUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      headers: {
        Authorization: localStorage.getItem('token') || ''
      },
      success: function(res) {
        if(res.status !== 0) return layer.msg(res.message)
        // 调用渲染头像方法
        renderAvatar(res.data)
      }
    })
  }
  function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    if(user.user_pic !== null) {
      $('.layui-nav-img').attr('str',user.user_pic).show()
      $('.text-avatar').hide()
    } else {
      $('.layui-nav-img').hide()
      var first = name[0].toUpperCase()
      $('.text-avatar').html(first).show()
    }
  }
})