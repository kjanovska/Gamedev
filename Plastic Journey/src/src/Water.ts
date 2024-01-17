import * as CF from 'colfio';
import {Messages, States, Tags, Attributes, releaseSpeed, velocityBound, defaultSpeedSlower} from './constants.ts';


export class Water extends CF.Component{
    message: number;

    onInit(){
        this.subscribe(Messages.BOTTLE_RELEASE, Messages.BOTTLE_IDLE, Messages.GAMEOVER);
        this.message = 0;
    }

    onMessage(msg: CF.Message) {
        if(msg.action === Messages.BOTTLE_IDLE){
            this.message = 0;
        }
        else if(msg.action === Messages.BOTTLE_RELEASE){
            this.message = 1;
        }
        else if(msg.action === Messages.GAMEOVER){
            this.message = 2;
        }
    }

    onUpdate(delta: number, absolute: number){
        const keyInputCmp = this.scene.findGlobalComponentByName<CF.KeyInputComponent>(CF.KeyInputComponent.name);
        
        if(keyInputCmp?.isKeyPressed(CF.Keys.KEY_SPACE) && this.message == 0){
            keyInputCmp.handleKey(CF.Keys.KEY_SPACE);
            this.sendMessage(Messages.BOTTLE_RELEASE);
            this.message = 1;
        } else if(keyInputCmp?.isKeyPressed(CF.Keys.KEY_SPACE) && this.message == 2){
           keyInputCmp.handleKey(CF.Keys.KEY_SPACE);
            this.sendMessage(Messages.BOTTLE_IDLE);
            this.message = 0;
        } 
    }
}