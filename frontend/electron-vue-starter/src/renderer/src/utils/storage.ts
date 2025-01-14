type StorageType = 'localStorage' | 'sessionStorage';

export class Storage {
    private storage: globalThis.Storage;

    constructor(type: StorageType = 'localStorage') {
        this.storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
    }

    /**
     * 设置存储项
     * @param key 键名
     * @param value 值
     */
    set<T = any>(key: string, value: T): void {
        try {
            const stringValue = JSON.stringify(value);
            this.storage.setItem(key, stringValue);
        } catch (error) {
            console.error('Storage set error:', error);
        }
    }

    /**
     * 获取存储项
     * @param key 键名
     * @param defaultValue 默认值
     */
    get<T = any>(key: string, defaultValue?: T): T | undefined {
        try {
            const item = this.storage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }

    /**
     * 移除存储项
     * @param key 键名
     */
    remove(key: string): void {
        this.storage.removeItem(key);
    }

    /**
     * 清空所有存储项
     */
    clear(): void {
        this.storage.clear();
    }

    /**
     * 获取所有键名
     */
    keys(): string[] {
        return Object.keys(this.storage);
    }

    /**
     * 获取存储项数量
     */
    get length(): number {
        return this.storage.length;
    }

    /**
     * 检查是否存在某个键
     * @param key 键名
     */
    has(key: string): boolean {
        return this.storage.getItem(key) !== null;
    }
}

// 创建默认实例
export const localStorage = new Storage('localStorage');
export const sessionStorage = new Storage('sessionStorage');
