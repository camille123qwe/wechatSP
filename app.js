//app.js
import Touches from './utils/Touches.js'
import { ToastPannel } from '/component/toastHi/toastHi';
App({
  ToastPannel,
  onLogin:function(){
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        var storeid = this.globalData.storeid;
        var that = this;
        if (code) {
          wx.getUserInfo({
            success: res => {
              // console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
              var _this = that;
              //------------------
              wx.request({
                url: _this.globalData.urlHost + '/pipes/wxmini/authcheck',//获取sessionkey
                method: 'get',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'cookie': 'UNF=' + _this.globalData.UNF,
                },
                data: {
                  storeid: storeid,
                  code: code
                },
                success:function(session){
                  if(session.data.result.session_key){
                    _this.globalData.openid = session.data.result.openid;
                    //解析用户数据
                    wx.request({
                      url: _this.globalData.urlHost + '/pipes/wxmini/decodeuser',//解析用户数据
                      method: 'get',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'cookie': 'UNF=' + _this.globalData.UNF,
                      },
                      data: {
                        storeid: storeid,
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                        session_key: session.data.result.session_key
                      },
                      success: data => {
                        //4.解密成功后 获取COOKIE
                        //  console.info(data.header)
                        let str = data.header['Set-Cookie'];
                        if (str) {
                          var cookie = data.header['Set-Cookie'].split(";");
                          for (let tt of cookie) {
                            if (tt.indexOf('UNF') != -1) {
                              _this.globalData.UNF = tt.substring(tt.indexOf('UNF=')+4);
                              _this.globalData.isBinding = true;
                            }
                          }
                        }else{
                          _this.globalData.isBinding = false;
                          // wx.reLaunch({
                          //   url: '../bindingphone/bindingphone',
                          // })
                        }
                        if (data.data.retcode == 0) {
                          //console.info(data.data)
                          var custwxinfo = data.data.result;
                          if (custwxinfo) {
                            if (custwxinfo.custuserid){
                              _this.globalData.custuserid = custwxinfo.custuserid;
                              _this.globalData.isBinding = true;
                            }else{
                              _this.globalData.isBinding = false;
                              // wx.reLaunch({
                              //   url: '../bindingphone/bindingphone',
                              // })
                            }
                            if (custwxinfo.custmobile)
                              _this.globalData.custmobile = custwxinfo.custmobile;
                          }
                        } else {
                          console.log('解密失败');
                          _this.globalData.isBinding = false;
                        }

                      },
                      fail: function () {
                        console.log('系统错误');
                       // _this.relogin();
                        _this.globalData.isBinding = false;
                      }
                    })
                  }else{
                    _this.globalData.isBinding = false;
                    // wx.reLaunch({
                    //   url: '../bindingphone/bindingphone',
                    // })
                  }
                },
                fail(){
                  console.log('获取sessionkey失败');
                  _this.relogin();
                }
              })
              //-----------------
             
            },
            fail: function () {
              console.log('获取用户信息失败')
              that.relogin();
            }
          })
        }
        else {
          console.info("用户登陆失败")
          this.relogin();
        }
      }
    })
  },
  relogin:function(){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '若不授权登录，无法使用此小程序购物功能哦',
      confirmText: '授权',
      cancelText: '不登录',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function (res) {
              that.onLogin();
              // if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {

              // }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          that.onLogin();
        }
      }
    });
  },
  onLaunch: function () {
    this.onLogin();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
   
    // 获取用户信息
    wx.getSetting({
      success: res => {
        //console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            // 授权失败
            fail:function(){
             

            }
          })
        }
      }
    })
  },
  // onshow:function(){
  //   this.onLogin();
  // },
  globalData: {
    UNF:'',
    //storeid: 25001767,
   storeid: 25000016,
    userInfo: null,
    storefaceurl_300: 'http://c.diancall.com/dir/storeface_300/',
    storefaceurl_900: 'http://c.diancall.com/dir/storeface_900/',
    goodsfaceurl_300: 'http://c.diancall.com/pipes/img/goods_300/',
    goodsfaceurl_900: 'http://c.diancall.com/pipes/img/goods_900/',
    storeimgsurl_720: 'http://c.diancall.com/dir/storeimg_720/',
  //urlHost:'https://c.diancall.com',
  urlHost:'http://192.168.1.128:6001'
  },
  Touches: new Touches()
})