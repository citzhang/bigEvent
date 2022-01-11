$(function() {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  function addZ(n) {
    return n<10? '0'+n:n 
  }
  // 美化时间
  template.defaults.imports.dateFormat= function(date) {
    var df = new Date(date)
    var y = df.getFullYear()
    var m = addZ(df.getMonth())
    var d = addZ(df.getDate())
    var h = addZ(df.getHours())
    var mm =addZ( df.getMinutes())
    var s = addZ(df.getSeconds())
    return `${y}年${m}月${d}日${h}时${mm}分${s}秒`
  }
  // 定义 查询参数对象，请求数据的时候，将请求参数对象提交到服务器
  var q = {
    pagenum: 1,   // 页码值，请求第一页的数据
    pagesize: 2,  // 每页显示几条数据，默认显示2条
    cate_id: '',  // 文章分类的Id
    state: '',    // 文章的发布状态
  }
  // 初始化表格数据
  getArtList()
  // 初始化分类数据
  // 在写完常规代码后，发现并没有渲染出来，为什么呢？是由于layui的渲染机制导致的
  // 网页自上而下渲染时，渲染到最后layui.all.js后，会回来渲染cate_id的选择框，layui没有发现数据，渲染出空的下拉菜单，然后通过动态发送ajax方式异步请求回来可选项，通过模板引擎插入select标签中，但插入数据并没有被layui监听到。用form.render()方法，一调用这个方法，会重新渲染表单区域
  // 动态获取文章分类
  getArtCate()
  function getArtCate() {
    $.ajax({
      method:'GET',
      url: '/my/article/cates',
      success: function(res) {
        if(res.status !== 0) return layer.msg('获取文章失败')
        // console.log(res.message);
        var htmlStr = template('cate_tpl',res)
        $('[name="cate_id"]').html(htmlStr)
        form.render()
      }
    })
  }
  function getArtList() {
    $.ajax({
      method:'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) {
        if(res.status !== 0) return layer.msg('请求失败')
        console.log(res);
        var htmlStr = template('list_tpl',res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法,要把总数据条数传去

        renderPage(res.total)
      }
    })
  }
  $('.layui-form').on('submit',function(e) {
    e.preventDefault();
    var cate_id = $('[name="cate_id"]').val()
    var state = $('[name="state"]').val()
    q.cate_id = cate_id
    q.state = state
    getArtList()
  })
// ----------------------------------------------
// 定义渲染分页的方法
  function renderPage(total) {
    // 在调用laypage.render方法的时候，可以传入一个配置对象，在配置对象中有一个jump回调函数，在回调函数中有2个参数，1个是obj，另一个是first,在obj中有当前分页的所有选项值
    laypage.render({
      // 调用 4 个参数
      elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
      ,count: total, //数据总数，从服务端得到
      limit: q.pagesize,  // 当前每页显示的数据量
      curr: q.pagenum,     // 设置默认被选中的分页
      limits: [1,2,3,4,5],
      layout: ['count','limit','prev','page','next','skip'],
      jump: function(obj,first) {
        // console.log(obj.curr);
        // 将最新的页码值赋值到查询参数上
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if(!first) {
          // 根据最新的q获取最新的数据列表，渲染到页面
          getArtList()
        }
      }
    })
  }
  $('tbody').on('click','#delBtn',function() {
    var len = $('#delBtn').length
    var id = $(this).attr('data-id')
    console.log(id);
    // console.log('ok');
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          if(res.status !== 0) return layer.msg(res.message)
          layer.msg(res.message)
          if(len === 1) {
            q.pagenum = q.pagenum === 1? q.pagenum:q.pagenum -1
          }
          getArtList()
        }
      })
      layer.close(index);
    });
  })
})
