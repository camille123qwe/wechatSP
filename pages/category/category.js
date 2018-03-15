// pages/category/category.js
var common = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories:[],
    categoryclass:"",
    currentId:'',
    globalData:[],
    goodslist:[]
  },
  errorFunction: function (e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "goodslist[" + errorImgIndex + "].goodsface" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  //获取公共数据
  appInstance() {
    let Appdata = getApp();
    this.setData({ globalData: Appdata.globalData });
  },
  //查询商品
  goodsQuery: function (groupid) {
    var that = this;
    let hoturl = common.shopGoods;
    wx.request({
      url: hoturl,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      data: {
        bean: {
          storeid: this.data.globalData.storeid,
          groupid:groupid,
          status: [10]
        }, flipper: {
          offset: that.data.flipper_page,
          limit: that.data.limit
        },
      },
      success: function (res) {
        for (let item of res.data.rows) {
          item.goodsface = that.data.globalData.goodsfaceurl_900 + item.goodsface
        }
        that.setData({ goodslist: res.data.rows });
      }
    })
  },
  //查询商品分类
  categoryQuery:function(){
    let storeid = this.data.globalData.storeid;
    let store36id = storeid.toString(36);
    let that = this;
    let goodsGroup = common.goodsGroup;
    wx.request({
      url: goodsGroup + store36id,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      data:{},
      success:function(res){
        let cId = res.data[0].groupid;
        that.setData({
          categories:res.data,
          currentId:cId
        });
        that.goodsQuery(cId);
      }

    })
  },
  //点击商品分类
  categoryTap:function(item){ 
    this.setData({currentId:item.currentTarget.dataset.groupid});
    this.goodsQuery(this.data.currentId);
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
    this.categoryQuery();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.appInstance();
    this.categoryQuery();
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