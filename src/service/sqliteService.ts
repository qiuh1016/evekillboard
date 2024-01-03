import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import async from 'async';

interface Character {
    id: number;
    name: string;
}

enum TaskType {
    Insert
}

interface Task {
    type: TaskType,
    name: string,
    id: number
}


export default class SqliteService {
    private static db: Database<sqlite3.Database> | undefined;
    private static isInitialised = false;
    static queue = async.queue((task: Task, completed: () => void) => {
        if (task.type === TaskType.Insert) {
            this.insertCharacter(task.name, task.id).then(() => {
                completed();
            });
        }
    });

    static async init(dbFilePath: string) {
        if (this.isInitialised) return;
        await this.open(dbFilePath);
        await this.createCharacterTable();
    }

    static async open(dbFilePath: string) {
        this.db = await open({
            filename: dbFilePath,
            driver: sqlite3.Database,
        });
    }

    static async createCharacterTable() {
        await SqliteService.run('CREATE TABLE IF NOT EXISTS characters (id integer, name Text)');
    }

    static getDb() {
        return this.db;
    }

    static getIsInitialised() {
        return SqliteService.isInitialised;
    }

    static async run(sql: string, params: any[] = []): Promise<void> {
        await this.db?.run(sql, ...params);
    }

    static addInsertTask(name: string, id: number, callback?: () => void) {
        this.queue.push({
            type: TaskType.Insert,
            name,
            id,
        }).then(callback);
    }

    static async insertCharacter(name: string, id: number): Promise<void> {
        try {
            const character = await this.getCharacter(name);
            if (character) return;
            await this.db?.run('INSERT INTO characters (id, name) VALUES (?, ?)', id, name);
        } catch (e: any) {
            console.error(e);
        }
    }

    static async getCharacter(name: string): Promise<Character | undefined> {
        return await this.db?.get<Character>('SELECT * FROM characters WHERE name = ?', name);
    }

    static async close(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = undefined;
            this.isInitialised = false;
        }
    }
}
