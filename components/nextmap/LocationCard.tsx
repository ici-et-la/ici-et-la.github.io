
import * as Icon from 'react-bootstrap-icons'
import { FC, MouseEventHandler } from "react";
import { Button, ButtonGroup, ButtonToolbar, Card, Nav } from "react-bootstrap";
import { MapLocation } from "./data/MapLocation";
import { LocationReview } from './data/LocationReview';
import ReviewRows from './ReviewRows';
import { MapDataHelper } from './MapDataHelper';
import MapModal from './MapModal';

interface LocationCardProps {
    location: MapLocation
    editHandler: MouseEventHandler,
    dataHelper: MapDataHelper,
    modal: MapModal
}

export const LocationCard: FC<LocationCardProps> = (props: LocationCardProps) => {

    return <Card>
        <Card.Header>
            <ButtonToolbar className='justify-content-end'>
                <ButtonGroup size="sm">
                {props.location.url
                    ? <Button className="btn btn-link" href={props.location.url} target='_new'>{props.location.label}</Button>
                    : <Button>{props.location.label}</Button>
                }
                    <Button className="btn btn-light" onClick={props.editHandler}><Icon.Pencil/></Button>
                </ButtonGroup>
            </ButtonToolbar>
        </Card.Header>
        <Card.Body>
        {/* <Card.Title>
    {props.location.url
        ? <a href={props.location.url} target="_new">{props.location.label}</a> 
        : <span>{props.location.label}</span>
    }
        </Card.Title> */}
        <Card.Text>
            {/* TODO render description data
            {props.location.description
               ? <p>{props.location.description}</p>
               : <></>} */}
            <ReviewRows location={props.location} dataHelper={props.dataHelper} modal={props.modal}></ReviewRows>
        </Card.Text>
        </Card.Body>
</Card>
}