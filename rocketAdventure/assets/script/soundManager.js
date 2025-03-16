
cc.Class({
    extends: cc.Component,

    properties: {
        backgroundMusic: {
            default: null,
            type: cc.AudioClip
        },
        countdownSound: {
            default: null,
            type: cc.AudioClip
        },
        gameOverSound: {
            default: null,
            type: cc.AudioClip
        },
        swipeLeftSound: {
            default: null,
            type: cc.AudioClip
        },
        swipeRightSound: {
            default: null,
            type: cc.AudioClip
        },
        tikDoubleSound: {
            default: null,
            type: cc.AudioClip
        },
        tikShieldSound:{
            default: null,
            type: cc.AudioClip
        },
    },

    // 播放背景音乐
    playBackgroundMusic: function() {
        //cc.audioEngine.playMusic(this.backgroundMusic, true);
        var effectId = cc.audioEngine.playMusic(this.backgroundMusic, true);
        cc.audioEngine.setVolume(effectId, 0.25);
    },

    // 停止背景音乐
    stopBackgroundMusic: function() {
        cc.audioEngine.stopMusic();
    },

    // 播放音效
    playEffect: function(audioClip) {
        cc.audioEngine.stopAllEffects();  // 停止所有正在播放的音效

        var effectId = cc.audioEngine.playEffect(audioClip, false);
        cc.audioEngine.setVolume(effectId, 0.8);
    },

    onLoad () {
        
    },

    start () {

    },

    // update (dt) {},
});
