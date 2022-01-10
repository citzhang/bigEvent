$(function () {
  var form = layui.form
  var layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function(value) {
      if($('[name="oldPwd"]').val() === value) return '不能与原密码相同'
    },
    rePwd: function(value) {
      if($('[name="newPwd"]').val() !== value) return '两次输入的密码不一致'
    }
  })
  $('#user_pwd_form').on('submit',function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0) return layer.msg('重置密码失败')
        layer.msg('更新密码成功')
      }
    })
  })
})
