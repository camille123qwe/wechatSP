// pages/bindingphone/bindingphone.js
var common = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '获取验证码',
    idcodeimage: common.imgCode,
    validcode: '',
    mobile: '',
    vercode: '',
    name: '',
    veryNum: '获取验证码',
    flag: false
  },

  /**
   * 页面交互
   */
  // 提交绑定
  commit: function () {
    // 正则
    var mPattern = /^1[34578]\d{9}$/;
    var vPattern = /^\d{4}$/;
    var msPattern = /^\d{6}$/;

    if (mPattern.test(this.data.mobile) && vPattern.test(this.data.validcode) && msPattern.test(this.data.vercode)) {
      this.bingwithwechat()
    } else {
      wx.showToast({
        title: '信息填写错误',
        icon: 'success',
        duration: 2000
      })
    }
  },
  // 获取验证码
  begintimer: function (e) {
    // 添加60s倒计时

    // 正则
    var mPattern = /^1[34578]\d{9}$/;
    var vPattern = /^\d{4}$/;
    var msPattern = /^\d{6}$/;
    if (mPattern.test(this.data.mobile) && vPattern.test(this.data.validcode)) {
      this.setData({ flag: true });
      this.getmsgcode(e.target.dataset);
      this.setData({ veryNum: '59秒' })
      let cont = 59;
      let interval = setInterval(() => {
        let str = cont + '秒';
        cont--;
        this.setData({ veryNum: str })
        if (cont == 0) {
          clearInterval(interval);
          this.setData({
            flag: false,
            veryNum: '获取验证码'
          });
        }
      }, 1000);
    } else {
      wx.showToast({
        title: '信息填写错误',
        icon: 'none',
        duration: 2000
      })
    }

  },
  // 点击图片
  imagetap: function () {
    this.setData({
      idcodeimage: common.imgCode + "?" + (new Date().getTime())
    });
  },

  bindvalidInput: function (e) {
    this.setData({
      validcode: e.detail.value
    })
  },
  bindmobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindnameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindvercodeInput: function (e) {
    this.setData({
      vercode: e.detail.value
    })
  },
  appInstance() {
    let Appdata = getApp();
    this.setData({ globalData: Appdata.globalData });
  },

  // 获取短信验证码
  getmsgcode: function (e) {
    // let hoturl = common.shopGoods;
    let data = this.data
    wx.request({
      url: common.verycode + data.mobile + '/ip:/validcode:' + data.validcode,
      data: {

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      success: function (res) {
        // console.log('66666====' + JSON.stringify(res)); 
      }
    })
  },
  // 绑定
  bingwithwechat: function (e) {
    // number：电话号码   openid： 微信id  vercode: 短信验证码\
    let data = this.data;
    let _this = this;
    wx.request({
      url: common.bindMobile + data.mobile + '/openid:' + data.globalData.openid + '/vercode:' + data.vercode + '/name:' + data.name,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'UNF=' + this.data.globalData.UNF,
      },
      success: function (res) {
        if (res.data.retcode == 0) {
          if (res.data.result.custuserid) {
            getApp().globalData.custuserid = res.data.result.custuserid;
            getApp().globalData.isBinding = true;
            let str = res.header['Set-Cookie'];
            if (str) {
              var cookie = res.header['Set-Cookie'].split(";");
              for (let tt of cookie) {
                if (tt.indexOf('UNF') != -1) {
                  getApp().globalData.UNF = tt.substring(tt.indexOf('UNF=') + 4);
                  getApp().globalData.isBinding = true;
                  wx.showToast({
                    title: '绑定成功',
                    duration: 1000
                  })
                  setTimeout(function () {
                    wx.navigateBack();
                  }, 1000)
                }
              }
            }
          } else {
            wx.showToast({
              title: res.data.retinfo

            });
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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