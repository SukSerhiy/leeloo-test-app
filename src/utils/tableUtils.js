/**
 * Gets cell from an array of cells by coords
 * @param {array} cellArr 
 * @param {string} xCoord 
 * @param {number} yCoord 
 * @return {object}
 */
export const getCellByCoords = (cellArr, xCoord, yCoord) => (
  cellArr.find(cell => cell.xCoord === xCoord && cell.yCoord === yCoord)
);