"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trialAssessmentDel = trialAssessmentDel;
exports.trialAssessmentQuery = trialAssessmentQuery;
exports.trialAssessmentUpdate = trialAssessmentUpdate;
exports.trialAssessmentInsert = trialAssessmentInsert;
exports.examArchiveDel = examArchiveDel;
exports.examArchiveQuery = examArchiveQuery;
exports.examArchiveUpdate = examArchiveUpdate;
exports.examArchiveSave = examArchiveSave;
exports.addHospitalRegist = addHospitalRegist;
exports.updateHospitalRegist = updateHospitalRegist;
exports.queryHospitalRegist = queryHospitalRegist;
exports.outHospitalRegist = outHospitalRegist;
exports.assessmentDel = assessmentDel;
exports.assessmentQuery = assessmentQuery;
exports.assessmentUpdate = assessmentUpdate;
exports.assessmentSave = assessmentSave;
exports.riskNotificationQuery = riskNotificationQuery;
exports.riskNotificationQueryList = riskNotificationQueryList;
exports.riskNotificationUpdate = riskNotificationUpdate;
exports.riskNotificationSave = riskNotificationSave;
exports.contractQuery = contractQuery;
exports.contractQueryList = contractQueryList;
exports.contractUpdate = contractUpdate;
exports.contractSave = contractSave;
exports.patientQuery = patientQuery;

var _request = _interopRequireDefault(require("@/utils/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 试用期评估
function trialAssessmentDel(params) {
  return regeneratorRuntime.async(function trialAssessmentDel$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", (0, _request["default"])('/trial-assessment/delete', {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

;

function trialAssessmentQuery(params) {
  return regeneratorRuntime.async(function trialAssessmentQuery$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", (0, _request["default"])("/trial-assessment/query?businessNo=".concat(params.businessNo), {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

;

function trialAssessmentUpdate(params) {
  return regeneratorRuntime.async(function trialAssessmentUpdate$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", (0, _request["default"])('/trial-assessment/update', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}

;

function trialAssessmentInsert(params) {
  return regeneratorRuntime.async(function trialAssessmentInsert$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", (0, _request["default"])('/trial-assessment/insert', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
}

;
/**体检*/

function examArchiveDel(params) {
  return regeneratorRuntime.async(function examArchiveDel$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", (0, _request["default"])("/examArchive/delete?businessNo=".concat(params.businessNo), {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}

;

function examArchiveQuery(params) {
  return regeneratorRuntime.async(function examArchiveQuery$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", (0, _request["default"])("/examArchive/select?businessNo=".concat(params.businessNo), {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}

;

function examArchiveUpdate(params) {
  return regeneratorRuntime.async(function examArchiveUpdate$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.abrupt("return", (0, _request["default"])('/examArchive/update', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
}

;

function examArchiveSave(params) {
  return regeneratorRuntime.async(function examArchiveSave$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          return _context8.abrupt("return", (0, _request["default"])('/examArchive/save', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
}

; //入院登记

function addHospitalRegist(params) {
  return regeneratorRuntime.async(function addHospitalRegist$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          return _context9.abrupt("return", (0, _request["default"])('/hospitalRegist/add', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
}

function updateHospitalRegist(params) {
  return regeneratorRuntime.async(function updateHospitalRegist$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          return _context10.abrupt("return", (0, _request["default"])('/hospitalRegist/update', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context10.stop();
      }
    }
  });
}

function queryHospitalRegist(params) {
  return regeneratorRuntime.async(function queryHospitalRegist$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          return _context11.abrupt("return", (0, _request["default"])('/hospitalRegist/select', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context11.stop();
      }
    }
  });
} //出院 


function outHospitalRegist(params) {
  return regeneratorRuntime.async(function outHospitalRegist$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          return _context12.abrupt("return", (0, _request["default"])("/hospitalRegist/out?businessNo=".concat(params.businessNo, "&to=").concat(params.peopleTo), {
            method: 'GET'
          }));

        case 1:
        case "end":
          return _context12.stop();
      }
    }
  });
} //试用期评估


function assessmentDel(params) {
  return regeneratorRuntime.async(function assessmentDel$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          return _context13.abrupt("return", (0, _request["default"])("/admission-assessment/delete?businessNo=".concat(params.businessNo), {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context13.stop();
      }
    }
  });
}

;

function assessmentQuery(params) {
  return regeneratorRuntime.async(function assessmentQuery$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          return _context14.abrupt("return", (0, _request["default"])("/admission-assessment/query?businessNo=".concat(params.businessNo), {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context14.stop();
      }
    }
  });
}

;

function assessmentUpdate(params) {
  return regeneratorRuntime.async(function assessmentUpdate$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          return _context15.abrupt("return", (0, _request["default"])('/admission-assessment/update', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context15.stop();
      }
    }
  });
}

;

function assessmentSave(params) {
  return regeneratorRuntime.async(function assessmentSave$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          return _context16.abrupt("return", (0, _request["default"])('/admission-assessment/insert', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context16.stop();
      }
    }
  });
}

; //风险告知书

function riskNotificationQuery(params) {
  return regeneratorRuntime.async(function riskNotificationQuery$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          return _context17.abrupt("return", (0, _request["default"])("/risk-notification/query?businessNo=".concat(params.businessNo), {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context17.stop();
      }
    }
  });
}

;

function riskNotificationQueryList(params) {
  return regeneratorRuntime.async(function riskNotificationQueryList$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          return _context18.abrupt("return", (0, _request["default"])("/risk-notification/query/page", {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context18.stop();
      }
    }
  });
}

;

function riskNotificationUpdate(params) {
  return regeneratorRuntime.async(function riskNotificationUpdate$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          return _context19.abrupt("return", (0, _request["default"])('/risk-notification/update', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context19.stop();
      }
    }
  });
}

;

function riskNotificationSave(params) {
  return regeneratorRuntime.async(function riskNotificationSave$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          return _context20.abrupt("return", (0, _request["default"])('/risk-notification/insert', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context20.stop();
      }
    }
  });
}

; //合同

function contractQuery(params) {
  return regeneratorRuntime.async(function contractQuery$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          return _context21.abrupt("return", (0, _request["default"])("/contract/query?businessNo=".concat(params.businessNo), {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context21.stop();
      }
    }
  });
}

;

function contractQueryList(params) {
  return regeneratorRuntime.async(function contractQueryList$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          return _context22.abrupt("return", (0, _request["default"])("/contract/query/page", {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context22.stop();
      }
    }
  });
}

;

function contractUpdate(params) {
  return regeneratorRuntime.async(function contractUpdate$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          return _context23.abrupt("return", (0, _request["default"])('/contract/update', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context23.stop();
      }
    }
  });
}

;

function contractSave(params) {
  return regeneratorRuntime.async(function contractSave$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          return _context24.abrupt("return", (0, _request["default"])('/contract/insert', {
            method: 'POST',
            data: params
          }));

        case 1:
        case "end":
          return _context24.stop();
      }
    }
  });
}

; //根据名字查询病人信息

function patientQuery(params) {
  return regeneratorRuntime.async(function patientQuery$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          return _context25.abrupt("return", (0, _request["default"])('/page/patient/query', {
            method: 'GET',
            data: params
          }));

        case 1:
        case "end":
          return _context25.stop();
      }
    }
  });
}