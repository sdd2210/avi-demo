import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalStateService {
    private readonly store = new Map<string, any>();
    /**
     * Creates or updates a dynamic variable globally.
     * @param key The name (key) of the variable to set.
     * @param value The value to assign to the variable.
     */
    set(key: string, value: any): void {
        this.store.set(key, value);
    }

    /**
     * Retrieves the value of a dynamic variable.
     * @param key The name (key) of the variable to retrieve.
     * @returns The value of the variable, or undefined if not found.
     */
    get(key: string): any | undefined {
        return this.store.get(key);
    }

    /**
     * Checks if a dynamic variable exists.
     */
    has(key: string): boolean {
        return this.store.has(key);
    }

    /**
     * Removes a dynamic variable.
     */
    delete(key: string): boolean {
        const deleted = this.store.delete(key);
        if (deleted) {
        console.log(`[DynamicStore] Deleted key: "${key}"`);
        }
        return deleted;
    }
}
