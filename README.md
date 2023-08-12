# Poki Player
Custom AVM Player for Poki projects

## Prerequistes ##
 - git ([installation instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
 - Node.js ([installation instructions](https://nodejs.dev/learn/how-to-install-nodejs))

## Installing ##
Either use the template file [here](https://github.com/awayfl/poki-template) (recommended) or clone this repo and test your own content by typing the following into a terminal / cmd prompt / shell window:
```shell
git clone https://github.com/awayfl/poki-player
cd poki-player
npm install
```

## Configuration ##
Open the `pokiGame.config.js` file and add some SWF files to `fileconfigs`, including a `rt_title` and `rt_filename` entry (without the .swf extension), eg:

```javascript
fileconfigs: [
    {
        rt_title: "my Awesome Flash Game",
        rt_filename: "my_awesome_flash_game",
    },
],
```

`pokiGame.config.js` contains many additional configs (documented inline) that can be applied either global or locally to individual test SWFs.

## PokiSDK examples ##
By default,  `fileconfigs` contains two example SWFs for demonstrating use of the PokiSDK with AS2 and AS3 SWFs. The source for these examples can be found in `/_XFL_original`.

XFL files are used to keep things git-friendly, and any SWF compiled from Adobe Animate  / Flash Pro is best having its accompanying source uploaded in XFL to allow for easier testing and keep track of any modifications. You can easily save  `.fla` files as `.xfl` files from any Adobe Flash IDE.

> N.B. AS2 XFLs can only be opened and compiled in Adobe Flash Pro CS6 (recommended) or earlier.

The SDK's most commonly used functions are:
 - `commercialBreak()`
 - `gameplayStart()`
 - `gameplayStop()`

Use cases are described inside the example SWFs / XFLs.

## Preview ##

To run a preview of your SWFs, start up the webpack development server:

```shell
npm start
```
Once compilation is complete, you can view your SWFs through the links at http://localhost. Updating SWFs or any files in  `/src` will auto-reload the browser. However, any changes to `pokiGame.config.js` will require a restart.