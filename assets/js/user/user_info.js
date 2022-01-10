$(function() {
  var form = layui.form
  var layer = layui.layer
  form.verify({
    nickname: function(value) {
      if(value.length > 6) return '昵称长度不能超过6个字符'
    }
  })
  userinfoGet()
  updateUser()
  $('#btnReset').on('click',function(e) {
    e.preventDefault()
    userinfoGet()
  })
  // 更新用户的基本信息
  function updateUser() {
    $('#uerinfo_form').on('submit',function(e) {
      e.preventDefault()
      $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function(res) {
          if(res.status !== 0) return layer.msg('请求失败')
          layer.msg(res.message)
          window.parent.getUserInfo()
        }
      })
    })
  }
  
  function userinfoGet() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function(res) {
        if(res.status !== 0) return layer.msg(res.message)
        console.log(res);
        form.val('userinfo_form',res.data)
      }
    })
  }
})