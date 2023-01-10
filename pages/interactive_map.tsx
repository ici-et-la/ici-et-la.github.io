import { NextPage } from "next"
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AtlassianProtectedPage } from "../components/auth/AtlassianProtectedPage"

const sheet_id = "1gd4w1x8qWrIxgb0_NuHqrOV4TeiluY5jzMnSSg2JmMo";
const client_id = "657764290407-71f2h1ri3k173p5tnr4ja19rhgage90s.apps.googleusercontent.com";
const settings_name = "dev.settings"


const InteractiveMap = dynamic(() => import("../components/jiramap/InteractiveMap"), { ssr:false });



const InteractiveMapPage: NextPage = () => {
    const [sheetId,setSheetId] = useState()
    const [settingsTabName,setSettingsTabName] = useState()

    useEffect(() => {
        fetch("/settings.json").then((response) => {
            response.json().then((data) => {
                setSheetId(data['sheetId'])
                setSettingsTabName(data['settingsTabName'])
            })
        })
    }, [setSheetId,setSettingsTabName])
    return (<>
    <AtlassianProtectedPage google_sheet_id={sheet_id} settings_tab_name={settings_name}>
        <InteractiveMap></InteractiveMap>
    </AtlassianProtectedPage>
    </>)
}
export default InteractiveMapPage
    