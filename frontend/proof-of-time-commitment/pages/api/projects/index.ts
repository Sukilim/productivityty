import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// GET /api/projects
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const projects = await prisma.project.findMany();
    return res.json(projects);
  } else if (req.method === 'POST') {
    const { name, contract } = req.body;
	const contractBuffer = Buffer.from(contract, 'binary');
    const project = await prisma.project.create({ data: { name, contract: contractBuffer.toString('utf8') } });
    return res.json(project);
  } else {
		return res.status(405).json({ error: 'Method not allowed' });
	}
}
