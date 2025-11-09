//=====================Request=========================//

// Color object structure
export interface ColorItem {
    name: string;
    hex: string;
}

export interface AddItemRequest{ 
   id: number;
    userId: number;
    userDisplayName: string;
    name: string;
    categoryId: number;
    categoryName: string;
    color?: string;
    brand?: string;
    frequencyWorn?: string;
    lastWornAt?: string;
    imgUrl?: string;
    weatherSuitable?: string;
    condition?: string;
    pattern?: string;
    fabric?: string;
    isAnalyzed: boolean;
    aiConfidence: number;
    occasions: Array<{ id: number; name: string }>;
    seasons: Array<{ id: number; name: string }>;
    styles: Array<{ id: number; name: string }>;
}
   

export interface AnalyzeItemRequest {
    file: any; 
}

export interface GetItemRequest {
    pageIndex: number;
    pageSize: number;
    userId: number;
    takeAll?: boolean;
    search?: string;
    isAnalyzed?: boolean;
    categoryId?: number;
    seasonId?: number;
    styleId?: number;
    occasionId?: number;
    sortByDate?: string;
}
//=====================Response=========================//
export interface AddItemResponse {
    statusCode: number;
    message: string;
    data: Item;
}
export interface AnalyzeItemResponse {
    statusCode: number;
    message: string;
    data: {
       itemIds: number[];
       confidence: number;
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
    brand?: string;
    frequencyWorn?: string;
    lastWornAt?: string; // ISO date string
    imgUrl?: string;
    weatherSuitable?: string;
    condition?: string;
    pattern?: string;
    fabric?: string;
    isAnalyzed: boolean; // Whether item has been analyzed
    aiConfidence?: number; // AI confidence score (0-100)
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