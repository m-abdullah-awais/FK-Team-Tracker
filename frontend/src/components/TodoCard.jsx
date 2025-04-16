import React, { useState, useEffect } from 'react';
import { Card, Typography, Box, Divider, TextField, Button, Stack, Checkbox, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import todoService from '../services/todoService';
import { useSnackbar } from '../contexts/SnackbarContext';

const TodoCard = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      showSnackbar('Failed to fetch todos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setTask(e.target.value);

  const handleAddTask = async () => {
    if (!task.trim()) return;

    try {
      const newTodo = await todoService.createTodo(task);
      setTodos([newTodo, ...todos]);
      setTask('');
      showSnackbar('Task added successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to add task', 'error');
    }
  };

  const handleToggleStatus = async (todo) => {
    try {
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      const updatedTodo = await todoService.updateTodoStatus(todo._id, newStatus);
      setTodos(todos.map(t => t._id === todo._id ? updatedTodo : t));
    } catch (error) {
      showSnackbar('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (todoId) => {
    try {
      await todoService.deleteTodo(todoId);
      setTodos(todos.filter(todo => todo._id !== todoId));
      showSnackbar('Task deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to delete task', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper', p: 3, width: "100%" }}>
      <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
        To-Do List
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          variant="outlined"
          fullWidth
          label="Add a new task"
          value={task}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTask}
          sx={{ height: '56px' }}
        >
          <AddIcon />
        </Button>
      </Box>

      <Stack spacing={1}>
        {todos && todos.map((todo) => (
          <Box key={todo._id} display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Checkbox
                checked={todo.status === 'completed'}
                onChange={() => handleToggleStatus(todo)}
              />
              <Typography
                variant="body2"
                sx={{
                  textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                  color: todo.status === 'completed' ? 'text.secondary' : 'text.primary',
                }}
              >
                {todo.title}
              </Typography>
            </Box>
            <Button
              color="error"
              size="small"
              onClick={() => handleDeleteTask(todo._id)}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

export default TodoCard;