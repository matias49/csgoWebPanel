# CSGOWebPanel
A nodeJS project to give all CSGO's game informations as a spectator on a single web page. Created using the [Game State Integration (GSI)](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Game_State_Integration).

## Features
- Provide a web view with all the important information of a CSGO game as a spectator
- Real time. You don't need to refresh to get the lastest data.
- More developed soon.

## Why this program?
We were discovering nodeJS at school. We had to make a project using this language. As CSGO's fans, we decided to use the Game State Integration Valve added to make something with.
When searching for some ideas on GitHub, we though we'll found a lot of projects using this API. We just found some good projects, but a lot of 'tests' repositories, and no project about the spectator version of the GSI. So we decided to create it!

It's still in an early phase.

## Is this legit?
Totally. The program uses as already said the Game State Integration, which is a public API Valve released for CS:GO. **VAC-free**

## How to use it?
This project was started with [Express generator](https://github.com/expressjs/generator).
To start it, you first **need to set your Steam API key on the config file (config/config.js)**. You can get yours [here](http://steamcommunity.com/dev).

They're also some facultative settings which can be enabled to secure your application.
- You can enter the IP the data is coming from. Only these data will be allowed.
- You can enter your Auth token the data is coming from (the one from the gamestate_integration cfg). Only the data with this Auth token will be allowed (soon handled).
- You can enter your Steam ID. Only the data with from this Steam ID will be allowed (soon handled).

Once this is done, you can launch the application with these classic commands:
```shell
npm install
node bin/www
```

By default, you can access it from http://localhost:3000

## Use as a remote app
- Change the socket IP on /public/javascripts/app.js with the corresponding IP.
- Change the port on /bin/www if you want (default is 3000)

If you change the socket port, you need to set it on /public/javascripts/app.js & /routes/index.js

### Docker
The application is Docker Ready. The Dockerfile creates a image of the application you can use.
```Docker
docker build -t image/name .
```
### Tools/languages used
- Javascript.
- Atom for developing.
- Jade for the HTML template.
- Socket.IO for the real-time data.
