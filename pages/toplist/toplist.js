var app = getApp();
var util = require('../../utils/util.js');
Page({
    data:{
        songlist:[],
        topinfo:{},
        update_time:'',
        listBgColor:'',
        songImg: '',
        songurl: '',
        playsong: null,
        isPlaying: true,   
    },
    onLoad: function (options) {
        var that = this,
            topListId = options.topListId;
        wx.showLoading({title: '数据加载中...', mask: true});
        util.getToplistInfo(topListId,function(data){
            wx.hideLoading();
            that.setData({
                songlist:data.songlist,
                topinfo:data.topinfo,
                update_time:data.update_time,
                listBgColor: that.dealColor(data.color)
            });
             console.log(that.dealColor(data.color));
        });
    },

    onShow: function () {
      var that = this;
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          if (res.status == 1) {
            that.setData({
              isPlaying: true
            });
          } else if (res.status == 0 || res.status == 2) {
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

            // 计算背景色
    dealColor: function (rgb) {
        if (!rgb) {
        return 'rgb(000,000,000)';
        }
        var r = (rgb & 0x00ff0000) >> 16,
        g = (rgb & 0x0000ff00) >> 8,
        b = (rgb & 0x000000ff);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
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

    toAutoPlayPage: function () {
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