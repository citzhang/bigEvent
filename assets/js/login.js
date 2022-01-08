$(function () {
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })
  // 从layui中获取form对象
  var form = layui.form
  var layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 验证密码是否相同
    // 当标签通过lay-verify=添加了repwd这个值后,value就可以得到此标签输入的内容
    repwd: function (value) {
      var pwd = $(".reg-pwd[name='password']").val()
      if (pwd !== value) return '两次输入密码不同'
    },
  })
  $('#form-reg').on('submit', function (e) {
    // console.log($(".reg-pwd[name='password']").val());
    e.preventDefault()
    // console.log('hao ')
    $.post('/api/reguser', { username: $('.reg-user').val(), password: $(".reg-pwd[name='password']").val() }, function (res) {
      if (res.status !== 0) return layer.msg(res.message)
      layer.msg('注册成功')
      $('#link_login').click()
    })
  })
  // 登录表单的实现
  $('#form-login').on('submit',function(e) {
    e.preventDefault()
    $.ajax({
      method:'post',
      url: '/api/login',
      // 用jquery的serialize()方法，获取数据
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0) return layer.msg(res.message)
        // console.log(res.message);
        localStorage.setItem('token',res.token)
        location.href = '/index.html'
      }
    })
  })
})
