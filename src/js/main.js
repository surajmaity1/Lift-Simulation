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
    const windowInnerWidth = window.innerWidth;
    const widthForAllLifts = 50 * totalNoOfLifts;
    const width = widthForAllLifts < windowInnerWidth ? `${windowInnerWidth - 50}px` : `${widthForAllLifts}px`;
    
    for (let floor = 0; floor < totalNoOfFloors; floor++) {
        const eachFloor = document.createElement('div');
        const lineSeparator = document.createElement('div');
        const floorName = document.createElement('p');
        const upButton = document.createElement('button');
        const downButton = document.createElement('button');
        const generateId = totalNoOfFloors - floor;

        eachFloor.id = `floor_${generateId}`;
        eachFloor.classList.add('floor');
        eachFloor.style.width = width;

        lineSeparator.style.backgroundColor = 'black';
        lineSeparator.style.height='4px';
        lineSeparator.style.width='100%';
        lineSeparator.style.borderRadius='10px';

        floorName.textContent = `Floor ${generateId}`;
        floorName.style.textAlign = 'right';
        floorName.style.fontWeight = 'bold';

        upButton.id = `up_button_${generateId}`;
        upButton.innerHTML = 'Up';
        upButton.classList.add('up_button');
        upButton.addEventListener('click', allLiftsButtonsControler);

        downButton.id = `down_button_${generateId}`;
        downButton.innerHTML = 'Down';
        downButton.classList.add('down_button');
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

    setInterval(() => {
        liftOperationScheduler();
    }, 500);
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

    // if lift present at current floor, simple open gate and close gate
    // don't move other lift
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

    // if lift is moving, return
    if (anyMovingLiftToFloor) {
        return;
    }

    // put operation in array
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
    // get lift id
    const id = getNearestLiftId(getLift);

    const lift = lifts.find(
        (lift) => lift.liftId === id
    );

    // if there is any lift 
    if (!lift) {
        scheduleOperation.unshift(getLift);
        return;
    }

    // move lift now
    liftMovement(lift.floorNumberAt, getLift, id);
}

function liftMovement(source, destination, currentLiftId) {
    const currentLift = lifts.find(
        (lift) => lift.liftId === currentLiftId
    );

    const liftLeftDoor = document.querySelector(`#left_lift_door_${currentLiftId}`);
    const liftRightDoor = document.querySelector(`#right_lift_door_${currentLiftId}`);
    const distance = -1 * destination * 160;
    const time = Math.abs(source - destination);

    setTimeout(() => {
        liftLeftDoor.style.transform = 'translateX(-100%)';
        liftLeftDoor.style.transition = 'transform 2.5s';
        liftRightDoor.style.transform = 'translateX(100%)';
        liftRightDoor.style.transition = 'transform 2.5s';
        currentLift.floorNumberAt = destination;
        currentLift.movingStatus = false;
        currentLift.whereMoving = null;
    }, time * 1000);

    currentLift.stateStatus = true;

    setTimeout(() => {
        liftLeftDoor.style.transform = 'translateX(0)';
        liftLeftDoor.style.transition = 'transform 2.5s';
        liftRightDoor.style.transform = 'translateX(0)';
        liftRightDoor.style.transition = 'transform 2.5s';
    }, time * 1000 + 2500);

    setTimeout(() => {
        currentLift.stateStatus = false;
    }, time * 1000 + 5000);

    currentLift.whereMoving = destination;
    currentLift.movingStatus = true;
    currentLift.element.style.transform = `translateY(${distance}px)`;
    currentLift.element.style.transition = `transform ${time}s`;
}
