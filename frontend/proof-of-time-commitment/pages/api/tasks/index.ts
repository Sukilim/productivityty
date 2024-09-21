import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("HIT")
	if (req.method === 'POST') {
		console.log("test");
		// return res.status(405).json({ message: 'Method not allowed' });

		const { name, desc, sp, assignee, projectId, status, manager } = req.body;

		try {
			const task = await prisma.task.create({
				data: {
					name,
					desc,
					sp,
					assignee,
					project: { connect: { id: projectId } },
					status,
					manager,
				},
			});

			return res.status(201).json(task);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error creating task' });
		}
	// } else if (req.method === 'GET') {
	// 	if (req.query.id) {
	// 		const taskId = req.query.id;
	//
	// 		try {
	// 			const task = await prisma.task.findUnique({
	// 				where: { id: taskId },
	// 			});
	//
	// 			if (taskId) {
	//
	// 			}
	// 			if (!task) {
	// 				return res.status(404).json({message: 'Task not found'});
	// 			}
	// 			return res.status(200).json(task)
	// 		} catch (error) {
	// 			console.error(error)
	// 			return res.status(500).json({message: 'Error retrieving task'});
	// 		}
	// 	} else {
	// 		try {
	// 			const tasks = await prisma.task.findMany();
	// 			return res.status(200).json(tasks);
	// 		} catch (error) {
	// 			console.error(error)
	// 			return res.status(500).json({message: 'Error retrieving task'});
	// 		}
	// 	}
	} else if (req.method === 'GET') {
			try {
				const tasks = await prisma.task.findMany();

				const todoTasks = tasks.filter(task => task.status === 'todo');
				const inProgressTasks = tasks.filter(task => task.status === 'in progress');
				const reviewTasks = tasks.filter(task => task.status === 'review');
				const doneTasks = tasks.filter(task => task.status === 'done');

				const containers = [
					{ title: 'Todo', id: `container-${uuidv4()}`, items: todoTasks.map(task => ({...task,title: task.name})) },
					{ title: 'In progress', id: `container-${uuidv4()}`, items: inProgressTasks.map(task => ({...task,title: task.name})) },
					{ title: 'Review', id: `container-${uuidv4()}`, items: reviewTasks.map(task => ({...task,title: task.name})) },
					{ title: 'Done', id: `container-${uuidv4()}`, items: doneTasks.map(task => ({...task,title: task.name})) },
				];

				return res.status(200).json(containers);
			} catch (error) {
				console.error(error);
				return res.status(500).json({ message: 'Error retrieving tasks' });
			}
		} else {

		return res.status(405).json({ message: 'Method not allowed' });
	}
}
