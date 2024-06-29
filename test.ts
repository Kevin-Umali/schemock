import {
  Faker,
  af_ZA as fakerAF_ZA,
  ar as fakerAR,
  az as fakerAZ,
  base as fakerBASE,
  cs_CZ as fakerCS_CZ,
  da as fakerDA,
  de as fakerDE,
  de_AT as fakerDE_AT,
  de_CH as fakerDE_CH,
  dv as fakerDV,
  el as fakerEL,
  en as fakerEN,
  en_AU as fakerEN_AU,
  en_AU_ocker as fakerEN_AU_ocker,
  en_BORK as fakerEN_BORK,
  en_CA as fakerEN_CA,
  en_GB as fakerEN_GB,
  en_GH as fakerEN_GH,
  en_HK as fakerEN_HK,
  en_IE as fakerEN_IE,
  en_IN as fakerEN_IN,
  en_NG as fakerEN_NG,
  en_US as fakerEN_US,
  en_ZA as fakerEN_ZA,
  eo as fakerEO,
  es as fakerES,
  es_MX as fakerES_MX,
  fa as fakerFA,
  fi as fakerFI,
  fr as fakerFR,
  fr_BE as fakerFR_BE,
  fr_CA as fakerFR_CA,
  fr_CH as fakerFR_CH,
  fr_LU as fakerFR_LU,
  fr_SN as fakerFR_SN,
  he as fakerHE,
  hr as fakerHR,
  hu as fakerHU,
  hy as fakerHY,
  id_ID as fakerID_ID,
  it as fakerIT,
  ja as fakerJA,
  ka_GE as fakerKA_GE,
  ko as fakerKO,
  lv as fakerLV,
  mk as fakerMK,
  nb_NO as fakerNB_NO,
  ne as fakerNE,
  nl as fakerNL,
  nl_BE as fakerNL_BE,
  pl as fakerPL,
  pt_BR as fakerPT_BR,
  pt_PT as fakerPT_PT,
  ro as fakerRO,
  ro_MD as fakerRO_MD,
  ru as fakerRU,
  sk as fakerSK,
  sr_RS_latin as fakerSR_RS_latin,
  sv as fakerSV,
  th as fakerTH,
  tr as fakerTR,
  uk as fakerUK,
  ur as fakerUR,
  vi as fakerVI,
  yo_NG as fakerYO_NG,
  zh_CN as fakerZH_CN,
  zh_TW as fakerZH_TW,
  zu_ZA as fakerZU_ZA,
} from "@faker-js/faker";
import type { LocaleDefinition } from "@faker-js/faker";

// Define the locale map with base locale included
const localeMap: { [key: string]: LocaleDefinition[] } = {
  af_ZA: [fakerAF_ZA, fakerEN, fakerBASE],
  ar: [fakerAR, fakerEN, fakerBASE],
  az: [fakerAZ, fakerEN, fakerBASE],
  base: [fakerEN, fakerBASE],
  cs_CZ: [fakerCS_CZ, fakerEN, fakerBASE],
  da: [fakerDA, fakerEN, fakerBASE],
  de: [fakerDE, fakerEN, fakerBASE],
  de_AT: [fakerDE_AT, fakerEN, fakerBASE],
  de_CH: [fakerDE_CH, fakerEN, fakerBASE],
  dv: [fakerDV, fakerEN, fakerBASE],
  el: [fakerEL, fakerEN, fakerBASE],
  en: [fakerEN, fakerBASE],
  en_AU: [fakerEN_AU, fakerEN, fakerBASE],
  en_AU_ocker: [fakerEN_AU_ocker, fakerEN, fakerBASE],
  en_BORK: [fakerEN_BORK, fakerEN, fakerBASE],
  en_CA: [fakerEN_CA, fakerEN, fakerBASE],
  en_GB: [fakerEN_GB, fakerEN, fakerBASE],
  en_GH: [fakerEN_GH, fakerEN, fakerBASE],
  en_HK: [fakerEN_HK, fakerEN, fakerBASE],
  en_IE: [fakerEN_IE, fakerEN, fakerBASE],
  en_IN: [fakerEN_IN, fakerEN, fakerBASE],
  en_NG: [fakerEN_NG, fakerEN, fakerBASE],
  en_US: [fakerEN_US, fakerEN, fakerBASE],
  en_ZA: [fakerEN_ZA, fakerEN, fakerBASE],
  eo: [fakerEO, fakerEN, fakerBASE],
  es: [fakerES, fakerEN, fakerBASE],
  es_MX: [fakerES_MX, fakerEN, fakerBASE],
  fa: [fakerFA, fakerEN, fakerBASE],
  fi: [fakerFI, fakerEN, fakerBASE],
  fr: [fakerFR, fakerEN, fakerBASE],
  fr_BE: [fakerFR_BE, fakerEN, fakerBASE],
  fr_CA: [fakerFR_CA, fakerEN, fakerBASE],
  fr_CH: [fakerFR_CH, fakerEN, fakerBASE],
  fr_LU: [fakerFR_LU, fakerEN, fakerBASE],
  fr_SN: [fakerFR_SN, fakerEN, fakerBASE],
  he: [fakerHE, fakerEN, fakerBASE],
  hr: [fakerHR, fakerEN, fakerBASE],
  hu: [fakerHU, fakerEN, fakerBASE],
  hy: [fakerHY, fakerEN, fakerBASE],
  id_ID: [fakerID_ID, fakerEN, fakerBASE],
  it: [fakerIT, fakerEN, fakerBASE],
  ja: [fakerJA, fakerEN, fakerBASE],
  ka_GE: [fakerKA_GE, fakerEN, fakerBASE],
  ko: [fakerKO, fakerEN, fakerBASE],
  lv: [fakerLV, fakerEN, fakerBASE],
  mk: [fakerMK, fakerEN, fakerBASE],
  nb_NO: [fakerNB_NO, fakerEN, fakerBASE],
  ne: [fakerNE, fakerEN, fakerBASE],
  nl: [fakerNL, fakerEN, fakerBASE],
  nl_BE: [fakerNL_BE, fakerEN, fakerBASE],
  pl: [fakerPL, fakerEN, fakerBASE],
  pt_BR: [fakerPT_BR, fakerEN, fakerBASE],
  pt_PT: [fakerPT_PT, fakerEN, fakerBASE],
  ro: [fakerRO, fakerEN, fakerBASE],
  ro_MD: [fakerRO_MD, fakerEN, fakerBASE],
  ru: [fakerRU, fakerEN, fakerBASE],
  sk: [fakerSK, fakerEN, fakerBASE],
  sr_RS_latin: [fakerSR_RS_latin, fakerEN, fakerBASE],
  sv: [fakerSV, fakerEN, fakerBASE],
  th: [fakerTH, fakerEN, fakerBASE],
  tr: [fakerTR, fakerEN, fakerBASE],
  uk: [fakerUK, fakerEN, fakerBASE],
  ur: [fakerUR, fakerEN, fakerBASE],
  vi: [fakerVI, fakerEN, fakerBASE],
  yo_NG: [fakerYO_NG, fakerEN, fakerBASE],
  zh_CN: [fakerZH_CN, fakerEN, fakerBASE],
  zh_TW: [fakerZH_TW, fakerEN, fakerBASE],
  zu_ZA: [fakerZU_ZA, fakerEN, fakerBASE],
};

interface BaseSchema {
  count?: number;
  items?: GenerateSchema;
}

interface GenerateSchema {
  [key: string]: string | BaseSchema | GenerateSchema;
}

const CustomFakerFunctions: { [key: string]: () => string } = {
  customFunction: () => "Custom Value",
};

// Helper function to check if the value is a schema array
const isSchemaArray = (value: unknown): value is BaseSchema => {
  return typeof value === "object" && value !== null && ("items" in value || "count" in value);
};

// Function to access nested properties with proper typing
const getNestedFunction = (obj: Record<string, any>, path: string): (() => any) => {
  return path.split(".").reduce((acc: any, part: string) => {
    if (acc && acc[part] !== undefined) {
      return acc[part];
    }
    throw new Error(`Path ${path} is invalid at part ${part}`);
  }, obj);
};

// Function to handle string schema values
const handleStringSchema = (value: string, fakerInstance: Faker): any => {
  try {
    let fakerFunction: () => any;
    if (value.startsWith("custom.")) {
      const customFunctionKey = value.split(".")[1];
      fakerFunction = CustomFakerFunctions[customFunctionKey];
      if (!fakerFunction) {
        throw new Error(`Custom faker function not found: ${customFunctionKey}`);
      }
    } else {
      fakerFunction = getNestedFunction(fakerInstance as unknown as Record<string, any>, value);
      if (typeof fakerFunction !== "function") {
        throw new Error(`Faker function not found: ${value}`);
      }
    }
    return fakerFunction();
  } catch (error) {
    console.log(error);
    return `Error accessing function: ${value}`;
  }
};

// Function to handle schema arrays
const handleSchemaArray = (value: BaseSchema, locale: string): any => {
  if (value.count) {
    return Array.from({ length: value.count }, () => generateFakeData(value.items || {}, locale));
  } else if (value.items) {
    return generateFakeData(value.items, locale);
  } else {
    return [];
  }
};

// Function to generate fake data based on the provided schema
export const generateFakeData = (schema: GenerateSchema, locale: string = "en"): Record<string, any> => {
  const fakerInstance = new Faker({
    locale: localeMap[locale] || localeMap["en"], // Default to 'en' if locale not found
  });

  const fakeData: Record<string, any> = {};

  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === "string") {
      fakeData[key] = handleStringSchema(value, fakerInstance);
    } else if (isSchemaArray(value)) {
      fakeData[key] = handleSchemaArray(value, locale);
    } else if (typeof value === "object" && value !== null) {
      fakeData[key] = generateFakeData(value as GenerateSchema, locale);
    } else {
      fakeData[key] = `Unhandled type for key: ${key}`;
    }
  }

  return fakeData;
};
