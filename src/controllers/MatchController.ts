import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

import CardAlgorithm from "../logic/CardAlgorithm";

const prisma = new PrismaClient()

interface deckFetchInterface {
    deck_id: string
}

interface cardInterface {
    value: string,
    suit: string,
    code: string
}

interface cardFetchInterface {
    cards: Array<cardInterface>
}

interface teamInterface {
    teamId: string,
    id: string
}

class MatchControler {
    public async createMatch (req: Request, res: Response): Promise<Response> {

        const deckFetch = axios.get<deckFetchInterface>("https://deckofcardsapi.com/api/deck/new/shuffle/?cards=2S,2D,2C,2H,3S,3D,3C,3H,4S,4D,4C,4H,5S,5D,5C,5H,6S,6D,6C,6H,7S,7D,7C,7H,QS,QD,QC,QH,JS,JD,JC,JH,KS,KD,KC,KH,AS,AD,AC,AH")

        const deckId = (await deckFetch).data.deck_id

        const createdMatch = await prisma.match.create({
            data: {
                deck: deckId
            }
        })

        var createdId = createdMatch.id

        const createdTeam = await prisma.team.create({
            data: {
                matchId: createdId
            }
        })
        
        await prisma.player.create({
            data: {
                matchId: createdId,
                teamId: createdTeam.id
            }
        })

        await prisma.table.create({
            data: {
                matchId: createdId
            }
        })

        var foundMatch = await prisma.match.findUnique({
            where: {
                id: createdId
            },
            include: {
                players: true,
                teams: true,
                table: true
            }
        })

        return res.json(foundMatch).status(200)
    }

    public async createTeam (req: Request, res: Response): Promise<Response> {
        const createdTeam = await prisma.team.create({
            data: {
                matchId: req.body.matchId
            }
        })

        return res.json(createdTeam).status(200)
    }

    public async shuffleCards (req: Request, res: Response): Promise<Response> {
        const matchId = req.body.matchId

        var foundMatch = await prisma.match.findUnique({
            where: {
                id: matchId
            },
            include: {
                players: true,
                cards: true
            }
        })

        await axios.get(`https://deckofcardsapi.com/api/deck/${foundMatch?.deck}/shuffle/`)

        if(foundMatch === null) return res.json({ sucess: false, message:"match not found" }).status(404)

        const playersId = foundMatch?.players.map(player => {
            return player.id
        })

        playersId.map(async id => {
            const cardFetching = await axios.get<cardFetchInterface>(`https://deckofcardsapi.com/api/deck/${foundMatch?.deck}/draw/?count=3`)

            const cards = cardFetching.data.cards.map(card => {
                return {
                    code: card.code,
                    value: card.value,
                    suit: card.suit
                }
            })

            await prisma.cards.createMany({
                data: [
                    {
                        ownerId: id,
                        value: cards[0].value,
                        suit: cards[0].suit,
                        code: cards[0].code,
                        matchId: matchId
                    },
                    {
                        ownerId: id,
                        value: cards[1].value,
                        suit: cards[1].suit,
                        code: cards[1].code,
                        matchId: matchId
                    },
                    {
                        ownerId: id,
                        value: cards[2].value,
                        suit: cards[2].suit,
                        code: cards[2].code,
                        matchId: matchId
                    }
                ]
            })
        })

        return res.json({ success: true, message:`giving new cards to players: ${playersId.join(', ')}` }).status(200)
    }

    public async clearCards (req: Request, res: Response): Promise<Response> {
        const matchId = req.body.matchId

        await prisma.cards.deleteMany({
            where: { matchId: matchId }
        })

        var foundMatch = await prisma.match.findUnique({
            where: {
                id: matchId
            },
            include: {
                cards: true
            }
        })

        return res.json(foundMatch).status(200)
    }
    
    public async finishRound (req: Request, res: Response): Promise<Response> {
        const matchId = req.body.matchId
        const tableId = req.body.tableId

        const foundTable = await prisma.table.findUnique({
            where: { id: tableId },
            include: {
                cards: true
            }
        })

        const foundMatch = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                players: true
            }
        })

        var cardLength = foundTable?.cards?.length
        if(cardLength === undefined) cardLength = 0

        var playerLength = foundMatch?.players?.length
        if(playerLength === undefined) playerLength = 0

        if(cardLength < playerLength) return res.json({ success: false, message:`table needs ${playerLength - cardLength} more cards to finish the round` })

        const values: any = foundTable?.cards.map(card => {
            const finalValue = CardAlgorithm.giveCardValue(card.code, card.ownerId)

            return finalValue
        })

        var higherCard

        if(values[0].value === values[1].value) {
            if(values[0].suitPriority < values[1].suitPriority) higherCard = values[0]
            else higherCard = values[1]
        }
        else {
            if(values[0].valuePriority < values[1].valuePriority) higherCard = values[0]
            else higherCard = values[1]
        }

        const winnerPlayer = await prisma.player.findUnique({
            where: { id: higherCard.playerId },
            include: { team: true }
        })

        const foundTeam = await prisma.team.findUnique({where:{id: extractId(winnerPlayer)}})

        var roundPoints = foundTeam?.round
        if(roundPoints == undefined || null) roundPoints = 0
        roundPoints = roundPoints + 1

        await prisma.team.update({
            where: { id: extractId(winnerPlayer) },
            data: {
                round: roundPoints
            }
        })

        return res.json({ success: true, message: `the team ${extractId(winnerPlayer)} won another round and now have ${roundPoints} round points` }).status(200)
    }

    public async finishRow (req: Request, res: Response): Promise<Response> {
        const matchId = req.body.matchId
        const tableId = req.body.tableId

        const foundMatch = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                teams: true,
                table: true
            }
        })

        var teamOneRound = foundMatch?.teams[0].round
        if(teamOneRound == undefined || null) teamOneRound = 0

        var teamTwoRound = foundMatch?.teams[1].round
        if(teamTwoRound == undefined || null) teamTwoRound = 0

        var winnerTeam

        if(teamOneRound > teamTwoRound) winnerTeam = foundMatch?.teams[0]
        else winnerTeam = foundMatch?.teams[1]

        const foundTeam = await prisma.team.findUnique({
            where: { id: returningId(winnerTeam?.id) }
        })

        const foundTable = await prisma.table.findUnique({
            where: { id: tableId }
        })

        var teamPoints = foundTeam?.points
        if(teamPoints == undefined || null) teamPoints = 0

        var roundValue = foundTable?.roundValue
        if(roundValue == undefined || null) roundValue = 0

        var finalPoints = teamPoints + roundValue

        await prisma.team.update({
            where: { id: returningId(winnerTeam?.id) },
            data: {
                round: 0,
                points: finalPoints
            }
        })

        return res.json({ success: true, message: `the winner team ${winnerTeam?.id} now have ${finalPoints} points in score` }).status(200)
    }
}

export default new MatchControler()

function extractId(winnerPlayer: any) {
    return winnerPlayer.teamId
}

function returningId(id: any) { return id }