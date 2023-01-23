import { NextApiRequest, NextApiResponse } from 'next'
import isMobile from 'is-mobile'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ isMobile: isMobile({ ua: req }), agent: req.headers['user-agent'] })
}
