var util = require('../../utils/util.js');
var app = getApp();
Page({
    data:{
        frontImg:'',
        dissname:'',
        visitnum:0,
        nickname:'',
        songlist:[],
        listBgColor:'',
        songImg: '',
        songurl: '',
        playsong: null,
        isPlaying: false,
    },
    onLoad: function(options){
        var that = this,
            musiclistId = options.musiclistId;
        wx.showLoading({title: '数据加载中...', mask: true});
        util.getMusicListInfo(musiclistId,function(data){
            wx.hideLoading();
            console.log(data.logo);
            that.setData({
                frontImg:data.logo,
                dissname:data.dissname,
                visitnum:data.visitnum,
                nickname:data.nickname,
                songlist:data.songlist,
                listBgColor: that.dealColor(data.logo)
            });
           
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
          } else {
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
    dealColor: function (pic_url) {
        var that = this;
        util.calculateBgColor(pic_url, function (data) {
                var magic_color = data.magic_color;
                var r = (magic_color & 0x00ff0000) >> 16,
                    g = (magic_color & 0x0000ff00) >> 8,
                    b = (magic_color & 0x000000ff);
                that.setData({
                    listBgColor: 'rgb(' + r + ',' + g + ',' + b + ')'
                })
                return 'rgb(' + r + ',' + g + ',' + b + ')';
            });
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