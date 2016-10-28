//index.js
//获取应用实例
var app = getApp();

var pageObject = {
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
    this.shuaiAnimation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    this.shuaiAnimation.translateX(-400);
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onYue:function(e){//点击“约”
    var value = wx.getStorageSync('weixinID');
    console.log(value) //这里拿到全局的变量weixinID
      if(value == ""){//如果没有id的话
        console.log("no weixinID");
        this.setData({
          modalHidden: false
        })
      }
    this.setData({
      isclick: true,
      className:"active"
    });
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
  },  
  ontouchstart: function(e){//监听开始触摸事件
    console.log(e);
    this.setData({
      touchstart: e.touches[0].pageX
    })
  },
  ontouchend: function(e){//监听结束触摸事件
    console.log(e);
    if(this.data.containerLeft < -100){//如果超过了100px，就let it go
      console.log("go to next");
      // while(this.data.containerLeft > -400){//一只让它滑到400px
      //   new_left = this.data.containerLeft -3;
      //   this.setData({
      //     containerLeft: new_left
      //   })
      // }
      this.setData({//然后修改activity数据，并将container复原
        currentActivity : this.data.lastActivity,
        containerLeft: 0,
        className: ""
      })
    }
    else if (this.data.containerLeft > 100){//这是往右滑的情况
      console.log("go to right");
      // while(this.data.containerLeft < 400){
      //   new_left = this.data.containerLeft +3;
      //   this.setData({
      //     containerLeft: new_left
      //   })
      // }
      this.setData({
        currentActivity : this.data.nextActivity,
        containerLeft: 0,
        className: ""
      })
      
    }
    else{//如果并没有超过那么多，就让它回到原来的位置
      this.setData({
        containerLeft: 0
      })
    }
  },

  onshuai: function(e){//监听触摸事件，拖动整个container
    this.setData({
      containerLeft: (e.touches[0].pageX-this.data.touchstart)
    })
  },
  


  data: {
    isclick: false,//判断是否点击
    isactive: "notactive",//用来改变样式
    touchCache: [],//用来保存滑动事件的pageX
    containerLeft: 0,//用来改变整个container的left值
    weixinID: "",//初始化微信id，检测是否有输入微信id
    areYouSB: "你还没输入你的微信id呢",//用来控制你是不是SB没有输入微信号
    modalHidden: true,//用来控制modal的显示
    toastHidden: true,//用来控制toast的显示
    actionSheetHidden: true,//用来控制底部菜单显示
    actionSheetItems: ['发布活动','谁约了我', '收藏活动', '收藏列表'],//底部菜单条目
    lastActivity:{//这是假装的上一个活动
      name:"一起去看电影",
      description:"一起去看复仇者联盟吧，人数2～3人",
      imgUrls: [
        'http://3.im.guokr.com/gkimage/ju/ce/vo/jucevo.png'
      ]
    },
    currentActivity: {
      name: "黑客马拉松－未来小程序第一届",
      description: "这个活动超刁的",
      imgUrls: [
        './imgs/hackthon.jpeg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      ]
    },
    nextActivity: {
      name: "想约一个人去逛一逛广州大剧院",
      description: "主要是为了散心，最好是异性",
      imgUrls: [
        'http://www.williamlong.info/google/upload/894_2.jpg'
      ]
    }
  },
  actionSheetTap: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindItemTap:function(e){
    console.log('tap ' + e.currentTarget.dataset.name)
    var tapName = e.currentTarget.dataset.name;
    if (tapName == "发布活动"){//发布活动，转到post页面
        wx.navigateTo({
          url:"../post/post"
        })
    }
    else if (tapName == "谁约了我"){//谁约了我，转到yuelist页面
      wx.navigateTo({
        url:"../yuelist/yuelist"
      })
    }
    else if (tapName == "收藏活动"){//收藏活动，显示toast，保存到localStorage
      this.setData({
        toastHidden: false
      })
      var collectionList = wx.getStorageSync("collectionList");
      collectionList.push(this.data.currentActivity);//给collectionList新加入当前的活动
      wx.setStorage({
        key:"collectionList",
        data:collectionList//保存新值
      })
    }
    else if (tapName == "收藏列表"){
      wx.navigateTo({
        url:"../collectionList/collectionList"
      })
        
    }
    
  }
}

var pageObject2 = {
  data: {
    isclick: false,//判断是否点击
    isactive: "notactive",//用来改变样式
    touchCache: [],//用来保存滑动事件的pageX
    containerLeft: 0,//用来改变整个container的left值
    weixinID: "",//初始化微信id，检测是否有输入微信id
    areYouSB: "你还没输入你的微信id呢",//用来控制你是不是SB没有输入微信号
    modalHidden: true,//用来控制modal的显示
    toastHidden: true,//用来控制toast的显示
    actionSheetHidden: true,//用来控制底部菜单显示
    actionSheetItems: ['发布活动','谁约了我', '收藏活动', '分享活动'],//底部菜单条目
    lastActivity:{//这是假装的上一个活动
      name:"一起去看电影",
      description:"一起去看复仇者联盟吧，人数2～3人",
      imgUrls: [
        'http://3.im.guokr.com/gkimage/ju/ce/vo/jucevo.png'
      ]
    },
    currentActivity: {
      name: "黑客马拉松－未来小程序第一届",
      description: "这个活动超刁的",
      imgUrls: [
        './imgs/hackthon.jpeg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      ]
    },
    nextActivity: {
      name: "想约一个人去逛一逛广州大剧院",
      description: "主要是为了散心，最好是异性",
      imgUrls: [
        'http://www.williamlong.info/google/upload/894_2.jpg'
      ]
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
    console.log("ready");
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
};

Page(pageObject)//传入这个页面object


