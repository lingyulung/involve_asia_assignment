"use strict";

const groupName = document.getElementById("groupName");
const groupDesc = document.getElementById("groupDesc");
const specialGroup = document.getElementById("specialGroup");
const submit = document.querySelector(".submit");
const parameterAddBtn = document.querySelector(".parameterAdd");
const addBtn = document.querySelector(".add");
const rulesContainer = document.querySelector(".rulesContainer");
const ruleEntry = document.querySelector(".ruleEntry");
const browseRevenueEntries = document.querySelector(".browseRevenueEntries");

let ruleEntries;
let ruleNum = 1;
let paraNum = 1;
let groupCount = 1;
const revenueGroups = [];

////////////////////FUNCTIONS

// ADDING AND REMOVING PARAMETERS FOR RULE

function paraAddRemoveFunction(e) {
  const paraContainer = e.target.closest(".rulePara");

  const paraHTML = `<input
                      type="text"
                      class="selectPara parameters${
                        e.target.closest(".ruleEntry").dataset.id
                      }"
                      placeholder="Select Parameter"
                    />
                    <img
                      class="parameterRemove"
                      src="images/remove_circle_outline.svg"
                    />`;

  const newParameter = document.createElement("div");

  newParameter.classList.add("paraEntry");

  newParameter.innerHTML = paraHTML;

  paraContainer
    .appendChild(newParameter)
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("parameterRemove")) {
        e.target.closest(".paraEntry").remove();
      }
    });
}

// DELETING RULE IN FORM

function deleteRuleFunction(e) {
  if (!e.target.classList.contains("ruleDelete")) return;

  e.target.closest(".ruleEntry").remove();

  ruleNum = 1;

  // RENUMBER EXISTING RULES IN THE FORM

  ruleEntries = document.querySelectorAll(".ruleEntry");

  for (const rule of ruleEntries) {
    rule.dataset.id = ruleNum;

    rule.querySelector(".ruleNum").textContent = `Rule ${ruleNum}`;

    rule.querySelector(".selectField").id = `field${ruleNum}`;

    rule.querySelector(".selectOperator").id = `operator${ruleNum}`;

    const currentRulePara = rule.querySelectorAll(".selectPara");

    // RENUMBER THE PARAMETERS IN THE RULES

    for (const para of currentRulePara) {
      para.classList = `selectPara parameters${ruleNum}`;
    }

    rule.querySelector(".parameterAdd").dataset.id = ruleNum;

    rule.querySelector(".ruleAmount").id = `rev${ruleNum}`;

    if (ruleNum !== ruleEntries.length) {
      ruleNum++;
    }
  }
}

// FOR CREATING NEW RULES

function addRule(num) {
  const ruleHTML = `<div class="ruleEntryHeader">
                      <p class="ruleNum">Rule ${num}</p>
                      <img class=ruleDelete src="images/Iconsdelete.svg" />
                    </div>

                    <div class="ruleInputs">
                      <label class="ruleIf">If</label>
                      <select class="selectField" id="field${num}">
                        <option value="">Select field</option>
                        <option value="afff_sub_1">afff_sub_1</option>
                        <option value="afff_sub_2">afff_sub_2</option>
                        <option value="afff_sub_3">afff_sub_3</option>
                        <option value="afff_sub_4">afff_sub_4</option>
                        <option value="afff_sub_5">afff_sub_5</option>
                        <option value="afff_sub_6">afff_sub_6</option>
                        <option value="afff_sub_7">afff_sub_7</option>
                        <option value="afff_sub_8">afff_sub_8</option>
                        <option value="afff_sub_9">afff_sub_9</option>
                      </select>
                      <select class="selectOperator" id="operator${num}">
                        <option value="">Select operator</option>
                        <option value="is not">is not</option>
                        <option value="is">is</option>
                        <option value="starts with">starts with</option>
                        <option value="ends with">ends with</option>
                        <option value="contains">contains</option>
                        <option value="doesn't contains">doesn't contains</option>
                        <option value="ends with">ends with</option>
                        <option value="doesn't end with">doesn't end with</option>
                        <option value="start with">start with</option>
                        <option value="doesn't start with">doesn't start with</option>
                      </select>
                      <div class="rulePara">
                        <div class="paraEntry">
                          <input
                            type="text"
                            class="selectPara parameters${num}"
                            placeholder="Select Parameter"
                          />
                          <img
                            class="parameterAdd"
                            data-id="${num}"
                            src="images/add_circle_outline.svg"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="ruleRevenueContainer">
                      <label class="ruleRevenueText">then revenue is</label>

                      <div class="ruleRevenueField">
                        <p class="percent">%</p>
                        <input
                          class="ruleAmount"
                          id="rev${num}"
                          type="text"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>`;

  const newRule = document.createElement("div");

  newRule.classList.add("ruleEntry");

  newRule.dataset.id = num;

  newRule.innerHTML = ruleHTML;

  const createdRule = rulesContainer.appendChild(newRule);

  // ATTACH EVENT LISTENER ON PARAMETER ADD AND DELETE BUTTON

  createdRule
    .querySelector(".parameterAdd")
    .addEventListener("click", function (e) {
      paraAddRemoveFunction(e);
    });

  // ATTACH EVENT LISTENER ON DELETE RULE BUTTON

  createdRule.addEventListener("click", function (e) {
    deleteRuleFunction(e);
  });
}

////////////////////CLASSES

class groupData {
  constructor(id, name, desc, special, rules) {
    this.id = id;
    this.groupName = name;
    this.groupDesc = desc;
    this.specialGroup = special;
    this.rules = rules;
    this.createTable(this);
  }

  maxParameterCount = 0;

  // GET MAX PARAMETERS COUNT TO BE PUT ON TABLE

  parameterKeysInsert(group) {
    let parameterHTML = "";

    group.rules.forEach((rule) => {
      let count = 0;

      rule.parameters.forEach(() => {
        count++;
      });

      if (this.maxParameterCount < count) this.maxParameterCount = count;
    });

    for (let x = 1; x <= this.maxParameterCount; x++) {
      parameterHTML += `<th>Parameter ${x}</th>`;
    }

    return parameterHTML;
  }

  // INSERT PARAMETERS OF A RULE

  parameterDataInsert(rule) {
    let parameterDataHTML = "";
    let count = 0;

    rule.parameters.forEach((parameter) => {
      parameterDataHTML += `<td>${parameter}</td>`;

      count++;
    });

    for (let i = count; i < this.maxParameterCount; i++) {
      parameterDataHTML += `<td></td>`;
    }

    return parameterDataHTML;
  }

  // CREATE TABLE FOR GROUP

  createTable(group) {
    // ALL HTML FOR TABLE

    const tableInfoHTML = `<div class="browseEntryTop">
                            <div class="browseHeader">
                              <div class="browseGroupNameAndSpecial">
                                <p class="browseGroupName">
                                ${group.groupName}</p>
                                ${
                                  group.specialGroup
                                    ? '<p class="browseSpecial">Special Group</p>'
                                    : ""
                                }
                              </div>
                              <img class="browseEntryDelete" src="images/Iconsdelete.svg" />
                            </div>

                            <p class="browseDesc">${group.groupDesc}</p>
                          </div>`;

    const tableRuleHeadHTML = `<tr>
                                <th>Rule</th>
                                <th>Field</th>
                                <th>Operator</th>
                                ${this.parameterKeysInsert(group)}
                                <th>Revenue</th>
                                <th>Action</th>
                              </tr>`;

    // HTML FOR EACH RULE AND SETTING BG COLOR FOR EACH RULE

    let tableRuleDataHTML = "";
    let ruleBgColor = 1;

    group.rules.forEach((rule) => {
      tableRuleDataHTML += `<tr class="tableRow ${
        ruleBgColor > 1 ? "altTableRow" : ""
      }" id="${rule.id}">
                              <td class="tableRuleNum">${rule.id.slice(-1)}</td>
                              <td>${rule.field}</td>
                              <td>${rule.operator}</td>
                              ${this.parameterDataInsert(rule)}
                              <td>${rule.revenue}</td>
                              <td>
                                <img class="tableRuleDelete" src="images/Iconsdelete.svg" />
                              </td>
                            </tr>`;

      if (ruleBgColor === 1) {
        ruleBgColor++;
      } else {
        ruleBgColor--;
      }
    });

    // COMBINE ALL TABLE HTML

    const fullTableHTML = document.createElement("table");

    fullTableHTML.classList.add("browseTable");

    fullTableHTML.insertAdjacentHTML(
      "afterbegin",
      tableRuleHeadHTML + tableRuleDataHTML
    );

    const bottomContainer = document.createElement("div");

    bottomContainer.classList.add("browseEntryBottom");

    bottomContainer.append(fullTableHTML);

    const tableContainer = document.createElement("div");

    tableContainer.classList.add("browseEntry");

    tableContainer.id = this.id;

    tableContainer.insertAdjacentHTML("afterbegin", tableInfoHTML);

    tableContainer.append(bottomContainer);

    const createdTable = browseRevenueEntries.appendChild(tableContainer);

    // ADD EVENT LISTENER THE GROUP AND RULE DELETE ICONS

    createdTable.addEventListener("click", function (e) {
      if (e.target.classList.contains("browseEntryDelete")) {
        let tableID = e.target.closest(".browseEntry").id;

        document.getElementById(tableID).remove();

        const revToDelete = revenueGroups.findIndex(
          (rev) => rev.id === tableID
        );

        revenueGroups.splice(revToDelete, 1);
      }

      if (e.target.classList.contains("tableRuleDelete")) {
        let ruleID = e.target.closest(".tableRow").id;

        const deletedRule = document.getElementById(ruleID);

        const currentRevGroupEl = deletedRule.closest(".browseEntry");

        const currentRevGroup =
          revenueGroups[
            revenueGroups.findIndex((rev) => rev.id === currentRevGroupEl.id)
          ];

        deletedRule.remove();

        const ruleToDelete = currentRevGroup.rules.findIndex(
          (rul) => rul.id === ruleID
        );

        currentRevGroup.rules.splice(ruleToDelete, 1);

        // RULE BG RECOLOR AND RENUMBER

        ruleBgColor = 1;

        let ruleReNumber = 1;

        const allCurrentRows = currentRevGroupEl.querySelectorAll(".tableRow");

        allCurrentRows.forEach((row) => {
          row.querySelector(".tableRuleNum").textContent = ruleReNumber;

          ruleReNumber++;

          row.classList.remove("altTableRow");

          if (ruleBgColor > 1) {
            row.classList.add("altTableRow");
            ruleBgColor--;
          } else {
            ruleBgColor++;
          }
        });
      }
    });
  }
}

class ruleData {
  constructor(id, field, operator, parameters, revenue) {
    this.id = id;
    this.field = field;
    this.operator = operator;
    this.parameters = parameters;
    this.revenue = revenue;
  }
}

////////////////SUBMITTING FORM

submit.addEventListener("click", function (e) {
  e.preventDefault();

  const allRules = [];

  for (let x = 1; x <= ruleNum; x++) {
    const fieldValue = document.getElementById(`field${x}`).value;
    const operatorValue = document.getElementById(`operator${x}`).value;
    const revenue = document.getElementById(`rev${x}`).value;

    const parameters = document.querySelectorAll(`.parameters${x}`);
    const parameterValues = [];

    for (const data of parameters) {
      parameterValues.push(data.value);
    }

    const rule = new ruleData(
      `t${groupCount}r${x}`,
      fieldValue,
      operatorValue,
      parameterValues,
      revenue
    );

    allRules.push(rule);
  }

  const group = new groupData(
    `tableId${groupCount}`,
    groupName.value,
    groupDesc.value,
    specialGroup.checked,
    allRules
  );

  revenueGroups.push(group);

  groupCount++;

  ruleEntries = document.querySelectorAll(".ruleEntry");

  // CLEARING FORM INPUTS

  groupName.value = "";
  groupDesc.value = "";
  specialGroup.checked = false;

  ruleEntries.forEach((entry) => entry.remove());

  ruleNum = 1;

  // PUT NEW RULE ENTRY
  addRule(ruleNum);
});

//////////// PARAMETER ADD FUNCTION TO THE FIRST RULE ON PAGE LOAD

parameterAddBtn.addEventListener("click", function (e) {
  paraAddRemoveFunction(e);
});

////////////// EVENT LISTENER TO ADD RULE BUTTON ON FORM

addBtn.addEventListener("click", function () {
  ruleNum++;

  addRule(ruleNum);
});

////////////// EVENT LISTENER FOR DELETING RULES

ruleEntry.addEventListener("click", function (e) {
  deleteRuleFunction(e);
});

////////////// EVENT LISTENER ON LETTER COUNT ON GROUP DESCRIPTION

groupDesc.addEventListener("input", function (e) {
  const currentCount = e.target.value.length;

  document.querySelector(".currentCharCount").textContent = currentCount;
});
