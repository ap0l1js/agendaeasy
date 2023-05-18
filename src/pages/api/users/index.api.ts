import { prisma } from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'nookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, username } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  // eslint-disable-next-line no-console
  console.log('userExists: ', userExists);

  if (userExists) {
    return res.status(400).json({
      message: 'Username already exists.',
    });
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  setCookie({ res }, '@agendaeasy:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return res.status(201).json(user);
}
