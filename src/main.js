async function loadJson() {

    const data = await fetch('labyrinthes.json')
        .then(response => response.json());

    let gridSize = 15;
    let mazeName = 'ex-0';

    return {
        gridSize: gridSize,
        cellData: data[gridSize][mazeName]
    };
}

function createMaze(mazeBoard) {

    // We destructure the object
    const {cellData, gridSize} = mazeBoard;

    // We create the grid layout
    const mainDiv = document.getElementById('mainDiv');
    mainDiv.style.gridTemplateColumns = 'repeat(' + gridSize + ', 100px)';
    mainDiv.style.gridTemplateRows = 'repeat(' + gridSize + ', 100px)';

    // We loop through to create cells and walls
    for (let i = 0; i < cellData.length; i++) {
        let createCell = document.createElement('div');
        let currentCell = cellData[i];

        // We add the cellNumber and adjacent cells property to the cellData Object
        currentCell.cellNumber = i;
        currentCell.adjacentCells = [];

        // We add the cellNumber in the display
        createCell.innerHTML += '<div>' + (currentCell.cellNumber) + '</div>';

        if (i === 0) {
            createCell.style.backgroundColor = 'orange'
        }

        // We get the last iteration to set the exit cell in green
        if (i === cellData.length - 1) {
            createCell.style.backgroundColor = "green"
        }
        // We apply the class for the color
        createCell.className = 'cell-color cell-' + i;

        // We apply the border for the walls and add adjacent cells property
        let walls = cellData[i]["walls"];

        if (walls[0]) {
            createCell.style.borderTop = '1px solid';
        } else {
            // We add the top adjacent cell
            currentCell.adjacentCells.push(currentCell.cellNumber - gridSize);
        }

        if (walls[3]) {
            createCell.style.borderLeft = '1px solid';
        } else {
            // We add the right adjacent cell
            currentCell.adjacentCells.push(currentCell.cellNumber - 1);
        }

        if (walls[1]) {
            createCell.style.borderRight = '1px solid';
        } else {
            // We add the left adjacent cell
            currentCell.adjacentCells.push(currentCell.cellNumber + 1);
        }

        if (walls[2]) {
            createCell.style.borderBottom = '1px solid';
        } else {
            // We add the bottom adjacent cell
            currentCell.adjacentCells.push(currentCell.cellNumber + gridSize);
        }

        // Then we add the child element to his parent
        mainDiv.appendChild(createCell);
    }
    document.getElementById('dfsIterative').addEventListener('click', function () {
        iterativeDfs(cellData, cellData[0], cellData[cellData.length - 1]);
    }, false);
    document.getElementById('dfsRecursive').addEventListener('click', function () {
        dfsRecursive(cellData, cellData[0], cellData[cellData.length - 1]);
    }, false);
    document.getElementById('bfsIterative').addEventListener('click', function () {
        iterativeBfs(cellData, cellData[0], cellData[cellData.length - 1]);
    }, false);
}

// Timer function to delay path display
const timer = ms => new Promise(res => setTimeout(res, ms));

const optimalDfsPath = [];

function iterativeDfs(grid, vertex, target) {

    let stack = [];

    // const notOptimalDfsPath = [];

    stack.push(vertex);

    while (stack.length) {
        if (vertex === target) {
            colorCells(optimalDfsPath);
            console.log(optimalDfsPath);
            console.log("You've reached the cell " + vertex.cellNumber);
            break
        }

        vertex = stack.pop();
        // notOptimalDfsPath.push(vertex.cellNumber);

        if (!vertex.visited) {
            vertex.visited = true;
            stack.push(vertex);
            optimalDfsPath.push(vertex.cellNumber);

            for (let node of vertex.adjacentCells) {
                stack.push(grid[node]);
            }
        }
    }
}

async function dfsRecursive(grid, vertex, target) {

    optimalDfsPath.push(vertex.cellNumber);

    vertex.visited = true;

    if (vertex === target) {
        console.log("You've reached cell " + vertex.cellNumber);
        console.log('Optimal path: ', optimalDfsPath);
        await colorCells(optimalDfsPath, grid.length - 1);
        return true;
    }

    for (let node of vertex.adjacentCells.reverse()) {
        if (!grid[node].visited) {
            if (await dfsRecursive(grid, grid[node], target)) {
                return true;
            }
        }
    }
}

function iterativeBfs(grid, vertex, target) {

    let queue = [];

    const optimalDfsPath = [];
    // const notOptimalDfsPath = [];

    queue.push(vertex);

    while (queue.length) {
        if (vertex === target) {
            colorCells(optimalDfsPath);
            console.log(optimalDfsPath);
            console.log("You've reached the cell " + vertex.cellNumber);
            break
        }

        vertex = queue.shift();
        // notOptimalDfsPath.push(vertex.cellNumber);

        if (!vertex.visited) {
            vertex.visited = true;
            queue.push(vertex);
            optimalDfsPath.push(vertex.cellNumber);

            for (let node of vertex.adjacentCells) {
                queue.push(grid[node]);
            }
        }
    }
}

async function colorCells(optimalPathCell) {

    for (let i = 0; i < optimalPathCell.length; i++) {

        let getOptimalCells = document.getElementsByClassName('cell-' + optimalPathCell[i]);
        getOptimalCells[0].style.background = "orange";

        if (optimalPathCell[i] !== 0) {
            getOptimalCells[0].style.background = "mediumpurple";
        }

        if (optimalPathCell[optimalPathCell.length - 1] === optimalPathCell[i]) {
            getOptimalCells[0].style.background = "springgreen";
        }

        await timer(50)
    }
}

async function main() {
    // Async main function to call our createMaze() which take an asynchronous parameter
    createMaze(await loadJson());
}

main();
