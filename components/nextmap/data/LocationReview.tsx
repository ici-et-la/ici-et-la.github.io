import { StringifyOptions } from "querystring";

export interface LocationReview {
    onSelectHandler?: Function,
    locationId?: string,
    id?: string,
    creator?: string,
    summary: string,
    description?: string
 }
