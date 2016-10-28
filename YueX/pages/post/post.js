

var src = 'please.jpg';
var app = getApp();
var pageObject = {
  data: {
    src: src,
    disabled: false,
    if_limited: false,
    modalHidden: true,
    toastHidden: true,
    weixinID: "",
    activityName: "",
    activityDescription: "",
    areYouSB:"你还没输入你的微信id呢"
  },
  formSubmit: function( e ) {
    var value = wx.getStorageSync('weixinID');//拿到全局微信id
    if(value == ""){
      console.log("no weixinID");
      this.setData({
        modalHidden: false
      })
      return;
    }
    wx.request({
      url:"172.16.1.30/post/add",
      data:e.detail.value,
      method:"POST",
        header:{
      "Content-Type":"application/json"
     },
     success: function(res) {
         console.log(res);
     }
    })
    console.log( 'form发生了submit事件，携带数据为：', e.detail.value,"img:"+src )
  },
  onLoad: function( options ) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log("onload" )
  },
  chooseImage: function() {
    //var Data = this.setData;
    //上传图片
    var that = this;
    wx.chooseImage( {
      count: 1, // 默认9
      sizeType: [ 'original', 'compressed' ], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [ 'album', 'camera' ], // 可以指定来源是相册还是相机，默认二者都有
      success: function( res )  {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
       // src = tempFilePaths[ 0 ];
        that.setData( {
          src:tempFilePaths[ 0 ]
        });
        wx.uploadFile({
            url: "https://sso.ifanr.com/hackathon/dogfood/?_c=Core&_m=GetDetailById&homepage=true&news_id=18",
            filePath:tempFilePaths[0],
            name:"image",
            success:function(){   
              console.log("OK")
            },
            complete:function(){
              console.log("aaaa");
            }
        })
      }
    });
  } ,
  switchchange: function( e ) {//监听是否限制异性
    console.log( e );
    this.setData( {
        if_limited: e.detail.value
    })
  },
  nameChange: function(e){
    this.setData({
      activityName: e.detail.value
    })
  },
  descriptionChange: function(e){
    this.setData({
      activityDescription: e.detail.value
    })
  },
  weixinIDChange: function(e){
    this.setData({
        weixinID: e.detail.value
      })
  },
  modalChange: function(e){//弹出让用户填id
    if(this.data.weixinID == ""){
      this.setData({
        areYouSB: "你根本没有填任何微信id！"
      })
    }
    else{
      this.setData({//显示modal
        modalHidden: true,
        toastHidden: false
      })
      app.globalData.weixinID = this.data.weixinID;
      wx.setStorage({
        key:"weixinID",
        data:this.data.weixinID
      })
    }
  },
  toastChange: function(){
    this.setData({
      toastHidden: true
    })
  }


}
Page(pageObject);