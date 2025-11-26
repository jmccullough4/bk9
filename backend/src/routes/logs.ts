import { Router } from 'express';
import { LogService } from '../logs/logService';

export function createLogsRouter(logService: LogService) {
  const router = Router();

  router.get('/export', (_req, res) => {
    res.json(logService.list());
  });

  return router;
}
