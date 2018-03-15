// pages/shoppingcar/shoppingcar.js
var common = require('../../utils/util.js');
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gouwuche:'/assests/icon/shoppingcar/icon_konggouwuche@2x.png',
    storeicon: "/assests/icon/shoppingcar/icon_shangdian@2x.png",//门店图标
    Uncheck: "/assests/icon/shoppingcar/icon_weixuanze@2x.png",//未选择图标
    Checked: "/assests/icon/shoppingcar/icon_xuanze@2x.png",//已选择图标
    allcheck: false, // 全选状态，默认未选
    hasList: false,          // 列表是否有数据
    carts: [],               // 购物车列表
    totalPrice: 0,           // 总价，初始为0
    putvalue:1,
    currentName: "",
    currentGoods:"",
    content:"",
    count:0,
    shoppingcarlist: [],
    allprice: 0
  },
  errorFunction: function (e) {
    
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "carts[0].goodslist[" + errorImgIndex + "].goodsInfo.goodsface" //carlistData为数据源，对象数组
    var errorImg = {}
    console.log(this.data.carts);
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },
  //获取公共数据
  appInstance() {
    let Appdata = getApp();
    this.setData({ globalData: Appdata.globalData });
    new Appdata.ToastPannel();
  },
  //查询购物车列表
  carlistQuery:function(){
    let mycustcart = common.mycustcart;
    let that = this;
   // console.log(getApp().globalData);
    wx.request({
      url: mycustcart,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      },
      data:{
        storeid: '\"'+getApp().globalData.storeid.toString(36)+'\"'
      },
      success:function(res){
        if(res.data.retcode==0){
          let obj = res.data.result;
          let carts = [];
          let i = 0;
          for(let item in obj){
            let newobj = {};
            newobj.name = item;
            newobj.goodslist = obj[item]; 
            for (let li of newobj.goodslist){
              li.mainIndex = i;
              li.goodsInfo.goodsface = that.data.globalData.goodsfaceurl_900 + li.goodsInfo.goodsface;
              console.log(li);
            }
            carts.push(newobj);
            i++; 
          }
          that.setData({
            hasList: true,        // 既然有数据了，那设为true吧
            carts:carts
          });
        }
      }
    })
  },
  //点击购物车里的门店
  seleStore:function(item){
    let index = item.currentTarget.dataset.index;
    let carts = this.data.carts;                    // 获取购物车列表
    const selected = carts[index].selected;         // 获取当前商品的选中状态
    carts[index].selected = !selected;
    let goodsarr = carts[index].goodslist;              // 改变状态
    for(let item of goodsarr){
      item.selected = !selected;
    }
    let flag = 0;
    let allcheck = false;
    for(let item of carts){
      if(item.selected){
        flag++;
      }else{
        flag--;
      }
    }
    if(flag>=carts.length){
      allcheck = true;
    }
    this.setData({
      carts: carts,
      allcheck: allcheck
    });
    this.getTotalPrice(); 
  },
  //点击购物车里的商品
  seleGoods:function(item){
    let index = item.currentTarget.dataset.index;
    let mainindex = item.currentTarget.dataset.mainindex;
    let carts = this.data.carts;
    let selected = carts[mainindex].goodslist[index].selected; 
    let allcheck = false;
    let flag = 0;
    carts[mainindex].goodslist[index].selected = !selected;
    if(selected){
      carts[mainindex].selected = !selected;
      allcheck = false;
    }else{
      for (let obj of carts[mainindex].goodslist) {
        if (obj.selected) {
          flag++;
        } else {
          flag--;
        }
      }
      if (flag >= carts[mainindex].goodslist.length){
        carts[mainindex].selected = true;
        let isallcheck = 0;
        for(let isall of carts){
          if(isall.selected){
            isallcheck++;
          }else{
            isallcheck--;
          }
        }
        if(isallcheck>=carts.length){
          allcheck=true;
        }
      } else {
        carts[mainindex].selected = false;
        allcheck = false;
      }
    }
    this.setData({
      carts:carts,
      allcheck:allcheck
    });
    this.getTotalPrice(); 
  },
  //点击全选
  seleAll:function(item){
    let carts = this.data.carts;
    let allcheck = this.data.allcheck;
    if (allcheck){
      for(let item of carts){
        item.selected = !allcheck;
        for(let obj of item.goodslist){
          obj.selected = !allcheck;
        }
      }
    }else{
      for (let item of carts) {
        item.selected = !allcheck;
        for (let obj of item.goodslist) {
          obj.selected = !allcheck;
        }
      }
    }
    this.setData({
      allcheck: !allcheck,
      carts: carts
    });
    this.getTotalPrice(); 
  },
  //减少购物车商品数量
  jian:function(item){
    let value = item.currentTarget.dataset.value.count;
    let index = item.currentTarget.dataset.index;
    let mainindex = item.currentTarget.dataset.value.mainIndex;
    if (value >= 2) {
      value--;
      let carts = this.data.carts;
      carts[mainindex].goodslist[index].count = value;
      this.setData({ carts: carts });
    } else {
      // 触发toast组件
      this.show("受不了了，真的不能再少了");
    }
    this.getTotalPrice();
  },
  //增加购物车商品数量
  jia:function(item){
    let value = item.currentTarget.dataset.value.count;
    let index = item.currentTarget.dataset.index;
    let mainindex = item.currentTarget.dataset.value.mainIndex;
    value++;
    let carts = this.data.carts; 
    carts[mainindex].goodslist[index].count = value;
    this.setData({carts: carts});
    this.getTotalPrice();
  },
  getTotalPrice:function() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    let count = 0;
    for (let i = 0; i < carts.length; i++) {       
      if (carts[i].selected) {                   
        //total += carts[i].num * carts[i].price;
        let arr = carts[i].goodslist;
        for(let item of arr){
          total += item.count * item.goodsInfo.sellprice/100;
            count+= item.count;
        }
      }else{
        let arr = carts[i].goodslist;
        for (let item of arr) {
          if(item.selected){
            total += item.count * item.goodsInfo.sellprice/100;
            count += item.count;
          }
        }
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      count:count
    });
  },
  //跳转到订单页面
  dingdan:function(){
    let that = this;
    let carts = this.data.carts;
    let shopcartids = [];
    let arrs=[];
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        let arr = carts[i].goodslist;
        for (let item of arr) {
          shopcartids.push(item.cartgoodsitemsid);
          arrs.push(item);
        }
      } else {
        let arr = carts[i].goodslist;
        for (let item of arr) {
          if (item.selected) {
            shopcartids.push(item.cartgoodsitemsid);
            arrs.push(item);
          }
        }
      }
    }
    
    if (shopcartids.length>0){
     let createOrderUrl = common.createOrder;
      wx.request({
        url: createOrderUrl,
        data:{
          shopcartids: shopcartids,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': 'UNF=' + getApp().globalData.UNF,
        },
        success:function(res){
            that.setData({
              totalPrice:0,
              count:0,
              allcheck:false
            })
          let custgoodsorderid =res.data.result[0].custgoodsorderid;
          wx.navigateTo({
            url: '../confirmorder/confirmorder?jsonStr=' + custgoodsorderid,
          })
          }
      })
    }else{
      this.show('您还没有选择宝贝哦')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let flag = common.isBind();
    if (!flag) {
      return;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(function(){
      this.carlistQuery()}.bind(this), 1000);
    this.appInstance();
     // 调用应用实例的方法获取全局数据
   
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
    if (!App.globalData.userInfo){
      getApp().onLogin();
    }
    let flag = common.isBind();
    if (!flag) {
      return;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(function () {
      this.carlistQuery()
    }.bind(this), 1000);
    this.appInstance();
    
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
    this.carlistQuery();
    
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
  // 左滑事件
  touchS: function (e) {  // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchM: function (e) {  // touchmove
    let index = (e.currentTarget.dataset.mainindex);
    let item = App.Touches.touchM(e, this.data.carts[index].goodslist, this.data.startX);
    let carts = this.data.carts;
    carts[index].goodslist = item;
    carts && this.setData({ carts })
  },
  touchE: function (e) { 
    let index = (e.currentTarget.dataset.mainindex); // touchend
    const width = 150  // 定义操作列表宽度
    let item = App.Touches.touchE(e, this.data.carts[index].goodslist, this.data.startX, width)
    let carts = this.data.carts;
    carts[index].goodslist = item;
    carts && this.setData({ carts })
  },
  itemDelete: function (e) { // itemDelete
    let index = (e.currentTarget.dataset.mainindex); // touchend
    let item = App.Touches.deleteItem(e, this.data.carts[index].goodslist);
    let carts = this.data.carts;
    if(item.list.length==0){
      carts = []
    }else{
      carts[index].goodslist = item.list;
    }
    carts && this.setData({ carts });
    let id = item.id;
    wx.request({
      url: common.deleteCar,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      },
      data:{
        shopcartids: '[' + id + ']',
      },
      success:function(res){
        
      }
    })
  },
})