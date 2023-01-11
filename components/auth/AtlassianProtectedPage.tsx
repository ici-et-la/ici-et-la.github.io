import { useGoogleLogin } from "@react-oauth/google";
import { FC, useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';
import { addSeconds, subSeconds } from 'date-fns';
//import useLocalStorage  from 'react-use-localstorage';
const useSsrLocalStorage = (key: string, initial: string): [string, React.Dispatch<string>] => {
    if (typeof window === 'undefined') {
        return [initial, (value: string) => undefined ]
    } else {
        return require("react-use-localstorage").default(key, initial);
    }
  }


interface ProtectedPageProps {
    google_sheet_id?: string,
    settings_tab_name?: string,
    children: any
}

export const AtlassianProtectedPage: React.FC<ProtectedPageProps> = (props: ProtectedPageProps) => {
    
    const [jiraConfigJson, setJiraConfigJson] = useSsrLocalStorage("jiraConfigJson","");
    const [pageContent, setPageContent] = useState(<></>);
    const [jiraTokenResponse, setJIRATokenResponse] = useSsrLocalStorage("jiraTokenResponse","");
    // Timestamp of the response
    const [jiraTokenResponseTime, setJIRATokenResponseTime] = useSsrLocalStorage("jiraTokenResponseTime","");
    const [jiraState, setJiraState] = useSsrLocalStorage("jiraState","");
    const [isRendered,setRendered] = useState(false);
    const getJIRAAuthConfigInGoogleSheets = (googleAuthToken:any, callback: Function) => {
        
        fetch("https://sheets.googleapis.com/v4/spreadsheets/" + props.google_sheet_id, {
            headers: {
            'Authorization': 'Bearer ' + googleAuthToken.access_token,
            }
        }).then((response): void => {
            fetch("https://sheets.googleapis.com/v4/spreadsheets/" + props.google_sheet_id + "/values/" + props.settings_tab_name, {
                headers: {
                    'Authorization': 'Bearer ' + googleAuthToken.access_token,
                }
                }).then((response) => {
                    response.json().then((sheet: any) => {
                        let config: any = {}
                        sheet.values.forEach((line: Array<string>, index: number) => {
                            config[line[0]] = line[1]
                        })
                    setJiraConfigJson(JSON.stringify(config));
                    return callback(config)
                })
            })
        })
    }
    const getJIRAAuthConfig = (callback: Function) => {
        let jiraConfig = null;
        try {
            jiraConfig = JSON.parse(jiraConfigJson);
        } catch (e) {}
        if (jiraConfig != null) {
            return callback(jiraConfig);
        }
        getGoogleToken((googleAuthToken:any, callback: Function) => {
            return getJIRAAuthConfigInGoogleSheets(googleAuthToken,callback);
        })

    }
    const getJIRAToken = (googleAuthToken:any, callback: Function) => {
        let jiraToken:any = null;
        try {
            jiraToken = JSON.parse(jiraTokenResponse);
            //console.log(jiraToken);
            const token_time = new Date(jiraTokenResponseTime);
            
            if (new Date() < addSeconds(token_time, jiraToken.expires_in)) { 
                return callback(jiraToken);
            }
        } catch (e) {
        }
        getJIRAAuthConfigInGoogleSheets(googleAuthToken, (jiraConfig: any) => {
            let jiraStateObject = {
                from_url: window.location.href,
                date: Date()
            }
            
            setJiraState(window.btoa(encodeURIComponent(JSON.stringify(jiraStateObject))));
            let authorize_url = jiraConfig["jira.authorize_url"] 
                + "?redirect_uri=" + encodeURIComponent(jiraConfig["jira.redirect_uri"])
                + "&audience=" + encodeURIComponent(jiraConfig["jira.audience"])
                + "&client_id=" + encodeURIComponent(jiraConfig["jira.client_id"])
                + "&prompt=" + encodeURIComponent(jiraConfig["jira.prompt"])
                + "&scope=" + encodeURIComponent(jiraConfig["jira.scope"])
                + "&response_type=" + encodeURIComponent(jiraConfig["jira.response_type"])
                + "&state=" + encodeURIComponent(jiraState);

            window.document.location = authorize_url;
        })
    }

    const [googleTokenResponse, setGoogleTokenResponse] = useSsrLocalStorage("googleTokenResponse","");
    // Timestamp of the response
    const [googleTokenResponseTime, setGoogleTokenResponseTime] = useSsrLocalStorage("googleTokenResponseTime","");
    const google_login_elem = <>
    <main>
        You are not authenticated
        <button onClick={() => login()}>
        Authenticate 🚀{' '}
        </button>
        </main>
    </>;
    var current_google_token = null;
    const onGoogleSuccessHandler = (tokenResponse:any) => {
        setGoogleTokenResponse(JSON.stringify(tokenResponse));
        setGoogleTokenResponseTime(Date());
        
        getJIRAToken(tokenResponse, () => {});
    }

    const login = useGoogleLogin({
        onSuccess: onGoogleSuccessHandler,
        scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
    });
    const getGoogleToken = (callback: Function) => {
            // Google token
        
        
        try {
            current_google_token = JSON.parse(googleTokenResponse);
        } catch (e) {
            return setPageContent(google_login_elem);
        }
        var google_token_time = null;
        try {
            google_token_time = new Date(googleTokenResponseTime);
        } catch (e) {
            return setPageContent(google_login_elem);
        }
        
        try {

            var expired: boolean = true;
            if (google_token_time < subSeconds(new Date(), current_google_token.expires_in)) {
                return setPageContent(google_login_elem);
            }
            callback(current_google_token);

        } catch (e) {
            return setPageContent(google_login_elem);
        }
    }
    useEffect(() => {
        
        if (!isRendered) {
            setRendered(true)
            getGoogleToken((google_token:any) => {
                setRendered(true)
                getJIRAToken(google_token, (token: any) => {
                    setPageContent(<>{props.children}</>)
                })
            })
        }
    }, [getGoogleToken, getJIRAToken, props.children, isRendered, setRendered]);
    return(<>
        {pageContent}
    </>)
}

export default AtlassianProtectedPage