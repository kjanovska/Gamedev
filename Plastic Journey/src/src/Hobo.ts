import * as CF from 'colfio';
import {Messages, States, Tags, Attributes, releaseSpeed, releaseDegree, velocityBound, defaultSpeedSlower} from './constants.ts';



export class Hobo extends CF.Component{


    onUpdate(delta: number, absolute: number){
        const bottle = this.scene.findObjectByTag(Tags.BOTTLE)!;
        if (bottle.stateId == States.RELEASED){
            if(this.owner.position.x > -200){
                const velocity = bottle.getAttribute<CF.Vector>(Attributes.VELOCITY);
                this.owner.position.x -= Math.abs(velocity.y * 10) + 2;
        } 
        } else if (bottle.stateId == States.IDLE){
            this.owner.position.x = 200;
            this.owner.position.y = 400;
        }
    }
}