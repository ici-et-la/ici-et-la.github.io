import { LocationReview } from "./data/LocationReview"
import { MapLocation } from "./data/MapLocation"

export interface MapDataHelper {
    createLocation(name: string, url: string, google_maps_url: string, locationtype?: string): Promise<any>
    getLocation(id: string): Promise<MapLocation>
    getLocations(): Promise<Array<MapLocation>>
    updateLocation(location: MapLocation): Promise<any>
    getReview(id: string): Promise<LocationReview>
    createReview(review: LocationReview): Promise<any>
    updateReview(review: LocationReview): Promise<any>
    ready: Promise<MapDataHelper>
    getUnlocatedLocations(): Promise<Array<MapLocation>>
}