# Poki Player
Custom AVM Player for Poki projects

## Installing ##
Either use the template file [here](https://github.com/awaystudios/poki-template) (recommended) or clone this repo and test your own content
```shell
git clone https://github.com/awaystudios/poki-player
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

## PokiSDK examples
By default,  `fileconfigs` contains two example SWFs for demonstrating use of the PokiSDK with AS2 and AS3 swfs. The source for these examples can be found in `/_FLA_Original`. XFL files are used to keep things git-friendly.

> N.B AS2 XFLs can only be opened in a Flash Pro CS6 or earlier

The SDK's most commonly used functions are:
 - `commercialBreak()`
 - `gameplayStart()`
 - `gameplayStop()`

Use cases are described inside the example SWFs / XFLs

## Preview ##

To run a preview of your swfs, start up the webpack development server

```shell
npm start
```
Once compilation is complete, you can view your swfs at http://localhost:8080. Updating swfs or any files in  `/src` will auto-reload the browser. However, any changes to `pokiGame.config.js` will require a restart