import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class PlayerController {
    public async addPlayer(req: Request, res: Response): Promise<Response> {
        const matchId = req.body.matchId

        await prisma.player.create({
            data: {
                matchId: matchId
            }
        })

        var foundMatch = await prisma.match.findUnique({
            where: {
                id: matchId
            },
            include: {
                players: true
            }
        })

        return res.json(foundMatch).status(200)
    }

    public async addToTeam (req: Request, res: Response): Promise<Response> {
        const playerUpdate = await prisma.player.update({
            where: { id: req.body.playerId },
            data: {
                teamId: req.body.teamId
            }
        })

        return res.json(playerUpdate).status(200)
    }

    public async fetchCards(req: Request, res: Response): Promise<Response> {
        const cards = await prisma.cards.findMany({
            where: { ownerId: req.params.id }
        })

        return res.json(cards).status(200)
    }

    public async playCard(req: Request, res: Response): Promise<Response> {
        const card = req.body.card
        const tableId = req.body.tableId

        const foundTable = await prisma.table.findUnique({
            where: { id: tableId },
            include: { cards: true }
        })

        const foundMatch = await prisma.match.findUnique({
            where: { id: foundTable?.matchId },
            include: { players: true }
        })

        if(foundTable?.cards.length === foundMatch?.players.length) return res.json({ success: false, message:"max card length exceeded" }).status(500)

        const targetCard = await prisma.cards.findUnique({
            where: { id: card }
        })

        if(targetCard === null) return res.json({ sucess: false, message:"card not found" }).status(500)

        if(targetCard?.tableId != null) return res.json({ sucess: false, message:"card already played" }).status(500)

        var cardUpdate = await prisma.cards.update({
            where: { id: card },
            data: {
                tableId: tableId
            }
        })

        return res.json({ success: true, cardUpdate }).status(200)
    }
}

export default new PlayerController()