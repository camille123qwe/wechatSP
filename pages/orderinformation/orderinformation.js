// pages/orderinformation/orderinformation.js
var common = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  appInstance() {
    let Appdata = getApp();
    this.globalData = Appdata.globalData;
  },
  data: {
    custOrder2Goodses: [],
    custgoodsorderid:'',
    shopcartids:[],
    img_url: 'http://c.diancall.com/pipes/img/goods_900/',
    orderStatus:1,
    goodslist: [],
    moren: '/assests/icon/bm_imge@2x.png'
  },
  errorface: function (e) {
    var errorImgIndex = e.target.dataset.errorimg; //获取循环的下标
    var imgObject =
      "orderlist[" + errorImgIndex + "].custCartGoodsItems.goodsInfo.goodsface";
    var errorImg = {}
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  errorFunction: function (e) {
    var errorImgIndex = e.target.dataset.errorimg; //获取循环的下标
    var imgObject =
      "goodslist[" + errorImgIndex + "].goodsface";
    var errorImg = {}
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  //查询地址
  findaddres: function () {
    var that = this;
    let hoturl = common.addrQuery;
    wx.request({
      url: hoturl,
      data: {
        bean: { "status": [10] }
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      }, success: function (res) {
        for (let item of res.data) {
          if (item.defaultorno == 10) {
            that.setData({ defauladdres: item });
            that.data.defauladdres = item;
          }
        }
      }
    })
  },
  //查询订单详情
  findorder: function (custgoodsorderid) {
    var that = this;
    let hoturl = common.findgoodsorder + custgoodsorderid;
    wx.request({
      url: hoturl,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      }, success: function (res) {
        for (let item of res.data.result.custOrder2Goodses){
          item.custCartGoodsItems.goodsInfo.goodsface = getApp().globalData.goodsfaceurl_900 + item.custCartGoodsItems.goodsInfo.goodsface;
              
        }
        that.setData({ 
          orderlist: res.data.result.custOrder2Goodses,
          ordertitle: res.data.result.ordertitle,
          ordersattus: res.data.result.status
         });
        let cons = 0
        for (let item of res.data.result.custOrder2Goodses) {
          cons += item.totalprice
        }
        that.setData({ money: cons });
        console.log(that.data.orderlist);
      }
    })
  },

  goodsQuery: function () {//猜你喜欢商品查询
    var that = this;
    let hoturl = common.shopGoods;
    wx.request({
      url: hoturl,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      },
      data: {
        bean: {
          // storeid: parseInt(id, 36),
          //  status: this.status,25000001,25000002,25000100,25001763
          storeid: getApp().globalData.storeid,
          status: [10]
        }, flipper: {
          offset: that.data.flipper_page,
          limit: that.data.limit
        },
      },
      success: function (res) {
        for(let item of res.data.rows){
          item.goodsface = getApp().globalData.goodsfaceurl_900+item.goodsface;
        }
        that.setData({ goodslist: res.data.rows });
      }
    })
  },
  goodsDetail: function (item) {//点击猜你喜欢商品
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
    this.data.custgoodsorderid = options.orderid
    this.appInstance();
    this.findorder(options.orderid);
    this.findaddres(options.orderid);
    this.goodsQuery();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.appInstance()
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