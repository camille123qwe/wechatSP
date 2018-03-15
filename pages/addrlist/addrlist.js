var common = require('../../utils/util.js');
// pages/addrlist/addrlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentId:"",
    moren:"设为默认",
    infoimg:"/assests/icon/addr/icon_zanwudizhi@2x.png",
    uncheck:"/assests/icon/addr/icon_weixuanze@2x.png",
    checked:"/assests/icon/addr/icon_xuanze@2x.png",
    edit:"/assests/icon/addr/icon_bianji@2x.png",
    dele:"/assests/icon/addr/icon_shanchu@2x.png",
    hiddenModal:true,
    addrArr:[]
  },
  //获取公共数据
  appInstance() {
    let Appdata = getApp();
    this.setData({ globalData: Appdata.globalData });
    new Appdata.ToastPannel();
  },
  //查询地址列表
  addrQuery(){
    let that = this;
    wx.request({
      url: common.addrQuery,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      data:{
        bean: {
          custuserid: this.data.globalData.custuserid,
          "status": [10] 
          }
      },
      success:function(res){
        let arr = res.data;
        let cId = "";
        for(let i=0;i<arr.length;i++){
          if (arr[i].defaultorno==10){
            cId = arr[i].custshippingaddressid;
            let obj = arr[i];
            arr[i] = arr[0];
            arr[0] = obj;
          }
        }
        that.setData({ addrArr: arr, currentId:cId});
      }
    })
  },
  //设置默认地址
  checkAddr(option){
    let id = option.currentTarget.dataset.addrid;
    let that = this;
    wx.request({
      url: common.addrUpdate,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      data:{
        bean: { 
          "custshippingaddressid": id, "status": 10, "defaultorno": 10 
          },
      cols: ["defaultorno"]
      },
      success:function(res){
        if(res.data.retcode==0){
           that.setData(
              {currentId: option.currentTarget.dataset.addrid}
          );
        }
      }
    })
  },
  //删除地址
  delete(option){
    this.setData({
      hiddenModal: false
    })
    let id = option.currentTarget.dataset.addrid;
    this.setData({addrid:id});
    
  },
  //确定删除
  listenerConfirm:function(e){
    let that = this;
    let id = this.data.addrid;
    wx.request({
      url: common.addrUpdate,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      data: {
        bean: {
          "custshippingaddressid": id, "status": 80
        },
        cols: ["status"]
      },
      success: function (res) {
        if (res.data.retcode == 0) {
          that.setData({
            hiddenModal: true
          })
          that.addrQuery();
        }
      }
    })
  },
  listenerCancel:function(){
    this.setData({
      hiddenModal: true
    })
  },
  //新增地址
  addAddr:function(){
    wx.navigateTo({
      url: '../receiveaddress/receiveaddress',
    })
  },
  edit:function(option){
    let id = option.currentTarget.dataset.addrid;
    wx.navigateTo({
      url: '../receiveaddress/receiveaddress?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.appInstance();
    this.addrQuery();
    if(options.dizhi){
      this.show('地址保存成功');
    }
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