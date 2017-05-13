/*
//  FpsUtils revision1.2 - Saegusa
//  New iterations through player objects,
//  Should be around 3x faster in process speed.
//  Read README.md for more info about how to use.
//  Thanks: Bernkastel - PinkiePie for ideas.
*/

var config = require('./config.json');
const format = require('./format.js');

const fs = require('fs');

module.exports = function FpsUtils(dispatch) {

    let DEBUG = config.debug || false;

    let player,
        cid,
        model,
        clss;

    let state = 0,
        lastState = 0,
        hiddenPlayers = {},
        hiddenIndividual = {};

    let flags = {
        me: false,
        hide: {
            tanks: false,
            healers: false,
            dps: false
        }
    };

    const classes = config.classes;

    function getClass(m) {
        return (m - 10101) % 100;
    }

    function handleCommands(event) {

        let command = format.stripTags(event.message).split(' ');

        if(command[0] !== '!fps')
            return;

        lastState = state;

        if(command.length > 1) {
            let arg = command[1];

            switch(arg.toString()) {
                // Set state to 0: Disabled.
                case "0":
                    state = 0;
                    config.state = 0;
                    log('fps-utils optimization disabled by client.');
                    systemMsg('optimization disabled by user. [0]');

                    if(lastState > 2) {
                        // Display all hidden players.
                        for(let pl in hiddenPlayers) {
                            if(!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid]) {
                                dispatch.toClient('S_SPAWN_USER', 3, hiddenPlayers[pl]);
                            }
                        }
                    }

                    break;
                // Set state to 1: Only hide projectiles.
                case "1":
                    state = 1;
                    config.state = 1;
                    log('fps-utils optimization set to stage 1, disabling skill particles.');
                    systemMsg('optimization set to remove skill particles. [1]');

                    if(lastState > 2) {
                        // Display all hidden players. EXCEPT HIDDEN INDIVIDUALS
                        for(let pl in hiddenPlayers) {
                            if(!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid]) {
                                dispatch.toClient('S_SPAWN_USER', 3, hiddenPlayers[pl]);
                            }
                        }
                    }

                    break;
                // Set state to 2: Hide all skill animations.
                case "2":
                    state = 2;
                    config.state = 2;
                    log('fps-utils optimization set to stage 2, disabling skill animations.');
                    systemMsg('optimization set to remove skill animations. [2]');

                    // Spawn all players with disabled animations.
                    if(lastState > 2) {
                        for(let pl in hiddenPlayers) {
                            if(!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid]) {
                                dispatch.toClient('S_SPAWN_USER', 3, hiddenPlayers[pl]);
                            }
                        }
                    }
                    break;
                // Set state to 3: Hide all other players.
                case "3":
                    state = 3;
                    config.state = 3;
                    log('fps-utils optimization set to stage 3, disabling other player models.');
                    systemMsg('optimization set to remove other player models [3]');

                    if(lastState < 3) {
                        // Hide all players on screen and disable spawn.
                        for(let pl in hiddenPlayers) {
                            if(!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid]) {
                                dispatch.toClient('S_DESPAWN_USER', 2, {
                                    target: hiddenPlayers[pl].cid,
                                    type: 1
                                });
                            }
                        }
                    }
                    break;
                // Toggle flag me: Turn all the players to your character.
                case "me":
                    flags.me = !flags.me;
                    log('fps-utils me mode toggled ' + flags.me);
                    systemMsg(`toggled me mode ${flags.me}.`);

                        if(state < 3) {
                            for(let pl in hiddenPlayers) {
                                if(!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid]) {
                                    dispatch.toClient('S_DESPAWN_USER', 2, {
                                        target: hiddenPlayers[pl].cid,
                                        type: 1
                                    });
                                    dispatch.toClient('S_SPAWN_USER', 3, hiddenPlayers[pl]);
                                }
                            }
                        }

                    break;
                // Save configuration to file.
                case "save":

                    break; 
                // Toggle individual classes on and off
                case "hide":
                    if(command.length < 3) {
                        log('fps-utils missing arguments for command "hide"');
                        systemMsg(`missing arguments for command "hide" [dps, healers, tanks] or [username]`);
                        break;
                    } else {
                        let arg2 = command[2];
                        if(state < 3)
                            switch(arg2.toString()) {
                                // Hide all dps classes
                                case "dps":
                                log('fps-utils hiding dps classes');
                                systemMsg(`hiding dps classes.`);
                                flags.hide.dps = true;
                                    for (let pl in hiddenPlayers) {
                                        if((!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid]) && classes.dps.indexOf(getClass(hiddenPlayers[pl].model)) > -1) {
                                            dispatch.toClient('S_DESPAWN_USER', 2, {
                                                target: hiddenPlayers[pl].cid,
                                                type: 1
                                            });
                                        }
                                    }
                                    break;
                                // Hide all healer classes
                                case "healers":

                                    flags.hide.healers = true;
                                    for (let pl in hiddenPlayers) {
                                        if((!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid]) && classes.healers.indexOf(getClass(hiddenPlayers[pl].model)) > -1) {
                                            dispatch.toClient('S_DESPAWN_USER', 2, {
                                                target: hiddenPlayers[pl].cid,
                                                type: 1
                                            });
                                        }
                                    }
                                    break;
                                // Hide all tank classes
                                case "tanks":

                                    flags.hide.tanks = true;
                                    for (let pl in hiddenPlayers) {
                                        if((!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid]) && classes.tanks.indexOf(getClass(hiddenPlayers[pl].model)) > -1) {
                                            dispatch.toClient('S_DESPAWN_USER', 2, {
                                                target: hiddenPlayers[pl].cid,
                                                type: 1
                                            });
                                        }
                                    }
                                    break;
                                // Argument is an individual name or not recognized.
                                default:
                                    for(let pl in hiddenPlayers) {
                                        if(hiddenPlayers[pl].name.toString().toLowerCase() === arg2.toString().toLowerCase()) {
                                            systemMsg(`player ${hiddenPlayers[pl].name} is added to the hiding list.`)
                                            hiddenIndividual[hiddenPlayers[pl].cid] = hiddenPlayers[pl];
                                            config.hiddenPeople.push(hiddenPlayers[pl].name.toString());
                                            dispatch.toClient('S_DESPAWN_USER', 2, {
                                                target: hiddenPlayers[pl].cid,
                                                type: 1
                                            });
                                            break;
                                        } else {
                                            continue;
                                        }
                                    }
                                    break;
                            }
                    }
                    break;

                // Try to respawn all hidden players included in show command.
                case "show":
                    if(command.length < 3) {
                        log('fps-utils missing arguments for command "show"');
                        systemMsg(`missing arguments for command "show" [dps, healers, tanks] or [username]`);
                        break;
                    } else {
                        let arg2 = command[2];
                        if(state < 3) {
                            switch(arg2.toString()) {
                                case "dps":
                                case "healers":
                                case "tanks":
                                    if(flags.hide[arg2.toString()]) {
                                        flags.hide[arg2.toString()] = false;
                                        log('fps-utils showing: ' + arg2);
                                        systemMsg(`showing ${arg2}`);
                                        for(let pl in hiddenPlayers) {
                                            if(classes[arg2.toString()].indexOf(getClass(hiddenPlayers[pl].model)) > -1) {
                                                if(!hiddenPlayers[pl].block || !hiddenIndividual[hiddenPlayers[pl].cid])
                                                    dispatch.toClient('S_SPAWN_USER', 3, hiddenPlayers[pl]);
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    // Individuals or unkown handler.
                                    for(let pl in hiddenIndividual) {
                                        if(arg2.toString().toLowerCase() === hiddenIndividual[pl].name.toString().toLowerCase()) {
                                            systemMsg(`showing player ${hiddenIndividual[pl].name}.`);
                                            if(!hiddenPlayers[pl].block) {
                                                config.hiddenPeople.splice(config.indexOf(hiddenPlayers[pl].name), 1);
                                                dispatch.toClient('S_SPAWN_USER', 3, hiddenIndividual[pl]);
                                                delete hiddenIndividual[pl];
                                            }

                                        }
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                // List the players in individuals list.
                case "list":
                    let hiddenArray = [];
                    for(let pl in hiddenIndividual) {
                        hiddenArray.push(hiddenIndividual[pl].name);
                    }
                    systemMsg(`Manually hidden players: ${hiddenArray}`);
                    break;
                // Command not recognized
                default:
                    systemMsg('Command not recognized. use [!fps help] for a list of available commands');
                    break;
            }

            return false;
        } else {

            return false;
        }

    }

    function log(msg) {
        if(DEBUG)
            console.log('[fps-utils] ' + msg);
    }

    function systemMsg(msg) {
        dispatch.toClient('S_CHAT', 1, {
            channel: 24,
            authorID: 0,
            unk1: 0,
            gm: 0,
            unk2: 0,
            authorName: '',
            message: ' (fps-utils) ' + msg
        });
    }

    function saveConfig() {
        
    }

    dispatch.hook('S_LOGIN', 2, (event) => {
        ({cid, model} = event);
        player = event.name;
        clss = getClass(event.model);
        state = config.state || 0;
    });

    dispatch.hook('S_LOAD_TOPO', 1, (event) => {
        // Refresh the hide list upon teleport or zone change.
        hiddenPlayers = {};
    });

    dispatch.hook('S_SPAWN_USER', 3, (event) => {

        // Add players in proximity of user to possible hide list.
        hiddenPlayers[event.cid] = event;

        // Check the state or if the individual is hidden.
        if(state === 3 || hiddenIndividual[event.cid]) {
            return false;
        }

        // Hide dps enabled, remove dps characters;
        if(flags.hide.dps && classes.dps.indexOf(getClass(event.model)) > -1) {
            return false;
        }

        // Hide tanks enabled, remove tank characters;
        if(flags.hide.tanks && classes.tanks.indexOf(getClass(event.model)) > -1) {
            return false;
        }

        // Why would you want this on, seriously...
        if(flags.hide.healers && classes.healers.indexOf(getClass(event.model)) > -1) {
            return false;
        }

        // If me-mode is enabled spawn everyone as yourself.
        if(flags.me && appearence) {
            //event.model = model;
            return true;
        }

    });

    dispatch.hook('S_DESPAWN_USER', 2, (event) => {
        delete hiddenPlayers[event.target];

        if(state === 3 || hiddenIndividual[event.target]) {
            return false;
        }
    });

    dispatch.hook('S_USER_LOCATION', 1, (event) => {
        // Update locations of every player in case we need to spawn them.
        hiddenPlayers[event.target].x = event.x2;
        hiddenPlayers[event.target].y = event.y2;
        hiddenPlayers[event.target].z = event.z2;
        hiddenPlayers[event.target].w = event.w;

        if(state > 2 || hiddenIndividual[event.target]) {
            return false;
        }
    });

    dispatch.hook('S_ACTION_STAGE', 1, (event) => {
        // If state is higher than state1 remove all skill animations.    
        if(state > 1 && (hiddenPlayers[event.source] || hiddenIndividual[event.source]))
            return false;
    });

    dispatch.hook('S_ACTION_END', 1, (event) => {
        // If we're removing skill animations we should ignore the end packet too.
        if(state > 1 && (hiddenPlayers[event.source] || hiddenIndividual[event.source]))
            return false;
    });

    dispatch.hook('S_START_USER_PROJECTILE', 1, (event) => {
        // State 1 and higher ignores particles and projectiles so we're ignoring this.
        if(state > 0 && (hiddenPlayers[event.source] || hiddenIndividual[event.source]))
            return false;
    });

    dispatch.hook('S_SPAWN_PROJECTILE', 1, (event) => {
        // Ignore the projectile spawn if enabled in state.
        if(state > 0 && (hiddenPlayers[event.source] || hiddenIndividual[event.source]))
            return false;
    });

    dispatch.hook('C_CHAT', 1, handleCommands);

}
