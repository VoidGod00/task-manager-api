const { getTaskById, getAllTask, updateTask, deleteTask, createTask } = require('../controllers/task-controller');
const authenticate = require('../middleware/authenticate');
const { validateCreateTask, validateUpdateTask } = require('../validators');


const router = require('express').Router();

router.use(authenticate);

router.post('/', validateCreateTask, createTask);
router.get('/', getAllTask);
router.get('/:id', getTaskById);

router.patch('/:id', validateUpdateTask, updateTask);

router.delete('/:id', deleteTask);

module.exports = router;