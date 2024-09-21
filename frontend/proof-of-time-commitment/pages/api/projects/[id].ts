import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/projects/:id
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const id = req.query.id;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(project);
  } else if (req.method === 'PATCH') {
    const id = req.query.id;
    const { name, contract } = req.body;
    const project = await prisma.project.update({ where: { id }, data: { name, contract } });
    return res.json(project);
  } else if (req.method === 'DELETE') {
    const id = req.query.id;
    await prisma.project.delete({ where: { id } });
    return res.status(204).json({ message: 'Project deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
