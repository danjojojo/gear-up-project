// Compatibility Specifications
export const compatibilitySpecs = {
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
            'rotorSize'
        ],
        wheelset: [
            'rearHubWidth', // Frame rear hub spacing -> Rear hub width
            'axleType', // Frame axle type -> Rear hub axle type
            'frameSize', // Frame size -> Tire size
            'maxTireWidth' // Frame max tire width -> Tire width
        ],
        seat: [
            'seatpostDiameter' // Frame seat post diameter -> Seat post diameter
        ],
        cockpit: [
            'headTubeType', // Headtube -> Headset type
            'headTubeUpperDiameter', // Headtube upper dia -> Headset upper dia
            'headTubeLowerDiameter' // Headtube lower dia -> Headset lower dia
        ]
    },
    fork: {
        wheelset: [
            'frontHubWidth', // Fork hub spacing -> Front hub width
            'axleType', // Fork axle type -> Front hub axle type
            'forkSize',
            'maxTireWidth' // Fork max tire width -> Frame max tire width
        ],
        cockpit: [
            'forkTubeUpperDiameter' // Fork tube upper dia -> Stem fork diameter
        ],
        frame: [
            'forkTravel', // Fork travel -> Frame purpose
            'forkSize', // Fork size -> Frame size
            'forkTubeType' // Fork tube type -> Head tube
            // 'forkAxleType', // Fork axle type -> Frame axle type
            // 'forkAxleDiameter', // Fork axle diameter -> Frame axle diameter
            // 'forkRotorSizes', // Fork rotor size -> Frame rotor size
            // 'forkMaxTireWidth' // Fork max tire width -> Frame max tire width
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
            'rotorSize',
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
            'tireSize',
            'tireWidth' // Fork max tire width -> Frame max tire width
        ],
        groupset: [
            'hubCassetteType', // Rear hub cassette type -> Cassette type
            'rearHubSpeed', // Rear hub speed -> Cassette speed
            'hubRotorType' // Hubs rotor mount type -> Rotor mount type
        ]
    },
    seat: {
        frame: [
            'seatpostDiameter' // Seat post diameter -> Frame seat post diameter
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
export const formOptions = {
    purpose: ["Cross-country (XC)", "Trail", "Enduro", "Downhill (DH)"],
    frameSize: ['26"', '27.5"', '29"'],
    headTubeType: ["Non Tapered", "Tapered"],
    headTubeUpperDiameter: ["44mm", "49mm", "55mm"],
    headTubeLowerDiameter: ["44mm", "55mm", "56mm"],
    frameAxleDiameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
    bottomBracketType: ["Threaded (BSA)", "Press-Fit (PF30, BB86, BB92)", "BB30"],
    bottomBracketWidth: ["68mm", "73mm (MTB)", "83mm (Downhill)", "86mm (Press-Fit)", "92mm (MTB)"],
    frameRotorSize: ["160mm", "180mm", "203mm"],
    rearHubWidth: ["135mm (Rear)", "142mm (Rear)", "148mm (Boost Rear)", "150mm (Downhill)"],

    maxTireWidth: ['2.1', '2.25', '2.4', '2.6', '2.8'],
    axleType: ["Quick Release (QR)", "Thru-Axle"],
    seatpostDiameter: ["27.2mm", "30.9mm", "31.6mm", "34.9mm"],
    rotorSize: ["160mm", "180mm", "203mm"],

    forkSize: ['26"', '27.5"', '29"'],
    forkTubeType: ["Non Tapered", "Tapered"],
    forkTubeUpperDiameter: ['1 1/8"', '1 1/4"', '1.5"'],
    forkTubeLowerDiameter: ['1 1/8"', '1 1/4"', '1.5"'],
    forkTravel: ["80mm to 120mm", "120mm to 160mm", "150mm to 180mm", "180mm to 200mm"],
    forkAxleDiameter: ["9mm (QR)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
    forkSuspensionType: ["Air", "Coil", "N/A (Rigid)"],
    forkRotorSize: ["160mm", "180mm", "203mm"],
    frontHubWidth: ["100mm (Front)", "110mm (Boost Front)"],

    chainringSpeed: ["Single (1x)", "Double (2x)", "Triple (3x)"],
    crankArmLength: ["165mm", "170mm", "175mm", "180mm"],
    frontDerailleurSpeed: ["2-speed", "3-speed", "N/A (1x Chainring speed)"],
    rearDerailleurSpeed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
    cassetteType: ["Cassette", "Threaded"],
    cassetteSpeed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
    chainSpeed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
    rotorMountType: ["6-bolt", "Centerlock"],

    hubRotorType: ["6-bolt", "Centerlock"],
    hubCassetteType: ["Cassette", "Threaded"],
    hubHoles: ["28H", "32H", "36H"],
    frontHubAxleType: ["Quick Release (QR)", "Thru-Axle (TA)"],
    frontHubAxleDiameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
    rearHubAxleType: ["Quick Release (QR)", "Thru-Axle (TA)"],
    rearHubAxleDiameter: ["9mm (QR)", "12mm (Thru-Axle)", "15mm (Thru-Axle)", "20mm (Thru-Axle)"],
    rearHubSpeed: ["8-speed", "9-speed", "10-speed", "11-speed", "12-speed"],
    tireSize: ['26"', '27.5"', '29"'],
    tireWidth: ['1.9', '1.95', '2.0', '2.1', '2.125', '2.25', '2.4', '2.6', '2.8'],
    rimSpokes: ["28", "32", "36"],

    seatpostLength: ["300mm", "350mm", "400mm", "450mm"],
    seatClampType: ["Quick Release", "Bolt-On"],
    saddleMaterial: ["Leather", "Synthetic", "Gel"],
    handleBarLength: ["680mm", "700mm", "720mm", "760mm"],
    handleBarClampDiameter: ["25.4mm", "31.8mm", "35mm"],
    handleBarType: ["Flat", "Riser", "Drop"],
    stemClampDiameter: ["25.4mm", "31.8mm", "35mm"],
    stemLength: ["60mm", "70mm", "80mm", "90mm", "100mm"],
    stemAngle: ["Negative", "Positive"],
    stemForkDiameter: ['1 1/8"', '1 1/4"', '1.5"'],
    headsetType: ["Non Tapered", "Tapered"],
    headsetCupType: ["Integrated", "Non-integrated"],
    headsetUpperDiameter: ["44mm", "49mm", "55mm"],
    headsetLowerDiameter: ["44mm", "55mm", "56mm"]
};