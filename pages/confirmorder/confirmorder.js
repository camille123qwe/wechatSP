// pages/confirmorder/confirmorder.js
var common = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  appInstance() {
    let Appdata = getApp();
    this.globalData = Appdata.globalData;
    new Appdata.ToastPannel();
  },
  data: {
    money: 0,
    orderlist: [],
    custgoodsorderid: '',
    comment: '',
    pricenumber: 600.76,
    img_url: 'http://c.diancall.com/pipes/img/goods_900/',
    shopcartids: [],
    defauladdres: '',
  },
  findaddres: function () {
    var that = this;
    let hoturl = common.addrQuery;
    wx.request({
      url: hoturl,
      data: {
        bean: { 
          "status": [10],
          custuserid: getApp().globalData.custuserid
          
        }
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      }, success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            addresShow2: false,
            addresShow1: true,
          });
        } else {
          that.setData({
            addresShow2: false,
            addresShow1: true,
          });
          for (let item of res.data) {
            if (item.defaultorno == 10) {
             // console.log(JSON.stringify(item))
              that.setData({ defauladdres: item });
              that.data.defauladdres = item;
              that.setData({
                addresShow2: true,
                addresShow1: false,
              });
              return;
            };
           
          }
        }
      }
    })
  },
  findorder: function (custgoodsorderid) {
    var that = this;
    let hoturl = common.findgoodsorder + custgoodsorderid;
    wx.request({
      url: hoturl,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      }, success: function (res) {
        that.setData({ orderlist: res.data.result.custOrder2Goodses })
        that.setData({ ordertitle: res.data.result.ordertitle })
        let cons = 0
        for (let item of res.data.result.custOrder2Goodses) {
          cons += item.totalprice
        }
        that.setData({ money: cons })

      }
    })
  },
  goaddres: function () {
    wx.navigateTo({
      url: '../addrlist/addrlist',
    });
  },
  putchange: function (event) {
    this.data.comment = event.detail.value;
  },
  wechatpay: function () {
    if (this.data.defauladdres == '') {
      // console.log('请前往添加地址')
      this.show('请前往添加地址')
      return;
    }
    var that = this;
    let hoturl = common.updategoodsorder;
    wx.request({
      url: hoturl,
      data: {
        bean: {
          'custgoodsorderid': that.data.custgoodsorderid,
          'comment': that.data.comment,
          'custshippingaddressid': that.data.defauladdres.custshippingaddressid
        }
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      },
      success: function (res) {
        that.prepay();
      }
    })

  },
  prepay: function () {
    let that = this;
    wx.request({
      url: common.prepay,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      },
      data: {
        bean: {
          payway: 20,
          paytype: 20,
          payno: this.data.custgoodsorderid,
        }
      },
      success: function (res) {
        if (res.data.retcode == 0) {
          let obj = res.data.result;
          obj.package = "prepay_id=" + res.data.result.prepayid;
          wx.requestPayment({
            'timeStamp': obj.timeStamp,
            'nonceStr': obj.nonceStr,
            'package': obj.package,
            'signType': 'MD5',
            'paySign': obj.paySign,
            'success': function (res) {
             console.log(res);
              wx.reLaunch({
                url: '../payscussess/payscussess?orderid=' + that.data.custgoodsorderid
              })
            },
            'fail': function (res) {
             // console.log(res);
            that.show(res.data.retinfo);
            }
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.custgoodsorderid = options.jsonStr
    // let datas = JSON.parse(options.jsonStr);
    // this.setData({ orderlist: datas });
    // let cons=0
    // for (let item of datas){
    //   cons += item.goodsInfo.sellprice * item.count
    //   this.data.shopcartids.push(item.cartgoodsitemsid)
    // }
    // this.setData({ money: cons });
    this.findorder(options.jsonStr)
    this.findaddres();
    this.appInstance();
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
    this.findaddres();
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