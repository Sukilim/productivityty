import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/projects/:id
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const id = req.query.id;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }
    return res.json(task);
  } else if (req.method === 'PATCH') {
    const id = req.query.id;
    const { name, contract } = req.body;
    const task = await prisma.task.update({ where: { id }, data: { name, contract } });
    return res.json(task);
  } else if (req.method === 'DELETE') {
    const id = req.query.id;
    await prisma.task.delete({ where: { id } });
    return res.status(204).json({ message: 'task deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
