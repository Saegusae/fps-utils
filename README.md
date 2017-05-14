# fps-utils

  Written for tera-proxy, a free script filled with features dedicated to improve your fps, in the open world and in dungeons.

  **To support development and me:** I accept any amount of MWA as donations on the EU-Killian server (I have debts to pay off) please PM me on discord Saegusa#3195 thanks.

## How to use:
* Setup tera-proxy by meishuu (https://github.com/meishuu/tera-proxy)
* put the script folder "fps-utils" into bin/node_modules
* Log the game using the proxy.
* Now you have access to fps-utils commands

## Commands:
* **!fps:**
    * **usage:** !fps [arg] [opt. arg2]
    * **valid arguments:** 0, 1, 2, me, show, hide, help
    * **description:** Toggles between fps-utils states to interact with the game client in various ways to improve fps, input 0 as argument to disable.
* **!fps 0:** disable main states, and spawn all non-blocked players.
* **!fps 1:** enable fps state 1 and remove skill particles and projectiles.
* **!fps 2:** enable fps state 2 and remove all skill animations.
* **!fps 3:** enable fps state 3 and remove any and all players from your screen.
* **!fps hide:**
    * **usage:** !fps hide [arg1]
    * **valid arguments:** dps, healers, tanks, any username
    * **description:** Hide a certain role or any user individually
* **!fps show:**
    * **usage:** !fps show [arg1]
    * **valid arguments:** dps, healers, tanks, any username
    * **description:** see fps-hide
* **!fps list:**
    * **usage:** !fps list
    * **description:** List individual players you're currently hiding with !fps hide


## Work In Progress:
* Overall improvements.
* Save configuration upon exit to remember last state.
* button toggle between fps states 0-1-2-3

## Notes:

Apparently !fps 2 mode is bugged somewhat in the current version, I am working on fixes to the desyncing issues that come with it.