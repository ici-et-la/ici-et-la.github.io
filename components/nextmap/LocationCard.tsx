
import * as Icon from 'react-bootstrap-icons'
import { FC, MouseEventHandler } from "react";
import { Button, ButtonGroup, ButtonToolbar, Card, Nav } from "react-bootstrap";
import { MapLocation } from "./MapLocation";

interface LocationCardProps {
    location: MapLocation
    editHandler: MouseEventHandler
}

export const LocationCard: FC<LocationCardProps> = (props: LocationCardProps) => {

    return <Card>
        <Card.Header>
            <ButtonToolbar className='justify-content-end'>
                <ButtonGroup size="sm">
                    <Button onClick={props.editHandler}><Icon.Pencil/></Button>
                </ButtonGroup>
            </ButtonToolbar>
        </Card.Header>
        <Card.Body>
        <Card.Title>
    {props.location.url
        ? <a href={props.location.url} target="_new">{props.location.label}</a> 
        : <span>{props.location.label}</span>
    }
        </Card.Title>
        </Card.Body>
</Card>
}