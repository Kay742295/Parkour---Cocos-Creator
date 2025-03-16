
cc.Class({
    extends: cc.Component,

    properties: {
        isReady : false,
        isPlay : false,
        bgspeed : 15, //初始速度待调整
        bg1Node : cc.Node,
        bg2Node : cc.Node,
        clickLayer : cc.Node,
        rocketNode : cc.Node,
        obstacleNode : cc.Node,
        scoreLineNode : cc.Node,
        shieldNode : cc.Node,
        doubleNode : cc.Node,
        gameOverNode: cc.Node,
        gameReadyNode: cc.Node,

        aerotilePrefab : cc.Prefab,
        planetPrefab : cc.Prefab,
        scoreLinePrefab : cc.Prefab,
        shieldPrefab : cc.Prefab,
        doublePrefab : cc.Prefab,


        isShielded : false,
        isDoubled : false,

        labelScoreOver: cc.Label,


        animationComponent : cc.Animation,

        //soundManager: null,
    },

    // 这个方法用来移动主角
    moveRocket: function(velocity, targetX) {

        // 确保主角每帧按照指定速度移动，直到到达目标x坐标
        let moveInterval = setInterval(() => {
           if ((velocity < 0 && this.rocketNode.x > targetX) || (velocity > 0 && this.rocketNode.x < targetX)) {
                this.rocketNode.x += velocity;
           } else {
                this.rocketNode.x = targetX; // 确保主角不会超过目标位置
                clearInterval(moveInterval); // 停止移动
            }
        }, 16.67); // 约每秒60帧
    },

    //滑动屏幕时：
    bindSwipeEvent: function() {
        let startX = 0;  
        let endX = 0;    

        this.clickLayer.on('touchstart', (event) => {
            if (!this.isPlay || !this.isReady) {
                return;
            }
            startX = event.getLocationX();
        }, this);
        this.clickLayer.on('touchend', (event) => {
            if (!this.isPlay || !this.isReady) {
                return;
            }
            endX = event.getLocationX();
            let deltaX = endX - startX;

            if (deltaX < 0 && Math.abs(deltaX) > 30) { // 30待定
                if(this.rocketNode.x >= -120 && this.rocketNode.x <= 120){
                    this.moveRocket(-60,-240);
                }else if(this.rocketNode.x > 120 && this.rocketNode.x <= 240){
                    this.moveRocket(-60,0);
                }
                this.soundManager.playEffect(this.soundManager.swipeLeftSound);
            }else if (deltaX >  0 && Math.abs(deltaX) > 30) { // 30待定
                if(this.rocketNode.x >= -120 && this.rocketNode.x <= 120){
                    this.moveRocket(60,240);
                }else if(this.rocketNode.x >= -240 && this.rocketNode.x < -120){
                    this.moveRocket(60,0);
                }
                this.soundManager.playEffect(this.soundManager.swipeRightSound);
            }
        }, this);
    },
    
    //移动速度函数
    moveSpeed: function() {
        if(this.bgspeed < 15){ // 速度待调整
            this.bgspeed += 0.02;//加速度待调整
        }else if(this.bgspeed >= 15 && this.bgspeed < 20){
            this.bgspeed += 0.01;
        }else if(this.bgspeed >= 20 && this.bgspeed < 22){
            this.bgspeed += 0.002;
        }else if(this.bgspeed >= 22 && this.bgspeed < 26){
            this.bgspeed += 0.0005;
        }else{
            return;
        }
    },

    //背景移动
    // moveBg1: function() {
    //     let bgList = this.bg1Node.children;
    //     for (let i = 0; i < bgList.length; i++) {
    //         bgList[i].y -= this.bgspeed; 
    //         if (bgList[i].y <= -1280) {
    //             if(this.rocketScript.scoreNum < 88){ //10待调整
    //                 bgList[i].y = 1280;
    //             }else{
    //                 bgList[i].destroy();
    //             }
    //         }
    //     }
    // },

    moveBg2: function() {
        let bgList = this.bg2Node.children;
        for (let i = 0; i < bgList.length; i++) {
            bgList[i].y -= this.bgspeed; 
            if (bgList[i].y <= -1280) {               
                bgList[i].y = 1280;                
            }
        }
    },
    
    // moveBg2: function() {  
    //     if(this.rocketScript.scoreNum >= 88){  //10待调整
    //         let bgList = this.bg2Node.children;
    //         for (let i = 0; i < bgList.length; i++) {
    //             bgList[i].y -= this.bgspeed; 
    //             if (bgList[i].y <= -1280) {
    //                 bgList[i].y = 1280;
    //             }
    //         }
    //     }
    // },

    //scoreLine移动
    moveScoreLine: function() {
        let scoreLineList = this.scoreLineNode.children;
        for (let i = 0; i < scoreLineList.length; i++) {
            scoreLineList[i].y -= this.bgspeed;
            if (scoreLineList[i].y <= -750) {
                scoreLineList[i].destroy();
                this.scoreLineCreate(0, 1070);
            }
        }
    },

    //星球&陨石移动
    moveObstacle: function() {
        let obstacleList = this.obstacleNode.children;
        for (let i = 0; i < obstacleList.length; i++) {
            obstacleList[i].y -= this.bgspeed;
            if (obstacleList[i].y <= -750) {
                obstacleList[i].destroy();
                var randomNum = this.getRandomInt(1, 18);
                if (randomNum == 1 ) {
                    this.aerotileCreate(-240, 1070, -300); //左陨石
                }else if (randomNum == 2) {
                    this.aerotileCreate(-240, 1070, 300);
                }else if (randomNum == 3) {
                    this.aerotileCreate(0, 1070, -300); //中陨石
                }else if (randomNum == 4) {
                    this.aerotileCreate(0, 1070, 300);
                }else if (randomNum == 5) {
                    this.aerotileCreate(240, 1070, -300);//右陨石
                }else if (randomNum == 6) {
                    this.aerotileCreate(240, 1070, 300);
                }else if (randomNum >= 7 && randomNum <= 10) {
                    this.planetCreate(-240, 1070); //左星球
                }else if (randomNum >= 11 && randomNum <= 14) {
                    this.planetCreate(0, 1070); //中星球
                }else if (randomNum >= 15 && randomNum <= 18) {
                    this.planetCreate(240, 1070); //右星球
                }             
            }
        }
    },

    //盾牌移动
    moveShield: function() {
        let shieldList = this.shieldNode.children; 
        for (let i = 0; i < shieldList.length; i++) {
            shieldList[i].y -= this.bgspeed;
            if (shieldList[i].y <= -750) {
                shieldList[i].destroy();
                var randomNum = this.getRandomInt(1, 6);//50%概率生成盾牌
                if (randomNum == 1) {
                    this.shieldCreate(-240, 1070, true); //左盾牌
                }else if (randomNum == 2) {
                    this.shieldCreate(0, 1070, true); //中盾牌
                }else if (randomNum == 3) {
                    this.shieldCreate(240, 1070, true); //右盾牌
                }else if (randomNum >= 4 && randomNum <= 6) {
                    this.shieldCreate(0, 1070, false);
                }           
            }
        }
    },

    //double移动
    moveDouble: function() {
        let doubleList = this.doubleNode.children; 
        for (let i = 0; i < doubleList.length; i++) {
            doubleList[i].y -= this.bgspeed;
            if (doubleList[i].y <= -750) {
                doubleList[i].destroy();
                var randomNum = this.getRandomInt(1, 6);//50%概率生成盾牌
                if (randomNum == 1) {
                    this.doubleCreate(-240, 1070, true); //左盾牌
                }else if (randomNum == 2) {
                    this.doubleCreate(0, 1070, true); //中盾牌
                }else if (randomNum == 3) {
                    this.doubleCreate(240, 1070, true); //右盾牌
                }else if (randomNum >= 4 && randomNum <= 6) {
                    this.doubleCreate(0, 1070, false);
                }           
            }
        }
    },

    //盾牌生成
    shieldCreate: function(x, y, isActive) {
        let shield = cc.instantiate(this.shieldPrefab);
        shield.setPosition(x, y);
        this.shieldNode.addChild(shield);
        shield.active = isActive;
    },

    //double生成
    doubleCreate: function(x, y, isActive) {
        let double = cc.instantiate(this.doublePrefab);
        double.setPosition(x, y);
        this.doubleNode.addChild(double);
        double.active = isActive;
    },

    //scoreLine生成
    scoreLineCreate: function(x, y) {
        let scoreLine = cc.instantiate(this.scoreLinePrefab);
        scoreLine.setPosition(x, y);
        this.scoreLineNode.addChild(scoreLine);
    },

    //陨石生成
    aerotileCreate: function(x, y ,velocity) {
        let aerotile = cc.instantiate(this.aerotilePrefab);
        aerotile.setPosition(x, y);
        this.obstacleNode.addChild(aerotile);

        let atRigidBody = aerotile.getComponent(cc.RigidBody);
        atRigidBody.linearVelocity = cc.v2(velocity, 0);
    },

    //星球生成
    planetCreate: function(x, y) {
        let planet = cc.instantiate(this.planetPrefab);
        planet.setPosition(x, y);
        var randomNum = this.getRandomInt(0, 3);

        var planetScript = planet.getComponent("changeSpriteFrame"); 
        if (randomNum == 0 ) {
            planetScript.changeSpriteFrame(0);
        }else if (randomNum == 1) {
            planetScript.changeSpriteFrame(1);
        }else if (randomNum == 2) {
            planetScript.changeSpriteFrame(2);
        }else if (randomNum == 3) {
            planetScript.changeSpriteFrame(3);
        }

        this.obstacleNode.addChild(planet);
    },

    getRandomInt: function(min, max) {
        min = Math.ceil(min); // 向上取整
        max = Math.floor(max); // 向下取整
        return Math.floor(Math.random() * (max - min + 1)) + min; // 返回随机整数
    },

    //盾牌消失
    shieldVanish: function() {
        this.shieldNode.children.forEach(function(child) {
            child.active = false;
        });  
    },

    //盾牌开始事件
    shieldStart: function(){
        this.changeClip('rocketPro');
        //this.scheduleOnce(this.shieldOver, 5); //5s后结束盾牌效果
        this.isShielded = true;
    },


    //盾牌结束事件
    shieldOver : function(){
        this.changeClip('rocketClip');
        this.isShielded = false;
    },
    
    //double消失
    doubleVanish: function() {
        this.doubleNode.children.forEach(function(child) {
            child.active = false;
        });  
    },

    //double开始事件
    doubleStart: function(){
        
        this.rocketScript.labelScore.node.color = new cc.Color(255, 0, 100);
        this.changeClip('rocketDouble');
        this.scheduleOnce(this.doubleOver, 5); //5s后结束double效果
        this.isDoubled = true;
    },

    //double结束事件
    doubleOver: function(){
        
        this.rocketScript.labelScore.node.color = new cc.Color(255, 255, 255);
        this.changeClip('rocketClip');
        this.isDoubled = false;
    },

    //火箭切换clip
    changeClip: function(clipName) {
        this.animationComponent.stop();
        this.animationComponent.defaultClip = this.animationComponent.getClips().find(clip => clip.name === clipName);
        this.animationComponent.play(clipName);
    },



    clickBtn: function(sender, str) {
        if(str == "replay"){
            this.gameReplay();
        }else if(str == "home"){
            this.goHome();
        }
    },

    gameReplay: function() {
        this.isPlay = true; //以下众多设置同初始化
        this.bgspeed = 15;
        this.isShielded = false;
        this.isDoubled = false;
        this.gameOverNode.active = false;

        var rocketScript = this.rocketNode.getComponent('rocketCollision');
        rocketScript.shieldNum = 0; 
        rocketScript.doubleNum = 0;
        rocketScript.scoreNum = 0;

        cc.director.loadScene("game"); 
        cc.director.resume();
    },

    goHome: function() {
        this.isPlay = true; //以下众多设置同初始化
        this.bgspeed = 15;
        this.isShielded = false;
        this.isDoubled = false;
        this.gameOverNode.active = false;

        var rocketScript = this.rocketNode.getComponent('rocketCollision');
        rocketScript.shieldNum = 0; 
        rocketScript.doubleNum = 0;
        rocketScript.scoreNum = 0;
        cc.director.resume();
        cc.director.loadScene("startMenu");
    },

    countDown: function() {
        let readyList = this.gameReadyNode.children; 
        this.soundManager.playEffect(this.soundManager.countdownSound);
        this.scheduleOnce(() => {
            readyList[0].active = false;
            readyList[1].active = true;

        }, 1);
        this.scheduleOnce(() => {
            readyList[1].active = false;
            readyList[2].active = true;
        }, 2);
        this.scheduleOnce(() => {
            readyList[2].active = false;
            this.isReady = true;
            this.soundManager.playBackgroundMusic();
        }, 3);
    }, 

    gameOver: function() {
        cc.director.pause();
        this.soundManager.stopBackgroundMusic();
        this.soundManager.playEffect(this.soundManager.gameOverSound);
        this.gameOverNode.active = true;
        this.labelScoreOver.string = '您作为大神得到了' + this.rocketScript.scoreNum + '分'
    },

    onLoad () {
        this.soundManager = cc.find("Canvas/soundManager").getComponent('soundManager');
        this.rocketScript = cc.find("Canvas/gamePlay/rocket").getComponent('rocketCollision');
        
    },

    start () {
        this.bindSwipeEvent();
        this.gameOverNode.active = false;
        this.countDown();
        
        
          
    },

    update (dt) {
        if (this.isPlay && this.isReady) {
            this.moveSpeed();
            // this.moveBg1();
            this.moveBg2();
            this.moveObstacle();
            this.moveScoreLine();
            this.moveShield();
            this.moveDouble();
        }else if(!this.isPlay){
            this.gameOver();
        }
    },

});
