// Mapping of course abbreviations to professional titles and welcome messages
export const COURSE_TITLES: Record<string, { title: string; welcome: string }> = {
  // Health & Allied Sciences
  BSN: { title: 'RN', welcome: 'Welcome Future RN' },
  BSP: { title: 'RPh', welcome: 'Welcome Future RPh' },
  BSMT: { title: 'RMT', welcome: 'Welcome Future RMT' },
  BSMLS: { title: 'RMT', welcome: 'Welcome Future RMT' },
  BSPT: { title: 'RPT', welcome: 'Welcome Future RPT' },
  BSOT: { title: 'ROT', welcome: 'Welcome Future ROT' },
  DMD: { title: 'DMD', welcome: 'Welcome Future DMD' },
  BSM: { title: 'RM', welcome: 'Welcome Future RM' },
  BSRT: { title: 'RTRP', welcome: 'Welcome Future RTRP' },
  BSN_ND: { title: 'RND', welcome: 'Welcome Future RND' },
  BSSLP: { title: 'RSLP', welcome: 'Welcome Future RSLP' },
  BSRespT: { title: 'RRT', welcome: 'Welcome Future RRT' },
  BSOA: { title: 'OD', welcome: 'Welcome Future OD' },

  // Law & Criminology
  JD_LLB: { title: 'Atty.', welcome: 'Welcome Future Atty' },
  BSCrim: { title: 'Crim.', welcome: 'Welcome Future Crim' },

  // Education
  BEEd: { title: 'LPT', welcome: 'Welcome Future LPT' },
  BSEd: { title: 'LPT', welcome: 'Welcome Future LPT' },
  BECEd: { title: 'LPT', welcome: 'Welcome Future LPT' },
  BSNEd: { title: 'LPT', welcome: 'Welcome Future LPT' },
  BPEd: { title: 'LPT', welcome: 'Welcome Future LPT' },
  BTTEd: { title: 'LPT', welcome: 'Welcome Future LPT' },

  // Engineering
  BSCE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSME: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSEE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSECE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSChE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSGE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSMineE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSSE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSMtE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSComEng: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSAeroE: { title: 'Engr.', welcome: 'Welcome Future Engr' },
  BSIE: { title: 'Engr.', welcome: 'Welcome Future Engr' },

  // Business & Accountancy
  BSA: { title: 'CPA', welcome: 'Welcome Future CPA' },
  BSCA: { title: 'LCB', welcome: 'Welcome Future LCB' },
  BSREM: { title: 'REB', welcome: 'Welcome Future REB' },

  // Architecture & Design
  BSA_Arch: { title: 'Arch.', welcome: 'Welcome Future Architect' },
  BSID: { title: 'IDr.', welcome: 'Welcome Future IDr' },
  BSLA: { title: 'LArch.', welcome: 'Welcome Future LArch' },
  BFA: { title: 'IDr.', welcome: 'Welcome Future IDr' },

  // Sciences
  BSChem: { title: 'RCh', welcome: 'Welcome Future RCh' },
  BSGeo: { title: 'RG', welcome: 'Welcome Future RG' },
  BSF: { title: 'RF', welcome: 'Welcome Future RF' },
  BSAgri: { title: 'R.Agriculturist', welcome: 'Welcome Future R.Agriculturist' },
};

export function getProfessionalTitleAndWelcome(courseAbbr: string) {
  // Normalize courseAbbr if needed (replace / or - with _)
  const key = courseAbbr.replace(/[\/-]/g, '_');
  return COURSE_TITLES[key] || { title: '', welcome: '' };
} 