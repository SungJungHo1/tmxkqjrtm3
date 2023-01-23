// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
  points: number
  grade: 'NORMAL' | 'PREMIUM'
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log(req.query.id)
  const names = req.query.id.toString()
  res.status(200).json({
    name: names,
    points: 0,
    grade: 'NORMAL',
  })
}