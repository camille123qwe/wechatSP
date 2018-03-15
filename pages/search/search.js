// pages/search/search.js
var common = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sousuoicon: '/assests/icon/shouye/4@2x.png',
    goodsflag:true,
    hisArr:[],
  },
  search:function(e){
    let goodsname="";
    if(!e.detail.value){
      goodsname = e.currentTarget.dataset.keywords;
    }else{
      goodsname = e.detail.value;
    }
    let that = this;
    if (goodsname==""){
      wx.showModal({
        title: '提示',
        content: '请输入关键字进行搜索',
        showCancel: false
      })
    }else{
      //新增搜索历史
      if (this.data.globalData.custuserid) {
        wx.request({
          url: common.createHistory,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'cookie': 'UNF=' + this.data.globalData.UNF,
          },
          data: {
            bean: {
              keywords: goodsname,
              storeid: this.data.globalData.storeid
            }
          }
        });
      }
      that.queryFun(goodsname);
    }
  },
  queryFun: function (goodsname){
    let that = this;
    //查询搜索名称
    wx.request({
      url: common.shopGoods,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      data: {
        bean: {
          goodsname: goodsname,
          storeid:this.data.globalData.storeid
        }
      },
      success: function (res) {
        that.historyQuery();
        if (res.data.rows.length > 0) {
          that.setData({
            goodslist: res.data.rows,
            goodsflag: false,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您搜索的商品不存在',
            showCancel: false
          })
        }
      }
    })
  },
  quxiao:function(){
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //获取公共数据
  appInstance() {
    let Appdata = getApp();
    this.setData({
      globalData: Appdata.globalData,
    });
  },
  //查询历史查询关键字
  historyQuery(){
    let that = this;
    wx.request({
      url: common.history,
      data:{
        bean:{
          storeid:this.data.globalData.storeid,
          status:[10]
          }
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      success:function(res){
        that.setData({
          hisArr:res.data
        })
      }
    })
  },
  //进入商品详情页
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
  //清除历史记录
  clear:function(){
    let arr = this.data.hisArr;
    let searchhisids = [];
    for(let item of arr){
      searchhisids.push(item.custsearchhisid);
    }
    console.log(searchhisids);
    
    wx.request({
      url: common.clearHistory,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      data:{
        searchhisids: searchhisids,
      },
      success:function(res){
        console.log(res);
        if(res.data.retcode==0){
          this.historyQuery();
        }
      }
    })

  },
  onLoad: function (options) {
    this.appInstance();
    if (this.data.globalData.custuserid){
      this.historyQuery();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.appInstance();
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