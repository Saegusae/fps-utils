# fps-utils

  Written for tera-proxy, a free script filled with features dedicated to improve your fps, in the open world and in dungeons.

  **To support development and me:** ~~I accept any amount of MWA as donations on the EU-Killian server (I have debts to pay off) Saegusa/Saegusa-chan or PM me on discord Saegusa#3195 thanks.~~

  I now have a [patreon page](https://www.patreon.com/saegusa) where you can show your support, for reminder all my mods will remain 100% free and the free users will keep getting my mods and updates for free. Free.

### ps.
The commands list here is for the next update which will be FpsUtils3, some will work some won't approach with caution, and yes !fps 2 is still a meme, using is not advised.

## How to use:
* Setup tera-proxy by meishuu (https://github.com/meishuu/tera-proxy)
* put the script folder "fps-utils" into bin/node_modules
* Log the game using the proxy.
* Now you have access to fps-utils commands

## Commands:

Command | Argument(s) | Usage | Alias* | Description
---|---|---|---|---
!fps | 0, 1, 2, 3 | !fps [state] | --- | Sets the current fps-utils oprtimization state. Check further in the notes for the states' details.
!fps | fireworks | !fps fireworks | firework, fireworks, fw | Enables/Disables hiding of firework entities in open world (true = shown / false = hidden)
!fps | hide | !fps hide [args] | hide, delete, h | Takes *dps*, *healers*, *tanks* or *any username* as a sub argument, tries to hide all respective characters of said specifics off the screen.
!fps | show | !fps show [args] | show, s | Again takes *healers*, *tanks* or *any username* as a sub argument, tries to show all hidden characters of said specifics on the screen.
!fps | list | !fps list | list, l | Prints a list of characters currently hidden by *hide* command to chat.
!fps | save | !fps save | save, config | Saves your current settings to the configuration file for the next launch.


## Work In Progress:
* Overall improvements.
* Save configuration upon exit to remember last state.
* button toggle between fps states 0-1-2-3
* Revive !fps 2 to it's full glory and screw this "2 IS A MEME" gaem.