$(function (){
  var layer = layui.layer
  getUserInfo()

  $('#btnLogout').on('click',function() {
    layer.confirm('确认退出?', {icon: 3, title:'提示'}, function(index){
      //do something
      localStorage.removeItem('token')
      location.href = '/login.html'
      layer.close(index);
    });
  })
})
function getUserInfo() {
  $.ajax({
    method:'GET',
    url: '/my/userinfo',
    success: function(res) {
      if(res.status !== 0) return console.log(res)
      // console.log(res.message);
      renderAvatar(res.data)
    },
  })
}
function renderAvatar(user) {
  // 1获取用户的名称
  var name = user.nickname || user.username
  // 2设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
  // 3按需渲染用户的头像
  if(user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src',user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 渲染文本头像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}