$(function () {
  var form = layui.form
  var layer = layui.layer
  // 初始化富文本编辑器
  initEditor()
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)
  // 获取下拉列表数据  /my/article/cates
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) return layer.msg(res.message)
      var htmlStr = template('pub_tpl', res)
      $('[name="cate_id"]').html(htmlStr)
      form.render()
    },
  })
  $('#changeImg').on('click', function () {
    $('#file').click()
  })
  $('#file').on('change', function (e) {
    var fileList = e.target.files
    if (fileList.length === 0) return layer.msg('请选择图片')
    var file = e.target.files[0]
    var newImgURL = URL.createObjectURL(file)
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })
  // 样式基本弄完，打算向服务器发送数据
  // 定义文章的发布状态
  var art_state = '已发布'
  // 存为草稿按钮，绑定点击事件处理函数
  $('#btnSave').on('click', function () {
    art_state = '草稿'
  })
  // 为表单绑定submit提交事件
  $('#pub_form').on('submit', function (e) {
    e.preventDefault()
    // 创建formDate的实例
    var fd = new FormData($(this)[0])
    // 由于 state属性没有在表单中，所以，向表单追加一个值
    fd.append('state', art_state)
    // 通过循环formDate的实例对象，可以得到表单中的键值对
    // fd.forEach(function(v,k) {
    //   console.log(k,v);
    // })
    // 此时，只缺文章的封面，先将裁剪区域得到的图片，输出一个文件，然后想办法将，文件转为 blob二进制，添加到 cover_img 属性后
    // 将封面裁剪过后的图片输出为文件对象
    // 调用$image.toBlob方法，可以得到一个对象，blob就是文件的对象
    // 将封面裁剪的图片，输出为一个对象
    // 只要调用了.toBlob()方法，就可以将.cropper()方法内的部分输出一个文件
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，输出为文件对象
        // 得到文件对象后，进行后续的操作
        // 在大事件项目中，将文件对象存储到 fd 中
        fd.append('cover_img', blob)
      })
      // 发起ajax请求，实现发布文章的功能
      function publishArticle(fd) {
        $.ajax({
          method: 'POST',
          url: '/my/article/add',
          data: fd,
          contentType: false,
          processData: false,
          success: function(res) {
            if(res.status !== 0) return layer.msg('发布文章失败')
            layer.msg('发布文章成功')
            location.href = '/article/art_list.html'
          }
        })
      }
  })
})
