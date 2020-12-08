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
            // We add the tp adjacent cell
            currentCell.adjacentCells.push(currentCell.cellNumber - gridSize);
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

        if (walls[3]) {
            createCell.style.borderLeft = '1px solid';
        } else {
            // We add the right adjacent cell
            currentCell.adjacentCells.push(currentCell.cellNumber - 1);
        }

        // Then we add the child element to his parent
        mainDiv.appendChild(createCell);
    }

    // We call our dfs function to find the solution and display it
    dfs(cellData[0], cellData[cellData.length - 1], cellData)
}

function dfs(startPos, targetPos, grid) {

    const visited = [];
    const stack = [];
    const root = startPos;
    const target = targetPos;
    target.isTarget = true;

    stack.push(root);

    while (stack.length) {

        const current = stack.pop();

        let displayDfsPath = document.getElementsByClassName('cell-' + current.cellNumber);

        if (current === target) {
            visited.push(current);
            break;
        }

        if (visited.indexOf(current) !== -1) {
            continue;
        }

        if (current.cellNumber !== 0) {
            displayDfsPath[0].style.background = 'mediumpurple'
        }

        visited.push(current);

        for (let node of current.adjacentCells) {
            stack.push(grid[node]);
        }
    }
}

async function main() {

    // Async main function to call our createMaze() which take an asynchronous parameter
    createMaze(await loadJson());
}

main();
