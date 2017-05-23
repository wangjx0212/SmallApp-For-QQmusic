//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    navbar:[
      '推荐','排行榜','搜索'
      ],
    songImg:'',
    songurl:'',
    playsong:null,
    isPlaying: true,
    currentTab:0,
    songlist:[],
    toplist:[],
    specialkey:'',
    hotkey:[],
    songlist:[],
    searchinfo:'',//  搜索框内容
    onsearch:false, 
    searchCancelShow:false, // 是否显示取消图标
    searchHotShow:true, // 是否显示热门搜索
    searchCleanShow:false,
    inputFocus:false, // 搜索框是否获得焦点
    searchPageNum:1, // 搜索分页数
    searchResultShow:false
  },
//TODO 事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    wx.showLoading({title: '数据加载中...', mask: true});
//TODO 调用应用实例的方法获取全局数据
    util.getRecommend(function(data){
      wx.hideLoading();
      that.setData({songlist: data.songList});
    });
    util.getToplist(function(data){
        that.setData({
          toplist:data
        });
    });
    util.getHotSearch(function(data){
        that.setData({
          specialkey:data.data.special_key,
          hotkey:data.data.hotkey
        });

    });
    

  },
  onShow:function(){
    var that = this;

    wx.getBackgroundAudioPlayerState({
      success:function(res){
        if(res.status == 1){
          that.setData({
            isPlaying:true
          });   
        }else if(res.status == 0 || res.status == 2){
          that.setData({
            isPlaying: false
          });
        }
      }
    });

    wx.getStorage({
      key: 'songImg',
      success: function (res) {
        that.setData({
          songImg: res.data
        });
      }
    });
    wx.getStorage({
      key: 'playsong',
      success: function (res) {

        that.setData({
          playsong: res.data
        });
      }
    });
    wx.getStorage({
      key: 'songUrl',
      success: function (res) {
        that.setData({
          songUrl: res.data
        });
      }
    });
  },
  onNavbarTap : function(ev){
     this.setData({currentTab: ev.target.dataset.index});
  },
//TODO 跳转到音乐列表页面
  toMusicList: function(ev){
    var id = ev.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../musiclist/musiclist?musiclistId='+id,
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
//TODO 跳到到toplist
  toToplistTap: function (ev) {
    var id = ev.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../toplist/toplist?topListId=' + id
    });
  },
//TODO 搜索结果
  onSearchResult:function(){
    var that = this,
        searchinfo = this.data.searchinfo,
        searchPageNum = this.data.searchPageNum;
    util.getSearchMusic(searchinfo,searchPageNum,function(data){
       that.setData({
         songlist:data.data.song.list,
         searchResultShow: true
       });
    wx.hideLoading();
       
     })
  },
//TODO 搜索框获得焦点
  onSearcFocus:function(){
    this.setData({
      searchCancelShow:true,
      searchHotShow:false
    });
  },
//TODO 取消搜索
  searccancel:function(){
    this.setData({
      searchCancelShow:false,
      searchHotShow:true,
      searchinfo:'',
      searchResultShow:false
    });
  },
//TODO 搜索框清除
  searchclear:function(){
    this.setData({
      searchinfo:'',
      inputFocus:true,
      searchResultShow:false
    })
  },
//TODO 搜索输入框内容
  onSearchInput:function(ev){
    this.setData({
      searchinfo:ev.detail.value
    });
  },
  onSearch: function () {
    wx.showLoading({ title: '数据加载中...', mask: true });
    var info = this.data.searchinfo;

    this.setData({
      searchinfo: info,
      searchHotShow: false,
      searchCancelShow: true,
    });
    this.onSearchResult();
  },
//TODO 进行热门搜索
  onHotSearch:function(ev){
    wx.showLoading({ title: '数据加载中...', mask: true });
    var info=ev.target.dataset.text;
    this.setData({
      searchinfo:info,
      searchHotShow:false,
      searchCancelShow:true,
    });
    this.onSearchResult();
  },

//TODO 跳转播放页面
  toPlayPage:function(ev){
        var id = ev.currentTarget.dataset.id;
        var mid = ev.currentTarget.dataset.mid; 
        var albummid = ev.currentTarget.dataset.albummid
        wx.navigateTo({
            url: '../play/play?id='+id+'&mid='+mid+'&albummid='+albummid,
            success: function(res){
                    // success
            },
            fail: function(res) {
                    // fail
            },
            complete: function(res) {
                    // complete
            }
        })
  },

  songToggle: function () {
    var that = this;
    if (that.data.isPlaying) {
      wx.pauseBackgroundAudio({
        success: function (res) {
          // success
          that.setData({
            isPlaying: false,
          });
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      });

    } else {
      wx.playBackgroundAudio({
        dataUrl: that.data.songUrl,
        title: that.data.playsong.title,
        coverImgUrl: that.songImg,
        success: function (res) {
          that.setData({
            isPlaying: true,
          });
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      });
    }
  },

  toAutoPlayPage : function(){
    wx.navigateTo({
      url: '../play/play?model=auto',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  }
})
