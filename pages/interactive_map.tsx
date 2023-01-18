import { NextPage } from "next"
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AtlassianProtectedPage } from "../components/auth/AtlassianProtectedPage"

const JiraMap = dynamic(() => import("../components/jiramap/JiraMap"), { ssr:false });



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
    <AtlassianProtectedPage google_sheet_id={sheetId} settings_tab_name={settingsTabName}>
        <JiraMap></JiraMap>
    </AtlassianProtectedPage>
    </>)
}
export default InteractiveMapPage
    