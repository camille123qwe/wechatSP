// pages/myorder/myorder.js
var common = require('../../utils/util.js');
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    txt_status: [0],
    orderlists: [],
    currentTab: 0,
    img_url: 'http://c.diancall.com/pipes/img/goods_900/',
    globalData: {},
    carts: [],   

  },



  errorFunction: function (e) {
    var errorImgIndex = e.target.dataset.errorimg; //获取循环的下标
    var mainindex = e.target.dataset.mainerror;
    var imgObject =
     "orderlists["+mainindex+"].custOrder2Goodses[" + errorImgIndex + "].goodsInfo.goodsface";
    var errorImg = {}
    errorImg[imgObject] = "/assests/icon/error.jpg" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
  },

  appInstance() {
    let Appdata = getApp();
    this.globalData = Appdata.globalData;
    new Appdata.ToastPannel();
  },
  orderQuery: function (data) {
    wx.showToast({
      title: '加载中',
      icon:'loading',
      duration:1000
    })
    var that = this;
    let hoturl = common.querygoodsorder;
    wx.request({
      url: hoturl,
      data: {
        bean: {
          "custuserid": getApp().globalData.custuserid,
          'storeid': getApp().globalData.storeid,
          "status": data
        },
        // flipper: {
        //   offset: that.data.flipper_page,
        //   limit: that.data.limit
        // },
      }, header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + getApp().globalData.UNF,
      },
      success: function (res) {
        for(let item of res.data.result.rows){
          for (let li of item.custOrder2Goodses){
            li.goodsInfo.goodsface = getApp().globalData.goodsfaceurl_900 + li.goodsInfo.goodsface
          }
        }
        that.setData({ orderlists: res.data.result.rows });
        let data = that.data.orderlists;
        console.log(data);
        for (let item of data) {
          item.order = false;
          console.log(item.order)
          // item.status=2
          if (item.status == 1) {
            item.goodstittle = '待付款' 
          } else if (item.status == 2 || item.status == 3|| item.status == 8 || item.status == 9) {
            item.goodstittle = '待收货'
          } else if (item.status == 4 || item.status == 7) {
            item.goodstittle = '已完成'
          } else if (item.status == 5) {
            item.goodstittle = '已完成'
          }
        }
        // that.setData({ orderlists: data });
      }
    })
  },
  deleteoder: function (event) {//删除订单按钮
    let str ='订单删除成功';
    let datas = event.currentTarget.dataset.id
    this.deletes(datas,str);
  },
  cancel: function (event) {//取消订单按钮
    let str = '订单取消成功';
    let datas = event.currentTarget.dataset.id
    this.deletes(datas, str);
  },
  deletes: function (datas, str) {//删除订单
    var that = this;
    let hoturl = common.cancelgoodsorder;
    wx.showModal({
      title: '提示',
      content: '确定删除这订单吗？',
      success: function (res) {
        if (res.confirm) {
          let hoturl = common.cancelgoodsorder;
          wx.request({
            url: hoturl + datas.custgoodsorderid,
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'cookie': 'UNF=' + getApp().globalData.UNF,
            },
            success: function (res) {
              if (res.data.retcode == 0) {
                that.show(str)
                let Index = datas;
                that.data.orderlists.splice(Index, 1);
                that.setData({ orderlists: that.data.orderlists });
              }else{
                that.show(res.data.retinfo)
              }
            },
          })
        } 
      }
    })
  },
  confirm: function (event){//确认收货
    let datas = event.currentTarget.dataset.id
    var that = this;
    let hoturl = common.confirmgoodsorder;
    wx.showModal({
      title: '提示',
      content: '您确定收到商品了吗？',
      success: function (res) {
        if (res.confirm) {
          console.log(hoturl)
          wx.request({
            url: hoturl + datas.custgoodsorderid,
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'cookie': 'UNF=' + getApp().globalData.UNF,
            },
            success: function (res) {
              var _that = this;
              if (res.data.retcode == 0) {
                that.show('确认收货成功')
                let Index = datas;
                that.data.orderlists.splice(Index, 1);
                that.setData({ orderlists: that.data.orderlists });
              } else {
                that.show(res.data.retinfo)
              }
            },
          })
        } else {

        }
      }
    })
  },
  taporder: function (event) {
    let custgoodsorderid = event.currentTarget.dataset.thisor.custgoodsorderid
    wx.navigateTo({
      url: '../orderinformation/orderinformation?orderid=' + custgoodsorderid,
    });
  },
  payment: function (event) {
    let custgoodsorderid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../confirmorder/confirmorder?jsonStr=' + custgoodsorderid,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
      if (e.target.dataset.current == 0) {
        this.data.txt_status = [1,2,3,4,5,6,7,8,10,11];
      } else if (e.target.dataset.current == 1) {
        this.data.txt_status = [1];
      } else if (e.target.dataset.current == 2) {
        this.data.txt_status = [2,3,8,9];
      } else if (e.target.dataset.current == 3) {
        this.data.txt_status = [2,9];
      } else if (e.target.dataset.current == 4) {
        this.data.txt_status = [4, 7,5];
      };
      this.orderQuery(this.data.txt_status);
    };
    
  },
  
  onLoad: function (options) {
    if (JSON.parse(options.OrderType)) {
      let types = JSON.parse(options.OrderType)
      let num = 0;
      switch (types) {
        case 'all':
          num = 0
          this.data.txt_status = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11];
          break;
        case 'obligation':
          num = 1
          this.data.txt_status = [1];
          break;
        case 'overhang':
          num = 2
          this.data.txt_status = [2, 3, 8, 9];
          break;
        case 'wait':
          num = 3
          this.data.txt_status = [2, 9];
          break;
        case 'accomplish':
          num = 4
          this.data.txt_status = [4, 7, 5];
          break;
        default:
          break;
      };
      this.orderQuery(this.data.txt_status);
      this.setData({
        currentTab: num,
      })
    }
    // this.orderQuery()
    let app = getApp();
    // toast组件实例
    this.appInstance()
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
    // this.orderQuery()

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