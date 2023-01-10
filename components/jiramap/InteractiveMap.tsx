import { FC, useEffect, useState } from "react";

import Map from "../Map";

import { loctype, MapLocation } from "../../lib/Location";


import 'bootstrap/dist/css/bootstrap.min.css';
import MapNav from "./MapNav";

const useSsrLocalStorage = (key: string, initial: string): [string, React.Dispatch<string>] => {
    if (typeof window === 'undefined') {
        return [initial, (value: string) => undefined ]
    } else {
        return require("react-use-localstorage").default(key, initial);
    }
}

export const InteractiveMap: FC = () => {
    //  const [map, setMap] = useState(<></>);
    const [jiraTokenResponse, setJIRATokenResponse] = useSsrLocalStorage("jiraTokenResponse","");
    const [jiraConfigJson, setJiraConfigJson] = useSsrLocalStorage("jiraConfigJson","");
    const [mapContent, setMapContent] = useState(<>Loading</>)
    useEffect(() => {
        const jira_token = JSON.parse(jiraTokenResponse);
        const jiraConfig = JSON.parse(jiraConfigJson)
        const fetch_options: RequestInit = {
            mode: 'cors',
            headers: new Headers({
                "Origin": document.location.protocol + '//' + document.location.host,
                "Authorization": "Bearer " + jira_token.access_token,
                "Accept": "application/json"
            })
        }
        fetch("https://api.atlassian.com/oauth/token/accessible-resources", fetch_options).then((response) => {
            response.json().then((data) => { 
                console.log(data)
                const cloud_id = data[0].id
                const api_url = jiraConfig["jira.api_url"] + cloud_id + jiraConfig["jira.api_url_suffix"]
                const jql = 'project = "D2" and type in (Ecole, Initiative, Localisation) and status in (Located, "In Progress", REVIEW, ACCEPT) ORDER BY created DESC'
                const locations_url = api_url + "/search?jql=" + encodeURIComponent(jql) + "&maxResults=1000"
                fetch(locations_url, fetch_options).then((response) => {
                    response.json().then((result) => {
                        console.log(result)
                        console.log("issues found")
                        const localisations = result.issues.map((issue: any, key: number) => {
                            try {
                                const location: MapLocation = {
                                    label: issue.fields.summary,
                                    url: issue.fields.customfield_10035,
                                    type: loctype.hasOwnProperty(issue.fields.issuetype.name) ? loctype[issue.fields.issuetype.name] : loctype["Localisation"],
                                    position: [parseFloat(issue.fields.customfield_10039),parseFloat(issue.fields.customfield_10040)]
                                };
    
                                return location;
                            } catch (e) {
                                console.log(issue)
                                console.log(e)
                            }
                        })
                        console.log(localisations)
                        setMapContent(<>
                            <Map locations={localisations}></Map>
                        </>)
                    }).catch((error) => {})
                })
                
            }).catch((error) => {
                console.log(error)
                console.log(response)
                setMapContent(<>Error while fetching data</>)

            })
        })
        //setMap(<MyAwesomeMap></MyAwesomeMap>)
     }, []);
      return (
        <>
        <MapNav></MapNav>
        {mapContent}
        </>
      )
    }

export default InteractiveMap