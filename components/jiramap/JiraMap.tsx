import dynamic from "next/dynamic";
import { FC, useEffect, useState } from "react";
import { JiraHelperImpl } from "../../lib/jira_helper";
import { MapDataHelper } from "../nextmap/MapDataHelper";

const MapPlotEditor = dynamic(() => import("../nextmap/MapPlotEditor"), { ssr:false });


const useSsrLocalStorage = (key: string, initial: string): [string, React.Dispatch<string>] => {
    if (typeof window === 'undefined') {
        return [initial, (value: string) => undefined ]
    } else {
        return require("react-use-localstorage").default(key, initial);
    }
}

export const JiraMap: FC = () => {
    const [jiraTokenResponse, setJIRATokenResponse] = useSsrLocalStorage("jiraTokenResponse","");
    const [jiraConfigJson, setJiraConfigJson] = useSsrLocalStorage("jiraConfigJson","");
    const [pageContent, setPageContent] = useState(<></>)
    useEffect(() => {
        const jira_token = JSON.parse(jiraTokenResponse);
        const jiraConfig = JSON.parse(jiraConfigJson)
        const helper = new JiraHelperImpl(jiraConfig, jira_token);
        setPageContent(<MapPlotEditor dataHelper={helper}/>)

    }, [jiraTokenResponse,jiraConfigJson])

    return(<>{pageContent}</>)
}

export default JiraMap