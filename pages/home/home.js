// pages/shouye/shouye.js
var common = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchPlaceholder: '请输入你想搜索的商品',
    sousuoicon:'/assests/icon/shouye/4@2x.png',
    remaiicon:'/assests/icon/shouye/icon_remaishangpin@2x.png',
    xianshi: '/assests/icon/shouye/icon_xianshimiaosha@2x.png',
    tuijian: '/assests/icon/shouye/icon_dianzhangtuijian@2x.png',
    xinpin: '/assests/icon/shouye/icon_xinpinshangshi@2x.png',
    banners:[
      '/assests/icon/shouye/haotaitai.png',
      '/assests/icon/shouye/vivo.png',
      '/assests/icon/shouye/zqgq.png',
    ],
    globalData:{},
    goodslist: [],
    moren:'/assests/icon/bm_imge@2x.png',
    flipper_page:0,
    limit:20
  
  },
  errorbanner:function(e){
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "banners[" + errorImgIndex + "]" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
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
    this.setData({ globalData:Appdata.globalData });
  },
  //查询商品
  goodsQuery: function (){
    // this.setData({
    //   loading: false
    // });
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
          status: [10]
        }, flipper: {
          offset: that.data.flipper_page,
          limit: that.data.limit
        },
      },
      success: function (res) {
        for(let item of res.data.rows){
          item.goodsface = that.data.globalData.goodsfaceurl_900+item.goodsface
        }
        that.setData({ goodslist: res.data.rows });
        
        // let goodslist = that.data.goodslist;
        // goodslist = goodslist.concat(res.data.rows)
        // that.setData({ goodslist: goodslist });
        // if (goodslist.length >= res.data.total) {
        //   this.setData({
        //     loading:false
        //   });
        // }else{
        //   this.setData({
        //     loading: true
        //   });
        // }
      }
    })
  },
  //进入搜索页面
  searchPage:function(){
    wx.navigateTo({
      url: '../search/search'
    })
  },
  //进入商品详情页
  goodsDetail:function(item){
    let goodsinfo = item.currentTarget.dataset.goods;
    let goodsid = goodsinfo.goodsid;
    let merchid = goodsinfo.merchid;
    let storeid = goodsinfo.storeid;
    let navdata = JSON.stringify({
      merchid:merchid,
      goodsid:goodsid,
      storeid:storeid
    });
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?navdata='+navdata,
    })
  },
  //进入限时秒杀，店长推荐，新品上市
  nextPage:function(e){
    let key = e.currentTarget.dataset.pagekey;
    wx.navigateTo({
      url: '../'+key+'/'+key,
    })
  },
  redyouzi:function(){
    window.location.href="http://www.baidu.com";
  },
  bannerQuery(){
    let that = this;
    let storeid = getApp().globalData.storeid;
    wx.request({
      url: common.banner,
      data:{
        bean:{
          storeid: storeid
        }
      },
      success:function(res){
        if(res.data.length==0){
          let bannerArr = [];
            wx.request({
              url: common.storeInfo+storeid.toString(36),
              success:function(res){
                console.log(res);
                res = res.data;
                let imgarr = res.storeimgs.split(";");
                if (imgarr.length>=2){
                    for(let item of imgarr){
                      item = getApp().globalData.storeimgsurl_720 + item;
                      bannerArr.push(item);
                    }
                }else{
                  if(res.storeface!=res.storeimgs&&res.storeimgs!=""){
                    bannerArr = 
                    [
                      getApp().globalData.storefaceurl_900 + res.storeface, 
                      getApp().globalData.storeimgsurl_720 +res.storeimgs
                    ]
                  }else{
                    bannerArr =
                      [
                        getApp().storefaceurl_900 + res.storeface
                      ]
                  }
                }
                console.log(bannerArr);
                that.setData({banners:bannerArr});
              }
            })
        }else{
          that.setData({banners:res.data});
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.appInstance();
    this.goodsQuery();
    this.bannerQuery();
    
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
    // wx.showToast({

    //   title: '没事儿别乱拉',//提示信息

    //   icon: 'success',//成功显示图标

    //   duration: 2000//时间

    // })
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
  // searchScrollLower:function(){
  //   console.log('你瞅啥呀');
  //   let offset = this.data.flipper_page;
  //   offset = offset+20;

  //   this.setData({
  //     flipper_page:offset
  //   });
  //   if(this.data.loading){
  //     this.goodsQuery();
  //     // setTimeout(function () {
  //     //   this.goodsQuery();
  //     // }.bind(this), 1000)
  //   }
  // }
})