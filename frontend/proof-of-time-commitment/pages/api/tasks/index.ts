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
			const task = await prisma.task.create({
				data: {
					name,
					desc,
					sp,
					assignee,
					project: { connect: { id: projectId } },
					status,
				},
			});

			return res.status(201).json(task);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error creating task' , error: error});
		}
	} else if (req.method === 'GET') {
		if (req.query.id) {
			const taskId = req.query.id;

			try {
				const task = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (taskId) {

				}
				if (!task) {
					return res.status(404).json({message: 'Task not found'});
				}
				return res.status(200).json(task)
			} catch (error) {
				console.error(error)
				return res.status(500).json({message: 'Error retrieving task', error: error});
			}
		} else {
			try {
				const tasks = await prisma.task.findMany();
				return res.status(200).json(tasks);
			} catch (error) {
				console.error(error)
				return res.status(500).json({message: 'Error retrieving task', error: error});
			}
		}
	} else {

		return res.status(405).json({ message: 'Method not allowed' });
	}
}
