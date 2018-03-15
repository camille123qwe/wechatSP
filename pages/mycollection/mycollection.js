// pages/mycollection/mycollection.js
var initdata = function (that) {
  var collectionlist = that.data.collectionlist
  for (var i = 0; i < collectionlist.length; i++) {
    collectionlist[i].txtStyle = ""
  }
  that.setData({ collectionlist: collectionlist })
}
var common = require('../../utils/util.js');
const App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 120,//删除按钮宽度单位（rrpx）
    goodcount: '2',
    noEditing: true, // 默认不在编辑
    collectionlist: [
      // { goodsInfo: { url: '/assests/icon/shouye/haotaitai.png', goodsname: '暂无收藏', sellprice: '', txtStyle: "" } },
    ],
    Uncheck: "/assests/icon/shoppingcar/icon_weixuanze@2x.png",//未选择图标
    Checked: "/assests/icon/shoppingcar/icon_xuanze@2x.png",//已选择图标
    allcheck: false, // 全选状态，默认未选
  },

  errorFunction: function (e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "collectionlist[" + errorImgIndex + "].goodsInfo.goodsface" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  appInstance() {
    let Appdata = getApp();
    this.setData({ globalData: Appdata.globalData });
  },
  /**
   * 页面交互
   */
  edittap: function () {
    let status = this.noEditing;
    this.setData({
      noEditing: !this.data.noEditing
    })
  },
  // 单个商品选择
  goodselect: function (args) {
    let index = args.target.dataset.index
    var collectionlist = this.data.collectionlist
    let selected = collectionlist[index].selected
    collectionlist[index].selected = !selected;
    //更新列表的状态  
    this.setData({
      collectionlist: collectionlist
    });
  },
  // 全部选择
  seleAll: function () {
    var allcheck = this.data.allcheck
    var origin = this.data.collectionlist
    if (allcheck == true) {
      for (let obj of origin) {
        obj.selected = false;
      }
    } else {
      for (let obj of origin) {
        obj.selected = true;
      }
    }
    this.setData({
      allcheck: !allcheck,
      collectionlist: origin
    });
  },
  // 删除
  remove: function () {
    var collectionlist = this.data.collectionlist
    var newcollectionlist = []
    var removeIdList = []
    for (let obj of collectionlist) {
      if (obj.selected == true) {
        removeIdList.push(obj.goodsInfo.goods36id)
      } else {
        newcollectionlist.push(obj)
      }
    }
    // 有选择才响应删除
    if (removeIdList.length > 0) {
      this.changecollectionQuery(removeIdList)

      this.setData({
        collectionlist: newcollectionlist,
        allcheck: false,
      });
    }else{
      console.log('没有选择商品')
    }


  },
  touchS: function (e) {  // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchM: function (e) {  // touchmove
    let collectionlist = App.Touches.touchM(e, this.data.collectionlist, this.data.startX)
    collectionlist && this.setData({ collectionlist })

  },
  touchE: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let collectionlist = App.Touches.touchE(e, this.data.collectionlist, this.data.startX, width)
    collectionlist && this.setData({ collectionlist })
  },
  itemDelete: function (e) {  // itemDelete
  let item = App.Touches.deleteCollect(e, this.data.collectionlist);
  let collectionlist = item.list;
    collectionlist && this.setData({ collectionlist });
    let id = [];
    id.push(item.id);
    this.changecollectionQuery(id);
  },

  // 收藏列表查询
  collectionQuery: function () {
    var that = this;
    // let hoturl = common.shopGoods;
    wx.request({
      url: common.favList,
      data: {
        bean: {
          'favorites': 20,
        },
        flipper: {
          offset: that.data.flipper_page,
          limit: that.data.limit
        },
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      success: function (res) {
        if (res.data.length > 0) {
          let origin = res.data
          for (let obj of origin) {
            obj.selected = false;
            obj.goodsInfo.goodsface = that.data.globalData.goodsfaceurl_900 + obj.goodsInfo.goodsface
          }
      
          that.setData({
            collectionlist: origin
          })
        } else {
          console.log('返回数据长度小于1')
        }
      }
    })
  },
  // 添加/取消收藏
  changecollectionQuery: function (array) {
    console.log(array);
    let url = common.favorite + '?goodsids=' + '['+array+']'
    var that = this;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      success: function (res) {
      }
    })
  },
  //进入商品详情页
  goodsDetail: function (item) {
    let goodsinfo = item.currentTarget.dataset.goods;
    let goodsid = goodsinfo.goodsid;
    let merchid = goodsinfo.merchid;
    let storeid = goodsinfo.storeid;
    let navdata = JSON.stringify({
      merchid: merchid,
      goodsid: goodsid,
      storeid: storeid
    });
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?navdata=' + navdata,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.appInstance();
    this.collectionQuery();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})