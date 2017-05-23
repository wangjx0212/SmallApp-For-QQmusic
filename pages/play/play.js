var util = require('../../utils/util.js');
var app = getApp();
Page({
    data:{
        playsong:null,
        songUrl:'',
        songImg:'',
        isPlaying:true,
        lyric:null,
        lyricSwiperH:400,
        scrollTop:0,
        timelines:[],
        currentPosition:0,
        countnum:0,
        songState:{
            progress:0,
            duration:'00:00',
            currentPosition:'00:00'
        },
  
        
    },
    onLoad:function(options){
      var that = this,
          id,
          mid,
          albummid;
      if (options.model == 'auto'){
        wx.showLoading({ title: '数据加载中...', mask: true });
        wx.getStorage({
          key: 'playsong',
          success: function (res) {
           
            that.setData({
              playsong: res.data
            });
            id = res.data.id;
            mid = res.data.mid;
            albummid = res.data.album.mid;

            wx.getBackgroundAudioPlayerState({
              success:function(res){
                  if(res.status == 1){
                    that.lyricMove(res.currentPosition , res.duration);
                  };
                    
              }
            });
            wx.hideLoading(); 

            that.getLyric(id);
            that.changeOption(id, mid, albummid);
            that.startPlay();     
          }
        });

      } else{
          id = options.id,
          mid = options.mid,
          albummid = options.albummid;
          wx.showLoading({ title: '数据加载中...', mask: true });
          util.getSongInfo(id, mid, function (data) {
            wx.hideLoading();
            that.setData({
              playsong: data[0]
            });
            wx.setStorage({
              key: 'playsong',
              data: data[0]
            });
          });



          that.getLyric(id);
          that.changeOption(id, mid, albummid);
          that.startPlay();
      }  

      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            lyricSwiperH: res.screenHeight - 180
          })
        }
      })

    },
    onReady:function(){
        var that = this;

        wx.playBackgroundAudio({
          dataUrl: that.data.songUrl,
          title: that.data.songTitle, 
          coverImgUrl: that.data.songImg,
          success: function(res){
            // success

          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        });
        
    },
    getLyric:function(id){
        var that = this,
            timelines = [];
        util.getLyric(id,function(data){
            var lyric=that.reconvert(data.lyric).slice(4);
                lyric=that.parseLyric(lyric);
            that.setData({
                lyric:lyric
            });
            for(var index in lyric ){
                if(lyric[index]){
                    timelines.push(index); 
                }
            }
            that.setData({
                timelines:timelines  
            });

        });
    },
    startPlay:function(){
        this.songPlay();

    },

    songPlay:function(){
        var that = this;
        clearInterval(timer);
        var timer=setInterval(function(){
                wx.getBackgroundAudioPlayerState({
                success: function(res){
                    // success
                    if(res.status == 1){
                        that.setData({
                            isPlaying:true
                        });
                         that.lyricMove(res.currentPosition,res.duration)
                    }else{
                        that.setData({
                            isPlaying:false
                        });
                        if(res.status == 2){
                        }
                    }
                    that.setData({
                        songState:{
                            duration:that.timeToString(res.duration),
                            currentPosition:that.timeToString(res.currentPosition),
                            progress:res.currentPosition/res.duration*100
                            },
                    })
                   
                },
                fail: function(res) {
                    // fail
                },
                complete: function(res) {
                    // complete
                }
                })
        },1000)
     
    },
    songToggle : function(){
        var that = this;
        if(that.data.isPlaying){
            wx.pauseBackgroundAudio({
              success: function(res){
                // success
                that.setData({
                    isPlaying:false,
                });
              },
              fail: function(res) {
                // fail
              },
              complete: function(res) {
                // complete
              }
            });

        }else{
            wx.playBackgroundAudio({
                title: that.data.songTitle, 
                coverImgUrl: that.data.songImg,
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
            this.songPlay();
        }
    },
    changeOption:function( id, mid, albummid ){
        var that = this;
        that.setData({
            songUrl: 'http://ws.stream.qqmusic.qq.com/C100' + mid + '.m4a?fromtag=38',
            songImg: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + albummid + '.jpg'
        });
        wx.setStorage({
          key:'songUrl',
          data: 'http://ws.stream.qqmusic.qq.com/C100' + mid + '.m4a?fromtag=38',
        });
        wx.setStorage({
          key: 'songImg',
          data: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' + albummid + '.jpg'
        });
    },
    timeToString:function(duration){
        var str = '';
        var minute = parseInt(duration/60) > 10 ?  (parseInt(duration/60)) : ('0'+parseInt(duration/60));
        var Second = duration%60 >10 ? (duration%60) : ('0'+duration%60);
        return str=minute+':'+Second;
    },
      // 解码>>中文
    reconvert: function (str) {
        str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
        });
        str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
        });
        str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
        });
        return str;
    },
    // 歌词解析
    parseLyric:function(lrc){
        var lyrics = lrc.split("\n");
        var lrcObj = {};
        for(var i=0;i<lyrics.length;i++){
            var lyric = decodeURIComponent(lyrics[i]);
            var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
            var timeRegExpArr = lyric.match(timeReg);
            if(!timeRegExpArr)continue;
            var clause = lyric.replace(timeReg,'');
            for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
                var t = timeRegExpArr[k];
                var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                var time = min * 60 + sec;
                lrcObj[time] = clause;
            }
        }
        return lrcObj;
    },

    // 歌词滚动

    lyricMove:function(currentPosition,duration){
        var that = this,
            timelines = that.data.timelines,
            moveTime,
            scrollTop = that.data.scrollTop;    
        for(var i=0,len=timelines.length;i<len;i++){
            if(parseInt(timelines[i]) > parseInt(currentPosition) ){
                moveTime = timelines[i - 1];
                break;
            }
        };

        that.setData({
            currentPosition:moveTime
        });

        for(var i=0,len=timelines.length;i<len;i++){
            if(parseInt(timelines[i]) == parseInt(currentPosition)){
                    that.setData({
                        scrollTop:i*44
                    });
            }
        };
        if(currentPosition == duration){
            that.setData({
                scrollTop:0,
                countnum:0
            });
        }
    },
     
})