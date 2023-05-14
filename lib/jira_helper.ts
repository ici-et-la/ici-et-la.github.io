import { AnyTxtRecord } from "dns";
import { LookupFunction } from "net";
import { loctype, MapLocation } from "../components/nextmap/data/MapLocation";
import { MapDataHelper } from "../components/nextmap/MapDataHelper";
import { LocationReview } from "../components/nextmap/data/LocationReview";

export class JiraHelperImpl implements MapDataHelper {
    public jira_token: any;
    public jiraConfig: any;
    public jiraProject: string = "D2";
    public cloudId: any;
    public apiUrl: any;
    public ready: any;
    public fetchOptions() {
        var fetch_options: RequestInit = {
            mode: 'cors',
            headers: new Headers({
                "Origin": document.location.protocol + '//' + document.location.host,
                "Authorization": "Bearer " + this.jira_token.access_token,
                "Accept": "application/json"
            })
        }
        return fetch_options;
    }
    public constructor(jiraConfig: any, jira_token: any) {
        if (jiraConfig == null || jira_token == null) return
        this.jiraConfig = jiraConfig;
        this.jira_token = jira_token;
        const fetch_options: RequestInit = this.fetchOptions();
        this.ready = new Promise<MapDataHelper>((resolve, reject) => {
            fetch("https://api.atlassian.com/oauth/token/accessible-resources", fetch_options).then((response) => {
                response.json().then((data) => { 
                    console.log(data)
                    this.cloudId = data[0].id;
                    this.apiUrl = this.jiraConfig["jira.api_url"] + this.cloudId + this.jiraConfig["jira.api_url_suffix"];
                    fetch(this.apiUrl + "/myself", fetch_options).then((response) => {
                        response.json().then((userData) => {
                            console.log(userData);
                            resolve(this)
                        }).catch(reject)
                    }).catch(reject)
                }).catch(reject)
            }).catch(reject)
        })
    }
    public mapLocationReview(issue: any, index?: number): LocationReview {
            const review: LocationReview = {
                id: issue.key,
                summary: issue.fields.summary,
                
            }
            if (issue.fields.description) {
                review.description = issue.fields.description
            }
            return review

    }
    public mapIssueToLocation(issue: any,index?: number): MapLocation {
        const helper: JiraHelperImpl = this;
        function mapLocationReview(issue: any, index?: number): LocationReview {
            const review: LocationReview = {
                id: issue.key,
                summary: issue.fields.summary,
                
            }
            if (issue.fields.description) {
                review.description = issue.fields.description
            }
            return review
        }
        const location: MapLocation = {
            id: issue.key,
            label: issue.fields.summary,
            status: issue.fields.status.name,
            maps_url: issue.fields.customfield_10038, 
            description: issue.fields.description, //?.content[0]?.content[0]?.text,
            url: issue.fields.customfield_10035,
            issuetype: issue.fields.issuetype.name,
            type: loctype.hasOwnProperty(issue.fields.issuetype.name) ? loctype[issue.fields.issuetype.name] : loctype["Localisation"],
            position: [parseFloat(issue.fields.customfield_10039),parseFloat(issue.fields.customfield_10040)],
            reviews: issue.fields.subtasks.filter((subtask: any) => subtask.fields.issuetype.name == "LocalisationReview").map(mapLocationReview)
        };
        console.log(location)
        return location;
    }
    public mapIssuesToLocations(issues:any): Array<MapLocation> {
        return issues.map(this.mapIssueToLocation)
    }
    public getLocation(id: string): Promise<MapLocation> {
        const helper = this;
        return new Promise((resolve, reject) => {
            const fetch_options: RequestInit = this.fetchOptions();
            const url = this.apiUrl + "/issue/" + id
            fetch(url, fetch_options).then((response) => {
                response.json().then((result) => {
                    resolve(this.mapIssueToLocation(helper,result))
                }).catch(reject)
            })
        });

    }

    public updateLocation(newLocationValues: MapLocation): Promise<any> {
        return new Promise((resolve, reject) => {
            const fetch_options: RequestInit = this.fetchOptions();
            const create_url = this.apiUrl + "/issue/" + newLocationValues.id
            fetch_options.method = "PUT"
            const issue_data = {
                fields: {
                    "summary": newLocationValues.label,
                    "customfield_10035": newLocationValues.url,
                    "customfield_10038": newLocationValues.maps_url?.substring(0,254),
                    "description": newLocationValues.description
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
                if (response.status === 204) resolve(null)
            }).catch(reject)
        })
    }
    updateReview(review: LocationReview): Promise<any> {
        return new Promise((resolve, reject) => {

        })
    }
    createReview(review: LocationReview): Promise<any> {
        return new Promise((resolve, reject) => {
            
        })
    }
    getReview(reviewId: string): Promise<LocationReview> {
        return new Promise((resolve, reject) => {
            const fetch_options: RequestInit = this.fetchOptions();
            const url = this.apiUrl + "/issue/" + reviewId
            fetch(url, fetch_options).then((response) => {
                response.json().then((result) => {
                    resolve(this.mapLocationReview(result))
                }).catch(reject)
            })
        })
    }
    // public getLocations() {}
    public createLocation(name: string, url: string,google_maps_url: string, locationtype?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const fetch_options: RequestInit = this.fetchOptions();
            const create_url = this.apiUrl + "/issue"
            if (!locationtype) {
                locationtype = "Localisation"
            }
            fetch_options.method = "POST"
            const issue_data = {
                update: {},
                fields: {
                    "summary": name,
                    "customfield_10035": url,
                    "customfield_10038": google_maps_url.substring(0,254),
                    "issuetype": {
                        "name": locationtype
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
        })
    }
    public searchIssues(jql: string) {
        return new Promise<Array<MapLocation>>((resolve,reject) => {
            const fetch_options: RequestInit = {
                mode: 'cors',
                headers: new Headers({
                    "Origin": document.location.protocol + '//' + document.location.host,
                    "Authorization": "Bearer " + this.jira_token.access_token,
                    "Accept": "application/json"
                })
            }
            const locations_url = this.apiUrl + "/search?jql=" + encodeURIComponent(jql) + "&maxResults=1000"
            fetch(locations_url, fetch_options).then((response) => {
                response.json().then((data) => {resolve(this.mapIssuesToLocations(data.issues))}).catch(reject)
            }).catch(reject)
        })
    }
    public getUnlocatedLocations(): Promise<Array<MapLocation>> {
        return new Promise<Array<MapLocation>>((resolve, reject) => {
            const jql = 'project = "' + this.jiraProject + '" and type in (Ecole, Initiative, Localisation) and status IN ("Locate", Open) ORDER BY created DESC'
            this.searchIssues(jql).then(resolve).catch(reject);
        })
    }
    public getLocations(): Promise<Array<MapLocation>> {
        return new Promise<Array<MapLocation>>((resolve, reject) => {
            const jql = 'project = "D2" and type in (Ecole, Initiative, Localisation) and status in ("Locate", Open, Located, "In Progress", REVIEW, ACCEPT) ORDER BY created DESC'
            this.searchIssues(jql).then(resolve).catch(reject);        
        });
    }
}