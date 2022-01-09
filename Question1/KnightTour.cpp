#include <iostream>
#include <utility>
#include <vector>
#include <queue>

using namespace std;

/**
 * @input chessBoardRows : Integer
 * @input chessBoardColumns : Integer
 * @input intialRow : Integer
 * @input intialColumn : Integer
 * @input finalRow : Integer
 * @input finalColumn : Integer
 * 
 * @Output Integer
 */
int knightsTour(int chessBoardRows, int chessBoardColumns, int intialRow, int intialColumn, int finalRow, int finalColumn) {
    
    int totalRows = chessBoardRows, totalColumns = chessBoardColumns;

    /**
     * Initializing a integer Grid with all cells as -1 to serve the purpose of determining whether a cell has been visited by the Knight.
     * The same grid will be used to store in the minimum distance for every cell from source cell.
     * This saves additional space required if instead a separate grid or other some other data structure like unordered_map<int, int> would've
     * been used to keep track of visited cells, that would required additional space of Order of O(chessBoardRows * chessBoardColumns).
     * 
     */
    vector<vector<int>> minDistanceFromSource (totalRows, vector<int>(totalColumns, -1));


    /**
     * Helper arrays to compute location of just reachable cells of every position where Knight stands.
     * 
     */
    int deviationInRow[] = {-2, -2, -1, 1, 2, 2, 1, -1};
    int deviationInCol[] = {-1, 1, 2, 2, 1, -1, -2, -2};

    /**
     * Subtracting 1 from each of the indices to treat everything internally as Zero-based indexing.
     * 
     */
    pair<int, int> src = make_pair(intialRow - 1, intialColumn - 1), dest = make_pair(finalRow - 1, finalColumn - 1);


    /**
     * Breadth First Search (BFS) logic starts here.
     * 
     */

    // A queue to keep track of processing every unvisited node. Only unvisited nodes/cells get pushed into this queue.
    queue<pair<int, int> > q;

    minDistanceFromSource[src.first][src.second] = 0;
    q.push(src);
    
    // To keep track of distance/level travelled from source.
    int currentLevel = 0;

    while (!q.empty()) {

        currentLevel++;
        
        // This variable holds the number of cells that are equidistant from the starting cell. So as we increase the currentLevel
        //  only if have finished procesing for all equidistant cells in batches.
        int currentLevelSize = q.size();

        for (int i = 0; i < currentLevelSize; i++) {
            pair<int, int> currentCell = q.front();
            q.pop();

            int parentCellRow = currentCell.first;
            int parentCellCol = currentCell.second;

            /**
             * In case of Knight in Chess, from any position a Knight has 8 possibile next moves.
             * Below piece of code considers all those 8 possible next moves if they've not been visited yet.
             * 
             */
            for (int childIndex = 0; childIndex < 8; childIndex++) {
                int childCellRow = parentCellRow + deviationInRow[childIndex];
                int childCellCol = parentCellCol + deviationInCol[childIndex];

                // Cases when child cell index are outside the Chess Board range.
                if (childCellRow < 0 || childCellRow >= totalRows || childCellCol < 0 || childCellCol >= totalColumns) {
                    continue;
                }

                // Check if the child cell is unvisited. If it is, then it needs to be processed and marked as visited.
                // Since the grid was initialized as -1, if a cell is still -1 implies that child cell has not yet been visited.
                if (minDistanceFromSource[childCellRow][childCellCol] == -1) {
                    
                    minDistanceFromSource[childCellRow][childCellCol] = currentLevel;
                    q.push(make_pair(childCellRow, childCellCol));
                
                }
            }
        }
    }

    /**
     * Breadth First Search logic ends here.
     * 
     */


    /**
     * Uncomment below piece of code to see final state of the board, where the number 
     * at each location is minimum distance if that cell was the destination for the given starting cell.
     */

    // for (vector<int> v: minDistanceFromSource) {
    //     for (auto it = v.begin(); it != v.end(); it++) {
    //         cout << *it << " ";
    //     }
    //     cout << endl;
    // }

    return minDistanceFromSource[dest.first][dest.second];
}


/**
 * @brief A test funtion to test out all possible combination of source and destination cells.
 * 
 */
void tester() {
    for (int row = 1; row <= 8; row++) {
        for (int col = 1; col <= 8; col++) {
            for (int frow = 1; frow <= 8; frow++) {
                for (int fcol = 1; fcol <= 8; fcol++) {
                    int minimumSteps = knightsTour(8, 8, row, col, frow, fcol);

                    cout << "Minimum steps required by Knight to reach destination from source: " << minimumSteps << endl;

                }
            }
        }
    }
}



int main() {

    int chessBoardRows = 8, chessBoardColumns = 8;
    int initialRow, initialColumn;
    int destinationRow, destinationColumn;

    cout << "Enter initial position of Knight on Chess Board separated by space: ";
    cin >> initialRow >> initialColumn;

    cout << "Enter final position of Knight on Chess Board separated by space: ";
    cin >> destinationRow >> destinationColumn;

    int minimumSteps = knightsTour(chessBoardRows, chessBoardColumns, initialRow, initialColumn, destinationRow, destinationColumn);
    cout << "Minimum steps required by Knight to reach destination from source: " << minimumSteps << endl;

    cout<<" \nPress enter to exit\n";
    getchar();
    cin.ignore();

    return 0;

}