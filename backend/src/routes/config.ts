import { Router } from 'express';
import { config } from '../config';

export function createConfigRouter() {
  const router = Router();
  router.get('/', (_req, res) => {
    res.json({
      mapboxToken: config.mapboxToken,
      apiBaseUrl: config.apiBaseUrl,
    });
  });

  router.post('/', (req, res) => {
    res.json({ received: req.body });
  });

  return router;
}
