import * as CF from 'colfio';
import {Messages, States, Tags, Attributes, releaseSpeed, releaseDegree, velocityBound, defaultSpeedSlower} from './constants.ts';



export class Bottle extends CF.Component{
    

    water: CF.Container;
    degree: number;
    boosterLastUpdate: number;

    get velocity() {
	    return this.owner.getAttribute<CF.Vector>(Attributes.VELOCITY);
	}

	set velocity(velocity: CF.Vector) {
	    this.owner.assignAttribute(Attributes.VELOCITY, velocity);
	}

    get boosters() {
	    return this.owner.getAttribute<number>(Attributes.BOOSTERS);
	}

	set boosters(boosters: number) {
	    this.owner.assignAttribute(Attributes.BOOSTERS, boosters);
	}

    onInit(){
        this.subscribe(Messages.BOTTLE_RELEASE, Messages.BOTTLE_IDLE, Messages.GAMEOVER);
        this.velocity = new CF.Vector(0);
        this.degree = releaseDegree;
        this.water = this.scene.findObjectByTag(Tags.WATER)!; 
        this.boosters = 0;
        this.boosterLastUpdate = new Date().getTime();
        }

    onMessage(msg: CF.Message) {
        if(msg.action === Messages.BOTTLE_IDLE){
            this.idle();
        }
        else if(msg.action === Messages.BOTTLE_RELEASE){
            this.release();
        }
    }

    idle(){
        this.owner.stateId = States.IDLE;
        this.owner.position.x = 400;
        this.owner.position.y = 200;
        this.boosters = 0;
        this.boosterLastUpdate = new Date().getTime();
    }

    release(){
        this.owner.stateId = States.TO_ASSIGN;
        this.velocity = new CF.Vector(releaseSpeed, -releaseSpeed); //zaporna, protoze v ose y jdeme vzdy nahoru
    }

    useBooster(){
        let timeSinceUpdate = new Date().getTime() - this.boosterLastUpdate;
        if (this.boosters > 0 && timeSinceUpdate > 1000){
            if (this.velocity.y >= 0){
                this.velocity = new CF.Vector(this.velocity.x, this.velocity.y + 0.1);
            } else{
               this.velocity = new CF.Vector(this.velocity.x, this.velocity.y - 0.1);
            }
        this.boosters -= 1;
        this.boosterLastUpdate = new Date().getTime();
        }
    }

    updateMovement(delta: number){ 
        const bbox = this.owner.getBounds();
        if(bbox.bottom < 600)
        {
            let rad = this.degree * Math.PI/180;
            let dy = this.velocity.y * Math.sin(rad);
            this.owner.position.y += dy * delta;
        }
        else{
            this.sendMessage(Messages.GAMEOVER);
            this.owner.stateId = States.GAME_OVER;
        }
        this.velocity = new CF.Vector(this.velocity.x, this.velocity.y + 0.0005);

        const bounds = this.owner.getBounds();
    }

    onUpdate(delta: number, absolute: number){
        const keyInputCmp = this.scene.findGlobalComponentByName<CF.KeyInputComponent>(CF.KeyInputComponent.name);
        if(this.owner.stateId == States.RELEASED){
            if (keyInputCmp?.isKeyPressed(CF.Keys.KEY_SPACE)){
                this.useBooster();
            }
            this.updateMovement(delta);
        }
        if(keyInputCmp?.isKeyPressed(CF.Keys.KEY_SPACE) && this.owner.stateId == States.IDLE){
            this.release();
        }
    }

}