"use strict";

const KEY_NAME_THRUSTER = "up";
const KEY_NAME_TELEPORT = "t";
const KEY_NAME_LEFT     = "left";
const KEY_NAME_RIGHT    = "right";
const KEY_NAME_SPACE    = "space";
const KEY_NAME_HELP     = "h";
const KEY_NAME_MAP      = "m";
const KEY_NAME_SMART    = "s";
const KEY_NAME_CTRL     = "control";
const KEY_NAME_SCORE    = "score";

const KEY_TYPE_UP       = "keyup";
const KEY_TYPE_DOWN     = "keydown";

class Keyboard {

    constructor() {
        
    }

    keyEvent (keyCode, type, player) {
        var keyName = String.fromCharCode(keyCode).toLowerCase();

        switch(keyCode) {
            case 37:
                keyName = KEY_NAME_LEFT;
            break;

            case 39:
                keyName = KEY_NAME_RIGHT;
            break;

            case 38:
                keyName = KEY_NAME_THRUSTER;
            break;

            case 32:
                keyName = KEY_NAME_SPACE;
            break;

            case 17:
                keyName = KEY_NAME_CTRL;
            break;

            case 40:
                keyName = KEY_NAME_CTRL;
            break;

            case 84:
                keyName = KEY_NAME_TELEPORT;
            break;

            case 77:
                keyName = KEY_NAME_MAP;
            break;

            default:
            break;
        }

        this.move(type, keyName, player);
    }

    move (keyType, keyName, player) {

        // Thruster is off
        if (keyName == KEY_NAME_THRUSTER && keyType == KEY_TYPE_UP) {
            player.thruster = false;
            player._thrust = 0;

        }
        // Thruster on
        else if (keyName == KEY_NAME_THRUSTER && keyType == KEY_TYPE_DOWN) {
            player.thruster = true;
            player._thrust = 0.05;
        }
        // Turning left
        if (keyName == KEY_NAME_LEFT && keyType == KEY_TYPE_DOWN) {
            player.vr = -7;
            player.radian = -0.05;
            player.rotate();
        }
        // Turning right
        if (keyName == KEY_NAME_RIGHT && keyType == KEY_TYPE_DOWN) {
            player.vr = 7;
            player.radian = 0.05;
            player.rotate();
        }
        // Stop turning
        if ((keyName == KEY_NAME_RIGHT || keyName == KEY_NAME_LEFT ) && keyType == KEY_TYPE_UP) {
            player.vr = 0;
            // player.rotate(0.05)
        }

        if (keyName == KEY_NAME_CTRL && keyType == KEY_TYPE_DOWN) {
            player.sheild = true;
        }

        if (keyName == KEY_NAME_CTRL && keyType == KEY_TYPE_UP) {
            player.sheild = false;
        }

        // v1 here to allow thrusting turning and firing
        if (keyName == KEY_NAME_SPACE && keyType == KEY_TYPE_DOWN) {
         
            if (!player.sheild) {
                if (player.shots.length < 15) {
                    player.addShot();
                }
            }
        }

    }
}

/*

Keyboard.prototype.keyEvent = function (keyCode, type, player) {
    var keyName = String.fromCharCode(keyCode).toLowerCase();

    if (keyCode == 37) {
        keyName = this.KEY_NAME_LEFT;
    }   // Left arrow key

    if (keyCode == 39) {
        keyName = this.KEY_NAME_RIGHT;
    }   // Right arrow key

    if (keyCode == 38) {
        keyName = this.KEY_NAME_THRUSTER;
    }   // Up arrow key

    if (keyCode == 32) {
        keyName = this.KEY_NAME_SPACE;
    }   // space bar

    if (keyCode == 17) {
        keyName = this.KEY_NAME_CTRL;
    }   // left control

    if (keyCode == 40) {
        keyName = this.KEY_NAME_CTRL;
    }   // down arrow (bloody MACS)

    if (keyCode == 84) {
        keyName = this.KEY_NAME_TELEPORT;
    }   // left control

    if (keyCode == 77) {
        keyName = this.KEY_NAME_MAP;
    }   // left control

    this.move(type, keyName, player);
}

Keyboard.prototype.move = function (keyType, keyName, player) {

    // Thruster is off
    if (keyName == this.KEY_NAME_THRUSTER && keyType == this.KEY_TYPE_UP) {
        player.thruster = false;
        player._thrust = 0;

    }
    // Thruster on
    else if (keyName == this.KEY_NAME_THRUSTER && keyType == this.KEY_TYPE_DOWN) {
        player.thruster = true;
        player._thrust = 0.05;
    }
    // Turning left
    if (keyName == this.KEY_NAME_LEFT && keyType == this.KEY_TYPE_DOWN) {
        player.vr = -7;
        player.radian = -0.05;
        player.rotate();
    }
    // Turning right
    if (keyName == this.KEY_NAME_RIGHT && keyType == this.KEY_TYPE_DOWN) {
        player.vr = 7;
        player.radian = 0.05;
        player.rotate();
    }
    // Stop turning
    if ((keyName == this.KEY_NAME_RIGHT || keyName == this.KEY_NAME_LEFT ) && keyType == this.KEY_TYPE_UP) {
        player.vr = 0;
       // player.rotate(0.05)
    }

    if (keyName == this.KEY_NAME_CTRL && keyType == this.KEY_TYPE_DOWN) {
        player.sheild = true;
    }

    if (keyName == this.KEY_NAME_CTRL && keyType == this.KEY_TYPE_UP) {
        player.sheild = false;
    }

}
*/
