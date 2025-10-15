import { GetItem } from './../services/endpoint/wardorbe';
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
    lastWornAt?: string; 
    imgUrl?: string;
    weatherSuitable?: string;
    condition?: string;
    pattern?: string;
    fabric?: string;
    tag?: string;
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
        color: string;
        aiDescription: string;
        weatherSuitable: string;
        condition: string;
        pattern: string;
        fabric: string;
        imageRemBgURL: string;
    };
}
export interface GetItemResponse {
    statusCode: number;
    message: string;
    data: {
        data: Item[];
    };
    metaData:{
       totalCount: number;
        pageSize: number;
        currentPage: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }
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
    tag?: string;
}
