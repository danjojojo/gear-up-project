// src/components/PartDetailsAccordion.jsx
import React, {useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { addToBUCart } from '../../utils/cartDB';


const PartDetails = ({ item, partType }) => {

    const PesoFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
    });

    const renderTechSpecs = () => {
        switch (partType) {
            case 'frame':
                return (
                    <>
                        <div className='details-ctn'>Purpose: {item.purpose}</div>
                        <div className='details-ctn'>Frame Size: {item.frame_size}</div>
                        <div className='details-ctn'>Head Tube Type: {item.head_tube_type}</div>
                        <div className='details-ctn'>Head Tube Upper Diameter: {item.head_tube_upper_diameter}</div>
                        <div className='details-ctn'>Head Tube Lower Diameter: {item.head_tube_lower_diameter}</div>
                        <div className='details-ctn'>Seatpost Diameter: {item.seatpost_diameter}</div>
                        <div className='details-ctn'>Frame Axle Type: {item.axle_type}</div>
                        <div className='details-ctn'>Frame Axle Diameter: {item.axle_diameter}</div>
                        <div className='details-ctn'>Frame Bottom Bracket Type: {item.bottom_bracket_type}</div>
                        <div className='details-ctn'>Frame Bottom Bracket Width: {item.bottom_bracket_width}</div>
                        <div className='details-ctn'>Frame Rotor Size: {item.rotor_size}</div>
                        <div className='details-ctn'>Frame Max Tire Width: {item.max_tire_width}</div>
                        <div className='details-ctn'>Rear Hub Width: {item.rear_hub_width}</div>
                        <div className='details-ctn'>Material: {item.material}</div>
                    </>
                );
            case 'fork':
                return (
                    <>
                        <div className='details-ctn'>Fork Size: {item.fork_size}</div>
                        <div className='details-ctn'>Fork Tube Type: {item.fork_tube_type}</div>
                        <div className='details-ctn'>Fork Tube Upper Diameter: {item.fork_tube_upper_diameter}</div>
                        <div className='details-ctn'>Fork Tube Lower Diameter: {item.fork_tube_lower_diameter}</div>
                        <div className='details-ctn'>Fork Travel: {item.fork_travel}</div>
                        <div className='details-ctn'>Fork Axle Type: {item.axle_type}</div>
                        <div className='details-ctn'>Fork Axle Diameter: {item.axle_diameter}</div>
                        <div className='details-ctn'>Fork Suspension Type: {item.suspension_type}</div>
                        <div className='details-ctn'>Fork Rotor Size: {item.rotor_size}</div>
                        <div className='details-ctn'>Fork Max Tire Width: {item.max_tire_width}</div>
                        <div className='details-ctn'>Front Hub Width: {item.front_hub_width}</div>
                        <div className='details-ctn'>Material: {item.material}</div>
                    </>
                );
            case 'groupset':
                return (
                    <>
                        <div className='details-ctn'>Chainring Speed: {item.chainring_speed}</div>
                        <div className='details-ctn'>Crank Arm Length: {item.crank_arm_length}</div>
                        <div className='details-ctn'>Front Derailleur Speed: {item.front_derailleur_speed}</div>
                        <div className='details-ctn'>Rear Derailleur Speed: {item.rear_derailleur_speed}</div>
                        <div className='details-ctn'>Cassette Type: {item.cassette_type}</div>
                        <div className='details-ctn'>Cassette Speed: {item.cassette_speed}</div>
                        <div className='details-ctn'>Chain Speed: {item.chain_speed}</div>
                        <div className='details-ctn'>Bottom Bracket Type: {item.bottom_bracket_type}</div>
                        <div className='details-ctn'>Bottom Bracket Width: {item.bottom_bracket_width}</div>
                        <div className='details-ctn'>Brake Type: {item.brake_type}</div>
                        <div className='details-ctn'>Rotor Mount Type: {item.rotor_mount_type}</div>
                        <div className='details-ctn'>Rotor Size: {item.rotor_size}</div>
                    </>
                );
            case 'wheelset':
                return (
                    <>
                        <div className='details-ctn'>Hub - Rotor Type: {item.hub_rotor_type}</div>
                        <div className='details-ctn'>Hub - Cassette Type: {item.hub_cassette_type}</div>
                        <div className='details-ctn'>Hub Holes: {item.hub_holes}</div>
                        <div className='details-ctn'>Front Hub Width: {item.front_hub_width}</div>
                        <div className='details-ctn'>Front Hub - Axle Type: {item.front_hub_axle_type}</div>
                        <div className='details-ctn'>Front Hub - Axle Diameter: {item.front_hub_axle_diameter}</div>
                        <div className='details-ctn'>Rear Hub Width: {item.rear_hub_width}</div>
                        <div className='details-ctn'>Rear Hub - Axle Type: {item.rear_hub_axle_type}</div>
                        <div className='details-ctn'>Rear Hub - Axle Diameter: {item.rear_hub_axle_diameter}</div>
                        <div className='details-ctn'>Rear Hub Speed: {item.rear_hub_speed}</div>
                        <div className='details-ctn'>Tire Size: {item.tire_size}</div>
                        <div className='details-ctn'>Tire Width: {item.tire_width}</div>
                        <div className='details-ctn'>Rim Spokes: {item.rim_spokes}</div>
                    </>
                );
            case 'seat':
                return (
                    <>
                        <div className='details-ctn'>Seatpost Diameter: {item.seatpost_diameter}</div>
                        <div className='details-ctn'>Seatpost Length: {item.seatpost_length}</div>
                        <div className='details-ctn'>Seat Clamp Type: {item.seat_clamp_type}</div>
                        <div className='details-ctn'>Saddle Material: {item.saddle_material}</div>
                    </>
                );
            case 'cockpit':
                return (
                    <>
                        <div className='details-ctn'>Handlebar Length: {item.handlebar_length}</div>
                        <div className='details-ctn'>Handlebar Clamp Diameter: {item.handlebar_clamp_diameter}</div>
                        <div className='details-ctn'>Handlebar Type: {item.handlebar_type}</div>
                        <div className='details-ctn'>Stem Clamp Diameter: {item.stem_clamp_diameter}</div>
                        <div className='details-ctn'>Stem Length: {item.stem_length}</div>
                        <div className='details-ctn'>Stem Angle: {item.stem_angle}</div>
                        <div className='details-ctn'>Stem Fork Diameter: {item.stem_fork_diameter}</div>
                        <div className='details-ctn'>Headset Type: {item.headset_type}</div>
                        <div className='details-ctn'>Headset Cup Type: {item.headset_cup_type}</div>
                        <div className='details-ctn'> Headset Upper Diameter: {item.headset_upper_diameter}</div>
                        <div className='details-ctn'>Headset Lower Diameter: {item.headset_lower_diameter} </div>
                    </>
                );
            // Add more cases for other parts (wheelset, seat, cockpit)
            default:
                return null;
        }
    };

    const addToCart = (part) => {
        addToBUCart(part);
    };

    return (
        <div className="part-details">
            <div className='item-name'>{item.item_name}</div>
            <div className='item-price'>{PesoFormat.format(item.item_price)}</div>
            <div className="stock-status">
                <span className='text'>
                    {item.stock_count > 0 ? "In Stock" : "Out of Stock"}
                </span>
            </div>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Details</Accordion.Header>
                    <Accordion.Body>{item.description}</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Tech Specs</Accordion.Header>
                    <Accordion.Body>
                        {renderTechSpecs()}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <button className='add-to-cart'
                onClick={() => {
                    if(item.stock_count > 0) {
                        addToCart(item); 
                    }
                    else alert("This item is out of stock.");
                }}
            >
                Add to cart
            </button>
        </div>
    );
};

export default PartDetails;
