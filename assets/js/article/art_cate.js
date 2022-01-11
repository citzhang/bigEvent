$(function () {
  const layer = layui.layer
  const form = layui.form
  form.verify({
    len: function(value) {
      if(value.length > 6) return '字符不能大于6位'
    }
  })
  getArtCate()
  var add =  null
  $('#addBtn').on('click',function() {
    add = layer.open({
      type: 1,
      title: '添加类别',
      area: ['400px', '250px'],
      content: $('#add_tpl').html()
    })
    $('#add_form').on('submit',function(e) {
      e.preventDefault()
      $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: function(res) {
          if(res.status !== 0) {
            layer.close(add)
            return layer.msg('新增失败')
          }
          getArtCate()
          layer.msg('新增成功')
          layer.close(add)
        }
      })
    }) 
  })
  var edit = null
  $('tbody').on('click', '#cate_edit', function () {
    edit = layer.open({
      type: 1,
      title: '类别编辑',
      area: ['400px', '250px'],
      content: $('#edit_tpl').html(),
    })
    var id = $(this).attr('data-id')
    $.ajax({
      method:'GET',
      url: '/my/article/cates/' + id,
      success: function(res) {
        // console.log(res.data);
        if(res.status !== 0) return
        form.val('edit_form',res.data)
      }
    })
    $('#edit_form').on('submit',function(e) {
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/my/article/updatecate',
        data: $(this).serialize(),
        success: function(res) {
          if(res.status !== 0) return '修改失败'
          getArtCate()
          layer.msg('修改success!')
          layer.close(edit)
        }
      })
    })
  })
$('tbody').on('click','#delBtn',function() {
  var id = $(this).attr('data-id')
  layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
    //do something
    $.ajax({
      method: 'GET',
      url: '/my/article/deletecate/' +id,
      success: function(res) {
        console.log(res);
        if(res.status !== 0) return layer.msg('删除失败')
        layer.msg('删除成功')
        getArtCate()
      }
    })
    layer.close(index);
  });  
})
})
function getArtCate() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success: function (res) {
      if (res.status !== 0) return layer.msg('获取分类列表失败')
      var htmlStr = template('cate_tpl', res)
      $('tbody').html(htmlStr)
    },
  })
}
