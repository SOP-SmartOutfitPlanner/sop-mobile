//=====================Request=========================//
export interface AddItemRequest{ 
    userId: number;
    name: string;
    categoryId: number;
    categoryName: string;
    color?: string;
    aiDescription?: string;
    brand?: string;
    frequencyWorn?: string;
    lastWornAt?: string; // ISO date string
    imgUrl?: string;
    weatherSuitable?: string;
    condition?: string;
    pattern?: string;
    fabric?: string;
    styleIds: number[];
    occasionIds: number[];
    seasonIds: number[];
}
  
export interface SummaryItemRequest {
    file: any; 
}

export interface GetItemRequest {
    pageIndex: number;
    pageSize: number;
    userId: number;
}
//=====================Response=========================//
export interface AddItemResponse {
    statusCode: number;
    message: string;
    data: Item;
}
export interface SummaryItemResponse {
    statusCode: number;
    message: string;
    data: {
        name: string;
        colors: {
            name: string;
            hex: string;
        }[];
        aiDescription: string;
        weatherSuitable: string;
        condition: string;
        pattern: string;
        fabric: string;
        imageRemBgURL: string;
        category: {
            id: number;
            name: string;
        };
        styles: {
            id: number;
            name: string;
        }[];
        occasions: {
            id: number;
            name: string;
        }[];
        seasons: {
            id: number;
            name: string;
        }[];
    };
}
export interface GetItemResponse {
    statusCode: number;
    message: string;
    data: {
        data: Item[];
        metaData: {
            totalCount: number;
            pageSize: number;
            currentPage: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        }
    };
}
export interface EditItemRequest {
    id: number;
    data: Partial<Item>;
}

//============== Item returned from API========================//
export interface Item {
    id: number;
    userId: number;
    userDisplayName: string;
    name: string;
    categoryId: number;
    categoryName: string;
    color?: string;
    aiDescription?: string;
    brand?: string;
    frequencyWorn?: string;
    lastWornAt?: string; // ISO date string
    imgUrl?: string;
    weatherSuitable?: string;
    condition?: string;
    pattern?: string;
    fabric?: string;
    styles: Array<{ id: number; name: string }>;
    occasions: Array<{ id: number; name: string }>;
    seasons: Array<{ id: number; name: string }>;
}
export interface ItemEdit{
    userId: number;
    name: string;
    categoryId: number;
    categoryName: string;
    color?: string;
    aiDescription?: string;
    brand?: string;
    frequencyWorn?: string;
    lastWornAt?: string; 
    imgUrl: string;
    weatherSuitable?: string;
    condition?: string;
    pattern?: string;
    fabric?: string;
    styleIds: number[];
    occasionIds: number[];
    seasonIds: number[];
}