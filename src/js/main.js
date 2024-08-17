const noOfFloors = document.getElementById('noOfFloors');
const noOfLifts = document.getElementById('noOfLifts');
const playButton = document.getElementById('playButton');
const formContainer = document.getElementById('form_container');
const constructFloors = document.getElementById('floors');

const floors = [];
const lifts = [];

const eachLiftState = {
    liftId: 0,
    stateStatus: false,
    movingStatus: false,
    whereMoving: null,
    floorNumberAt: 0,
    element: null
};

playButton.addEventListener('click', function(event) {
    if (noOfFloors.value < 2 || noOfLifts.value < 1) {
        return;
    }

    event.preventDefault();
    formContainer.remove();

    createFloors(noOfFloors.value, noOfLifts.value);
});

function createFloors(totalNoOfFloors, totalNoOfLifts) {
    
    const windowInnerHeight = window.innerHeight;
    const windowInnerWidth = window.innerWidth;
    
    for (let floor = 0; floor < totalNoOfFloors; floor++) {
        const eachFloor = document.createElement('div');
        const lineSeparator = document.createElement('div');
        const floorName = document.createElement('p');
        const upButton = document.createElement('button');
        const downButton = document.createElement('button');

        eachFloor.id = `floor#${(floor + 1)}`;
        eachFloor.style.backgroundColor = 'white';
        eachFloor.style.height='50px';
        eachFloor.style.width='100%';

        lineSeparator.style.backgroundColor = 'black';
        lineSeparator.style.height='4px';
        lineSeparator.style.width='100%';
        lineSeparator.style.borderRadius='10px';

        floorName.id = `floor_name#${(floor + 1)}`;
        floorName.textContent = `Floor ${totalNoOfFloors - floor}`;
        floorName.style.textAlign = 'right';

        upButton.id = `up_button_#${floor+1}`;
        upButton.innerHTML = 'Up';

        downButton.id = `down_button_#${floor+1}`;
        downButton.innerHTML = 'Down';


        floors.push(eachFloor);
        constructFloors.appendChild(floorName);

        if (floor !== 0) {
            constructFloors.appendChild(upButton);
            constructFloors.appendChild(document.createElement('br'));
        }
        if (floor !== totalNoOfFloors - 1) {
            constructFloors.appendChild(downButton);
        }

        constructFloors.appendChild(eachFloor);
        constructFloors.appendChild(lineSeparator);

    }
}

function createLifts(totalNoOfLifts) {
    for (let liftNumber = 0; liftNumber < totalNoOfLifts; liftNumber++) {
        const eachLift = document.createElement('div');
        const liftLeftDoor = document.createElement('div');
        const liftRightDoor = document.createElement('div');

        liftLeftDoor.id = `left_door#${liftNumber + 1}`;
        liftRightDoor.id = `right_door#${liftNumber + 1}`;

        eachLift.id = `lift#${liftNumber + 1}`;
        eachLift.appendChild(liftLeftDoor);
        eachLift.appendChild(liftRightDoor);


        eachLiftState.liftId = `lift#${liftNumber + 1}`;
        eachLiftState.stateStatus = false;
        eachLiftState.element = eachLift;

        lifts.push(eachLiftState);
    }
}