import "./bike-upgrader.scss"
import React, {useState, useEffect } from "react";
import {
    getFrameItems,
    getForkItems,
    getGroupsetItems,
    getWheelsetItems,
    getSeatItems, 
    getCockpitItems 
} from "../../services/bikeBuilderService";

const BikeUpgrader = () => {
    const ownedPartsSelection = [
        'Frame',
        'Fork',
        'Groupset',
        'Wheelset',
        'Seat',
        'Cockpit'
    ]

    // Compatibility Specifications
    const compatibilitySpecs = {
        frame: {
            fork: [
                'purpose', // Frame purpose -> Fork travel
                'frameSize', // Frame size -> Fork size
                'headTubeType', // Head tube -> Fork tube type
                // 'frameAxleType', // Frame axle type -> Fork axle type
                // 'frameAxleDiameter', // Frame axle diameter -> Fork axle diameter
                // 'frameRotorSize', // Frame rotor size -> Fork rotor size
                // 'frameMaxTireWidth' // Frame max tire width -> Fork max tire width
            ],
            groupset: [
                'bottomBracketType', // Frame bottom bracket type -> Bottom bracket type
                'bottomBracketWidth', // Frame bottom bracket width -> Bottom bracket width
                'rotorSize' // Frame rotor size -> Rotor size
            ],
            wheelset: [
                'rearHubWidth', // Frame rear hub spacing -> Rear hub width
                'frameAxleType', // Frame axle type -> Rear hub axle type
                'tireSize', // Frame size -> Tire size
                'frameMaxTireWidth' // Frame max tire width -> Tire width
            ],
            seat: [
                'seatPostDiameter' // Frame seat post diameter -> Seat post diameter
            ],
            cockpit: [
                'headsetType', // Headtube -> Headset type
                'headsetUpperDiameter', // Headtube upper dia -> Headset upper dia
                'headsetLowerDiameter' // Headtube lower dia -> Headset lower dia
            ]
        },
        fork: {
            groupset: [
                'forkRotorSize' // Fork rotor size -> Rotor size
            ],
            wheelset: [
                'frontHubWidth', // Fork hub spacing -> Front hub width
                'frontHubAxleType', // Fork axle type -> Front hub axle type
                'forkMaxTireWidth' // Fork max tire width -> Frame max tire width
            ],
            cockpit: [
                'forkTubeUpperDiameter' // Fork tube upper dia -> Stem fork diameter
            ],
            frame: [
                'forkTravel', // Fork travel -> Frame purpose
                'forkSize', // Fork size -> Frame size
                'forkTubeType', // Fork tube type -> Head tube
                'forkAxleType', // Fork axle type -> Frame axle type
                'forkAxleDiameter', // Fork axle diameter -> Frame axle diameter
                'forkRotorSizes', // Fork rotor size -> Frame rotor size
                'forkMaxTireWidth' // Fork max tire width -> Frame max tire width
            ]
        },
        groupset: {
            wheelset: [
                'cassetteType', // Cassette type -> Rear hub cassette type
                'cassetteSpeed', // Cassette speed -> Rear hub speed
                'rotorMountType' // Rotor mount type -> Hubs rotor mount type
            ],
            frame: [
                'bottomBracketType', // Bottom bracket type -> Frame bottom bracket type
                'bottomBracketWidth', // Bottom bracket width -> Frame bottom bracket width
                'rotorSize' // Rotor size -> Frame rotor size
            ],
            fork: [
                'rotorSize' // Rotor size -> Fork rotor size
            ]
        },
        wheelset: {
            frame: [
                'rearHubWidth', // Rear hub width -> Frame rear hub spacing
                'rearHubAxleType', // Rear hub axle type -> Frame axle type
                'tireSize', // Tire size -> Frame size
                'tireWidth' // Tire width -> Frame max tire width
            ],
            fork: [
                'frontHubWidth', // Front hub width -> Fork hub spacing
                'frontHubAxleType', // Front hub axle type -> Fork axle type
                'forkMaxTireWidth' // Fork max tire width -> Frame max tire width
            ],
            groupset: [
                'cassetteType', // Rear hub cassette type -> Cassette type
                'rearHubSpeed', // Rear hub speed -> Cassette speed
                'rotorMountType' // Hubs rotor mount type -> Rotor mount type
            ]
        },
        seat: {
            frame: [
                'seatPostDiameter' // Seat post diameter -> Frame seat post diameter
            ]
        },
        cockpit: {
            frame: [
                'headsetType', // Headset type -> Headtube
                'headsetUpperDiameter', // Headset upper diameter -> Headtube upper dia
                'headsetLowerDiameter' // Headset lower diameter -> Headtube lower dia
            ],
            fork: [
                'stemForkDiameter' // Stem fork diameter -> Fork tube upper dia
            ]
        }
    };

    // Form Options Matching Compatibility Specs
    const formOptions = {
        purpose: ["Cross-country (XC)", "Trail", "Enduro", "Downhill (DH)"],
        frameSize: ["26\"", "27.5\"", "29\""],
        headTubeType: ["Non Tapered", "Tapered"],
        headTubeUpperDiameter: ["34mm", "44mm", "49mm", "55mm"],
        headTubeLowerDiameter: ["34mm", "44mm", "55mm", "56mm"],
        seatPostDiameter: ["27.2mm", "30.9mm", "31.6mm", "34.9mm"],
        frameAxleType: ["Quick Release (QR)", "Thru-Axle"],
        frameAxleDiameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
        bottomBracketType: ["Threaded (BSA)", "Press-Fit (PF30, BB86, BB92)", "BB30"],
        bottomBracketWidth: ["68mm", "73mm (MTB)", "83mm (Downhill)", "86mm (Press-Fit)", "92mm (MTB)"],
        frameRotorSize: ["160mm", "180mm", "203mm"],
        frameMaxTireWidth: ["2.1\"", "2.25\"", "2.4\"", "2.6\"", "2.8\""],
        rearHubWidth: ["135mm (Rear)", "142mm (Rear)", "148mm (Boost Rear)", "150mm (Downhill)"],
        forkSize: ["26\"", "27.5\"", "29\""],
        forkTubeType: ["Non Tapered", "Tapered"],
        forkTubeUpperDiameter: ["1 1/8\"", "1 1/4\"", "1.5\""],
        forkTubeLowerDiameter: ["1 1/8\"", "1 1/4\"", "1.5\""],
        forkTravel: ["80mm to 120mm", "120mm to 160mm", "150mm to 180mm", "180mm to 200mm"],
        forkAxleType: ["Quick Release (QR)", "Thru-Axle"],
        forkAxleDiameter: ["9mm (QR)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
        forkSuspensionType: ["Air", "Coil", "N/A (Rigid)"],
        forkRotorSize: ["160mm", "180mm", "203mm"],
        forkMaxTireWidth: ["2.1\"", "2.25\"", "2.4\"", "2.6\"", "2.8\""],
        frontHubWidth: ["100mm (Front)", "110mm (Boost Front)"],
        chainringSpeed: ["Single (1x)", "Double (2x)", "Triple (3x)"],
        crankArmLength: ["165mm", "170mm", "175mm", "180mm"],
        frontDerailleurSpeed: ["2-speed", "3-speed", "N/A (1x Chainring speed)"],
        rearDerailleurSpeed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
        cassetteType: ["Cassette", "Threaded Freewheel"],
        cassetteSpeed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
        chainSpeed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
        rotorSize: ["160mm", "180mm", "203mm"],
        rotorMountType: ["6-bolt", "Centerlock"],
        hubCassetteType: ["Cassette", "Threaded"],
        hubHoles: ["28H", "32H", "36H"],
        frontHubAxleType: ["Quick Release (QR)", "Thru-Axle (TA)"],
        frontHubAxleDiameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
        rearHubAxleType: ["Quick Release (QR)", "Thru-Axle (TA)"],
        rearHubAxleDiameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
        rearHubSpeed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
        tireSize: ["26\"", "27.5\"", "29\""],
        tireWidth: ["1.9\"", "1.95\"", "2.0\"", "2.1\"", "2.125\"", "2.25\"", "2.4\"", "2.6\"", "2.8\""],
        rimSpokes: ["28", "32", "36"],
        seatPostLength: ["300mm", "350mm", "400mm", "450mm"],
        seatClampType: ["Quick Release", "Bolt-On"],
        saddleMaterial: ["Leather", "Synthetic", "Gel"],
        handleBarLength: ["680mm", "700mm", "720mm", "760mm"],
        handleBarClampDiameter: ["25.4mm", "31.8mm", "35mm"],
        handleBarType: ["Flat", "Riser", "Drop"],
        stemClampDiameter: ["25.4mm", "31.8mm", "35mm"],
        stemLength: ["60mm", "70mm", "80mm", "90mm", "100mm"],
        stemAngle: ["Negative", "Positive"],
        stemForkDiameter: ["1 1/8\"", "1 1/4\"", "1.5\""],
        headsetType: ["Tapered", "Non-tapered"],
        headsetCupType: ["Integrated", "Non-integrated"],
        headsetUpperDiameter: ["44mm", "49mm", "55mm"],
        headsetLowerDiameter: ["44mm", "55mm", "56mm"]
    };


    const [ownedParts, setOwnedParts] = useState([]);
    const [desiredPart, setDesiredPart] = useState('');
    const [dynamicFormFields, setDynamicFormFields] = useState([]);
    const [formValues, setFormValues] = useState({});

    const handleOwnedPartSelected = (ownedPartsValue) => {
        if(ownedParts.includes(ownedPartsValue)) {
            setOwnedParts(ownedParts.filter(part => part !== ownedPartsValue));
        } else {
            setOwnedParts([...ownedParts, ownedPartsValue]);
        }
    }

    const handleDesiredPartChange = (desiredPartValue) => {
        setDesiredPart(desiredPartValue);
    }

    const handleSetSpecification = (field, value) => {
        if(dynamicFormFields.includes(field)) {
            setFormValues((prev) => ({
                ...prev,
                [field]: value
            }));
        }
    }

    useEffect(() => {
        console.log(formValues);
    },[formValues]);

    const getFormFields = (ownedParts, desiredPart) => {
        if (ownedParts.length === 0 || desiredPart === '') return [];
        // set formFields as Set to avoid dupes sa fields na hahanapin below
        let formFields = new Set();
        console.log('Compatibility checking...')
        // console.log('Owned parts:', ownedParts);

        ownedParts.forEach((part) => {
            // Check if part is a key in compatibilitySpecs
            // Check if desiredPart is a property of the key in compatibilitySpecs
            if (compatibilitySpecs[part] && compatibilitySpecs[part][desiredPart]) {
                // If yes
                formFields.add(part);
                compatibilitySpecs[part][desiredPart].forEach((field) => {
                    // Add the values of the desiredPart property to formFields
                    // Sample: compatibilitySpecs.frame.fork = ['purpose', 'frameSize', bla bla bla]
                    formFields.add(field);
                });
            }
        });

        // convert formFields na Set to Array
        return Array.from(formFields);
    };

    useEffect(() => {
        // When ownedParts and desiredPart changes, get the formFields
        const fields = getFormFields(ownedParts, desiredPart);
        setDynamicFormFields(fields);
    }, [ownedParts, desiredPart]);

    const renderDynamicForm = () => {
        // render the dynamic form fields
        // values will be yung fields na nakuha from getFormFields
        if(dynamicFormFields.length === 0) 
            return (
                <div className="no-compatibility">
                    <i className="fa-regular fa-square-minus"></i>
                    <p>Parts selected are independent from each other.</p>
                </div>
            )

        return dynamicFormFields.map((field, index) => (
            // render yung mga fields as separate selects
            <div key={index} className="form-field">
                {/* yung formFields natin nakaset as camelCase */}
                {/* this regex will get the words that has capital letters (/([A-Z])/g) tapos magdadagdag siya ng space before it (' $1') */}
                {!ownedParts.includes(field) ? 
                    <>
                        <label>{field.replace(/([A-Z])/g, ' $1')}</label>
                        <select defaultValue={'none'} onChange={(e) => handleSetSpecification(field, e.target.value)}>
                            <option value="none" disabled>Set specification</option>
                            {/* check if field is a property in formOptions */}
                            {formOptions[field] && formOptions[field].map((option, idx) => (
                                // if so
                                // render yung values from that property as options
                                <option key={idx} value={option}>{option}</option>
                            ))}
                        </select>
                    </>
                :   <h3 className="owned-part-name">{field}</h3>
                }
            </div>
        ));
    };

    const handleFindParts = async () => {
        console.log(dynamicFormFields);
        switch(desiredPart) {
            case 'frame':
                const frameItems = await getFrameItems();
                console.log(frameItems);
                break;
            case 'fork':
                const forkItems = await getForkItems();
                console.log(forkItems);
                break;
            case 'groupset':
                const groupsetItems = await getGroupsetItems();
                console.log(groupsetItems);
                break;
            case 'wheelset':
                const wheelsetItems = await getWheelsetItems();
                console.log(wheelsetItems);
                break;
            case 'seat':
                const seatItems = await getSeatItems();
                console.log(seatItems);
                break;
            case 'cockpit':
                const cockpitItems = await getCockpitItems();
                console.log(cockpitItems);
                break;
            default:
                break;
        }
    }

    const PesoFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });


    return (
        <div className="bike-upgrader">
            <div className="left-container">
                <div className="row-1">
                    <div className="left">
                        <div className="top">
                            <h4>Your owned parts</h4>
                        </div>
                        <div className="owned-parts">
                            <div className="owned-parts-selection">
                                {ownedPartsSelection.map((part, index) => {
                                    return (
                                        <button type="button" 
                                            className={ownedParts.includes(part.toLowerCase()) ? 'owned-part selected' : 'owned-part'}
                                            key={index}
                                            onClick={(e) => handleOwnedPartSelected((e.target.value).toLowerCase())} 
                                            value={part.toLowerCase()}
                                            disabled={desiredPart === part.toLowerCase() ? true : false }
                                        >{part}
                                        {ownedParts.includes(part.toLowerCase()) && <span><i className="fa-solid fa-check" onClick={(e) => e.stopPropagation()}></i></span>}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h4>Part you're looking for</h4>
                        <div className="desired-part">
                            <div className="owned-parts-selection">
                                <select className={desiredPart && 'selected'} name="" id="" defaultValue={'select'} onChange={(e) => handleDesiredPartChange((e.target.value).toLowerCase())}>
                                    <option value="select" disabled>Select a desired bike part</option>
                                    {ownedPartsSelection.map((part, index) => {
                                        return (
                                            <option value={part} key={index}
                                                disabled={ownedParts.includes(part.toLowerCase()) ? true : false }
                                            >{part}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row-2">
                    <h4>Set your specifications</h4>
                    {ownedParts.length === 0 || desiredPart === '' ? 
                        <div className="no-specs">
                            <i className="fa-solid fa-bicycle"></i>
                            <p>Select your owned parts and desired part to set your specifications.</p> 
                        </div>
                    : 
                        <div className="specs-container">
                            {renderDynamicForm()}
                        </div>
                    }
                </div>
                <div className="row-3">
                    <button className="upgrade-part" onClick={handleFindParts}>Find parts</button>
                </div>
            </div>
            <div className="right-container">
                <h4>{desiredPart === '' ? 'Parts' : desiredPart + 's'}</h4>
                <div className="parts-container">
                    <div className="specs-not-set">
                        <p>Enter your specifications and press <strong>Find Parts</strong>.</p>
                    </div>
                    {/* <div className="parts">
                        <div className="part">
                            <div className="part-image">
                                <img src="https://via.placeholder.com/150" alt="part" />
                            </div>
                            <div className="part-details">
                                <h5>Part Name</h5>
                                <p>Part Description</p>
                                <p>{PesoFormat.format(1000)}</p>
                                <button>Add to cart</button>
                            </div>
                        </div>
                        <div className="part">
                            <div className="part-image">
                                <img src="https://via.placeholder.com/150" alt="part" />
                            </div>
                            <div className="part-details">
                                <h5>Part Name</h5>
                                <p>Part Description</p>
                                <p>{PesoFormat.format(1000)}</p>
                                <button>Add to cart</button>
                            </div>
                        </div>
                        <div className="part">
                            <div className="part-image">
                                <img src="https://via.placeholder.com/150" alt="part" />
                            </div>
                            <div className="part-details">
                                <h5>Part Name</h5>
                                <p>Part Description</p>
                                <p>{PesoFormat.format(1000)}</p>
                                <button>Add to cart</button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );

};

export default BikeUpgrader;