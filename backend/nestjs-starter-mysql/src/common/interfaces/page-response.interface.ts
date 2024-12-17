export interface PageResponse<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}
