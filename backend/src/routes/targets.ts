import { Router } from 'express';
import { Target } from '../models/target';

export class TargetsStore {
  private targets: Target[] = [];

  setTargets(targets: Target[]) {
    this.targets = targets;
  }

  addTarget(target: Target) {
    this.targets.push(target);
  }

  all() {
    return this.targets;
  }

  isTarget(id: string) {
    return this.targets.some((t) => t.id.toLowerCase() === id.toLowerCase());
  }
}

export function createTargetsRouter(store: TargetsStore) {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(store.all());
  });

  router.post('/', (req, res) => {
    const target = req.body as Target;
    store.addTarget(target);
    res.json({ ok: true });
  });

  return router;
}
