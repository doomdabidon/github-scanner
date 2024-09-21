import crypto from 'crypto';

import { SYMAPHORE_CAPACITY_LIMIT } from '../constants'

export class Simaphore {
  private capacity: number;
  private currentNumberOfLocks = 0;
  private locksQueue: Array<() => any> = [];
  private locksInWorkSet: Set<string> = new Set();

  constructor(limit?: number) {
    this.capacity = limit ?? SYMAPHORE_CAPACITY_LIMIT;
  }

  async aquireLock(): Promise<() => any> {
    const uuid = crypto.randomUUID();
    this.locksInWorkSet.add(uuid);

    const reliseFunction = () => { this.reliseLock(uuid) };

    if (this.currentNumberOfLocks < this.capacity) {
      this.currentNumberOfLocks += 1;
      return new Promise((relise) => relise(reliseFunction));
    } else {
      return new Promise((relise) => {
        this.locksQueue.push(() => relise(reliseFunction))
      });
    }
  }

  private reliseLock(id: string) {
    if (!this.locksInWorkSet.has(id)) {
      return;
    }

    this.currentNumberOfLocks -= 1;

    this.locksInWorkSet.delete(id);

    if (this.currentNumberOfLocks >= this.capacity) {
      return;
    }

    const relise = this.locksQueue.shift()
    if (relise) {
      this.currentNumberOfLocks += 1;
      relise();
    }
  }
}
