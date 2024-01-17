import * as CF from 'colfio';
import {Messages, States, Tags, Attributes, releaseSpeed, releaseDegree, velocityBound, defaultSpeedSlower} from './constants.ts';



export class Bird extends CF.Component{

    onUpdate(delta: number, absolute: number){
        const bottle = this.scene.findObjectByTag(Tags.BOTTLE)!;
        const velocity = bottle.getAttribute<CF.Vector>(Attributes.VELOCITY);

        if(bottle.stateId == States.RELEASED){
            this.owner.position.x -= Math.abs(velocity.y * 10) + 2;
            this.owner.visible = true;
        } else{
            this.owner.position.x = 0;
            this.owner.visible = false;
        }
        
        if (this.owner.position.x < -200){
            let newX = Math.floor(Math.random() * 1500) + 800;
            let newY = Math.floor(Math.random() * 200) + 50;

            this.owner.position.x = newX;
            this.owner.position.y = newY;
        }
    }
}