export enum Messages{
    BOTTLE_IDLE = 'BOTTLE_IDLE', // game - bottle idle (power choosing)
    BOTTLE_RELEASE = 'BOTTLE_RELEASE', // game - bottle released
    GAMEOVER = 'GAMEOVER'
}

export enum States{
    IDLE = 1,
    RELEASED = 2,
    TO_ASSIGN = 3,
    GAME_OVER = 4
}

export enum Tags {
    WATER = 'water',
    BOTTLE = 'bottle',
    BACKGROUND = 'background',
    GULL = 'gull',
    HOBO = 'hobo',
    PIGEON = 'pigeon'
}

export enum Attributes{
    VELOCITY = 'velocity',
    DEGREE = 'degree',
    SCENE_HEIGHT = 'scene_height',
    BOOSTERS = 'boosters'
}

export const releaseSpeed = 0.2; // POTOM TO NEBUDE KONSTANTA, ALE BUDE URCENA HODEM
export const releaseDegree = 50;
export const defaultSpeedSlower = 0.05;
export const velocityBound = 0.5;

