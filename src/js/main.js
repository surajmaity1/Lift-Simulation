const noOfFloors = document.getElementById('noOfFloors');
const noOfLifts = document.getElementById('noOfLifts');
const playButton = document.getElementById('playButton');
const formContainer = document.getElementById('form_container');
const constructFloors = document.getElementById('floors');

const floors = [];
const lifts = [];
const scheduleOperation = [];

playButton.addEventListener('click', function(event) {
    if (noOfFloors.value < 2 || noOfLifts.value < 1) {
        return;
    }

    event.preventDefault();
    formContainer.remove();

    createFloors(noOfFloors.value, noOfLifts.value);
    createLifts(noOfLifts.value);
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
        const generateId = totalNoOfFloors - floor;

        eachFloor.id = `floor_${generateId}`;
        eachFloor.classList.add('floor');

        lineSeparator.style.backgroundColor = 'black';
        lineSeparator.style.height='4px';
        lineSeparator.style.width='100%';
        lineSeparator.style.borderRadius='10px';

        floorName.textContent = `Floor ${generateId}`;
        floorName.style.textAlign = 'right';

        upButton.id = `up_button_${generateId}`;
        upButton.innerHTML = 'Up';
        upButton.addEventListener('click', allLiftsButtonsControler);

        downButton.id = `down_button_${generateId}`;
        downButton.innerHTML = 'Down';
        downButton.addEventListener('click', allLiftsButtonsControler);


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
    const groundFloor = document.querySelector('#floor_1');

    for (let liftNumber = 0; liftNumber < totalNoOfLifts; liftNumber++) {
        const mainLiftNumber = liftNumber + 1;
        const eachLift = document.createElement('div');
        const liftLeftDoor = document.createElement('div');
        const liftRightDoor = document.createElement('div');

        liftLeftDoor.id = `left_lift_door_${mainLiftNumber}`;
        liftLeftDoor.classList.add('lift-door');

        liftRightDoor.id = `right_lift_door_${mainLiftNumber}`;
        liftRightDoor.classList.add('lift-door');

        eachLift.id = `lift_${mainLiftNumber}`;
        eachLift.classList.add('lift');
        eachLift.appendChild(liftLeftDoor);
        eachLift.appendChild(liftRightDoor);

        const eachLiftState = {
            liftId: mainLiftNumber,
            stateStatus: false,
            movingStatus: false,
            whereMoving: null,
            floorNumberAt: 0,
            element: eachLift
        };

        lifts.push(eachLiftState);
        groundFloor.appendChild(eachLift);
    }
}

function openDoorsOfCurrentLift(currentLiftId) {
    const liftLeftDoor = document.querySelector(`#left_lift_door_${currentLiftId}`);
    const liftRightDoor = document.querySelector(`#right_lift_door_${currentLiftId}`);

    // open door
    setTimeout(() => {
        liftLeftDoor.style.transform = 'translateX(-100%)';
        liftLeftDoor.style.transition = `transform 2.5s`;
        liftRightDoor.style.transform = 'translateX(100%)';
        liftRightDoor.style.transition = `transform 2.5s`;
    }, 2500);

    // close door
    setTimeout(() => {
        liftLeftDoor.style.transform = 'translateX(0)';
        liftLeftDoor.style.transition = `transform 2.5s`;
        liftRightDoor.style.transform = 'translateX(0)';
        liftRightDoor.style.transition = `transform 2.5s`;
    }, 5000);
}

function allLiftsButtonsControler(event) {
    const button = event.target.id;
    const floorNumberAt = button.split('_')[2] - 1;

    // check any lift present at same floor from where button is clicked
    const currentLiftAt = lifts.find(
        (lift) => {
            return lift.floorNumberAt === floorNumberAt && lift.movingStatus === false
        }
    );

    if (currentLiftAt) {
        openDoorsOfCurrentLift(currentLiftAt.liftId);
        return;
    }

    // check any lift moving at that floor from where button is clicked
    const anyMovingLiftToFloor = lifts.find(
        (lift) => {
            lift.whereMoving === floorNumberAt && lift.movingStatus === true
        }
    );

    if (anyMovingLiftToFloor) {
        return;
    }

    scheduleOperation.push(floorNumberAt);
}

function getNearestLiftId (currentFloor) {

    // finding nearest lift id
    let distance = floors.length;
    let id = lifts[0].liftId;
    const totalNoOfLifts = lifts.length;

    for (let liftIdx = 0; liftIdx < totalNoOfLifts; liftIdx++) {
        const eachLift = lifts[liftIdx];

        if (eachLift.stateStatus === false && Math.abs(eachLift.floorNumberAt - currentFloor) < distance) {
            id = eachLift.liftId;
            distance = Math.abs(eachLift.floorNumberAt - currentFloor);
        }
    }

    return id;
}

function liftOperationScheduler() {
    if (scheduleOperation.length === 0) {
        return;
    }

    const getLift = scheduleOperation.shift();
    const id = getNearestLiftId(getLift);

    const lift = lifts.find(
        (lift) => lift.liftId === id
    );

    if (!lift) {
        scheduleOperation.unshift(getLift);
        return;
    }

    liftMovement(lift.floorNumberAt, getLift, id);
}

function liftMovement(source, destination, currentLiftId) {
    const currentLift = lifts.find(
        (lift) => lift.liftId === id
    );

    const liftLeftDoor = document.querySelector(`#left_lift_door_${currentLiftId}`);
    const liftRightDoor = document.querySelector(`#right_lift_door_${currentLiftId}`);


}