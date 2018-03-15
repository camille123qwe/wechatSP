// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opentime:"9:00-17:00",
    flipper_page:0,
    limit:20,
    storeinfo:{},
    storeface:"",
    imgurl:{},
    isfollowed:null,
    followed:"/assests/icon/icon-heart.png",
    goodslist:[]
  },
//点击关注
  toFollow:function() {
    this.setData({isfollowed:true});
  },
//获取公共数据
  appInstance(){
    let Appdata = getApp();
    this.setData({imgurl: Appdata.globalData});
  },
//查询商品
  goodsQuery:function(){
    var that = this;
    wx.request({
      url: 'http://c.diancall.com/pipes/custgoods/query/',
      data: {
        bean: {
         // storeid: parseInt(id, 36),
        //  status: this.status,
          storeid: 25000001,
          status:[10]
        }, flipper: {
          offset: that.data.flipper_page,
          limit: that.data.limit
        },
      },
      success:function(res){
        that.setData({goodslist:res.data.rows});
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询门店信息
    var that = this;
    this.appInstance();
    wx.request({
      url: 'http://c.diancall.com/pipes/custstore/findstoreinfo/evu4h',
      data: '',
      success: function (res) {
        let result = res.data;
        let storeImgArr = [];
        result.storeface = that.data.imgurl.storefaceurl_900 + result.storeface;
        if (this.storeimgs == undefined) {
          storeImgArr = result.storeface;
        } else {
          let storeImgArr = result.storeimgs.split(";")
          for (var value of storeImgArr){
            value = this.data.imgurl.storeimgsurl_720 + value;
          }
        }
        that.setData({
          storeinfo: res.data,
          isfollowed: res.data.isfollowed
        });
        if (result.opentime != "" && result.closetime != "") {
          that.setData({opentime:result.opentime+"-"+result.closetime});
        }
      }
    });
    this.goodsQuery();
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