import { Router } from 'express'

const routes = Router()

import MatchController  from "./controllers/MatchController"
import PlayerController from "./controllers/PlayerController"

// Creation functions
routes.get('/match/create', MatchController.createMatch)
routes.post('/player/create', PlayerController.addPlayer)
routes.post('/match/teams/create', MatchController.createTeam)
routes.post('/player/team/add', PlayerController.addToTeam)

// Game events
routes.post('/events/cards/shuffle', MatchController.shuffleCards)
routes.post('/events/rounds/finish', MatchController.finishRound)
routes.post('/events/cards/clear', MatchController.clearCards)
routes.post('/events/rows/finish', MatchController.finishRow)
routes.post('/events/truco', MatchController.truco)

// Misc functions
routes.get('/player/cards/list/:id', PlayerController.fetchCards)

// Player events
routes.post('/player/cards/play', PlayerController.playCard)

export default routes
