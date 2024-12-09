// Compatibility Specifications
import { useEffect, useState } from 'react';
import { getCompatibilitySpecs } from '../services/bikeBuilderService';

const transformSpecsData = (data) => {
    const transformedSpecs = {};

    data.forEach((row) => {
        const { part_type_from, part_type_to, attribute_from, attribute_to } = row;
        const lowerCasePartTypeFrom = part_type_from.toLowerCase();
        const lowerCasePartTypeTo = part_type_to.toLowerCase();

        // Initialize part_type_from and part_type_to if not already present
        if (!transformedSpecs[lowerCasePartTypeFrom]) {
            transformedSpecs[lowerCasePartTypeFrom] = {};
        }
        if (!transformedSpecs[lowerCasePartTypeFrom][lowerCasePartTypeTo]) {
            transformedSpecs[lowerCasePartTypeFrom][lowerCasePartTypeTo] = [];
        }

        // Add the attribute pair to the appropriate place in the object
        transformedSpecs[lowerCasePartTypeFrom][lowerCasePartTypeTo].push(attribute_from);
    });
    return transformedSpecs;
};

// Get Compatibility Specs
export const useCompatibilitySpecs = (bikeType) => {
    const [compatibilitySpecs, setCompatibilitySpecs] = useState({});
    useEffect(() => {
        const fetchCompatibilitySpecs = async () => {
            try {
                const { specs } = await getCompatibilitySpecs(bikeType);
                const transformedSpecs = transformSpecsData(specs);
                setCompatibilitySpecs(transformedSpecs);
            } catch (error) {
                console.error('Error fetching compatibility specs:', error);
            }
        }
        fetchCompatibilitySpecs();
    }, [bikeType]);
    return compatibilitySpecs;
}

// export const compatibilitySpecs = {
//     frame: {
//         fork: [
//             'purpose', // Frame purpose -> Fork travel
//             'frame_size', // Frame size -> Fork size
//             'headTubeType', // Head tube -> Fork tube type
//         ],
//         groupset: [
//             'bottomBracketType', // Frame bottom bracket type -> Bottom bracket type
//             'bottomBracketWidth', // Frame bottom bracket width -> Bottom bracket width
//             'rotorSize'
//         ],
//         wheelset: [
//             'rearHubWidth', // Frame rear hub spacing -> Rear hub width
//             'axleType', // Frame axle type -> Rear hub axle type
//             'frameSize', // Frame size -> Tire size
//             'maxTireWidth' // Frame max tire width -> Tire width
//         ],
//         seat: [
//             'seatpostDiameter' // Frame seat post diameter -> Seat post diameter
//         ],
//         cockpit: [
//             'headTubeType', // Headtube -> Headset type
//             'headTubeUpperDiameter', // Headtube upper dia -> Headset upper dia
//             'headTubeLowerDiameter' // Headtube lower dia -> Headset lower dia
//         ]
//     },
//     fork: {
//         wheelset: [
//             'frontHubWidth', // Fork hub spacing -> Front hub width
//             'axleType', // Fork axle type -> Front hub axle type
//             'forkSize',
//             'maxTireWidth' // Fork max tire width -> Frame max tire width
//         ],
//         cockpit: [
//             'forkTubeUpperDiameter' // Fork tube upper dia -> Stem fork diameter
//         ],
//         frame: [
//             'forkTravel', // Fork travel -> Frame purpose
//             'forkSize', // Fork size -> Frame size
//             'forkTubeType' // Fork tube type -> Head tube
//         ]
//     },
//     groupset: {
//         wheelset: [
//             'cassetteType', // Cassette type -> Rear hub cassette type
//             'cassetteSpeed', // Cassette speed -> Rear hub speed
//             'rotorMountType' // Rotor mount type -> Hubs rotor mount type
//         ],
//         frame: [
//             'bottomBracketType', // Bottom bracket type -> Frame bottom bracket type
//             'bottomBracketWidth', // Bottom bracket width -> Frame bottom bracket width
//             'rotorSize',
//         ]
//     },
//     wheelset: {
//         frame: [
//             'rearHubWidth', // Rear hub width -> Frame rear hub spacing
//             'rearHubAxleType', // Rear hub axle type -> Frame axle type
//             'tireSize', // Tire size -> Frame size
//             'tireWidth' // Tire width -> Frame max tire width
//         ],
//         fork: [
//             'frontHubWidth', // Front hub width -> Fork hub spacing
//             'frontHubAxleType', // Front hub axle type -> Fork axle type
//             'tireSize',
//             'tireWidth' // Fork max tire width -> Frame max tire width
//         ],
//         groupset: [
//             'hubCassetteType', // Rear hub cassette type -> Cassette type
//             'rearHubSpeed', // Rear hub speed -> Cassette speed
//             'hubRotorType' // Hubs rotor mount type -> Rotor mount type
//         ]
//     },
//     seat: {
//         frame: [
//             'seatpostDiameter' // Seat post diameter -> Frame seat post diameter
//         ]
//     },
//     cockpit: {
//         frame: [
//             'headsetType', // Headset type -> Headtube
//             'headsetUpperDiameter', // Headset upper diameter -> Headtube upper dia
//             'headsetLowerDiameter' // Headset lower diameter -> Headtube lower dia
//         ],
//         fork: [
//             'stemForkDiameter' // Stem fork diameter -> Fork tube upper dia
//         ]
//     }
// };

// Form Options Matching Compatibility Specs

export const formOptions = {
    purpose: ["Cross-country (XC)", "Trail", "Enduro", "Downhill (DH)"],
    frame_size: ['26"', '27.5"', '29"'],
    head_tube_type: ["Non Tapered", "Tapered"],
    head_tube_upper_diameter: ["44mm", "49mm", "55mm"],
    head_tube_lower_diameter: ["44mm", "55mm", "56mm"],
    frame_axle_diameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
    bottom_bracket_type: ["Threaded (BSA)", "Press-Fit (PF30, BB86, BB92)", "BB30"],
    bottom_bracket_width: ["68mm", "73mm (MTB)", "83mm (Downhill)", "86mm (Press-Fit)", "92mm (MTB)"],
    frame_rotor_size: ["160mm", "180mm", "203mm"],
    rear_hub_width: ["135mm (Rear)", "142mm (Rear)", "148mm (Boost Rear)", "150mm (Downhill)"],
    max_tire_width: ['2.1', '2.25', '2.4', '2.6', '2.8'],
    axle_type: ["Quick Release (QR)", "Thru-Axle"],
    seatpost_diameter: ["27.2mm", "30.9mm", "31.6mm", "34.9mm"],
    rotor_size: ["160mm", "180mm", "203mm"],
    fork_size: ['26"', '27.5"', '29"'],
    fork_tube_type: ["Non Tapered", "Tapered"],
    fork_tube_upper_diameter: ['1 1/8"', '1 1/4"', '1.5"'],
    fork_tube_lower_diameter: ['1 1/8"', '1 1/4"', '1.5"'],
    fork_travel: ["80mm to 120mm", "120mm to 160mm", "150mm to 180mm", "180mm to 200mm"],
    fork_axle_diameter: ["9mm (QR)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
    fork_suspension_type: ["Air", "Coil", "N/A (Rigid)"],
    fork_rotor_size: ["160mm", "180mm", "203mm"],
    front_hub_width: ["100mm (Front)", "110mm (Boost Front)"],
    chainring_speed: ["Single (1x)", "Double (2x)", "Triple (3x)"],
    crank_arm_length: ["165mm", "170mm", "175mm", "180mm"],
    front_derailleur_speed: ["2-speed", "3-speed", "N/A (1x Chainring speed)"],
    rear_derailleur_speed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
    cassette_type: ["Cassette", "Threaded"],
    cassette_speed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
    chain_speed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
    rotor_mount_type: ["6-bolt", "Centerlock"],
    hub_rotor_type: ["6-bolt", "Centerlock"],
    hub_cassette_type: ["Cassette", "Threaded"],
    hub_holes: ["28H", "32H", "36H"],
    front_hub_axle_type: ["Quick Release (QR)", "Thru-Axle (TA)"],
    front_hub_axle_diameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
    rear_hub_axle_type: ["Quick Release (QR)", "Thru-Axle (TA)"],
    rear_hub_axle_diameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
    rear_hub_speed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
    tire_size: ['26"', '27.5"', '29"'],
    tire_width: ['1.9', '1.95', '2.0', '2.1', '2.125', '2.25', '2.4', '2.6', '2.8'],
    rim_spokes: ["28", "32", "36"],
    seatpost_length: ["300mm", "350mm", "400mm", "450mm"],
    seat_clamp_type: ["Quick Release", "Bolt-On"],
    saddle_material: ["Leather", "Synthetic", "Gel"],
    handle_bar_length: ["680mm", "700mm", "720mm", "760mm"],
    handle_bar_clamp_diameter: ["25.4mm", "31.8mm", "35mm"],
    handle_bar_type: ["Flat", "Riser", "Drop"],
    stem_clamp_diameter: ["25.4mm", "31.8mm", "35mm"],
    stem_length: ["60mm", "70mm", "80mm", "90mm", "100mm"],
    stem_angle: ["Negative", "Positive"],
    stem_fork_diameter: ['1 1/8"', '1 1/4"', '1.5"'],
    headset_type: ["Non Tapered", "Tapered"],
    headset_cup_type: ["Integrated", "Non-integrated"],
    headset_upper_diameter: ["44mm", "49mm", "55mm"],
    headset_lower_diameter: ["44mm", "55mm", "56mm"]
};
