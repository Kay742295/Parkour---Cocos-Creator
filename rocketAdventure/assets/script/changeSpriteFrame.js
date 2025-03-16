
cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames: [cc.SpriteFrame],
    },

    //切换spriteFrame
    changeSpriteFrame: function(index) {
        var sprite = this.getComponent(cc.Sprite);  // 获取当前节点的 Sprite 组件
        if (sprite && index >= 0 && index < this.spriteFrames.length) {
            sprite.spriteFrame = this.spriteFrames[index];  // 设置新的 SpriteFrame
        }else if(!sprite){
            cc.log("no sprite")
        }else if(index < 0 || index >= this.spriteFrames.length){
            cc.log("index out of range")
        }
    },

    onLoad () {},

    start () {

    },

    // update (dt) {},
});
