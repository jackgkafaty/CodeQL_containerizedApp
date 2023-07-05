import { Request, Response } from 'express'
import { sanitize } from 'mongo-sanitize'

import { challenges } from '../data/datacache'
import { db } from '../data/mongodb'

export function trackOrder(): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    const id = sanitize(req.params.id)

    if (!/^[a-zA-Z0-9-]+$/.test(id)) {
      res.status(400).json({ error: 'Invalid order ID' })
      return
    }

    db.orders.findOne({ orderId: id }).then((order: any) => {
      if (!order) {
        order = { orderId: id }
      }

      const result = { data: [order] }
      res.json(result)

      challengeUtils.solveIf(challenges.noSqlOrdersChallenge, () => {
        return result.data.length > 1
      })
    }, () => {
      res.status(400).json({ error: 'Wrong Param' })
    })
  }
}
