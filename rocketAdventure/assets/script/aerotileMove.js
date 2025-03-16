

cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeed: 300, //x速度大小待调整
    },

    moveAerotile: function (dt) {
        let atRigidBody = this.node.getComponent(cc.RigidBody);
        atRigidBody.linearVelocity = cc.v2(this.moveSpeed, 0);
    },

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    },

    start () {
    },

    onBeginContact (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'wall') {
            this.moveSpeed = -this.moveSpeed;
        }
    },

    update(dt) {
        var canvasNode = cc.find("Canvas");
        var mainScript = this.getMainScript(canvasNode);
        if (mainScript && !mainScript.isReady) {
            return;
        }
        this.moveAerotile();
    },
    
    getMainScript(node) {
        var script = node.getComponent("main") || node.getComponent("main0");
        return script;
    },
    
});
