
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    clickBtn: function(sender, str) {
        if(str == "start"){
            this.gameStart();
            this.soundManager.stopBackgroundMusic();
        }
        else if(str == "start0"){
            this.gameStart0();
            this.soundManager.stopBackgroundMusic();
        }
    },

    gameStart: function() {
        cc.director.loadScene("game");
    },
    gameStart0: function() {
        cc.director.loadScene("game0");
    },

    onLoad () {
        this.soundManager = cc.find("Canvas/soundManager").getComponent('soundManager');
        this.soundManager.playBackgroundMusic();
    },

    start () {
        const loadTask = wx.loadSubpackage({
            name: 'font', // 分包的名字
            success: function () {
              console.log('分包加载成功');
              // 这里可以安全地使用分包中的字体或其他资源
            },
            fail: function () {
              console.error('分包加载失败');
            }
          });
          
          loadTask.onProgressUpdate(res => {
            console.log('加载进度', res.progress);
            console.log('已经下载的数据长度', res.totalBytesWritten);
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
          });
          
    },

    // update (dt) {},
});
