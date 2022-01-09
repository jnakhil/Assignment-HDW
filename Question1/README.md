## Problem Statement
Consider a ChessBoard with only one Knight. Develop an algorithm which can compute the minimum steps
in which the Knight can reach from a source cell to a destination cell.


## Considerations
Takes in position as number with One-based indexing (1, 1) => (8, 8) but not as actual Chess Position Notations.

## Algorithm
The problem can be solved using Breadth First Search (BFS) technique used in Graph Travesals.

The idea is to start travelling from the source cell and keep visiting every unvisited child cell and meanwhile updating the steps required to reach that child cell from source cell. For a cell where Knight is currently standing, child cells are the ones which are just reachable from the current cell under consideration. And for every cell under consideration where the Knight is currently located, there are at max 8 possiblities for next valid move within the ChessBoard. So in a queued fashion we keep processing a group of cells which are equidistant from the source cell and end up visting entire ChessBoard and updating the minimum steps during the process.

## Time Complexity
In case the Best and the Worst case time complexities are same, since we are pushing every cell in to the queue once and processing it exactly once. Durin the processing, we always check if the next position is unvisited and in that case only the
cell corresponding to next position is pushed and marked as visited.

Hence the time complexity of the algorithm is O(ChessBoardRows * ChessBoardColumns)

## Space Complexity
Additional Space is used in the follwing forms by the algorithm:

* A grid => O(ChessBoardRows * ChessBoardColumns);
* A queue => It can have at max order of O(ChessBoardRows * ChessBoardColumns) elements at any instance.

So overall space complexity of algorithm is O(ChessBoardRows * ChessBoardColumns)

## Compile and Run
* Compile the KnightTour.cpp using g++ compiler => g++ KnightsTour.cpp -o KnightsTour.exe
* Run the executable generated => KnightsTour.exe