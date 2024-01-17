import * as CF from 'colfio';
import * as PIXI from 'pixi.js';
import { Loader } from '@pixi/loaders';
import { Bottle } from './Bottle.ts';
import {Messages, States, Tags, Attributes, releaseSpeed, velocityBound, defaultSpeedSlower} from './constants.ts';
import { CollisionHandler } from './CollisionHandler.ts';
import  { Water } from './Water.ts';
import { Bird } from './Bird.ts';
import { Hobo } from './Hobo.ts';

const gullAnimation = './static/gull-sheet.json';


export class MyGame{
    engine: CF.Engine;
    up: boolean;
    startPower: number;
    score: CF.Text;
    boosters: CF.Text;
    scoreNumber: number;
    highScore: number;
    lastScore: number;
  // background: Background;

    constructor() {
        this.engine = new CF.Engine();
        let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);
        this.startPower = 0;
        this.scoreNumber = 0;
        this.lastScore = 0;
        this.highScore = 0;
        this.up = true;
        // init the game loop
        this.engine.init(canvas, {
            resizeToScreen: false,
            width: 800,
            height: 600,
            resolution: 1,
        });
        this.initText();
        const loader = new Loader();
        // using PIXI loader, load all assets
        loader
            .reset()
            .add('bottle.png')
            .add('water.png')
            .add('background.png')
            .load(() => this.load());
    }

    initText(){
        this.score = new CF.Text("Score: " + this.scoreNumber);
        this.score.position.set(100, 20);
        this.score.anchor.set(0.5);

        this.boosters = new CF.Text("Boosters: " + 0);
        this.boosters.position.set(100, 40);
        this.boosters.anchor.set(0.5);
    }

    updatePower(){
        let step = 0.005;
        if (this.startPower < velocityBound && this.up)
            this.startPower += step;
        else if (this.startPower >= velocityBound){
            this.startPower -= step;
            this.up = false;
        }
        else if (this.startPower <= 0){
            this.startPower += step;
            this.up = true;
        }
        else if (this.startPower < velocityBound && !this.up && this.startPower > 0){
            this.startPower -= step;
        }
    }

    powerBar(){
        const bottle = this.engine.scene!.findObjectByTag(Tags.BOTTLE)!;
        const width = 100;
        const height = 25;
        let powerbar = new CF.Builder(this.engine.scene!)
            .asGraphics()
            .localPos(this.engine.scene!.width/2 - width, this.engine.scene!.height /4 - height)
            .withParent(this.engine.scene!.stage)
            .withComponent(new CF.FuncComponent('').doOnUpdate((cmp, delta, absolute) => {
                const gfx = cmp.owner.asGraphics();
                if (bottle.stateId == States.IDLE){
                gfx.clear();
                gfx.lineStyle({
                    width: 5,
                    color: 0xEEEEEE
                });
                gfx.drawRect(0, 0, width, height);
                gfx.lineStyle({
                    width: 0
                });
                gfx.beginFill(0x2831cF);
                gfx.drawRect(2.5, 2.5, (width - 5)*(this.startPower % velocityBound)*2, height - 5);
                gfx.endFill(); 
                this.updatePower();
            }
                else{
                    gfx.clear();
                    if (bottle.stateId == States.TO_ASSIGN){
                        let startVelocity = new CF.Vector(releaseSpeed, this.startPower);
                        bottle.assignAttribute(Attributes.VELOCITY, startVelocity);
                        bottle.stateId = States.RELEASED;
                }
                }
            }))
            .build();
    }

    start(){
        const bottle = this.engine.scene!.findObjectByTag(Tags.BOTTLE)!;
        let width = 600;
        let height = 170;
        let bcg = new CF.Builder(this.engine.scene!)
        .asGraphics()
        .localPos(100, 370)
        .withParent(this.engine.scene!.stage)
        .withComponent(new CF.FuncComponent('').doOnUpdate((cmp, delta, absolute) => {
            const gfx = cmp.owner.asGraphics();
            if (bottle.stateId == States.IDLE){
            gfx.clear();
            gfx.lineStyle({
                width: 5,
                color: 0xEEEEEE
            });
            gfx.beginFill(0xEEEEEE);
            gfx.drawRect(0, 0, width, height);
        }
            else{
                gfx.clear();
            }
        }))
        .build();

        let text = 'Welcome to PLASTIC JOURNEY! \nYour goal is to throw the bottle as far as possible. \nCurrent power is displayed over your head. \n You can gain speed boosters by crashing into pigeons \nand use them by pressing SPACE. \nSelect the power and start the game by pressing SPACE.';
        let style = new PIXI.TextStyle({
            fontFamily: 'Verdana',
            fontSize: 21,
            align: 'center'
        })
        let txt = new CF.Builder(this.engine.scene!)
            .asText(text, style)
            .localPos(100, 380)
            .withParent(this.engine.scene!.stage)
            .withComponent(new CF.FuncComponent('').doOnUpdate((cmp, delta, absolute) => {
            const t = cmp.owner.asText();
            if (bottle.stateId != States.IDLE){
                t.text = " ";
                t.updateText(false);
            }
            else{
                t.text = text;
                t.updateText(false);
            }
    }))
    .build();
    }

    gameover(){
        const bottle = this.engine.scene!.findObjectByTag(Tags.BOTTLE)!;
        let width = 600;
        let height = 170;
        let bcg = new CF.Builder(this.engine.scene!)
        .asGraphics()
        .localPos(100, 370)
        .withParent(this.engine.scene!.stage)
        .withComponent(new CF.FuncComponent('').doOnUpdate((cmp, delta, absolute) => {
            const gfx = cmp.owner.asGraphics();
            if (bottle.stateId == States.GAME_OVER){
            gfx.clear();
            gfx.lineStyle({
                width: 5,
                color: 0xEEEEEE
            });
            gfx.beginFill(0xEEEEEE);
            gfx.drawRect(0, 0, width, height);
        }
            else{
                gfx.clear();
            }
        }))
        .build();
        let text = "";
        let style = new PIXI.TextStyle({
            fontFamily: 'Verdana',
            fontSize: 21,
            align: 'center'
        })
        let txt = new CF.Builder(this.engine.scene!)
            .asText(text, style)
            .localPos(150, 400)
            .withParent(this.engine.scene!.stage)
            .withComponent(new CF.FuncComponent('').doOnUpdate((cmp, delta, absolute) => {
            const t = cmp.owner.asText();
            if (bottle.stateId != States.GAME_OVER){
                t.text = " ";
                t.updateText(false);
            } 
            else{
                if(this.scoreNumber != 0)
                    this.lastScore = Math.round(this.scoreNumber);
                if(this.highScore < Math.round(this.scoreNumber))
                    this.highScore = Math.round(this.scoreNumber);
                if(this.lastScore >= this.highScore){
                    text = 'Congratulations! \n You have beaten the current high score.\n Your score is: ' + this.highScore + '. \nIf you wish to start a new game, press SPACE.';
                }
                else{
                    text = 'Game over! Your score is: ' + Math.round(this.lastScore) + '.\n The current high score is: ' + this.highScore + '.\nIf you wish to start a new game, press SPACE.';
                }
                t.text = text;
                t.updateText(false);
                this.scoreNumber = 0;
                this.score.text = "Score: " + this.scoreNumber;
            }
    }))
    .build();
    }

    load() {
        // init the scene and run your game

        let scene = this.engine.scene!!;
        scene.addGlobalComponent(new CF.KeyInputComponent);


       let bcg_texture =  PIXI.Texture.from('background.png');
        bcg_texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        
        new CF.Builder(scene)
                .localPos(400, 
                    460)
                .anchor(0.5)
                .scale(1)
                .withParent(scene.stage)
                .asSprite(PIXI.Texture.from('water.png'))
                .withComponent(new Water())
                .withTag(Tags.WATER)
                .build();

        let bcg = new CF.Builder(scene)
            .asTilingSprite(bcg_texture, 1600, 600)
            .localPos(400, 
                300)
            .anchor(0.5)

            .scale(1)
            .withParent(scene.stage)
            .withTag(Tags.BACKGROUND)
            .build().asTilingSprite();


        let bottle = new CF.Builder(scene)
                .localPos(400, 
                    200)
                .anchor(0.5)
                .scale(1)
                .withParent(scene.stage)
                .asSprite(PIXI.Texture.from('bottle2.png'))
                .withComponent(new Bottle())
                .withTag(Tags.BOTTLE)
                .build();

       /*
                const gullImg = [
                    './static/gull1.png',
                    './static/gull2.png'
                ]
                const texture1 = PIXI.Texture.from(gullImg[0]);
                const texture2 = PIXI.Texture.from(gullImg[1]);
                let textureArray = [texture1, texture2];

               let gullAnim = new CF.AnimatedSprite('gull-anim', textureArray);
               gullAnim.animationSpeed = 0.267;
               gullAnim.loop = true;
               gullAnim.play();
               gullAnim.position.set(500, 300);
               gullAnim.anchor.set(0.5);
               gullAnim.addTag(Tags.GULL);
               gullAnim.addComponent(new Bird());
*/

        let xpos = 500;
        let ypos = 300;
        let gull = new CF.Builder(scene)
                .localPos(xpos, 
                    ypos)
                .anchor(0.5)
                .scale(1)
                .withParent(scene.stage)
                .asSprite(PIXI.Texture.from('gull.png'))
                .withComponent(new Bird())
                .withTag(Tags.GULL)
                .build();
        

        let pigeon = new CF.Builder(scene)
                .localPos(xpos - 400, 
                    ypos - 100)
                .anchor(0.5)
                .scale(0.6)
                .withParent(scene.stage)
                .asSprite(PIXI.Texture.from('pidgeon.png'))
                .withComponent(new Bird())
                .withTag(Tags.PIGEON)
                .build();

        let hobo = new CF.Builder(scene)
                .localPos(200, 
                    400)
                .anchor(0.5)
                .scale(1)
                .withParent(scene.stage)
                .asSprite(PIXI.Texture.from('hobo.png'))
                .withComponent(new Hobo())
                .withTag(Tags.HOBO)
                .build();

        this.powerBar();
        this.start();
        this.gameover();

        scene.stage.addChild(this.score);
        scene.stage.addChild(this.boosters);

        scene.addGlobalComponent(new CollisionHandler());
        scene.sendMessage(new CF.Message(Messages.BOTTLE_IDLE));

        this.engine.ticker!.add(() =>
            {
                const bbox = bottle.getBounds();
                const velocity = bottle.getAttribute<CF.Vector>(Attributes.VELOCITY);
                const b = bottle.getAttribute<number>(Attributes.BOOSTERS);
                if(bbox.bottom < 600 && bottle.stateId == States.RELEASED){
                    bcg.tilePosition.x -= Math.abs(velocity.y * 10) + 1;
                this.scoreNumber += Math.abs(velocity.y) / 10;
                let scoreRounded = Math.round(this.scoreNumber);
                this.score.text = "Score: " + scoreRounded;
                this.boosters.text = "Boosters: " + b;
            }
            }
        )

    }
}
 
// this will create a new instance as soon as this file is loaded
export default new MyGame();