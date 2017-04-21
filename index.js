/* Get rekt bernkastel-sama */
// It's ok we buds now xd.

/*
=========HOW TO USE==========
Chat commands:
fps [preset]
increase the preset (maximum 3)
to enable density of the fps
increase
*/

const format = require('./format.js');

module.exports = function FPSUtils(dispatch) {

    let nostrum = 184659;

    let player,
        cid,
        model,
        job,
        character = {};

    let lagstate = 0,
        lastlagstate = 0,
        hiddenPlayers = [],
        hiddenIndex = [],
        zmr = 0;

    let flags = {
            me: false,
            enableHealers: false,
            enableTanks: false
    };

    function getClass(mdl) {
        return (mdl - 10101) % 100;
    }

    dispatch.hook('S_LOGIN', 1, function(event) {
        ({cid, model} = event);
        player = event.name;
        job = (model - 10101) % 100;
        character = event;
    });

    dispatch.hook('S_PCBANGINVENTORY_DATALIST', 1, function(event) {
        for(let item of event.inventory)
            if (item.item == nostrum) {
                item.cooldown = 0;
                return true;
            }
    });

    dispatch.hook('C_CHAT', 1, function(event) {

            let command = format.stripTags(event.message).split(' ');

            if(command[0] === 'fps') {

                lastlagstate = lagstate;

                if (command.length > 1) {

                    switch(command[1]) {
                        case "0":
                            lagstate = 0;
                            log('fps-utils optimization disabled by client.');
                            systemMsg('optimization disabled by user. [0]');

                            if(lastlagstate == 2) {
                                for(i = 0; i < zmr; i++) {
                                    if(hiddenPlayers[hiddenIndex[i]] != "block") {
                                            dispatch.toClient('S_SPAWN_USER', 3, hiddenPlayers[hiddenIndex[i]]);
                                    }
                                }
                            }

                            return false;
                        case "1":
                            lagstate = 1;
                            log('fps-utils optimization set to stage 1, disabling skill animations.');
                            systemMsg('optimization set to remove skill animations. [1]');
                            return false;

                            if(lastlagstate == 2) {
                                for(i = 0; i < zmr; i++) {
                                    if(hiddenPlayers[hiddenIndex[i]] != "block") {
                                            dispatch.toClient('S_SPAWN_USER', 3, hiddenPlayers[hiddenIndex[i]]);
                                    }
                                }
                            }

                        case "2":
                            lagstate = 2;
                            log('fps-utils optimization set to stage 2, disabling other player models.');
                            systemMsg('optimization set to remove other player models [2]');

                            if(lastlagstate == 0 || lastlagstate == 1) {
                                for(i = 0; i < zmr; i++) {
                                    if(hiddenPlayers[hiddenIndex[i]] != "block") {
                                        dispatch.toClient('S_DESPAWN_USER', 2, {
                                            target: hiddenPlayers[hiddenIndex[i]].cid,
                                            type: 1,
                                        });
                                    }
                                }
                            }

                            return false;
                        case "3":
                            lagstate = 2;
                            log('fps-utils optimization set to stage 3, idk what to do. Set back to stage 2.'); //TODO
                            systemMsg('stage 3 is still WIP reverted back to stage 2. [2]');
                            return false;
                        case "me":
                            lagstate = lastlagstate;
                            //flags.me = !flags.me;
                            log('fps-utils toggled me mode. ' + flags.me);
                            systemMsg('setting "me" toggled by user. ' + flags.me);
                            return false;
                        default:
                            lagstate = lastlagstate;
                            log('unrecognized arguments.')
                            systemMsg('argument unrecognized please use a stage between 1-3. usage: /fps [0-3]')
                            return;
                    }

                } else {
                    log('fps-utils initiated wrong command.');
                    systemMsg('please input arguments for command "fps".')
                }

                return false;
            }



    });

    dispatch.hook('S_LOAD_TOPO', 1, function(event) {
        hiddenPlayers = [];
        hiddenIndex = [];
        zmr = 0;
    });

    dispatch.hook('S_SPAWN_USER', 3, function(event) {

        if(hiddenPlayers[event.cid] != "block") {
            hiddenIndex[zmr] = event.cid;
            zmr++;
        }

        hiddenPlayers[event.cid] = event;

        if(lagstate == 2) {
            return false;
        }

    });

    dispatch.hook('S_DESPAWN_USER', 2, function(event) {
        hiddenPlayers[event.target] = "block";
        if(lagstate == 2) {
            return false;
        }
    });

    dispatch.hook('S_USER_LOCATION', 1, function(event) {
        hiddenPlayers[event.target].x = event.x2;
		hiddenPlayers[event.target].y = event.y2;
		hiddenPlayers[event.target].z = event.z2;
		hiddenPlayers[event.target].w = event.w;
        if(lagstate == 2) {
            return false;
        }
    });

    dispatch.hook('S_ACTION_STAGE', 1, function(event) {
        if((lagstate == 1 || lagstate == 2) && (hiddenPlayers[event.source] == "block" || hiddenPlayers[event.source]))
            return false;
    });

    dispatch.hook('S_SPAWN_PROJECTILE', 1, function(event) {
        if((lagstate == 1 || lagstate == 2) && (hiddenPlayers[event.source] == "block" || hiddenPlayers[event.source])) {
            return false;
        }
    });

    dispatch.hook('S_START_USER_PROJECTILE', 1, function(event) {
        if((lagstate == 1 || lagstate == 2) && (hiddenPlayers[event.source] == "block" || hiddenPlayers[event.source]))
            return false;
    });


    function log(msg) {
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

}
