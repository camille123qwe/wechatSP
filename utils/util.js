const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

function isBind(){
  let flag = true;
    if (!getApp().globalData.isBinding) {
      wx.showModal({
        title: '提示',
        content: '您需要绑定手机号才能进行相关操作哦',
        cancelText: '取消',
        confirmText: '去绑定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../bindingphone/bindingphone',
            })
          } else if (res.cancel) {
            // wx.showToast({
            //   title: '取消绑定',
            //   icon: 'none'
            // })
          }
        }
      });
      flag = false;
    }
    return flag;
  }
const urlHost = 'http://192.168.1.128:6001';
//const urlHost = 'https://c.diancall.com';
module.exports = {
  isBind:isBind,
  addaddres: urlHost +'/pipes/custshipadder/update',//新增地址
  shopGoods: urlHost + '/pipes/custgoods/query/',//获得门店热门商品列表
  mycustcart: urlHost + '/pipes/b2cmall/mycustcart',//查询我的购物车
  goodsGroup: urlHost + '/pipes/custgoods/goodsgroup/',//查询商品分类
  findGoods: urlHost + '/pipes/custgoods/find/',//查询商品详情
  addCar: urlHost + '/pipes/b2cmall/add2custcart',//添加到购物车
  createOrder: urlHost + '/pipes/b2cmall/createcustgoodsorder',//结算生成订单
  addrQuery: urlHost + '/pipes/custshipadder/query',//地址列表查询
  addrUpdate: urlHost + '/pipes/custshipadder/update',//新增或修改地址
  findAddr: urlHost + '/pipes/custshipadder/find/',//查询用户收货地址信息
  favorite: urlHost + '/pipes/custgoods/favorites/',//添加收藏商品
  favList: urlHost + '/pipes/custgoods/footstep/query',//收藏列表
  deleteCar: urlHost + '/pipes/b2cmall/deletecustcart',//批量删除购物车
  history: urlHost + '/pipes/custsearchhis/query',//查看搜索历史列表
  createHistory: urlHost + '/pipes/custsearchhis/wxmini/update',//新增搜索历史
  prepay: urlHost + '/pipes/b2cpay/wxmini/prepay',//微信预支付
  querygoodsorder: urlHost + '/pipes/b2cmall/querycustgoodsorder',//查询订单
  cancelgoodsorder: urlHost + '/pipes/b2cmall/cancelgoodsorder/',//取消订单
  findgoodsorder: urlHost +'/pipes/b2cmall/findgoodsorder/',//订单详情
  findaddres: urlHost + '/pipes/custshipadder/query',
  updategoodsorder: urlHost + '/pipes/b2cmall/updategoodsorder/confirmorder',//更新订单信息
  clearHistory: urlHost + '/pipes/custsearchhis/clear',//清除历史记录
  imgCode: urlHost +'/pipes/validcode/get/',//获取图片验证码
  verycode: urlHost + '/pipes/custuser/smswxbind/mobile:',//获取验证码
  bindMobile: urlHost + '/pipes/wxmini/bind/mobile:',//绑定手机
  confirmgoodsorder: urlHost + '/pipes/b2cmall/confirmgoodsorder/', //确认收货
  banner: urlHost + '/pipes/bannerpage/query',//查询banner图
  storeInfo: urlHost + '/pipes/custstore/findstoreinfo/'//查询门店信息
}


