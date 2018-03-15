// pages/goodsdetail/goodsdetail.js
var common = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kefu:"/assests/icon/goodsdetail/icon_kefu@2x.png",
    star:"/assests/icon/goodsdetail/icon_shoucang_1@2x.png",
    ystar:"/assests/icon/goodsdetail/icon_yshoucang@2x.png",
    car:"/assests/icon/goodsdetail/icon_gouwuche_1@2x.png",
    more:"/assests/icon/goodsdetail/icon_gengduo@2x.png",
    urlHost:"",
    objId:{
      storeid: "",
      store36id: "",
      merchid: "",
      goodsid: ""
    },
    isfollow:false,
    goodsinfo:{},
    hotlist:[],
    guige:{},
    count:1,
    current :[{currentpropid:'',valuename: ""}, {currentpropid:'',valuename:"" }],
    showModalStatus:false,
  },
  errorFace: function (e) {
    let goodsinfodata = this.data.goodsinfo;
    goodsinfodata.goodsface = "/assests/icon/error.jpg"; //我们构建一个对象
    this.setData({goodsinfo:goodsinfodata}) //修改数据源对应的数据
  },
  errorDetail:function(e){
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "imgarr[" + errorImgIndex + "]" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  errorFunction: function (e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "hotlist[" + errorImgIndex + "].goodsface" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  //获取公共数据
  appInstance() {
    let Appdata = getApp();
    this.setData({ 
      globalData: Appdata.globalData,
    });
  },
  isEmptyObject: function (obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  },
  //查询商品详情
  goodsQuery(){
    let that = this;
    let findGoods = common.findGoods;
    wx.request({
      url: findGoods+parseInt(this.data.objId.goodsid).toString(36),
      data:{},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      success:function(res){
        let imgarr = [];
        if (typeof (res.data.goodsimgs) == 'undefined' || res.data.goodsimgs == '') {
          imgarr.push(res.data.goodsface);
        } else {
          imgarr = res.data.goodsimgs.split(";");
          if(imgarr[0]==res.data.goodsface){
            imgarr.shift();
          }
        }
        let detail = res.data.detail?res.data.detail:"暂无";
        let isfollow = false;
        if (res.data.isfollowed=='true'){
          isfollow = true;
        }
       
        if(res.data.propValues){
          let props = res.data.propValues;
          let propstitle = [];
          let guige = [];
          if (that.isEmptyObject(props) != true) {
            for (let key in props){
              propstitle.push(key);
              guige.push(props[key]);
            }
            that.setData({
              guige: guige,
              propstitle: propstitle
            })
          }
        }

        WxParse.wxParse('detail', 'html', detail, that, 0);
        res.data.goodsface = that.data.globalData.goodsfaceurl_900 + res.data.goodsface;
        let arr = [];
        for(let item of imgarr){
          item = that.data.globalData.goodsfaceurl_900+item;
          arr.push(item);
        }
        that.setData({
          goodsinfo: res.data,
          imgarr: arr,
          isfollow: isfollow
        });
      }
    })
  },
//查询热门商品
  hotGoods:function() {
    let hoturl = common.shopGoods;
    let that = this;
    wx.request({
      url: hoturl,
      data:{
        'bean':{
          storeid: this.data.objId.storeid,
          status: [10]
        }
      },
      success:function(res){
        for(let item of res.data.rows){
          item.goodsface = that.data.globalData.goodsfaceurl_900 + item.goodsface
        }
        that.setData({
          hotlist:res.data.rows
        })
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
  //进入购物车
  gouwuche:function(){
    let flag = common.isBind();
    if (!flag) {
      return;
    }
    wx.switchTab({
      url: '../shoppingcar/shoppingcar'
    })
  },
  //点击选择规格
  moreGuige:function(e){
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu);
  },
  //点击关闭模态框
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  }, 
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    } 
  },
  //减少购物车商品数量
  jian: function (item) {
    let count = this.data.count;
    if (count >= 2) {
      count--;
      this.setData({ count: count });
    } else {
      this.show("受不了了，真的不能再少了");
    }
  },
  //增加购物车商品数量
  jia: function (item) {
    let count = this.data.count;
    count++;
    this.setData({ count: count });
  },
  choose:function(item){
    let mainIdx = item.currentTarget.dataset.index;
    let propid = item.currentTarget.dataset.item.propvalueid;
    let valuename = item.currentTarget.dataset.item.valuename;
    let current = this.data.current;
    current[mainIdx].currentpropid = propid;
    current[mainIdx].valuename = valuename+" ";
    this.setData({
      current:current
      });
  },
  //加入购物车的方法
  addCarFun:function(){
    let len = this.data.propstitle.length;
    let current = this.data.current;
    let props = [];
    for (let i = 0; i < len; i++) {
      if (current[i].valuename == "") {
        this.show("请选择商品规格");
        return;
      } else {
        props.push(current[i].currentpropid);
      }
    }
    let goodsid = this.data.objId.goodsid;
    let storeid = this.data.objId.storeid;
    let count = this.data.count;
    let addcarUrl = common.addCar;//加入购物车接口
    let that = this;
    var flag = wx.request({
      url: addcarUrl,
      data: {
        bean: {
          goodsid: goodsid,
          count: count,
          storeid: storeid,
        },
        props: props
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      },
      success: function (res) {
        if (res.data.retcode == 0) {
          return true;
        }
      }
    })
    if(flag){
      return true;
    }
  },
  noguigeAddcar:function(){
    let goodsid = this.data.objId.goodsid;
    let storeid = this.data.objId.storeid;
    let count = this.data.count;
    let addcarUrl = common.addCar;//加入购物车接口
    let that = this;
    var flag = wx.request({
      url: addcarUrl,
      data: {
        bean: {
          goodsid: goodsid,
          count: count,
          storeid: storeid,
        },
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      },
      success: function (res) {
        if (res.data.retcode == 0) {
          return true;
        }
      }
    })
    if (flag) {
      return true;
    }
  },
  //规格选择页加入购物车
  addcar:function(){
    if (!getApp().globalData.userInfo) {
      getApp().onLogin();
    }
    let flag = common.isBind();
    if (!flag) {
      return;
    }
    let addcar = this.addCarFun();
    if(addcar){
      this.show('添加成功！在购物车等亲哦');
      this.setData({ showModalStatus: false });
    }
  },
  //规格选择页立即购买
  buynow:function(){
    if (!getApp().globalData.userInfo) {
      getApp().onLogin();
    }
    let flag = common.isBind();
    if (!flag) {
      return;
    }
    let addcar = this.addCarFun();
    if (addcar) {
      wx.switchTab({
        url: '/pages/shoppingcar/shoppingcar',
      })
    }
  },
  ifaddcar:function(){
    if (!getApp().globalData.userInfo) {
      getApp().onLogin();
    }
    let flag = common.isBind();
    if(!flag){
      return;
    }
    if(this.data.guige.length>0){
      this.setData({ showModalStatus: true });
    }else{
      if (this.noguigeAddcar()){
        this.show('添加成功！在购物车等亲哦');
      }
    }
  },
  ifbuynow:function(){
    if (!getApp().globalData.userInfo) {
      getApp().onLogin();
    }
    let flag = common.isBind();
    if (!flag) {
      return;
    }
    if (this.data.guige.length>0) {
      this.setData({ showModalStatus: true });
    }else{
      if (this.noguigeAddcar()) {
        wx.switchTab({
          url: '/pages/shoppingcar/shoppingcar',
        })
      }
    }
  },
  //加入收藏
  shoucang:function(){
    if (!getApp().globalData.userInfo) {
      getApp().onLogin();
    }
    let flag = common.isBind();
    if (!flag) {
      return;
    }
  let that = this;
  let goodsid = this.data.objId.goodsid;
  let goods36id = goodsid.toString(36);
   wx.request({
     url: common.favorite +'?goodsids=['+goods36id+']',
     header: {
       'content-type': 'application/x-www-form-urlencoded',
       'cookie': 'UNF=' + getApp().globalData.UNF,
     },
     success:function(res){
       wx.request({
         url: common.favList,
         header: {
           'content-type': 'application/x-www-form-urlencoded',
           'cookie': 'UNF=' + getApp().globalData.UNF,
         },
         data:{
           bean:{}
         },
         success:function(r){
           let isfollow = that.data.isfollow;
           that.setData({
             isfollow:!isfollow
           })
         }
       })
     }
   })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用应用实例的方法获取全局数据
    let app = getApp();
    // toast组件实例
    new app.ToastPannel();
    this.appInstance();
    let objdata = JSON.parse(options.navdata);
    objdata.store36id = parseInt(objdata.storeid).toString(36);
    this.setData({
      objId:objdata
    });
    var that = this;
    // wx.request({
    //   url: '',
    //   method: 'POST',
    //   data: {
    //     'id': 13
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     var article = res.data[0].post;
    //     WxParse.wxParse('article', 'html', article, that, 5);
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.appInstance();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })
    this.goodsQuery();

    this.hotGoods();
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