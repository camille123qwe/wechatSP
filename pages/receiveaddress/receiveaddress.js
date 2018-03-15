var model = require('../../model/model.js');
var common = require('../../utils/util.js');
var show = false;
var item = {};

Page({
  data: {
    item: {
      show: show,
      addr:{},
      province: "北京市",
      city: "市辖区",
      county: "东城区"
    }
  },
  //获取公共数据
  appInstance() {
    let Appdata = getApp();
    this.setData({ globalData: Appdata.globalData });
    new Appdata.ToastPannel();
  },
  onLoad:function(options){
    this.appInstance();
    if(options.id){
      let that = this;
      wx.request({
        url: common.findAddr+options.id,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': 'UNF=' + this.data.globalData.UNF,
        },
        success:function(res){
          that.setData({
            receivername:res.data.receivername,
            mobile: res.data.mobile,
            address: res.data.address,
            custshippingaddressid: res.data.custshippingaddressid,
          });
        }
      })

    }
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
    this.setData({
      province: '北京市',
      city: '市辖区',
      county: '东城区'
    });
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  formSubmit:function(e){
    let that = this;
    let receivername = e.detail.value.receivername;
    let mobile = e.detail.value.mobile;
    let address = e.detail.value.address;
    let rqdata = "";
    if (receivername == "" || mobile == "" || address == "") {
      this.show('请完善地址信息');
    } else {
      let province = this.data.province;
      let city = this.data.city;
      let county = this.data.county;
      address = province + city + county + address;
      if (this.data.custshippingaddressid){
        rqdata = {
          bean: { 
            custshippingaddressid: this.data.custshippingaddressid,
            status: 10, 
            receivername: receivername,
            mobile: mobile,
            address: address,
          },
          cols: ["receivername", "mobile","address"]
        }
      }else{
        rqdata = {
          bean: {
            status: 10,
            receivername: receivername,
            mobile: mobile,
            address: address,
            custuserid: this.data.globalData.custuserid
          }
        }
      }
      wx.request({
        url: common.addrUpdate,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'cookie': 'UNF=' + this.data.globalData.UNF,
        },
        data: rqdata,
        success: function (res) {
          if (res.data.retcode == 0) {
            wx.navigateTo({
              url: '../addrlist/addrlist?dizhi=save'
            })
          }
        }
      })
    }
  }
})