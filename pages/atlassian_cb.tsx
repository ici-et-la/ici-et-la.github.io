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

import AtlassianCallback from "../components/auth/AtlassianCallback";


const atlassian_cb: NextPage = (props) => {
    return(<AtlassianCallback></AtlassianCallback>)
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