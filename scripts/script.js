const calcButton = document.querySelector(".calc-button");

calcButton.addEventListener("click", onClickCalcButton);

function evenNumber(curNumber) {
  const wholePart = Math.trunc();
  return curNumber - wholePart === 0 ? true : false;
}

function inTableIsHydrogen(curTablePartOne) {
  let isHydrogen = false;

  for (const curRow of curTablePartOne) {
    const foundedRow = curRow.currentTable.find((zn) => zn.elemOfTable === "H");
    if (foundedRow !== undefined) {
      isHydrogen = true;
      break;
    }
  }

  return isHydrogen;
}

function isMultiplicity(curTablePartOne, curTablePartTwo) {
  let curIsMultiplicity = false;
  let flagOfBreak = false;
  for (const curRow of curTablePartOne) {
    const multCoeffOne = evenNumber(curRow.coefficient);
    if (!multCoeffOne) {
      flagOfBreak = true;
      break;
    }
  }

  if (flagOfBreak) {
    curIsMultiplicity = true;
  } else {
    for (curRowTwo of curTablePartTwo) {
      const multCoeffTwo = evenNumber(curRowTwo.coefficient);
      if (!multCoeffTwo) {
        curIsMultiplicity = true;
        break;
      }
    }
  }

  return curIsMultiplicity;
}

function getStringOfPart(tableOfPart) {
  let currentStr = "";

  const countRow = tableOfPart.length;

  for (let k = 0; k < countRow; k += 1) {
    const curRowOfTable = tableOfPart[k];
    if (k > 0) {
      currentStr = currentStr + " + ";
    }
    currentStr =
      currentStr +
      (curRowOfTable.coefficient === 1
        ? ""
        : String(curRowOfTable.coefficient) + curRowOfTable.formule);
  }

  return currentStr;
}

function removeMultiplicity(curTablePartOne, curTablePartTwo) {
  let listOfCoefficients = [];
  for (const curRowOne of curTablePartOne) {
    listOfCoefficients.push(curRowOne.coefficient);
  }
  for (const curRowTwo of curTablePartTwo) {
    listOfCoefficients.push(curRowTwo.coefficient);
  }
  const foundedNull = listOfCoefficients.indexOf(0);
  if (foundedNull === -1) {
    let isMultiplicity = isMultiplicity(curTablePartOne, curTablePartTwo);

    let numberRow = 1;
    while (isMultiplicity) {
      for (const rowOne of curTablePartOne) {
        rowOne.coefficient = rowOne.coefficient * 2;
      }
      for (const rowTwo of curTablePartTwo) {
        rowTwo.coefficient = rowTwo.coefficient * 2;
      }
      if (numberRow === 1000) {
        break;
      }
      numberRow += 1;
      isMultiplicity = isMultiplicity(curTablePartOne, curTablePartTwo);
    }
  }
}

function getArrayOfDivider(firstElem) {
  let totalArray = [];

  for (k = 1; k <= firstElem; k += 1) {
    if (k === 1) {
      continue;
    }
    totalArray.push(k);
  }

  return totalArray;
}

function itDivisionWithoutRemainder(
  curTablePartOne,
  curTablePartTwo,
  curDivider
) {
  let withoutRemainder = true;
  let flagOfBreak = false;

  for (const curRowOne of curTablePartOne) {
    const remaindFromDivision = curRowOne.coefficient % curDivider;
    if (remaindFromDivision !== 0) {
      flagOfBreak = true;
      break;
    }
  }

  if (flagOfBreak) {
    withoutRemainder = false;
  } else {
    for (const curRowTwo of curTablePartTwo) {
      const remaindFromDivision = curRowTwo.coefficient % curDivider;
      if (remaindFromDivision !== 0) {
        withoutRemainder = false;
        break;
      }
    }
  }

  return withoutRemainder;
}

function reduceCoefficients(curTablePartOne, curTablePartTwo) {
  let listOfCoefficients = [];
  for (const curenRowOne of curTablePartOne) {
    listOfCoefficients.push(curenRowOne.coefficient);
  }
  for (const curentRowTwo of curTablePartTwo) {
    listOfCoefficients.push(curentRowTwo.coefficient);
  }

  const foundedNull = listOfCoefficients.indexOf(0);
  if (foundedNull === -1) {
    listOfCoefficients.sort((a, b) => a - b);
    const firstElem = listOfCoefficients[0];
    if (firstElem > 1) {
      const arrayOfCoef = getArrayOfDivider(firstElem);

      for (const curDivider of arrayOfCoef) {
        let divWithoutRemainder = itDivisionWithoutRemainder(
          curTablePartOne,
          curTablePartTwo,
          curDivider
        );
        while (divWithoutRemainder) {
          for (const rowOne of curTablePartOne) {
            rowOne.coefficient = rowOne.coefficient / curDivider;
          }
          for (const rowTwo of curTablePartTwo) {
            rowTwo.coefficient = rowTwo.coefficient / curDivider;
          }
          divWithoutRemainder = itDivisionWithoutRemainder(
            curTablePartOne,
            curTablePartTwo,
            curDivider
          );
        }
      }
    }
  }
}

function getCountUnequalElements(
  countUnequalElements,
  tableOfChangedElements,
  tableOfChanges,
  curTablePartOne,
  curTablePartTwo
) {
  for (const curRow of tableOfChangedElements) {
    const foundedRowForCheking = tableOfChanges.find(
      (zn) => zn.elemOfTable === curRow.elemOfOnePart
    );
    if (
      foundedRowForCheking.repeatPartOne === 1 &&
      foundedRowForCheking.repeatPartTwo === 1
    ) {
      let curTableOne = undefined;
      let curTableTwo = undefined;

      for (const curRowTableOne of curTablePartOne) {
        const foundedRowOne = curRowTableOne.currentTable.find(
          (zn) => zn.elemOfTable === curRow.elemOfOnePart
        );
        if (foundedRowOne !== undefined) {
          curTableOne = curRowTableOne;
          break;
        }
      }

      for (const curRowTableTwo of curTablePartTwo) {
        const foundedRowTwo = curRowTableTwo.currentTable.find(
          (zn) => zn.elemOfTable === curRow.elemOfOnePart
        );
        if (foundedRowTwo !== undefined) {
          curTableTwo = curRowTableTwo;
          break;
        }
      }

      let curCountOne = curTableOne.currentTable.find(
        (zn) => zn.elemOfTable === curRow.elemOfOnePart
      ).count;

      let curCountTwo = curTableTwo.currentTable.find(
        (zn) => zn.elemOfTable === curRow.elemOfOnePart
      ).count;

      let valueInLeftSide = curTableOne.coefficient * curCountOne;
      let valueInRightSide = curTableTwo.coefficient * curCountTwo;
      if (valueInLeftSide !== valueInRightSide) {
        if (valueInLeftSide < valueInRightSide) {
          curTableOne.coefficient = valueInRightSide / curCountOne;
        } else {
          curTableTwo.coefficient = valueInLeftSide / curCountTwo;
        }
      }
    } else {
      countUnequalElements += 1;
    }
  }
}

function getTableOfChanges(
  tableOfChangedElements,
  curTablePartOne,
  curTablePartTwo
) {
  let tableOfChanges = [];

  for (const currentRow of tableOfChangedElements) {
    let newRow = new Object();
    newRow.elemOfTable = currentRow.elemOfOnePart;

    let sumOne = 0;
    for (const currentRowOne of curTablePartOne) {
      const foundedRow = currentRowOne.currentTable.find(
        (zn) => zn.elemOfTable === currentRow.elemOfOnePart
      );
      if (foundedRow !== undefined) {
        sumOne += 1;
      }
    }

    newRow.repeatPartOne = sumOne;

    let sumTwo = 0;

    for (const currentRowTwo of curTablePartTwo) {
      const foundedRowTwo = currentRowTwo.currentTable.find(
        (zn) => zn.elemOfTable === currentRow.elemOfOnePart
      );
      if (foundedRowTwo !== undefined) {
        sumTwo += 1;
      }
    }

    newRow.repeatPartTwo = sumTwo;

    tableOfChanges.push(newRow);
  }
  return tableOfChanges;
}

function addTotalCoeff(tableOfChangedElements, totalStructureOfCoeff) {
  for (const curElem of tableOfChangedElements) {
    if (curElem.coefficient >= 0) {
      curElem.totalCoefficient = totalStructureOfCoeff.totalMinus;
    } else {
      curElem.totalCoefficient = totalStructureOfCoeff.totalPlus;
    }
  }
}

function getTableOfChangedElements(
  tableFormuleOfPartsOne,
  tableFormuleOfPartsTwo
) {
  let tableOfElements = [];

  for (const curElemOne of tableFormuleOfPartsOne) {
    for (const curElemTableOne of curElemOne.tableOfElements) {
      for (const curElemTwo of tableFormuleOfPartsTwo) {
        for (const curElemTableTwo of curElemTwo.tableOfElements) {
          if (curElemTableTwo.elemOfTable === curElemTableOne.elemOfTable) {
            if (curElemTableTwo.valence !== curElemTableOne.valence) {
              const foundedElem = tableOfElements.find(
                (zn) => zn.elemOfOnePart === curElemTableOne.elemOfTable
              );
              if (foundedElem === undefined) {
                const newObj = {
                  elemOfOnePart: curElemTableOne.elemOfTable,
                  valenOfPartOne: curElemTableOne.valence,
                  countElemParteOne: curElemTableOne.count,
                  elemOfTwoPart: curElemTableTwo.elemOfTable,
                  valenOfPartTwo: curElemTableTwo.valence,
                  countElemPartTwo: curElemTableTwo.count,
                };
                tableOfElements.push(newObj);
              }
            }
          }
        }
      }
    }
  }

  return tableOfElements;
}

function setCoefficientsForTableChanges(tableOfChangedElements) {
  for (const curElem of tableOfChangedElements) {
    if (curElem.countElemParteOne === curElem.countElemPartTwo) {
      curElem.coefficient =
        curElem.valenOfPartOne * curElem.countElemParteOne -
        curElem.valenOfPartTwo * curElem.countElemPartTwo;
    } else {
      if (curElem.countElemParteOne === 1) {
        curElem.coefficient =
          curElem.valenOfPartOne *
            curElem.countElemParteOne *
            curElem.countElemPartTwo -
          curElem.valenOfPartTwo * curElem.countElemPartTwo;
      } else if (curElem.countElemPartTwo === 1) {
        if (curElem.valenOfPartOne !== 0) {
          curElem.coefficient =
            curElem.valenOfPartTwo *
              curElem.countElemPartTwo *
              curElem.countElemParteOne -
            curElem.valenOfPartOne * curElem.countElemParteOne;
        } else {
          curElem.coefficient =
            curElem.valenOfPartOne * curElem.countElemParteOne -
            curElem.valenOfPartTwo *
              curElem.countElemPartTwo *
              curElem.countElemParteOne;
        }
      } else {
        curElem.coefficient =
          curElem.valenOfPartOne * curElem.countElemParteOne -
          curElem.valenOfPartTwo * curElem.countElemPartTwo;
      }
    }
  }
}

function getStructureOfCoeff(tableOfChangedElements) {
  let sumPluses = 0;
  let sumMinuses = 0;

  for (const curElem of tableOfChangedElements) {
    if (curElem.coefficient >= 0) {
      sumPluses += curElem.coefficient;
    } else {
      sumMinuses += curElem.coefficient;
    }
  }

  const newObj = {
    plus: sumPluses,
    minus: -sumMinuses,
  };
  return newObj;
}

function getStructTotalCoeff(structureOfCoeff) {
  let totalScruct = new Object();

  if (structureOfCoeff.plus === structureOfCoeff.minus) {
    totalScruct.totalPlus = structureOfCoeff.plus / structureOfCoeff.minus;
    totalScruct.totalMinus = structureOfCoeff.plus / structureOfCoeff.minus;
  } else if (
    (structureOfCoeff.plus !== 1 && structureOfCoeff.minus === 1) ||
    (structureOfCoeff.plus === 1 && structureOfCoeff.minus !== 1)
  ) {
    totalScruct.totalPlus = structureOfCoeff.plus;
    totalScruct.totalMinus = structureOfCoeff.minus;
  } else if (structureOfCoeff.plus > structureOfCoeff.minus) {
    let originalPlus = structureOfCoeff.plus;
    let originalMinus = structureOfCoeff.minus;

    let curValueMinus = originalMinus;

    for (let k = 2; k <= curValueMinus; k += 1) {
      let resultPlus = originalPlus / k;
      let resultMinus = originalMinus / k;

      let remaindPlus = originalPlus % k;
      let remaindMinus = originalMinus % k;

      while (remaindPlus === 0 && remaindMinus === 0) {
        originalPlus = resultPlus;
        originalMinus = resultMinus;

        resultPlus = originalPlus / k;
        resultMinus = originalMinus / k;

        remaindPlus = originalPlus % k;
        remaindMinus = originalMinus % k;
      }
    }

    totalScruct.totalPlus = originalPlus;
    totalScruct.totalMinus = originalMinus;
  } else if (structureOfCoeff.plus < structureOfCoeff.minus) {
    let originalPlus = structureOfCoeff.plus;
    let originalMinus = structureOfCoeff.minus;

    let curValuePlus = originalPlus;

    for (let k = 2; k <= curValuePlus; k += 1) {
      let resultPlus = originalPlus / k;
      let resultMinus = originalMinus / k;

      let remaindPlus = originalPlus % k;
      let remaindMinus = originalMinus % k;
      while (remaindPlus === 0 && remaindMinus === 0) {
        originalPlus = resultPlus;
        originalMinus = resultMinus;

        resultPlus = originalPlus / k;
        resultMinus = originalMinus / k;

        remaindPlus = originalPlus % k;
        remaindMinus = originalMinus % k;
      }
    }

    totalScruct.totalPlus = originalPlus;
    totalScruct.totalMinus = originalMinus;
  }

  return totalScruct;
}

function deleteExtraColumns(tableOfChangedElements) {
  let newArray = tableOfChangedElements.map((el) => ({
    totalCoefficient: el.totalCoefficient,
    elemOfOnePart: el.elemOfOnePart,
  }));
  return newArray;
}

function getTableForCompar(tableFormuleOfPart, tableOfChangedElements) {
  let tableForCompare = [];

  for (const curRow of tableFormuleOfPart) {
    let newRow = Object();
    newRow.formule = curRow.curFormule;
    newRow.currentTable = curRow.tableOfElements;
    let coefficient = 1;
    for (const curRowTable of curRow.tableOfElements) {
      const foundedElem = tableOfChangedElements.find(
        (zn) => zn.elemOfOnePart === curRowTable.elemOfTable
      );
      if (foundedElem !== undefined) {
        coefficient = foundedElem.totalCoefficient;
        break;
      }
    }
    newRow.coefficient = coefficient;
    tableForCompare.push(newRow);
  }

  return tableForCompare;
}

function onClickCalcButton() {
  //Тест
  //Тест

  const strFormule = "NO + H3PO4 --> N2O3 + P2O3 + H2O";
  const strParts = getStructurOfParts(strFormule);

  const tableOne = getTableOfDate(strParts.partOne);
  const tableTwo = getTableOfDate(strParts.partTwo);

  const tableFormuleOfPartsOne = getTableOfParts(tableOne);
  const tableFormuleOfPartsTwo = getTableOfParts(tableTwo);

  let tableOfChangedElements = getTableOfChangedElements(
    tableFormuleOfPartsOne,
    tableFormuleOfPartsTwo
  );

  setCoefficientsForTableChanges(tableOfChangedElements);

  let structureOfCoeff = getStructureOfCoeff(tableOfChangedElements);

  let totalStructureOfCoeff = getStructTotalCoeff(structureOfCoeff);

  addTotalCoeff(tableOfChangedElements, totalStructureOfCoeff);

  let tableOfChangedElementsNew = deleteExtraColumns(tableOfChangedElements);

  let curTablePartOne = getTableForCompar(
    tableFormuleOfPartsOne,
    tableOfChangedElementsNew
  );
  let curTablePartTwo = getTableForCompar(
    tableFormuleOfPartsTwo,
    tableOfChangedElementsNew
  );

  let tableOfChanges = getTableOfChanges(
    tableOfChangedElementsNew,
    curTablePartOne,
    curTablePartTwo
  );

  let countUnequalElements = 0;
  getCountUnequalElements(
    countUnequalElements,
    tableOfChangedElementsNew,
    tableOfChanges,
    curTablePartOne,
    curTablePartTwo
  );

  console.log(countUnequalElements);
  console.log(curTablePartOne);
  console.log(curTablePartTwo);
}

function getStructurOfParts(curValue) {
  const findSimbol = curValue.indexOf(">");

  const parts = {
    partTwo: curValue.substr(findSimbol + 1).trim(),
    partOne: curValue
      .substr(0, findSimbol - 1)
      .replace("-", "")
      .trim(),
  };

  return parts;
}

function getTableOfDate(curPart) {
  let tableOfDate = [];

  let arrayOfJoins = [];

  let originalStr = curPart;

  let findedSym = originalStr.indexOf("+");

  while (findedSym !== -1) {
    arrayOfJoins.push(originalStr.substr(0, findedSym - 1).trim());
    originalStr = originalStr.substr(findedSym + 1);
    findedSym = originalStr.indexOf("+");
  }

  arrayOfJoins.push(originalStr.trim());

  for (let k = 0; k < arrayOfJoins.length; k += 1) {
    const curElNew = arrayOfJoins[k];
    const newObj = {
      formule: curElNew,
      tableElementsOfCounts: fillTable(curElNew),
    };
    tableOfDate.push(newObj);
  }

  return tableOfDate;
}

function getTableOfParts(curTable) {
  const tableForAnalyz = getTableOfElements();

  let totalTable = [];

  for (let k = 0; k < curTable.length; k += 1) {
    const currentRow = curTable[k];
    const tableOfElementsCurrent = currentRow.tableElementsOfCounts;
    const currentFormule = currentRow.formule;

    let tableWithValences = [];

    for (let m = 0; m < currentRow.tableElementsOfCounts.length; m += 1) {
      const currentRowTwo = currentRow.tableElementsOfCounts[m];
      const foundedElem = tableForAnalyz.find(
        (zn) => zn.elemOfTable === currentRowTwo.elemOfTable
      );
      if (foundedElem !== undefined) {
        const newObj = {
          elementOfTable: currentRowTwo.elemOfTable,
          count: currentRowTwo.count,
          arrayOfValences: foundedElem.arrayVal,
        };
        tableWithValences.push(newObj);
      }
    }

    let tableForValences = [];

    for (let rowOne = 0; rowOne < tableWithValences.length; rowOne += 1) {
      const curRowOne = tableWithValences[rowOne];
      for (
        let rowTwo = 0;
        rowTwo < curRowOne.arrayOfValences.length;
        rowTwo += 1
      ) {
        const newObj = {
          elemOfTable: curRowOne.elementOfTable,
          count: curRowOne.count,
          valence: curRowOne.arrayOfValences[rowTwo],
        };
        tableForValences.push(newObj);
      }
    }

    const tableForValencesTotal = [];

    const countInTable = tableWithValences.length;

    for (
      let numberOne = 0;
      numberOne < tableForValences.length;
      numberOne += 1
    ) {
      for (
        let numberTwo = 0;
        numberTwo < tableForValences.length;
        numberTwo += 1
      ) {
        for (
          let numberThree = 0;
          numberThree < tableForValences.length;
          numberThree += 1
        ) {
          let intermediateTable = [];

          const newRoweOne = tableForValences[numberOne];
          const newRoweTwo = tableForValences[numberTwo];
          const newRoweThree = tableForValences[numberThree];

          const findElemOne = intermediateTable.find(
            (zn) => zn.elemOfTable === newRoweOne.elemOfTable
          );

          fillIntemediateTable(intermediateTable, findElemOne, newRoweOne);

          const findElemTwo = intermediateTable.find(
            (zn) => zn.elemOfTable === newRoweTwo.elemOfTable
          );

          fillIntemediateTable(intermediateTable, findElemTwo, newRoweTwo);

          const findElemThree = intermediateTable.find(
            (zn) => zn.elemOfTable === newRoweThree.elemOfTable
          );

          fillIntemediateTable(intermediateTable, findElemThree, newRoweThree);

          if (intermediateTable.length === countInTable) {
            const newObj = {
              tableDate: intermediateTable,
            };
            tableForValencesTotal.push(newObj);
          }
        }
      }
    }

    let totalObject = new Object();
    totalObject.curFormule = currentFormule;

    for (
      let numberRow = 0;
      numberRow < tableForValencesTotal.length;
      numberRow += 1
    ) {
      const curRow = tableForValencesTotal[numberRow];
      let sumTotal = 0;

      for (let r = 0; r < curRow.tableDate.length; r += 1) {
        const curRowTable = curRow.tableDate[r];
        sumTotal = sumTotal + curRowTable.count * curRowTable.valence;
      }

      if (sumTotal === 0) {
        totalObject.tableOfElements = curRow.tableDate;
        break;
      }
    }

    if (
      totalObject.hasOwnProperty("tableOfElements") === false &&
      tableOfElementsCurrent.length === 1
    ) {
      const rowOfCurTable = tableOfElementsCurrent[0];

      let tableOfElementsNew = [];

      const newObj = {
        valence: 0,
        count: rowOfCurTable.count,
        elemOfTable: rowOfCurTable.elemOfTable,
      };

      tableOfElementsNew.push(newObj);

      totalObject.tableOfElements = tableOfElementsNew;
    }
    totalTable.push(totalObject);
  }

  return totalTable;
}

function fillIntemediateTable(intermediateTable, findElemOne, newRoweOne) {
  if (findElemOne === undefined) {
    const newObj = {
      elemOfTable: newRoweOne.elemOfTable,
      count: newRoweOne.count,
      valence: newRoweOne.valence,
    };
    intermediateTable.push(newObj);
  }
}

function getArrayOfNumbers() {
  let curArray = [];
  curArray.push("0");
  curArray.push("1");
  curArray.push("2");
  curArray.push("3");
  curArray.push("4");
  curArray.push("5");
  curArray.push("6");
  curArray.push("7");
  curArray.push("8");
  curArray.push("9");
  return curArray;
}

function fillTable(curElement) {
  const curArrayOfNumbers = getArrayOfNumbers();

  const tableOfElements = getTableOfElements();

  let tableElementsOfCount = [];

  let curCount = curElement.length;

  for (let k = 0; k <= curCount; k += 1) {
    for (let d = 0; d <= k; d += 1) {
      const curValue = curElement.substr(0, d + 1);
      const curValueTwo = curElement.substr(0, d + 2);

      const foundValueOne = tableOfElements.find(
        (zn) => zn.elemOfTable === curValue
      );

      const foundValueTwo = tableOfElements.find(
        (zn) => zn.elemOfTable === curValueTwo
      );

      if (foundValueOne !== undefined || foundValueTwo !== undefined) {
        let newObj = new Object();

        newObj.elemOfTable =
          foundValueTwo !== undefined ? curValueTwo : curValue;

        const newValue = curElement.substr(
          foundValueTwo !== undefined ? d + 2 : d + 1,
          1
        );

        const findElemNew = curArrayOfNumbers.indexOf(newValue);

        if (newValue === "" || findElemNew === -1) {
          newObj.count = 1;
          curElement = curElement.substr(
            foundValueTwo !== undefined ? d + 2 : d + 1
          );
          curCount = curElement.length;
          tableElementsOfCount.push(newObj);
          break;
        } else {
          let indexOfBegin = foundValueTwo !== undefined ? d + 2 : d + 1;
          let currentNumber = "";
          let beginValue = curElement.substr(indexOfBegin, 1);
          let foundedElem = curArrayOfNumbers.indexOf(beginValue);
          while (foundedElem !== -1) {
            currentNumber = currentNumber + beginValue;
            indexOfBegin = indexOfBegin + 1;
            beginValue = curElement.substr(indexOfBegin, 1);
            foundedElem = curArrayOfNumbers.indexOf(beginValue);
          }
          newObj.count = getNumber(currentNumber);
          curElement = curElement.substr(indexOfBegin);
          curCount = curElement.length;
          tableElementsOfCount.push(newObj);
          break;
        }
      }
    }
  }

  return tableElementsOfCount;
}

function getNumber(currentNumber) {
  let numberReturn = 0;
  try {
    numberReturn = parseInt(currentNumber);
  } catch (error) {
    numberReturn = 0;
  }
  return numberReturn;
}

function addElenetInTableValent(tableVal, curEl, arrayOfVal) {
  const newObj = {
    elemOfTable: curEl,
    arrayVal: arrayOfVal,
  };
  tableVal.push(newObj);
}

function getArrayVal() {
  let totalArray = [];
  for (let n = 0; n < arguments.length; n += 1) {
    totalArray.push(arguments[n]);
  }
  return totalArray;
}

function getTableOfElements() {
  let tableNew = [];

  addElenetInTableValent(tableNew, "H", getArrayVal(1, -1));
  addElenetInTableValent(tableNew, "He", getArrayVal(8));
  addElenetInTableValent(tableNew, "Li", getArrayVal(1));
  addElenetInTableValent(tableNew, "Be", getArrayVal(2));
  addElenetInTableValent(tableNew, "B", getArrayVal(-3, 3));
  addElenetInTableValent(tableNew, "C", getArrayVal(2, 4));
  addElenetInTableValent(tableNew, "N", getArrayVal(-3, -2, -1, 1, 2, 3, 4, 5));
  addElenetInTableValent(tableNew, "O", getArrayVal(-2));
  addElenetInTableValent(tableNew, "F", getArrayVal(-1, 1));
  addElenetInTableValent(tableNew, "Ne", getArrayVal(8));
  addElenetInTableValent(tableNew, "Na", getArrayVal(1));
  addElenetInTableValent(tableNew, "Mg", getArrayVal(2));
  addElenetInTableValent(tableNew, "Al", getArrayVal(3));
  addElenetInTableValent(tableNew, "Si", getArrayVal(-4, 2, 4));
  addElenetInTableValent(tableNew, "P", getArrayVal(-3, 1, 3, 5));
  addElenetInTableValent(tableNew, "S", getArrayVal(-2, 2, 4, 6));
  addElenetInTableValent(tableNew, "Cl", getArrayVal(-1, 1, 2, 3, 4, 5, 7));
  addElenetInTableValent(tableNew, "Ar", getArrayVal(8));
  addElenetInTableValent(tableNew, "K", getArrayVal(1));
  addElenetInTableValent(tableNew, "Ca", getArrayVal(2));
  addElenetInTableValent(tableNew, "Sc", getArrayVal(3));
  addElenetInTableValent(tableNew, "Ti", getArrayVal(2, 3, 4));
  addElenetInTableValent(tableNew, "V", getArrayVal(2, 3, 4, 5));
  addElenetInTableValent(tableNew, "Cr", getArrayVal(2, 3, 6));
  addElenetInTableValent(tableNew, "Mn", getArrayVal(2, 3, 4, 6, 7));
  addElenetInTableValent(tableNew, "Fe", getArrayVal(2, 3, 4, 6));
  addElenetInTableValent(tableNew, "Co", getArrayVal(2, 3, 4));
  addElenetInTableValent(tableNew, "Ni", getArrayVal(1, 2, 3, 4));
  addElenetInTableValent(tableNew, "Cu", getArrayVal(1, 2, 3));
  addElenetInTableValent(tableNew, "Zn", getArrayVal(2));
  addElenetInTableValent(tableNew, "Ga", getArrayVal(2, 3));
  addElenetInTableValent(tableNew, "Ge", getArrayVal(-4, 2, 4));
  addElenetInTableValent(tableNew, "As", getArrayVal(-3, 2, 3, 5));
  addElenetInTableValent(tableNew, "Se", getArrayVal(-2, 2, 4, 6));
  addElenetInTableValent(tableNew, "Br", getArrayVal(-1, 1, 3, 4, 5));
  addElenetInTableValent(tableNew, "Kr", getArrayVal(8));
  addElenetInTableValent(tableNew, "Rb", getArrayVal(1));
  addElenetInTableValent(tableNew, "Sr", getArrayVal(2));
  addElenetInTableValent(tableNew, "Y", getArrayVal(3));
  addElenetInTableValent(tableNew, "Zr", getArrayVal(2, 3, 4));
  addElenetInTableValent(tableNew, "Nb", getArrayVal(2, 3, 4, 5));
  addElenetInTableValent(tableNew, "Mo", getArrayVal(2, 3, 4, 5, 6));
  addElenetInTableValent(tableNew, "Tc", getArrayVal(6));
  addElenetInTableValent(tableNew, "Ru", getArrayVal(2, 3, 4, 6, 7, 8));
  addElenetInTableValent(tableNew, "Rh", getArrayVal(2, 3, 4, 6));
  addElenetInTableValent(tableNew, "Pd", getArrayVal(2, 4, 6));
  addElenetInTableValent(tableNew, "Ag", getArrayVal(1, 2, 3));
  addElenetInTableValent(tableNew, "Cd", getArrayVal(1, 2));
  addElenetInTableValent(tableNew, "In", getArrayVal(1, 2, 3));
  addElenetInTableValent(tableNew, "Sn", getArrayVal(2, 4));
  addElenetInTableValent(tableNew, "Sb", getArrayVal(-3, 3, 4, 5));
  addElenetInTableValent(tableNew, "Te", getArrayVal(-2, 2, 4, 6));
  addElenetInTableValent(tableNew, "I", getArrayVal(-1, 1, 3, 4, 5, 7));
  addElenetInTableValent(tableNew, "Xe", getArrayVal(8));
  addElenetInTableValent(tableNew, "Cs", getArrayVal(1));
  addElenetInTableValent(tableNew, "Ba", getArrayVal(2));
  addElenetInTableValent(tableNew, "La", getArrayVal(3));
  addElenetInTableValent(tableNew, "Ce", getArrayVal(3, 4));
  addElenetInTableValent(tableNew, "Pr", getArrayVal(3));
  addElenetInTableValent(tableNew, "Nd", getArrayVal(3, 4));
  addElenetInTableValent(tableNew, "Pm", getArrayVal(3));
  addElenetInTableValent(tableNew, "Sm", getArrayVal(2, 3));
  addElenetInTableValent(tableNew, "Eu", getArrayVal(2, 3));
  addElenetInTableValent(tableNew, "Gd", getArrayVal(3));
  addElenetInTableValent(tableNew, "Tb", getArrayVal(3, 4));
  addElenetInTableValent(tableNew, "Dy", getArrayVal(3));
  addElenetInTableValent(tableNew, "Ho", getArrayVal(3));
  addElenetInTableValent(tableNew, "Er", getArrayVal(3));
  addElenetInTableValent(tableNew, "Tm", getArrayVal(2, 3));
  addElenetInTableValent(tableNew, "Yb", getArrayVal(2, 3));
  addElenetInTableValent(tableNew, "Lu", getArrayVal(3));
  addElenetInTableValent(tableNew, "Hf", getArrayVal(4));
  addElenetInTableValent(tableNew, "Ta", getArrayVal(3, 4, 5));
  addElenetInTableValent(tableNew, "W", getArrayVal(2, 3, 4, 5, 6));
  addElenetInTableValent(tableNew, "Re", getArrayVal(-1, 1, 2, 3, 4, 5, 6, 7));
  addElenetInTableValent(tableNew, "Os", getArrayVal(2, 3, 4, 6, 8));
  addElenetInTableValent(tableNew, "Ir", getArrayVal(1, 2, 3, 4, 6));
  addElenetInTableValent(tableNew, "Pt", getArrayVal(1, 2, 3, 4, 6));
  addElenetInTableValent(tableNew, "Au", getArrayVal(1, 2, 3));
  addElenetInTableValent(tableNew, "Hg", getArrayVal(1, 2));
  addElenetInTableValent(tableNew, "Tl", getArrayVal(1, 2, 3));
  addElenetInTableValent(tableNew, "Pb", getArrayVal(2, 4));
  addElenetInTableValent(tableNew, "Bi", getArrayVal(-3, 2, 3, 4, 5));
  addElenetInTableValent(tableNew, "Po", getArrayVal(-2, 2, 4, 6));
  addElenetInTableValent(tableNew, "Rn", getArrayVal(8));
  addElenetInTableValent(tableNew, "Ra", getArrayVal(2));
  addElenetInTableValent(tableNew, "Ac", getArrayVal(3));
  addElenetInTableValent(tableNew, "Th", getArrayVal(4));
  addElenetInTableValent(tableNew, "Pa", getArrayVal(5));
  addElenetInTableValent(tableNew, "U", getArrayVal(2, 3, 4, 5, 6));
  return tableNew;
}
