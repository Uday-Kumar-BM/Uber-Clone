import asyncHandler from '../utils/asyncHandler.js';
import { errorHandler } from '../middleware/errorMiddleware.js';

// This factory creates a generic CRUD controller for any Sequelize model.
const createGenericController = (Model) => {
  const modelName = Model.name;

  // @desc    Create new item
  // @route   POST /api/<model-name>
  // @access  Private/Admin (customize as needed)
  const createItem = asyncHandler(async (req, res, next) => {
    // Basic access control: Only admin can create for generic models by default
    if (req.user.userType !== 'admin') {
      return errorHandler(res, 403, `Not authorized to create ${modelName} entries.`);
    }

    const item = await Model.create(req.body);
    res.status(201).json(item);
  });

  // @desc    Get all items
  // @route   GET /api/<model-name>
  // @access  Private/Admin (customize as needed)
  const getItems = asyncHandler(async (req, res, next) => {
    // Basic access control: Only admin can view all for generic models by default
    if (req.user.userType !== 'admin') {
      return errorHandler(res, 403, `Not authorized to view all ${modelName} entries.`);
    }

    const items = await Model.findAll();
    res.status(200).json(items);
  });

  // @desc    Get single item by ID
  // @route   GET /api/<model-name>/:id
  // @access  Private/Admin (customize as needed)
  const getItemById = asyncHandler(async (req, res, next) => {
    // Basic access control: Only admin can view by ID for generic models by default
    if (req.user.userType !== 'admin') {
      return errorHandler(res, 403, `Not authorized to view ${modelName} entries.`);
    }

    const item = await Model.findByPk(req.params.id);
    if (item) {
      res.status(200).json(item);
    } else {
      errorHandler(res, 404, `${modelName} not found`);
    }
  });

  // @desc    Update item
  // @route   PUT /api/<model-name>/:id
  // @access  Private/Admin (customize as needed)
  const updateItem = asyncHandler(async (req, res, next) => {
    // Basic access control: Only admin can update for generic models by default
    if (req.user.userType !== 'admin') {
      return errorHandler(res, 403, `Not authorized to update ${modelName} entries.`);
    }

    const item = await Model.findByPk(req.params.id);
    if (item) {
      await item.update(req.body);
      res.status(200).json(item);
    } else {
      errorHandler(res, 404, `${modelName} not found`);
    }
  });

  // @desc    Delete item
  // @route   DELETE /api/<model-name>/:id
  // @access  Private/Admin (customize as needed)
  const deleteItem = asyncHandler(async (req, res, next) => {
    // Basic access control: Only admin can delete for generic models by default
    if (req.user.userType !== 'admin') {
      return errorHandler(res, 403, `Not authorized to delete ${modelName} entries.`);
    }

    const item = await Model.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      res.status(200).json({ message: `${modelName} removed` });
    } else {
      errorHandler(res, 404, `${modelName} not found`);
    }
  });

  return { createItem, getItems, getItemById, updateItem, deleteItem };
};

export default createGenericController;
