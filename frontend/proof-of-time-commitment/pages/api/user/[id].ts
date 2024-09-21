import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/projects/:id
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const id = req.query.id;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    return res.json(user);
  } else if (req.method === 'PATCH') {
    const id = req.query.id;
    const { name, contract } = req.body;
    const user = await prisma.user.update({ where: { id }, data: { name, contract } });
    return res.json(user);
  } else if (req.method === 'DELETE') {
    const id = req.query.id;
    await prisma.user.delete({ where: { id } });
    return res.status(204).json({ message: 'user deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
