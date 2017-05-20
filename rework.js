/*
// FpsUtils3 indev-0.1 currently not functional.
// Written by Saegusa with love<3 and memes
//
// This is a development structral version of
// FpsUtils' new version, which will be the
// third iteration of this mod, which includes
// the same features as before but in a better
// code structure to make it more understandable
// and easier to work on for people other than gooses.
// 
// FpsUtils3 currently includes the new command
// system i thought up for "masterwork" and is beastin
// Pls forward any future requests to my Patreon page:
// https://www.patreon.com/saegusa
//
// Original code repository is placed at:
// https://github.com/Saegusae/fps-utils
*/

let config = require('./config.json');

const format = require('./format'),
      fs = require('fs');

module.exports = function FpsUtils3(dispatch) {

    const CLASSES = config.classes;

    let debug = config.debug || false;

    let player,
        cid,
        model,
        clss;

    let state = config.state || 0,
        lastState = state || 0,
        hiddenPlayers = {},
        hiddenIndividual = {};

    let flags = {
        fireworks: false,
        hide: {
            tanks: false,
            healers: false,
            dps: false
        }
    }

    function getClass(mdl) {
        return (m % 100);
    }

    const commands = {
        state: {
            alias: ["0", "1", "2", "3"],
            help: "Changes fps state to given argument.",
            run: function(args) {

                lastState = state;
                state = parseInt(args[0]);
                config.state = state;

                switch(state) {
                    // State 0: Disable fps-utils optimization.
                    case 0:
 
                        if(lastState > 2) {
                            // Display all hidden players.
                        }
                        break;
                    // State 1: Hide skill particles and projectiles.
                    case 1:

                        if(lastState > 2) {
                            // Display all hidden players, except individuals.
                        }
                        break;
                    // State 2: Hide skill animations.
                    case 2:

                        if(lastState > 2) {
                            // Display all hidden players, except individuals.
                        }
                        break;
                    // State 3: Hide all players.
                    case 3:

                        if(lastState < 3) {
                            // Hide all players.
                        }
                        break;
                    default:
                        break;
                }
            }
        },
        save: {
            alias: ['save', 'config'],
            help: "Saves current settings to config file for next launch.",
            run: function(args) {
                save((err) => {
                    if(err) {
                        log('Save to config failed.');
                    } else {
                        log('Settings successfully saved to config');
                    }
                });
            }
        },
        fireworks: {
            alias: ['firework', 'fireworks', 'fw'],
            help: "Hide fireworks, and their pesky animations. (true = show | false = hide)",
            run: function(args) {
                flags.fireworks = !flags.fireworks;
                log(`toggled fireworks: ${flags.fireworks}`);
            }
        },
        hide: {
            alias: ['hide', 'h', 'delete'],
            help: "",
            run: function(args) {
                if(args.length < 2) {
                    // Missing argument, throw help function.
                } else {
                    if(state < 3)
                        switch(args[1]) {
                            case "dps":
                            case "healers":
                            case "tanks":

                                // Hide all characters of said class.

                                break;
                            default:

                                // Hide individuals by username.

                                break;
                        }
                }
            }
        },
        show: {
            alias: ['show', 's'],
            help: "",
            run: function(args) {

                if(args.length < 2) {
                    // Missing argument, throw help.
                } else {
                    if(state < 3)
                        switch(args[1]) {
                            case "dps":
                            case "healers":
                            case "tanks":
                                // Show chosen class.
                                break;
                            default:
                                // Show individual by name.
                                break;
                        }
                }

            }
        },
        list: {
            alias: ['list', 'l'],
            help: "Show a list of players hidden by 'hide' command.",
            run: function(args) {
                let hiddenArray = [];
                for(let pl in hiddenIndividual) hiddenArray.push(hiddenIndividual[pl].name);
                log(`Hidden Players: ${hiddenArray}`);
            }
        }
    }

    dispatch.hook('C_CHAT', 1, (event) => {
        if(!event.message.includes('!fps'))
            return;

        let command = format.stripTags(event.message).split(' ');

        if(command.length > 1) {
            command = command.splice(1, 1);
            for(let cmd in commands) {
                if(commands[cmd].alias.indexOf(command[0])) {
                    commands[cmd].run(command);
                }            
            }
        }

        return false;
    });


    function help(cmd) {

    }

    function log(msg) {
        if(debug) console.log('[fps-utils3] ' + msg);
        dispatch.toClient('S_CHAT', 1, {
            channel: 24,
            authorID: 0,
            unk1: 0,
            gm: 0,
            unk2: 0,
            authorName: '',
            message: ' (fps-utils3) ' + msg
        });
    }

    function save(callback) {
        fs.writeFile('./config.json', config, 'utf8', (err) => { 
            if(!err) log("config file overwritten successfully"); 
            else callback(err);
        });
    }

}