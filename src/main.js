async function loadJson() {

    const data = await fetch('labyrinthes.json')
        .then(response => response.json());

    let gridSize = 25;
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

    // We call our dfs function to find the solution and display it
    iterativeDfs(cellData, cellData[0], cellData[cellData.length - 1])
}

// Timer function to delay path display
const timer = ms => new Promise(res => setTimeout(res, ms));

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

function iterativeDfs(grid, vertex, target) {

    let stack = [];

    const optimalDfsPath = [];
    const notOptimalDfsPath = [];

    stack.push(vertex);

    while (stack.length) {
        if (vertex === target) {
            colorCells(optimalDfsPath);
            console.log(optimalDfsPath);
            console.log("You've reached the cell " + vertex.cellNumber);
            break
        }

        vertex = stack.pop();
        notOptimalDfsPath.push(vertex.cellNumber);

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

// async function customDfs(startPos, targetPos, grid) {
//
//     const visited = [];
//     const stack = [];
//     const root = startPos;
//     const target = targetPos;
//
//     stack.push(root);
//
//     while (stack.length) {
//
//         const current = stack.pop();
//
//         let displayDfsPath = document.getElementsByClassName('cell-' + current.cellNumber);
//
//         if (current === target) {
//             displayDfsPath[0].style.background = 'springgreen';
//             visited.push(current);
//             console.log(visited);
//             return current;
//         }
//
//         // If the current cell isn't visited we continue
//         if (visited.indexOf(current) !== -1) {
//             continue;
//         }
//
//         if (current.cellNumber !== 0) {
//             console.log(displayDfsPath[0]);
//             displayDfsPath[0].style.background = 'mediumpurple';
//         }
//
//         visited.push(current);
//
//         // We push the adjacent cells of the current one
//         for (let adjacentCell of current.adjacentCells) {
//             stack.push(grid[adjacentCell]);
//         }
//
//         // We apply a timeout to render the path dynamically
//         await timer(50);
//     }
// }

async function main() {
    // Async main function to call our createMaze() which take an asynchronous parameter
    createMaze(await loadJson());
}

main();
