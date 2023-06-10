import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/libs/prisma'
import { setCookie } from 'nookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userAlreadyExists) {
    return res.status(400).json({
      message: 'User already taken',
    })
  }

  const response = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@ignitecall:userId', response.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  res.status(201).json(response)
}
