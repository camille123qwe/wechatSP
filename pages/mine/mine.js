// pages/mine/mine.js
var common = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    username: {
      name: 'jack',
      avatar: 'http://wx4.sinaimg.cn/thumb150/006c6EXlly1foloctiaqzj30qo1bfgmy.jpg'
    },
    mylist: [
      {
        iconurl: '/assests/icon/me/icon_wodeshoucang@2x.png',
        text: '我的收藏',
        moreurl: '/assests/icon/me/icon_gengduo@2x.png',
        pagekey:"mycollection"
      },
      {
        iconurl: '/assests/icon/me/icon_dizhiguanli @2x.png',
        text: '地址管理',
        moreurl: '/assests/icon/me/icon_gengduo@2x.png',
        pagekey:"addrlist"
      },
      {
        iconurl: '/assests/icon/me/icon_bangdingshouji@2x.png',
        text: '绑定手机',
        moreurl: '/assests/icon/me/icon_gengduo@2x.png',
        pagekey: "bindingphone"
      },
      {
        iconurl: '/assests/icon/me/icon_guanyuwomen@2x.png',
        text: '关于我们',
        moreurl: '/assests/icon/me/icon_gengduo@2x.png',
        pagekey:"aboutme"
      }
    ],
    orderarrs:[
      {
        iconurl: '/assests/icon/me/icon_daifukuan@2x.png',
        text: '待付款',
        id: "obligation"
      }, {
        iconurl: '/assests/icon/me/icon_daifahuo@2x.png',
        text: '待发货',
        id: "overhang"
      }, {
        iconurl: '/assests/icon/me/icon_daishouhuo@2x.png',
        text: '待收货',
        id: "wait"
      }, {
        iconurl: '/assests/icon/me/icon_yiwancheng@2x.png',
        text: '已完成',
        id: "accomplish"
      },
    ]
  },
  test(){
    wx.navigateTo({
      url: '../payscussess/payscussess',
    })
  },
  appInstance() {
    let Appdata = getApp();
    this.setData({ globalData: Appdata.globalData });
  },
  goorder: function(){
    let flag = common.isBind();
    if (!flag) {
      return;
    }
    let types = 'all';
    wx.navigateTo({
      url: '../myorder/myorder?OrderType=' + JSON.stringify(types),
    });
  },
  nextPage:function(item){
    if (!getApp().globalData.userInfo) {
      getApp().onLogin();
    }
    
    let pname = item.currentTarget.dataset.pagekey;
    if (pname =='mycollection'||pname=="addrlist"){
      let flag = common.isBind();
      if (!flag) {
        return;
      }
    }
    let nextpage = '../'+pname+'/'+pname;
    if (nextpage =="../shoppingcar/shoppingcar"){
      wx.switchTab({
        url: nextpage
      })
    }else{
      wx.navigateTo({
        url: nextpage
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.appInstance();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  gonextorder :function (event){
    let flag = common.isBind();
    if (!flag) {
      return;
    }
    let id = event.currentTarget.dataset.id
    // let nextPage = "../myorder/myorder";
    // switch (id) {
    //   case 'obligation':    
    //     nextPage = MyShopPage;
    //   case 'overhang':
    //     nextPage = MyShopPage;
    //   case 'wait':
    //     nextPage = MyShopPage;
    //   case 'accomplish':
    //     nextPage = MyShopPage;
    //   default:
    //     break;
    // };
    // console.log(id)
    wx.navigateTo({
      url: '../myorder/myorder?OrderType=' + JSON.stringify(id)
    });
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
    this.appInstance();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

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

  },


})