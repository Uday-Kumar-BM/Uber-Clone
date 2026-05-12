import express from 'express';
import createGenericController from '../controllers/genericController.js';
import { isAuthenticated, hasRole } from '../middleware/auth.js';

// This factory creates a generic CRUD router for any Sequelize model.
// By default, all operations are restricted to 'admin'. Customize as needed.
export const genericRoutesFactory = (Model) => {
  const router = express.Router();
  const { createItem, getItems, getItemById, updateItem, deleteItem } = createGenericController(Model);

  router.route('/')
    .post(isAuthenticated, hasRole(['admin']), createItem) // Only admin can create by default
    .get(isAuthenticated, hasRole(['admin']), getItems);    // Only admin can list by default

  router.route('/:id')
    .get(isAuthenticated, hasRole(['admin']), getItemById)   // Only admin can get by ID by default
    .put(isAuthenticated, hasRole(['admin']), updateItem)    // Only admin can update by ID by default
    .delete(isAuthenticated, hasRole(['admin']), deleteItem); // Only admin can delete by ID by default

  return router;
};
