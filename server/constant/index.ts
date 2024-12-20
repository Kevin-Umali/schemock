import { z } from 'zod'

import {
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
  type LocaleDefinition,
} from '@faker-js/faker'

// Define the union type for Faker methods
export const FakerMethods = z.enum([
  '_defaultRefDate',
  'datatype.number',
  'datatype.float',
  'datatype.datetime',
  'datatype.string',
  'datatype.uuid',
  'datatype.boolean',
  'datatype.hexadecimal',
  'datatype.json',
  'datatype.array',
  'datatype.bigInt',
  'date.month',
  'date.weekday',
  'date.anytime',
  'date.past',
  'date.future',
  'date.between',
  'date.betweens',
  'date.recent',
  'date.soon',
  'date.birthdate',
  'number.int',
  'number.float',
  'number.binary',
  'number.octal',
  'number.hex',
  'number.bigInt',
  'string.fromCharacters',
  'string.alpha',
  'string.alphanumeric',
  'string.binary',
  'string.octal',
  'string.hexadecimal',
  'string.numeric',
  'string.sample',
  'string.uuid',
  'string.nanoid',
  'string.symbol',
  'random.word',
  'random.words',
  'random.locale',
  'random.alpha',
  'random.alphaNumeric',
  'random.numeric',
  'airline.airport',
  'airline.airline',
  'airline.airplane',
  'airline.recordLocator',
  'airline.seat',
  'airline.aircraftType',
  'airline.flightNumber',
  'animal.dog',
  'animal.cat',
  'animal.snake',
  'animal.bear',
  'animal.lion',
  'animal.cetacean',
  'animal.horse',
  'animal.bird',
  'animal.cow',
  'animal.fish',
  'animal.crocodilia',
  'animal.insect',
  'animal.rabbit',
  'animal.rodent',
  'animal.type',
  'color.human',
  'color.space',
  'color.cssSupportedFunction',
  'color.cssSupportedSpace',
  'color.rgb',
  'color.cmyk',
  'color.hsl',
  'color.hwb',
  'color.lab',
  'color.lch',
  'color.colorByCSSColorSpace',
  'commerce.department',
  'commerce.productName',
  'commerce.price',
  'commerce.productAdjective',
  'commerce.productMaterial',
  'commerce.product',
  'commerce.productDescription',
  'commerce.isbn',
  'company.suffixes',
  'company.name',
  'company.companySuffix',
  'company.catchPhrase',
  'company.bs',
  'company.buzzPhrase',
  'company.catchPhraseAdjective',
  'company.catchPhraseDescriptor',
  'company.catchPhraseNoun',
  'company.bsAdjective',
  'company.buzzAdjective',
  'company.bsBuzz',
  'company.buzzVerb',
  'company.bsNoun',
  'company.buzzNoun',
  'database.column',
  'database.type',
  'database.collation',
  'database.engine',
  'database.mongodbObjectId',
  'finance.account',
  'finance.accountNumber',
  'finance.accountName',
  'finance.routingNumber',
  'finance.mask',
  'finance.maskedNumber',
  'finance.amount',
  'finance.transactionType',
  'finance.currency',
  'finance.currencyCode',
  'finance.currencyName',
  'finance.currencySymbol',
  'finance.bitcoinAddress',
  'finance.litecoinAddress',
  'finance.creditCardNumber',
  'finance.creditCardCVV',
  'finance.creditCardIssuer',
  'finance.pin',
  'finance.ethereumAddress',
  'finance.iban',
  'finance.bic',
  'finance.transactionDescription',
  'git.branch',
  'git.commitEntry',
  'git.commitMessage',
  'git.commitDate',
  'git.commitSha',
  'git.shortSha',
  'hacker.abbreviation',
  'hacker.adjective',
  'hacker.noun',
  'hacker.verb',
  'hacker.ingverb',
  'hacker.phrase',
  'image.avatar',
  'image.avatarGitHub',
  'image.avatarLegacy',
  'image.url',
  'image.urlLoremFlickr',
  'image.urlPicsumPhotos',
  'image.urlPlaceholder',
  'image.dataUri',
  'image.image',
  'image.imageUrl',
  'image.abstract',
  'image.animals',
  'image.business',
  'image.cats',
  'image.city',
  'image.food',
  'image.nightlife',
  'image.fashion',
  'image.people',
  'image.nature',
  'image.sports',
  'image.technics',
  'image.transport',
  'internet.avatar',
  'internet.email',
  'internet.exampleEmail',
  'internet.userName',
  'internet.displayName',
  'internet.protocol',
  'internet.httpMethod',
  'internet.httpStatusCode',
  'internet.url',
  'internet.domainName',
  'internet.domainSuffix',
  'internet.domainWord',
  'internet.ip',
  'internet.ipv4',
  'internet.ipv6',
  'internet.port',
  'internet.userAgent',
  'internet.color',
  'internet.mac',
  'internet.password',
  'internet.emoji',
  'location.zipCode',
  'location.zipCodeByState',
  'location.city',
  'location.cityName',
  'location.buildingNumber',
  'location.street',
  'location.streetName',
  'location.streetAddress',
  'location.secondaryAddress',
  'location.county',
  'location.country',
  'location.countryCode',
  'location.state',
  'location.stateAbbr',
  'location.latitude',
  'location.longitude',
  'location.direction',
  'location.cardinalDirection',
  'location.ordinalDirection',
  'location.nearbyGPSCoordinate',
  'location.timeZone',
  'lorem.word',
  'lorem.words',
  'lorem.sentence',
  'lorem.slug',
  'lorem.sentences',
  'lorem.paragraph',
  'lorem.paragraphs',
  'lorem.text',
  'lorem.lines',
  'music.genre',
  'music.songName',
  'person.firstName',
  'person.lastName',
  'person.middleName',
  'person.fullName',
  'person.gender',
  'person.sex',
  'person.sexType',
  'person.bio',
  'person.prefix',
  'person.suffix',
  'person.jobTitle',
  'person.jobDescriptor',
  'person.jobArea',
  'person.jobType',
  'person.zodiacSign',
  'phone.number',
  'phone.imei',
  'science.chemicalElement',
  'science.unit',
  'system.fileName',
  'system.commonFileName',
  'system.mimeType',
  'system.commonFileType',
  'system.commonFileExt',
  'system.fileType',
  'system.fileExt',
  'system.directoryPath',
  'system.filePath',
  'system.semver',
  'system.networkInterface',
  'system.cron',
  'vehicle.vehicle',
  'vehicle.manufacturer',
  'vehicle.model',
  'vehicle.type',
  'vehicle.fuel',
  'vehicle.vin',
  'vehicle.color',
  'vehicle.vrm',
  'vehicle.bicycle',
  'word.adjective',
  'word.adverb',
  'word.conjunction',
  'word.interjection',
  'word.noun',
  'word.preposition',
  'word.verb',
  'word.sample',
  'word.words',
])

export const Locales = z.enum([
  'af_ZA',
  'ar',
  'az',
  'cs_CZ',
  'da',
  'de',
  'de_AT',
  'de_CH',
  'dv',
  'el',
  'en',
  'en_AU',
  'en_AU_ocker',
  'en_BORK',
  'en_CA',
  'en_GB',
  'en_GH',
  'en_HK',
  'en_IE',
  'en_IN',
  'en_NG',
  'en_US',
  'en_ZA',
  'eo',
  'es',
  'es_MX',
  'fa',
  'fi',
  'fr',
  'fr_BE',
  'fr_CA',
  'fr_CH',
  'fr_LU',
  'fr_SN',
  'he',
  'hr',
  'hu',
  'hy',
  'id_ID',
  'it',
  'ja',
  'ka_GE',
  'ko',
  'lv',
  'mk',
  'nb_NO',
  'ne',
  'nl',
  'nl_BE',
  'pl',
  'pt_BR',
  'pt_PT',
  'ro',
  'ro_MD',
  'ru',
  'sk',
  'sr_RS_latin',
  'sv',
  'th',
  'tr',
  'uk',
  'ur',
  'vi',
  'yo_NG',
  'zh_CN',
  'zh_TW',
  'zu_ZA',
])

// Define the locale map with base locale included
export const localeMap: { [key: string]: LocaleDefinition[] } = {
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
}
