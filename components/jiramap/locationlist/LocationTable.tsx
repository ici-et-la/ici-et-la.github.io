import { FC, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { JiraHelper } from "../../../lib/jira_helper";
import { MapLocation } from "../../../lib/Location";
import LocationRows from "./LocationRows";


interface LocationTableProps {
    locations: Array<MapLocation>
    columns?: Array<String>
    selected?: MapLocation
    jiraHelper: JiraHelper
}

export const LocationTable: FC<LocationTableProps> = (props: LocationTableProps) => {
    const columns = props.columns ? props.columns : ["id", "label","actions"]
    return <>
        <Table striped>
            <thead>
                <tr>
                {columns.includes("id") ? <th>#</th>: <></>}
                {columns.includes("label") ? <th>Name</th> : <></>}
                {columns.includes("actions") ? <th>Actions</th> : <></>}
                </tr>
            </thead>
            <tbody>
                <LocationRows jiraHelper={props.jiraHelper} columns={columns} locations={props.locations}></LocationRows>
            </tbody> 
        </Table>
    </>
}
