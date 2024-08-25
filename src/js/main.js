const noOfFloors = document.getElementById('noOfFloors');
const noOfLifts = document.getElementById('noOfLifts');
const playButton = document.getElementById('playButton');
const formContainer = document.getElementById('form_container');
const constructFloors = document.getElementById('floors');

const floors = [];
const lifts = [];
const scheduleOperation = [];

playButton.addEventListener('click', function (event) {
    if (noOfFloors.value < 1 || noOfLifts.value < 1) {
        return;
    }

    event.preventDefault();
    formContainer.remove();

    createFloors(noOfFloors.value, noOfLifts.value);
    createLifts(noOfLifts.value);
});

function createFloors(totalNoOfFloors, totalNoOfLifts) {
    const windowInnerWidth = window.innerWidth;
    const widthForAllLifts = 100 * totalNoOfLifts;
    const width = widthForAllLifts < windowInnerWidth ? `${windowInnerWidth - 100}px` : `${widthForAllLifts}px`;

    for (let floor = 0; floor < totalNoOfFloors; floor++) {
        const eachFloor = document.createElement('div');
        const floorName = document.createElement('p');
        const containers = document.createElement('div');
        const upButton = document.createElement('button');
        const downButton = document.createElement('button');
        const generateId = totalNoOfFloors - floor;

        eachFloor.id = `floor_${generateId}`;
        eachFloor.classList.add('floor');
        eachFloor.style.width = width;

        floorName.innerHTML = `Floor ${generateId}`;

        upButton.id = `up_button_${generateId}`;
        upButton.innerHTML = 'Up';
        upButton.classList.add('up_button');
        upButton.addEventListener('click', allLiftsButtonsController);

        downButton.id = `down_button_${generateId}`;
        downButton.innerHTML = 'Down';
        downButton.classList.add('down_button');
        downButton.addEventListener('click', allLiftsButtonsController);

        // for ground floor, only up button appear
        // for top floor, only down button appear
        if (floor !== 0) {
            containers.appendChild(upButton);
        }
        containers.appendChild(downButton);
        containers.appendChild(floorName);

        if (floor === 0) {
            upButton.style.visibility = 'hidden';
        }

        if (floor === totalNoOfFloors - 1) {
            downButton.style.visibility = 'hidden';
        }

        floors.push(eachFloor);
        eachFloor.appendChild(containers);
        constructFloors.appendChild(eachFloor);
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
        eachLift.appendChild(liftLeftDoor);
        eachLift.appendChild(liftRightDoor);
        eachLift.classList.add('lift');

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
    }, 100);
}

function openDoorsOfCurrentLift(currentLiftId) {
    const lift = lifts.find((lift) => lift.liftId === currentLiftId);
    const liftLeftDoor = document.querySelector(`#left_lift_door_${currentLiftId}`);
    const liftRightDoor = document.querySelector(`#right_lift_door_${currentLiftId}`);

    lift.stateStatus = true;
    // open door
    setTimeout(() => {
        liftLeftDoor.style.transform = 'translateX(-100%)';
        liftLeftDoor.style.transition = `transform 2.5s`;
        liftRightDoor.style.transform = 'translateX(100%)';
        liftRightDoor.style.transition = `transform 2.5s`;
        console.log('openDoorsOfCurrentLift door open start', lift);
    }, 2500);

    // close door
    setTimeout(() => {
        liftLeftDoor.style.transform = 'translateX(0)';
        liftLeftDoor.style.transition = `transform 2.5s`;
        liftRightDoor.style.transform = 'translateX(0)';
        liftRightDoor.style.transition = `transform 2.5s`;
    }, 5000);

    setTimeout(() => {
        lift.stateStatus = false;
        console.log('openDoorsOfCurrentLift door close complete', lift);
    }, 7000);
    console.log('openDoorsOfCurrentLift just started', lift);
}

function allLiftsButtonsController(event) {
    const button = event.target.id;
    const floorNumberAt = button.split('_')[2] - 1;
    console.log(floorNumberAt);
    // check any lift present at same floor from where button is clicked
    const currentLiftAt = lifts.find(
        (lift) => {
            return lift.floorNumberAt === floorNumberAt && lift.movingStatus === false
        }
    );
    //console.log('currentLiftAt', currentLiftAt);
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

    // console.log('anyMovingLiftToFloor:', anyMovingLiftToFloor);

    // if lift is moving, return
    if (anyMovingLiftToFloor) {
        return;
    }
    console.log('schedule');

    // put operation in array
    scheduleOperation.push(floorNumberAt);
}

function getNearestLiftId(currentFloor) {

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
    const floorToMove = scheduleOperation.shift();
    // get lift id
    const id = getNearestLiftId(floorToMove);

    const lift = lifts.find(
        (lift) => lift.liftId === id
    );

    // if there is any lift 
    if (!lift) {
        scheduleOperation.unshift(floorToMove);
        return;
    }

    if (lift.stateStatus === true) {
        console.log('Already opened & wait', lift);

        // find nearest lift that is not moving & door close
        let distance = floors.length;
        let nearestLiftId = null;
        const totalNoOfLifts = lifts.length;

        for (let liftIdx = 0; liftIdx < totalNoOfLifts; liftIdx++) {
            const eachLift = lifts[liftIdx];

            if (eachLift.stateStatus === false &&
                eachLift.movingStatus === false &&
                eachLift.whereMoving === null &&
                Math.abs(eachLift.floorNumberAt - floorToMove) < distance
            ) {
                nearestLiftId = eachLift.liftId;
                distance = Math.abs(eachLift.floorNumberAt - floorToMove);
            }
        }

        if (!nearestLiftId) {
            scheduleOperation.push(floorToMove);
            return;
        }

        const liftFound = lifts.find((lift) => lift.liftId === nearestLiftId);
        if (!liftFound) {
            scheduleOperation.push(floorToMove);
            return;
        }
        liftMovement(liftFound.floorNumberAt, floorToMove, nearestLiftId);

        return;
    }

    if (lift.movingStatus === true) {
        console.log('Already moving', lift);

        //FIXED: AFTER COMPLETION OF MOVEMENT, THEN OTHER STARTED MOVING
        // if already moving to that floor
        const alreadyMovingLift = lifts.find((lift) => lift.whereMoving === floorToMove);
        if (alreadyMovingLift) {
            return;
        }

        // find nearest lift that is not moving & door close
        let distance = floors.length;
        let nearestLiftId = null;
        const totalNoOfLifts = lifts.length;

        for (let liftIdx = 0; liftIdx < totalNoOfLifts; liftIdx++) {
            const eachLift = lifts[liftIdx];

            if (eachLift.stateStatus === false &&
                eachLift.movingStatus === false &&
                eachLift.whereMoving === null &&
                Math.abs(eachLift.floorNumberAt - floorToMove) < distance
            ) {
                nearestLiftId = eachLift.liftId;
                distance = Math.abs(eachLift.floorNumberAt - floorToMove);
            }
        }

        const liftFound = lifts.find((lift) => lift.liftId === nearestLiftId);
        if (!liftFound) {
            scheduleOperation.push(floorToMove);
            return;
        }
        liftMovement(liftFound.floorNumberAt, floorToMove, nearestLiftId);
        return;
    }

    // move lift now
    liftMovement(lift.floorNumberAt, floorToMove, id);
}

function liftMovement(source, destination, currentLiftId) {
    const currentLift = lifts.find(
        (lift) => lift.liftId === currentLiftId
    );

    const liftLeftDoor = document.querySelector(`#left_lift_door_${currentLiftId}`);
    const liftRightDoor = document.querySelector(`#right_lift_door_${currentLiftId}`);
    const distance = -1 * destination * 160;
    const time = Math.abs(source - destination) * 2;

    currentLift.whereMoving = destination;
    currentLift.movingStatus = true;

    setTimeout(() => {
        liftLeftDoor.style.transform = 'translateX(-100%)';
        liftLeftDoor.style.transition = 'transform 2.5s';
        liftRightDoor.style.transform = 'translateX(100%)';
        liftRightDoor.style.transition = 'transform 2.5s';
        currentLift.stateStatus = true;
        currentLift.floorNumberAt = destination;
        currentLift.movingStatus = false;
        currentLift.whereMoving = null;
        console.log('lift moving complete & door open start: ', currentLift);
    }, time * 1000);


    setTimeout(() => {
        liftLeftDoor.style.transform = 'translateX(0)';
        liftLeftDoor.style.transition = 'transform 2.5s';
        liftRightDoor.style.transform = 'translateX(0)';
        liftRightDoor.style.transition = 'transform 2.5s';
    }, time * 1000 + 2500);

    setTimeout(() => {
        currentLift.stateStatus = false;
        console.log('lift moving complete & door close complete: ', currentLift);
    }, time * 1000 + 5000);

    console.log('lift moving start: ', currentLift);
    currentLift.element.style.transform = `translateY(${distance}px)`;
    currentLift.element.style.transition = `transform ${time}s`;
}
