# fps-utils

  Written for tera-proxy, a free alternative to Berstankel's ZFPS.

## How to use:
* Setup tera-proxy by meishuu (https://github.com/meishuu/tera-proxy)
* put the script folder "fps-utils" into bin/node_modules
* Log the game using the proxy.
* Now you have access to fps-utils commands

## Commands:
* **fps:**
    * **usage:** fps [arg]
    * **valid arguments:** 0, 1, 2
    * **description:** Toggles between fps-utils states to interact with the game client in various ways to improve fps, input 0 as argument to disable.
    * **state 1:** All skill and cast animations aside from user skills are disabled, other player models still shown moving even while using said disabled skills.
    * **state 2:** (This is what I call Icaruna mode) Completely hide other player models, increases fps substentially, all skill animations and player models disabled. (please don't use in Harrowhold for obvious reasons)


        fps 0 > disables fps-utils and resets state.
        fps 1 > enables state 1 to disable skill animations.
        fps 2 > enables state 2 to completely hide other player models.

## Work In Progress:
* More arguments for the 'fps' command. As in exclude tanks and/or healers in disabled models.
