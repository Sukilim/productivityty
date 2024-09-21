import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("HIT")
	if (req.method === 'POST') {
		console.log("test");
		// return res.status(405).json({ message: 'Method not allowed' });

		const { name, desc, sp, assignee, projectId, status } = req.body;

		try {
			const user = await prisma.user.create({
				data: {
					name,
					address,
				},
			});

			return res.status(201).json(user);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error creating user' });
		}
	} else if (req.method === 'GET') {
		if (req.query.id) {
			const taskId = req.query.id;

			try {
				const user = await prisma.user.findUnique({
					where: { id: taskId },
				});

				if (taskId) {

				}
				if (!user) {
					return res.status(404).json({message: 'user not found'});
				}
				return res.status(200).json(user)
			} catch (error) {
				console.error(error)
				return res.status(500).json({message: 'Error retrieving user'});
			}
		} else {
			try {
				const tasks = await prisma.user.findMany();
				return res.status(200).json(tasks);
			} catch (error) {
				console.error(error)
				return res.status(500).json({message: 'Error retrieving user'});
			}
		}
	} else {

		return res.status(405).json({ message: 'Method not allowed' });
	}
}
