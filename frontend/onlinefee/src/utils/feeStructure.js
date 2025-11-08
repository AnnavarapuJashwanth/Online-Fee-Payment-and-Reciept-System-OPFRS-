// Fee structure based on the provided image for academic year 2025-26

export const feeStructure = {
  "Category A": {
    "Computer Science and Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 380000,
      tuitionFeePerSemester: 190000,
    },
    "CSE - AI & ML": {
      admissionFee: 20000,
      tuitionFeePerYear: 380000,
      tuitionFeePerSemester: 190000,
    },
    "CSE - Cyber Security": {
      admissionFee: 20000,
      tuitionFeePerYear: 380000,
      tuitionFeePerSemester: 190000,
    },
    "CSE - Data Science": {
      admissionFee: 20000,
      tuitionFeePerYear: 380000,
      tuitionFeePerSemester: 190000,
    },
    "CSE - IoT": {
      admissionFee: 20000,
      tuitionFeePerYear: 380000,
      tuitionFeePerSemester: 190000,
    },
    "Electronics and Communication Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "Electrical and Electronics Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Mechanical Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Chemical Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Agriculture Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Civil Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Textile Technology": {
      admissionFee: 20000,
      tuitionFeePerYear: 200000,
      tuitionFeePerSemester: 100000,
    },
    "Biotechnology": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "Bioinformatics": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "Food Technology": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
  },
  "Category B": {
    "Computer Science and Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "CSE - AI & ML": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "CSE - Cyber Security": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "CSE - Data Science": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "CSE - IoT": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "Electronics and Communication Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "Electrical and Electronics Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Mechanical Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Chemical Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Agriculture Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Civil Engineering": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
    "Textile Technology": {
      admissionFee: 20000,
      tuitionFeePerYear: 200000,
      tuitionFeePerSemester: 100000,
    },
    "Biotechnology": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "Bioinformatics": {
      admissionFee: 20000,
      tuitionFeePerYear: 300000,
      tuitionFeePerSemester: 150000,
    },
    "Food Technology": {
      admissionFee: 20000,
      tuitionFeePerYear: 220000,
      tuitionFeePerSemester: 110000,
    },
  },
};

// Hostel fee structure
export const hostelFee = {
  "AC Rooms": {
    feePerYear: 145000,
    feePerSemester: 72500,
    registrationFee: 5000,
  },
  "Non AC Rooms": {
    feePerYear: 115000,
    feePerSemester: 57500,
    registrationFee: 5000,
  },
};

// Transport fee structure (example - adjust as needed)
export const transportFee = {
  "Within 10km": {
    feePerYear: 20000,
    feePerSemester: 10000,
  },
  "10-20km": {
    feePerYear: 30000,
    feePerSemester: 15000,
  },
  "20-30km": {
    feePerYear: 40000,
    feePerSemester: 20000,
  },
  "Above 30km": {
    feePerYear: 50000,
    feePerSemester: 25000,
  },
};

// Get fee for specific student
export const getStudentFee = (category, branch, year, semester) => {
  const branchFee = feeStructure[category]?.[branch];
  if (!branchFee) return null;

  return {
    tuitionFee: branchFee.tuitionFeePerSemester,
    admissionFee: year === "1st Year" && semester === "1st Semester" ? branchFee.admissionFee : 0,
  };
};

// Get semester number from year and semester
export const getSemesterNumber = (year, semester) => {
  const yearNum = parseInt(year);
  const semNum = semester === "1st Semester" ? 1 : 2;
  return (yearNum - 1) * 2 + semNum;
};

// Validate if student can pay for a specific semester
export const canPayForSemester = (currentYear, currentSemester, targetYear, targetSemester) => {
  const currentSemNum = getSemesterNumber(currentYear, currentSemester);
  const targetSemNum = getSemesterNumber(targetYear, targetSemester);
  
  return currentSemNum === targetSemNum;
};
