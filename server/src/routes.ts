import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

//instantcia da classe de insert do points
const pointsController = new PointsController();
const itemsController = new ItemsController();

//desaclopando rotas do servidor (server.ts)
const routes = express.Router();

routes.get('/', (req, res) => {
  return res.json({
    name: 'Next Level Week - API',
    version: '0.0.1',
    developer: 'Marques, Willyan'
  })
});

routes.get('/items', itemsController.index);
routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;