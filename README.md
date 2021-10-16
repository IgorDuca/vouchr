<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=300px src="https://i.ibb.co/BcqRDDc/vouchr.png" alt="Project logo"></a>
</p>

<h3 align="center">Vouchr</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/IgorDuca/vouchr/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/IgorDuca/vouchr/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Vouchr is a "truco" cardgame API that you can use to play with your friends for free
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Starting the app](#starting)
- [Routes](#routes)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

Vouchr is an API that allows you to simulate a Truco (cardgame) match. With POST and GET requests, you can simply create, manage and run a match. <br>
A vouchr match works by rounds and rows. A round is a "deck hand", that is a submatch, divided by 3 or 4 rounds (in case of draw) - The first team to win all the rounds, win a row, recieving a specific pontuation (it can be: 1, 3, 6, 9, 12) determinated during the match. <br> To win a match, the team needs 12 points. <br> The app use the traditional truco card priorities to define the round winner. The cards in growing order are: `4, 5, 6, 7, Q, J, K, A, 2, 3`. <br> In case of two cards have the same value, the card with the major suit will win. The suits in growing order are: `D, S, H, C`.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

First, you need to install Yarn. Read more [here](https://yarnpkg.com/)

```
npm i yarn -g
```

And then, install all the needed packages with the command:
```
yarn
```

After t

## 🎈 Starting the app <a name="starting"></a>

First things first, you need to start runing the yarn app, using the comand: `yarn dev`
Then, a port will appear on your console, this port will be used on the requests.
```
Example: Listening on: http://localhost:8267
```
> Here, the port used on the GET and POST request will be 8267

## 🧬 Routes <a name = "routes"></a>
### To play a match, the first thing you need to do is start it, right? <br> 
### So, to start a match, you can make a GET request with none parameters to the route:
```
/match/create
```
> Parameters: None

### To create a player, make a POST request to the route:
```
/player/create
```
### Request body:
```
{
	"matchId":"<<matchId>>"
}
```
> Parameters: 
>> matchId(String) 

### To create a team, make a POST request to the route:
```
/match/teams/create
```
### Request body:
```
{
	"matchId":"<<matchId>>"
}
```
> Parameters: 
>> matchId(String) 

### To add a player to a specific team, make a POST request to the route:
```
/player/team/add
```
### Request body:
```
{
	"playerId":"<<playerId>>",
	"teamId":"<<teamId>>"
}
```
> Parameters: 
>> matchId(String) <br>
>> teamId(String)

### To shuffle and distribute the deck cards to all players, make a POST request to the route:
```
/events/cards/shuffle
```
### Request body:
```
{
	"matchId":"<<matchId>>"
}
```
> Parameters: 
>> matchId(String)

### If you want to see all the player cards, you can simply GET the route:
```
/player/cards/list/:id
```
And then you'll recieve a response with all the card values, suits, codes and ids

### And after seeing and selecting the target card, you can POST the route:
```
/player/cards/play
```
### Request body:
```
{
	"tableId":"<<tableId>>",
	"card": "<<card>>"
}
```
> Parameters: 
>> matchId(String) <br>
>> card(String)
>>> The card parameter refers to the card id

### To finish a round, make a POST request to the route:
```
/events/rounds/finish
```
### Request body:
```
{
	"tableId":"<<tableId>>",
	"matchId":"<<matchId>>"
}
```
> Parameters: 
>> matchId(String) <br>
>> tableId(String)

### To create a truco poll, you need to POST the route:
``` 
/events/truco
```
### And send a body with this info:
```
{
	"tableId":"<<tableId>>",
	"playerId":"<<playerId>>"
}
```
### If the poll has the vote numbers equals half of the match player count, the truco event will be triggered and the match round value will increase. If the round value is equal to `1`, the new value will be equal to `3`, if the value is `6`, the new will be `9`, and if it is `9`, the new will be `12`, being twelve the max round value

### To clear all the cads in the match, make a POST request to the route:
```
/events/cards/clear
```
### Request body:
```
{
	"matchId":"6166f4a41e3dfbf45a581408"
}
```
> Parameters: 
>> matchId(String)

### To finish a row, make a POST request to the route:
```
/events/rows/finish
```
### Request body:
```
{
	"matchId":"6166f4a41e3dfbf45a581408",
	"tableId":"6166f4a71e3dfbf45a58140b"
}
```
> Parameters: 
>> matchId(String) <br>
>> tableId(String)

## ⛏️ Built Using <a name = "built_using"></a>

- [Typescript](https://www.typescriptlang.org/) - Programming language
- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Yarn](https://yarnpkg.com/) - Package manager
- [Prisma](https://www.prisma.io/) - Database toolkit

## ✍️ Authors <a name = "authors"></a>

- [@IgorDuca](https://github.com/IgorDuca) - Idea & Initial work
