

cc.Class({
    extends: cc.Component,

    properties: {
       labelScore: cc.Label,
       scoreNum: 0,

       shieldIconNode: cc.Node,
       shieldNum: 0,

       doubleIconNode: cc.Node,
       doubleNum: 0,
    },

    getMainScript(node) {
        var script = node.getComponent("main") || node.getComponent("main0");
        return script;
    },

    stopGame: function() {
        var canvasNode = cc.find("Canvas");
        var mainScript = this.getMainScript(canvasNode);
        mainScript.isPlay = false;
        cc.log(mainScript.bgspeed)
    },

    shieldIconReset: function(){
        let shieldIconList = this.shieldIconNode.children;
        shieldIconList[0].active = false;
        shieldIconList[1].active = false;
        shieldIconList[2].active = false;
    },

    doubleIconReset: function(){
        let doubleIconList = this.doubleIconNode.children;
        doubleIconList[0].active = false;
        doubleIconList[1].active = false;
        doubleIconList[2].active = false;
    },

    shieldCollision: function(){ //调用main函数中的shieldVanish函数
        var canvasNode = cc.find("Canvas");
        var mainScript = this.getMainScript(canvasNode);

        let shieldIconList = this.shieldIconNode.children; 

        if(this.doubleNum == 0){
            this.shieldNum += 1;
        }else if(this.doubleNum != 0){
            this.doubleNum = 0;
            this.doubleIconReset();
            this.shieldNum += 1;
        }                
        cc.log('shieldNum: ' + this.shieldNum)
        mainScript.shieldVanish();
        this.soundManager.playEffect(this.soundManager.tikShieldSound);
        if(this.shieldNum == 1){
            shieldIconList[0].active = true;
        }else if(this.shieldNum == 2){
            shieldIconList[1].active = true;
        }else if(this.shieldNum >=3){
            shieldIconList[2].active = true;
            this.shieldNum = 0;
            this.scheduleOnce(this.shieldIconReset, 1); //1s后归零盾牌图标
            mainScript.shieldStart();
        }
    },

    doubleCollision: function(){ 
        var canvasNode = cc.find("Canvas");
        var mainScript = this.getMainScript(canvasNode);

        let doubleIconList = this.doubleIconNode.children; 

        if(this.shieldNum == 0){
            this.doubleNum += 1;   
        }else if(this.shieldNum !=0){
            this.shieldNum = 0;
            this.shieldIconReset();
            this.doubleNum += 1;
        }
        cc.log("doubleNum: " + this.doubleNum);
        mainScript.doubleVanish();
        this.soundManager.playEffect(this.soundManager.tikDoubleSound)
        if(this.doubleNum == 1){
            doubleIconList[0].active = true;
        }else if(this.doubleNum == 2){
            doubleIconList[1].active = true;
        }else if(this.doubleNum >=3){
            doubleIconList[2].active = true;
            this.doubleNum = 0;
            this.scheduleOnce(this.doubleIconReset, 1); //1s后归零盾牌图标
            mainScript.doubleStart();
        }
    },

    onBeginContact(contact, selfCollider, otherCollider) {
        var canvasNode = cc.find("Canvas");
        var mainScript = this.getMainScript(canvasNode);

        otherCollider.node.scoreAdded = otherCollider.node.scoreAdded || false;
        if(otherCollider.node.group === "default" && !otherCollider.node.scoreAdded){
            //盾牌的作用
            if(mainScript.isShielded == false){ 
                this.stopGame();
            }else if (mainScript.isShielded == true){
                mainScript.shieldOver();
                cc.log("shield over");
            }
            otherCollider.node.scoreAdded = true;
        }else if(otherCollider.node.group === "shield" && !otherCollider.node.scoreAdded){
            otherCollider.node.scoreAdded = true; 
            this.shieldCollision();
        }else if(otherCollider.node.group === "double" && !otherCollider.node.scoreAdded){
            otherCollider.node.scoreAdded = true; 
            this.doubleCollision();
        }
    },

    onEndContact(contact, selfCollider, otherCollider) {
        var canvasNode = cc.find("Canvas");
        var mainScript = this.getMainScript(canvasNode);
        // 确保 otherCollider 拥有 scoreAdded 属性
        otherCollider.node.scoreAdded = otherCollider.node.scoreAdded || false;
    
        if (otherCollider.node.group === "scoreLine" && !otherCollider.node.scoreAdded) {
            if(mainScript.isDoubled == false){
                this.setScore(1);
            }else if(mainScript.isDoubled == true){
                this.setScore(2);
                
            }
            otherCollider.node.scoreAdded = true; // 设置标记表示已增加分数
        }
    },


    setScore: function(score) {
        this.labelScore.string = this.scoreNum + score;
        this.scoreNum += score;
    },
    
    onLoad () {
        cc.director.getPhysicsManager().enabled = true;

        this.soundManager = cc.find("Canvas/soundManager").getComponent('soundManager');
    },

    start () {

    },

    update (dt){},
    
});
