import { loctype, MapLocation } from "./Location";

export class JiraHelper {
    public jira_token: any;
    public jiraConfig: any;
    public constructor(jiraConfig: any, jira_token: any) {
        this.jiraConfig = jiraConfig;
        this.jira_token = jira_token;
    }
    // public getLocations() {}
    public createIssue(name: string, url: string,google_maps_url: string) {
        return new Promise((resolve, reject) => {
            const fetch_options: RequestInit = {
                mode: 'cors',
                headers: new Headers({
                    "Origin": document.location.protocol + '//' + document.location.host,
                    "Authorization": "Bearer " + this.jira_token.access_token,
                    "Accept": "application/json"
                })
            }
            fetch("https://api.atlassian.com/oauth/token/accessible-resources", fetch_options).then((response) => {
                response.json().then((data) => { 
                    console.log(data)
                    const cloud_id = data[0].id
                    const api_url = this.jiraConfig["jira.api_url"] + cloud_id + this.jiraConfig["jira.api_url_suffix"]
                    const create_url = api_url + "/issue"
                    fetch_options.method = "POST"
                    const issue_data = {
                        update: {},
                        fields: {
                            "summary": name,
                            "customfield_10035": url,
                            "customfield_10038": google_maps_url,
                            "issuetype": {
                                "id": "10009"
                            },
                            "project": {
                                "id": "10001"
                            },

                        }
                    }
                    fetch_options.body = JSON.stringify(issue_data)
                    fetch_options.headers = new Headers({
                        "Origin": document.location.protocol + '//' + document.location.host,
                        "Authorization": "Bearer " + this.jira_token.access_token,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    })
                    fetch(create_url, fetch_options).then((response) => {
                        response.json().then((result) => {
                            resolve(result)
                        }).catch(reject)
                    })
                    
                }).catch(reject)
            })
          });
    }
    public getLocations() {
        return new Promise((resolve, reject) => {
            const fetch_options: RequestInit = {
                mode: 'cors',
                headers: new Headers({
                    "Origin": document.location.protocol + '//' + document.location.host,
                    "Authorization": "Bearer " + this.jira_token.access_token,
                    "Accept": "application/json"
                })
            }
            fetch("https://api.atlassian.com/oauth/token/accessible-resources", fetch_options).then((response) => {
                response.json().then((data) => { 
                    console.log(data)
                    const cloud_id = data[0].id
                    const api_url = this.jiraConfig["jira.api_url"] + cloud_id + this.jiraConfig["jira.api_url_suffix"]
                    const jql = 'project = "D2" and type in (Ecole, Initiative, Localisation) and status in (Located, "In Progress", REVIEW, ACCEPT) ORDER BY created DESC'
                    const locations_url = api_url + "/search?jql=" + encodeURIComponent(jql) + "&maxResults=1000"
                    fetch(locations_url, fetch_options).then((response) => {
                        response.json().then((result) => {
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
                            resolve(localisations)
                        }).catch(reject)
                    })
                    
                }).catch(reject)
            })
          });
        
    }
}