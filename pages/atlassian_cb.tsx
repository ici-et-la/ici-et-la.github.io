/**
 * 
 * Will receive a code query parameter
 * 
 * curl --request POST \
  --url 'https://auth.atlassian.com/oauth/token' \
  --header 'Content-Type: application/json' \
  --data '{
    "grant_type": "authorization_code",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET","code": "YOUR_AUTHORIZATION_CODE","redirect_uri": "https://YOUR_APP_CALLBACK_URL"}'
  */
import { NextPage } from "next";
import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { roundToNearestMinutes } from "date-fns";


const useSsrLocalStorage = (key: string, initial: string): [string, React.Dispatch<string>] => {
    if (typeof window === 'undefined') {
        return [initial, (value: string) => undefined ]
    } else {
        return require("react-use-localstorage").default(key, initial);
    }
}


const atlassian_cb: NextPage = (props) => {
    const [pageContent, setPageContent] = useState(<>
        <h4>Something went wrong</h4>
    </>);
    const [jiraTokenResponse, setJIRATokenResponse] = useSsrLocalStorage("jiraTokenResponse","");
    const [jiraTokenResponseTime, setJIRATokenResponseTime] = useSsrLocalStorage("jiraTokenResponseTime","");
    
    const [jiraState, setJiraState] = useSsrLocalStorage("jiraState","");
    const [jiraConfigJson, setJiraConfigJson] = useSsrLocalStorage("jiraConfigJson","");
    const router = useRouter();
    useEffect(() => {
        if(!router.isReady) return;
        let jiraConfig: any = null;
        let jira_state: any = null
        try {
            jiraConfig = JSON.parse(jiraConfigJson);
        } catch (e) {
            return setPageContent(<>
                <h4>Error fetching config</h4>
            </>)
        }
        // TODO: state safety check
        try { //setJiraState(window.btoa(encodeURIComponent(JSON.stringify(jiraStateObject))));
            jira_state = JSON.parse(decodeURIComponent(window.atob(jiraState)));
            if (!jira_state.hasOwnProperty("from_url")) return setPageContent(<>
                Invalid State
            </>)
        } catch (e) {
            return setPageContent(<>Invalid state</>)
        }
        if ("state" in router.query && "code" in router.query) {
            
            const token_req_headers = new Headers();
            let bodyObject:any = {
                code: router.query["code"]
            };
            let valid_config: boolean = true;
           token_req_headers.set("Content-Type", "application/json"); 
           console.log(jiraConfig);
            ["grant_type","client_id","redirect_uri","client_secret"].forEach((confItem) => {
                if (jiraConfig.hasOwnProperty("jira." + confItem)) {
                    bodyObject[confItem] = jiraConfig["jira." + confItem];
                    //token_req_headers.set(confItem,  jiraConfig["jira." + confItem]);
                } else {
                    valid_config = false;
                }
            })
            if (!valid_config) {
                setPageContent(<>Invalid config</>)
            }
            const token_params: RequestInit = {
                    method: 'POST',
                    body: JSON.stringify(bodyObject),
                    //mode: 'no-cors',
                    headers: new Headers({
                        "Origin": document.location.protocol + '//' + document.location.host,
                        "Content-Type": "application/json"
                    })
            };
            fetch(jiraConfig["jira.token_url"],token_params).then((response) => {
                try {
                    if (response.ok) {
                        response.json().then((json_response) => {
                            console.log(json_response);
                            setJIRATokenResponse(JSON.stringify(json_response));
                            setJIRATokenResponseTime(Date());
                            document.location.href = jira_state.from_url;

                        });
                    } else {

                    }
                } catch (e) {
                    return setPageContent(<>
                        <h4>Error while fetching token</h4>
                    </>)
                }
            })

        }

    }, [router.isReady, router.query])
    
    return (
      <div>
        {pageContent}
      </div>
    )
}

export default atlassian_cb

/*
interface AtlassianProps {
    sheet_id: string,
    googleTokenResponse: any

  };
export const atlassian_cb: React.FC<AtlassianProps> = (props: AtlassianProps) => {
    const [markers,setMarkers] = useState(<></>);
    useEffect(() => {
        let accessToken = props.googleTokenResponse.access_token;
        fetch("https://sheets.googleapis.com/v4/spreadsheets/" + props.sheet_id, {
            headers: {
            'Authorization': 'Bearer ' + accessToken,
            }
        }).then((response) => {
            fetch("https://sheets.googleapis.com/v4/spreadsheets/" + props.sheet_id + "/values/Lieux", {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
            }).then((response) => {
                response.json().then((sheet: any) => {
                console.log(sheet);
                let attributes = sheet.values[0];
                let data = sheet.values.slice(1).map((row: Array<string>) => {
                    var result: any = { }; //{[k: string]: any} = {};
                    attributes.forEach((key: string, index: number) => {
                        result[key] = row[index];   
                    });
                    return result;
                });
            })
        })
    })
    })
} 
*/