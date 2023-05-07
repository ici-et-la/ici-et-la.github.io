import { NextPage } from "next"
import { MapInterface } from "../components/nextmap/MapInterface"
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import { InteractiveMapSideBar } from "../components/nextmap/InteractiveMapSidebar";
import { MapDataHelper } from "../components/nextmap/MapDataHelper";
import { MapLocation } from "../components/nextmap/MapLocation";

const MapPlotEditor = dynamic(() => import("../components/nextmap/MapPlotEditor"), { ssr:false });

class TestDataHelper implements MapDataHelper {
    getUnlocatedLocations(): Promise<MapLocation[]> {
        throw new Error("Method not implemented.");
    }
    createLocation(name: string, url: string, google_maps_url: string, locationtype?: string | undefined): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getLocation(id: string): Promise<MapLocation> {
        throw new Error("Method not implemented.");
    }
    getLocations(): Promise<MapLocation[]> {
        return new Promise<MapLocation[]>((resolve) => {
            const result1: MapLocation = {
                id: "0",
                label: "Test1",
                position: [0 , 0]
            }
            const result2: MapLocation = {
                id: "1",
                label: "Paris",
                position: [48.8589466,2.2769955]
            }
            resolve ([
                result1, result2
            ])
        })
    }
    updateLocation(location: MapLocation): Promise<any> {
        throw new Error("Method not implemented.");
    }
    ready: Promise<MapDataHelper> =  new Promise<MapDataHelper> ((resolve) => {
        return resolve(this);
    }); 
    
}

const test_components: NextPage = (props) => {
    const helper: TestDataHelper = new TestDataHelper()
    return <>
        <MapPlotEditor dataHelper={helper}></MapPlotEditor>
    </>
}

export default test_components