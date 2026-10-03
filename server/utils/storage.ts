import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config/index.js';

const DATA_DIR = path.resolve(process.cwd(), config.dataDir);

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface BaseDoc {
  _id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export class JsonCollection<T extends BaseDoc> {
  private filePath: string;
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.initFile();
  }

  private initFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  private read(): T[] {
    try {
      this.initFile();
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw || '[]');
    } catch (err) {
      console.error(`Error reading collection ${this.collectionName}:`, err);
      return [];
    }
  }

  private write(data: T[]) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error writing collection ${this.collectionName}:`, err);
    }
  }

  generateId(): string {
    return crypto.randomBytes(12).toString('hex'); // 24-char hex string matching MongoDB ObjectId format
  }

  find(query: Partial<T> = {}): T[] {
    const records = this.read();
    return records.filter((item) => {
      for (const key of Object.keys(query)) {
        if ((item as any)[key] !== (query as any)[key]) {
          return false;
        }
      }
      return true;
    });
  }

  findOne(query: Partial<T>): T | null {
    const records = this.read();
    for (const item of records) {
      let match = true;
      for (const key of Object.keys(query)) {
        if ((item as any)[key] !== (query as any)[key]) {
          match = false;
          break;
        }
      }
      if (match) return item;
    }
    return null;
  }

  findById(id: string): T | null {
    const records = this.read();
    return records.find((item) => item._id === id) || null;
  }

  create(docData: Omit<T, '_id' | 'createdAt' | 'updatedAt'> & Partial<BaseDoc>): T {
    const records = this.read();
    const now = new Date().toISOString();
    const newDoc = {
      ...docData,
      _id: docData._id || this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as unknown as T;

    records.unshift(newDoc);
    this.write(records);
    return newDoc;
  }

  findByIdAndUpdate(id: string, updateData: Partial<T>): T | null {
    const records = this.read();
    const index = records.findIndex((item) => item._id === id);
    if (index === -1) return null;

    const updatedDoc: T = {
      ...records[index],
      ...updateData,
      _id: id, // Immutable
      updatedAt: new Date().toISOString(),
    };

    records[index] = updatedDoc;
    this.write(records);
    return updatedDoc;
  }

  findByIdAndDelete(id: string): boolean {
    const records = this.read();
    const filtered = records.filter((item) => item._id !== id);
    if (filtered.length === records.length) {
      return false;
    }
    this.write(filtered);
    return true;
  }

  count(query: Partial<T> = {}): number {
    return this.find(query).length;
  }
}
