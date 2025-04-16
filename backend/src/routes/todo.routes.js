import { Router } from 'express';
import todoController from '../controllers/todo.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/')
    .post(todoController.createTodo)
    .get(todoController.getAllTodos);

router.route('/:todoId')
    .patch(todoController.updateTodoStatus)
    .delete(todoController.deleteTodo);

export default router;