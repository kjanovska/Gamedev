import * as CF from 'colfio';
import * as PIXI from 'pixi.js';
import {Messages, States, Tags, Attributes, releaseSpeed, velocityBound, defaultSpeedSlower, releaseDegree} from './constants.ts';

export class CollisionHandler extends CF.Component{

    speedSlower: number;
    boosterLastUpdate: number;

    onInit(): void {
        this.speedSlower = defaultSpeedSlower;
        this.boosterLastUpdate = new Date().getTime();
    }
    
    onUpdate(delta: number, absolute: number): void {
        const bottle = this.scene.findObjectByTag(Tags.BOTTLE)!;
        const waters = this.scene.findObjectByTag(Tags.WATER)!;
        const gulls = this.scene.findObjectByTag(Tags.GULL)!;
        const pigeon = this.scene.findObjectByTag(Tags.PIGEON)!;

        const bottleBox = bottle!.getBounds();

        const colliders = [pigeon, gulls, waters];
        for(let collider of colliders){
            const cbox = collider!.getBounds();
            const horizontalIntersection = this.horizontalIntersection(bottleBox, cbox);
            const verticalIntersection = this.verticalIntersection(bottleBox, cbox);
            const velocity = bottle.getAttribute<CF.Vector>(Attributes.VELOCITY);
            const degree = bottle.getAttribute<number>(Attributes.DEGREE);
            const boosters = bottle.getAttribute<number>(Attributes.BOOSTERS);

            const collides = horizontalIntersection >= 0 && verticalIntersection >= 0;
            
            if(collides && collider.hasTag(Tags.WATER)){ //JEN POKUD KOLIDUJE S VODOU
                let newVelocity: CF.Vector;
            if (velocity.y < 0.6){
                newVelocity = new CF.Vector(releaseSpeed, -Math.abs(velocity.y) + this.speedSlower);
                }
            else{
                newVelocity = new CF.Vector(0, 0.005); //tohle je kdyz se ponori
                }
                bottle.assignAttribute(Attributes.VELOCITY, newVelocity);
                if (degree > 0.5){
                    let newDegree = degree - 0.5;
                    bottle.assignAttribute(Attributes.DEGREE, releaseDegree);
                }
            } else if (collides && collider.hasTag(Tags.GULL)){
                let newVelocity = new CF.Vector(releaseSpeed, -Math.abs(velocity.y));
                bottle.assignAttribute(Attributes.VELOCITY, newVelocity);
            } else if (collides && collider.hasTag(Tags.PIGEON)){
                let timeSinceUpdate = new Date().getTime() - this.boosterLastUpdate;
                if(timeSinceUpdate > 1000){
                    let newBoost = boosters + 1;
                    bottle.assignAttribute(Attributes.BOOSTERS, newBoost);
                    this.boosterLastUpdate = new Date().getTime();
                }
            }
        }
    }

    private horizontalIntersection(A: PIXI.Rectangle, B: PIXI.Rectangle){
        return Math.min(A.right, B.right) - Math.max(A.left, B.left);
    }

    private verticalIntersection(A: PIXI.Rectangle, B: PIXI.Rectangle){
        return Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
    }
}