export const FakerFunctions: {
  category: string
  description: string
  items: { method: string; description: string; parameters: string; example: string }[]
}[] = [
  {
    category: 'airline',
    description: 'Module to generate airline and airport-related data.',
    items: [
      {
        method: 'airline.airport',
        description: 'Generates a random airport.',
        parameters: '',
        example: "{ name: 'Dallas Fort Worth International Airport', iataCode: 'DFW' }",
      },
      {
        method: 'airline.airline',
        description: 'Generates a random airline.',
        parameters: '',
        example: "{ name: 'American Airlines', iataCode: 'AA' }",
      },
      {
        method: 'airline.airplane',
        description: 'Generates a random airplane.',
        parameters: '',
        example: "{ name: 'Airbus A321neo', iataTypeCode: '32Q' }",
      },
      {
        method: 'airline.recordLocator',
        description: 'Generates a random record locator, used by airlines to identify reservations.',
        parameters: `{
          allowNumerics?: boolean;
          allowVisuallySimilarCharacters?: boolean;
        }`,
        example: "'KIFRWE' or '1Z2Z3E' (depending on options)",
      },
      {
        method: 'airline.seat',
        description: 'Generates a random seat.',
        parameters: `{
          aircraftType?: 'narrowbody' | 'regional' | 'widebody';
        }`,
        example: "'22C', '7A', or '42K' (depending on options)",
      },
      {
        method: 'airline.aircraftType',
        description: 'Returns a random aircraft type.',
        parameters: '',
        example: "'narrowbody', 'regional', or 'widebody'",
      },
      {
        method: 'airline.flightNumber',
        description: 'Returns a random flight number, optionally padded with leading zeros.',
        parameters: `{
          length?: number | { min: number; max: number };
          addLeadingZeros?: boolean;
        }`,
        example: "'2405', '0042', or 'AA0798' (when combined with airline code)",
      },
    ],
  },
  {
    category: 'animal',
    description: 'Module to generate animal-related entries.',
    items: [
      {
        method: 'animal.dog',
        description: 'Returns a random dog breed.',
        parameters: '',
        example: "'Irish Water Spaniel'",
      },
      {
        method: 'animal.cat',
        description: 'Returns a random cat breed.',
        parameters: '',
        example: "'Singapura'",
      },
      {
        method: 'animal.snake',
        description: 'Returns a random snake species.',
        parameters: '',
        example: "'Eyelash viper'",
      },
      {
        method: 'animal.bear',
        description: 'Returns a random bear species.',
        parameters: '',
        example: "'Asian black bear'",
      },
      {
        method: 'animal.lion',
        description: 'Returns a random lion species.',
        parameters: '',
        example: "'Northeast Congo Lion'",
      },
      {
        method: 'animal.cetacean',
        description: 'Returns a random cetacean species.',
        parameters: '',
        example: "'Spinner Dolphin'",
      },
      {
        method: 'animal.horse',
        description: 'Returns a random horse breed.',
        parameters: '',
        example: "'Swedish Warmblood'",
      },
      {
        method: 'animal.bird',
        description: 'Returns a random bird species.',
        parameters: '',
        example: "'Buller's Shearwater'",
      },
      {
        method: 'animal.cow',
        description: 'Returns a random cow species.',
        parameters: '',
        example: "'Brava'",
      },
      {
        method: 'animal.fish',
        description: 'Returns a random fish species.',
        parameters: '',
        example: "'Mandarin fish'",
      },
      {
        method: 'animal.crocodilia',
        description: 'Returns a random crocodilian species.',
        parameters: '',
        example: "'Philippine Crocodile'",
      },
      {
        method: 'animal.insect',
        description: 'Returns a random insect species.',
        parameters: '',
        example: "'Pyramid ant'",
      },
      {
        method: 'animal.rabbit',
        description: 'Returns a random rabbit species.',
        parameters: '',
        example: "'Florida White'",
      },
      {
        method: 'animal.rodent',
        description: 'Returns a random rodent breed.',
        parameters: '',
        example: "'Cuscomys ashanika'",
      },
      {
        method: 'animal.type',
        description: 'Returns a random animal type.',
        parameters: '',
        example: "'crocodilia'",
      },
    ],
  },
  {
    category: 'color',
    description: 'Module to generate colors.',
    items: [
      {
        method: 'color.human',
        description: 'Returns a random human-readable color name.',
        parameters: '',
        example: "'red'",
      },
      {
        method: 'color.space',
        description: 'Returns a random color space name from worldwide accepted color spaces.',
        parameters: '',
        example: "'sRGB'",
      },
      {
        method: 'color.cssSupportedFunction',
        description: 'Returns a random CSS-supported color function name.',
        parameters: '',
        example: "'rgb'",
      },
      {
        method: 'color.cssSupportedSpace',
        description: 'Returns a random CSS-supported color space name.',
        parameters: '',
        example: "'display-p3'",
      },
      {
        method: 'color.rgb',
        description: 'Returns an RGB color.',
        parameters: `{
            prefix?: string;
            casing?: 'lower' | 'upper' | 'mixed';
            format?: 'hex' | 'css' | 'binary';
            includeAlpha?: boolean;
          }`,
        example: "'#8be4ab' or 'rgba(180, 158, 24, 0.75)' (depending on options)",
      },
      {
        method: 'color.cmyk',
        description: 'Returns a CMYK color.',
        parameters: `{
            format?: 'decimal' | 'css' | 'binary';
          }`,
        example: "[0.31, 0.52, 0.32, 0.43] or 'cmyk(100%, 0%, 0%, 0%)' (depending on options)",
      },
      {
        method: 'color.hsl',
        description: 'Returns an HSL color.',
        parameters: `{
            format?: 'decimal' | 'css' | 'binary';
            includeAlpha?: boolean;
          }`,
        example: "[201, 0.23, 0.32] or 'hsl(0deg, 100%, 80%)' (depending on options)",
      },
      {
        method: 'color.hwb',
        description: 'Returns an HWB color.',
        parameters: `{
            format?: 'decimal' | 'css' | 'binary';
          }`,
        example: "[201, 0.21, 0.31] or 'hwb(194 0% 0%)' (depending on options)",
      },
      {
        method: 'color.lab',
        description: 'Returns a LAB (CIELAB) color.',
        parameters: `{
            format?: 'decimal' | 'css' | 'binary';
          }`,
        example: "[0.832133, -80.3245, 100.1234] or 'lab(29.2345% 39.3825 20.0664)' (depending on options)",
      },
      {
        method: 'color.lch',
        description: 'Returns an LCH color.',
        parameters: `{
            format?: 'decimal' | 'css' | 'binary';
          }`,
        example: "[0.522345, 72.2, 56.2] or 'lch(52.2345% 72.2 56.2)' (depending on options)",
      },
      {
        method: 'color.colorByCSSColorSpace',
        description: 'Returns a random color based on the specified CSS color space.',
        parameters: `{
            format?: 'decimal' | 'css' | 'binary';
            space?: 'sRGB' | 'display-p3' | 'rec2020' | 'a98-rgb' | 'prophoto-rgb';
          }`,
        example: "[0.93, 1, 0.82] or 'color(display-p3 0.12 1 0.23)' (depending on options)",
      },
    ],
  },
  {
    category: 'commerce',
    description: 'Module to generate commerce and product-related entries.',
    items: [
      {
        method: 'commerce.department',
        description: 'Returns a department inside a shop.',
        parameters: '',
        example: "'Garden'",
      },
      {
        method: 'commerce.productName',
        description: 'Generates a random descriptive product name.',
        parameters: '',
        example: "'Incredible Soft Gloves'",
      },
      {
        method: 'commerce.price',
        description: 'Generates a price between min and max (inclusive).',
        parameters: `{
            min?: number;
            max?: number;
            dec?: number;
            symbol?: string;
          }`,
        example: "'828.00', '$114' (depending on options)",
      },
      {
        method: 'commerce.productAdjective',
        description: 'Returns an adjective describing a product.',
        parameters: '',
        example: "'Handcrafted'",
      },
      {
        method: 'commerce.productMaterial',
        description: 'Returns a material of a product.',
        parameters: '',
        example: "'Rubber'",
      },
      {
        method: 'commerce.product',
        description: 'Returns a short product name.',
        parameters: '',
        example: "'Computer'",
      },
      {
        method: 'commerce.productDescription',
        description: 'Returns a product description.',
        parameters: '',
        example: "'Andy shoes are designed to keeping...'",
      },
      {
        method: 'commerce.isbn',
        description: 'Returns a random ISBN identifier.',
        parameters: `{
            variant?: 10 | 13;
            separator?: string;
          }`,
        example: "'978-0-692-82459-7', '978 1 6618 9122 0' (depending on options)",
      },
    ],
  },
  {
    category: 'company',
    description: 'Module to generate company-related entries.',
    items: [
      {
        method: 'company.suffixes',
        description: 'Returns an array with possible company name suffixes.',
        parameters: '',
        example: "['Inc', 'and Sons', 'LLC', 'Group']",
      },
      {
        method: 'company.name',
        description: 'Generates a random company name.',
        parameters: '',
        example: "'Zieme, Hauck and McClure'",
      },
      {
        method: 'company.companySuffix',
        description: 'Returns a random company suffix.',
        parameters: '',
        example: "'and Sons'",
      },
      {
        method: 'company.catchPhrase',
        description: 'Generates a random catch phrase that can be displayed to an end user.',
        parameters: '',
        example: "'Upgradable systematic flexibility'",
      },
      {
        method: 'company.bs',
        description: 'Generates a random company BS phrase.',
        parameters: '',
        example: "'cultivate synergistic e-markets'",
      },
      {
        method: 'company.buzzPhrase',
        description: 'Generates a random buzz phrase.',
        parameters: '',
        example: "'cultivate synergistic e-markets'",
      },
      {
        method: 'company.catchPhraseAdjective',
        description: 'Returns a random catch phrase adjective.',
        parameters: '',
        example: "'Multi-tiered'",
      },
      {
        method: 'company.catchPhraseDescriptor',
        description: 'Returns a random catch phrase descriptor.',
        parameters: '',
        example: "'composite'",
      },
      {
        method: 'company.catchPhraseNoun',
        description: 'Returns a random catch phrase noun.',
        parameters: '',
        example: "'leverage'",
      },
      {
        method: 'company.bsAdjective',
        description: 'Returns a random company BS adjective.',
        parameters: '',
        example: "'one-to-one'",
      },
      {
        method: 'company.buzzAdjective',
        description: 'Returns a random buzz adjective.',
        parameters: '',
        example: "'one-to-one'",
      },
      {
        method: 'company.bsBuzz',
        description: 'Returns a random company BS buzzword.',
        parameters: '',
        example: "'empower'",
      },
      {
        method: 'company.buzzVerb',
        description: 'Returns a random buzz verb.',
        parameters: '',
        example: "'empower'",
      },
      {
        method: 'company.bsNoun',
        description: 'Returns a random company BS noun.',
        parameters: '',
        example: "'paradigms'",
      },
      {
        method: 'company.buzzNoun',
        description: 'Returns a random buzz noun.',
        parameters: '',
        example: "'paradigms'",
      },
    ],
  },
  {
    category: 'database',
    description: 'Module to generate database-related entries.',
    items: [
      {
        method: 'database.column',
        description: 'Returns a random database column name.',
        parameters: '',
        example: "'createdAt'",
      },
      {
        method: 'database.type',
        description: 'Returns a random database column type.',
        parameters: '',
        example: "'timestamp'",
      },
      {
        method: 'database.collation',
        description: 'Returns a random database collation.',
        parameters: '',
        example: "'utf8_unicode_ci'",
      },
      {
        method: 'database.engine',
        description: 'Returns a random database engine.',
        parameters: '',
        example: "'ARCHIVE'",
      },
      {
        method: 'database.mongodbObjectId',
        description: 'Returns a MongoDB ObjectId string.',
        parameters: '',
        example: "'e175cac316a79afdd0ad3afb'",
      },
    ],
  },
  {
    category: 'datatype',
    description: 'Module to generate various primitive values and data types.',
    items: [
      {
        method: 'datatype.number',
        description: 'Returns a single random number between zero and the given max value or range with the specified precision.',
        parameters: `{
            min?: number;
            max?: number;
            precision?: number;
          }`,
        example: '55422 or 36.94 (depending on options)',
      },
      {
        method: 'datatype.float',
        description: 'Returns a single random floating-point number for the given precision or range and precision.',
        parameters: `{
            min?: number;
            max?: number;
            precision?: number;
          }`,
        example: '51696.36 or 57.315 (depending on options)',
      },
      {
        method: 'datatype.datetime',
        description: 'Returns a Date object using a random number of milliseconds since the Unix Epoch.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'2089-04-17T18:03:24.956Z' or '2021-09-12T07:13:00.255Z' (depending on options)",
      },
      {
        method: 'datatype.string',
        description: 'Returns a string containing UTF-16 chars between 33 and 125 (`!` to `}`).',
        parameters: `{
            length?: number;
          }`,
        example: "'Zo!.:*e>wR' or '6Bye8' (depending on options)",
      },
      {
        method: 'datatype.uuid',
        description: 'Returns a UUID v4.',
        parameters: '',
        example: "'4136cd0b-d90b-4af7-b485-5d1ded8db252'",
      },
      {
        method: 'datatype.boolean',
        description: 'Returns the boolean value true or false, with an optional probability of true.',
        parameters: `{
            probability?: number;
          }`,
        example: 'true or false (depending on options)',
      },
      {
        method: 'datatype.hexadecimal',
        description: 'Returns a hexadecimal number.',
        parameters: `{
            length?: number;
            prefix?: string;
            case?: 'lower' | 'upper' | 'mixed';
          }`,
        example: "'0xaE13d044cB' or '#f12a974eB1' (depending on options)",
      },
      {
        method: 'datatype.json',
        description: 'Returns a string representing a JSON object with 7 pre-defined properties.',
        parameters: '',
        example: '`{"foo":"mxz.v8ISij","bar":29154,...}`',
      },
      {
        method: 'datatype.array',
        description: 'Returns an array with random strings and numbers.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "[94099, 'SK7H$W3:d*', 42281] (depending on options)",
      },
      {
        method: 'datatype.bigInt',
        description: 'Returns a BigInt number.',
        parameters: `{
            min?: bigint;
            max?: bigint;
          }`,
        example: '55422n or 36n (depending on options)',
      },
    ],
  },
  {
    category: 'date',
    description: 'Module to generate dates.',
    items: [
      {
        method: 'date.anytime',
        description: 'Generates a random date that can be either in the past or in the future.',
        parameters: `{
            refDate?: string | Date | number;
          }`,
        example: "'2022-07-31T01:33:29.567Z'",
      },
      {
        method: 'date.past',
        description: 'Generates a random date in the past.',
        parameters: `{
            years?: number;
            refDate?: string | Date | number;
          }`,
        example: "'2021-12-03T05:40:44.408Z'",
      },
      {
        method: 'date.future',
        description: 'Generates a random date in the future.',
        parameters: `{
            years?: number;
            refDate?: string | Date | number;
          }`,
        example: "'2022-11-19T05:52:49.100Z'",
      },
      {
        method: 'date.between',
        description: 'Generates a random date between the given boundaries.',
        parameters: `{
            from: string | Date | number;
            to: string | Date | number;
          }`,
        example: "'2026-05-16T02:22:53.002Z'",
      },
      {
        method: 'date.betweens',
        description: 'Generates random dates between the given boundaries, returned in chronological order.',
        parameters: `{
            from: string | Date | number;
            to: string | Date | number;
            count?: number | { min: number; max: number };
          }`,
        example: "[ '2022-07-02T06:00:00.000Z', '2024-12-31T12:00:00.000Z', '2027-07-02T18:00:00.000Z' ]",
      },
      {
        method: 'date.recent',
        description: 'Generates a random date in the recent past.',
        parameters: `{
            days?: number;
            refDate?: string | Date | number;
          }`,
        example: "'2022-02-04T02:09:35.077Z'",
      },
      {
        method: 'date.soon',
        description: 'Generates a random date in the near future.',
        parameters: `{
            days?: number;
            refDate?: string | Date | number;
          }`,
        example: "'2022-02-05T09:55:39.216Z'",
      },
      {
        method: 'date.birthdate',
        description: 'Returns a random birthdate based on the specified options.',
        parameters: `{
            min?: number;
            max?: number;
            mode?: 'age' | 'year';
            refDate?: string | Date | number;
          }`,
        example: "'1977-07-10T01:37:30.719Z'",
      },
      {
        method: 'date.month',
        description: 'Returns a random name of a month.',
        parameters: `{
            abbreviated?: boolean;
            context?: boolean;
          }`,
        example: "'October' or 'Feb'",
      },
      {
        method: 'date.weekday',
        description: 'Returns a random day of the week.',
        parameters: `{
            abbreviated?: boolean;
            context?: boolean;
          }`,
        example: "'Monday' or 'Thu'",
      },
    ],
  },
  {
    category: 'finance',
    description: 'Module to generate finance and money-related entries.',
    items: [
      {
        method: 'finance.accountNumber',
        description: 'Generates a random account number.',
        parameters: `{
            length?: number;
          }`,
        example: "'92842238'",
      },
      {
        method: 'finance.accountName',
        description: 'Generates a random account name.',
        parameters: '',
        example: "'Personal Loan Account'",
      },
      {
        method: 'finance.routingNumber',
        description: 'Generates a random routing number.',
        parameters: '',
        example: "'522814402'",
      },
      {
        method: 'finance.maskedNumber',
        description: 'Generates a random masked number.',
        parameters: `{
            length?: number;
            parens?: boolean;
            ellipsis?: boolean;
          }`,
        example: "'(...9711)'",
      },
      {
        method: 'finance.amount',
        description: 'Generates a random amount between given bounds.',
        parameters: `{
            min?: number;
            max?: number;
            dec?: number;
            symbol?: string;
            autoFormat?: boolean;
          }`,
        example: "'617.87'",
      },
      {
        method: 'finance.transactionType',
        description: 'Returns a random transaction type.',
        parameters: '',
        example: "'payment'",
      },
      {
        method: 'finance.currency',
        description: 'Returns a random currency object.',
        parameters: '',
        example: "{ code: 'USD', name: 'US Dollar', symbol: '$' }",
      },
      {
        method: 'finance.currencyCode',
        description: 'Returns a random currency code.',
        parameters: '',
        example: "'USD'",
      },
      {
        method: 'finance.currencyName',
        description: 'Returns a random currency name.',
        parameters: '',
        example: "'US Dollar'",
      },
      {
        method: 'finance.currencySymbol',
        description: 'Returns a random currency symbol.',
        parameters: '',
        example: "'$'",
      },
      {
        method: 'finance.bitcoinAddress',
        description: 'Generates a random Bitcoin address.',
        parameters: '',
        example: "'3ySdvCkTLVy7gKD4j6JfSaf5d'",
      },
      {
        method: 'finance.litecoinAddress',
        description: 'Generates a random Litecoin address.',
        parameters: '',
        example: "'MoQaSTGWBRXkWfyxKbNKuPrAWGELzcW'",
      },
      {
        method: 'finance.creditCardNumber',
        description: 'Generates a random credit card number.',
        parameters: `{
            issuer?: string;
          }`,
        example: "'4427163488662'",
      },
      {
        method: 'finance.creditCardCVV',
        description: 'Generates a random credit card CVV.',
        parameters: '',
        example: "'506'",
      },
      {
        method: 'finance.creditCardIssuer',
        description: 'Returns a random credit card issuer.',
        parameters: '',
        example: "'discover'",
      },
      {
        method: 'finance.pin',
        description: 'Generates a random PIN number.',
        parameters: `{
            length?: number;
          }`,
        example: "'5067'",
      },
      {
        method: 'finance.ethereumAddress',
        description: 'Generates a random Ethereum address.',
        parameters: '',
        example: "'0xf03dfeecbafc5147241cc4c4ca20b3c9dfd04c4a'",
      },
      {
        method: 'finance.iban',
        description: 'Generates a random IBAN.',
        parameters: `{
            formatted?: boolean;
            countryCode?: string;
          }`,
        example: "'TR736918640040966092800056'",
      },
      {
        method: 'finance.bic',
        description: 'Generates a random SWIFT/BIC code.',
        parameters: `{
            includeBranchCode?: boolean;
          }`,
        example: "'WYAUPGX1'",
      },
      {
        method: 'finance.transactionDescription',
        description: 'Generates a random transaction description.',
        parameters: '',
        example: "'invoice transaction at Kilback - Durgan using card ending with ***(...4316) for UAH 783.82 in account ***16168663'",
      },
    ],
  },
  {
    category: 'git',
    description: 'Module to generate git-related entries.',
    items: [
      {
        method: 'git.branch',
        description: 'Generates a random branch name.',
        parameters: '',
        example: "'feed-parse'",
      },
      {
        method: 'git.commitEntry',
        description: 'Generates a random commit entry as printed by `git log`.',
        parameters: `{
            merge?: boolean;
            eol?: 'LF' | 'CRLF';
            refDate?: string | Date | number;
          }`,
        example: `// commit fe8c38a965d13d9794eb36918cb24cebe49a45c2
    // Author: Marion Becker <Marion_Becker49@gmail.com>
    // Date: Mon Nov 7 05:38:37 2022 -0600
    //
    //     generate open-source system`,
      },
      {
        method: 'git.commitMessage',
        description: 'Generates a random commit message.',
        parameters: '',
        example: "'reboot cross-platform driver'",
      },
      {
        method: 'git.commitDate',
        description: 'Generates a date string for a git commit using the same format as `git log`.',
        parameters: `{
            refDate?: string | Date | number;
          }`,
        example: "'Mon Nov 7 14:40:58 2022 +0600'",
      },
      {
        method: 'git.commitSha',
        description: 'Generates a random commit SHA with a default length of 40 characters.',
        parameters: `{
            length?: number;
          }`,
        example: "'2c6e3880fd94ddb7ef72d34e683cdc0c47bec6e6'",
      },
      {
        method: 'git.shortSha',
        description: 'Generates a random short commit SHA (deprecated).',
        parameters: '',
        example: "'6155732'",
      },
    ],
  },
  {
    category: 'hacker',
    description: 'Module to generate hacker/IT words and phrases.',
    items: [
      {
        method: 'hacker.abbreviation',
        description: 'Returns a random hacker/IT abbreviation.',
        parameters: '',
        example: "'THX'",
      },
      {
        method: 'hacker.adjective',
        description: 'Returns a random hacker/IT adjective.',
        parameters: '',
        example: "'cross-platform'",
      },
      {
        method: 'hacker.noun',
        description: 'Returns a random hacker/IT noun.',
        parameters: '',
        example: "'system'",
      },
      {
        method: 'hacker.verb',
        description: 'Returns a random hacker/IT verb.',
        parameters: '',
        example: "'copy'",
      },
      {
        method: 'hacker.ingverb',
        description: "Returns a random hacker/IT verb for continuous actions (e.g., 'hacking').",
        parameters: '',
        example: "'navigating'",
      },
      {
        method: 'hacker.phrase',
        description: 'Generates a random hacker/IT phrase.',
        parameters: '',
        example: "'If we override the card, we can get to the HDD feed through the back-end HDD sensor!'",
      },
    ],
  },
  {
    category: 'image',
    description: 'Module to generate random images and placeholders URLs.',
    items: [
      {
        method: 'image.avatar',
        description: 'Generates a random avatar image URL.',
        parameters: '',
        example: "'https://avatars.githubusercontent.com/u/97165289'",
      },
      {
        method: 'image.avatarGitHub',
        description: 'Generates a random avatar from GitHub.',
        parameters: '',
        example: "'https://avatars.githubusercontent.com/u/97165289'",
      },
      {
        method: 'image.avatarLegacy',
        description: 'Generates a random avatar from IPFS.',
        parameters: '',
        example: "'https://cloudflare-ipfs.com/ipfs/.../170.jpg'",
      },
      {
        method: 'image.url',
        description: 'Generates a random image URL.',
        parameters: 'width?: number, height?: number',
        example: "'https://loremflickr.com/640/480?lock=1234'",
      },
      {
        method: 'image.urlLoremFlickr',
        description: 'Generates a random image URL provided via LoremFlickr.',
        parameters: 'width?: number, height?: number, category?: string',
        example: "'https://loremflickr.com/640/480/nature?lock=1234'",
      },
      {
        method: 'image.urlPicsumPhotos',
        description: 'Generates a random image URL provided via Picsum.',
        parameters: `width?: number, height?: number, grayscale?: boolean, blur?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10`,
        example: "'https://picsum.photos/seed/NWbJM2B/640/480?grayscale&blur=4'",
      },
      {
        method: 'image.urlPlaceholder',
        description: 'Generates a random placeholder image URL.',
        parameters: `{
            width?: number;
            height?: number;
            backgroundColor?: string;
            textColor?: string;
            format?: 'gif' | 'jpeg' | 'jpg' | 'png' | 'webp';
            text?: string;
          }`,
        example: "'https://via.placeholder.com/150x180/FF0000/FFFFFF.webp?text=lorem'",
      },
      {
        method: 'image.dataUri',
        description: 'Generates a random data URI containing an SVG image.',
        parameters: `width?: number, height?: number, color?: string, type?: 'svg-uri' | 'svg-base64'`,
        example: "'data:image/svg+xml;charset=UTF-8,...'",
      },
      {
        method: 'image.abstract',
        description: 'Generates a random abstract image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/abstract'",
      },
      {
        method: 'image.animals',
        description: 'Generates a random animal image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/animals'",
      },
      {
        method: 'image.business',
        description: 'Generates a random business image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/business'",
      },
      {
        method: 'image.cats',
        description: 'Generates a random cat image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/cats'",
      },
      {
        method: 'image.city',
        description: 'Generates a random city image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/city'",
      },
      {
        method: 'image.food',
        description: 'Generates a random food image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/food'",
      },
      {
        method: 'image.nightlife',
        description: 'Generates a random nightlife image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/nightlife'",
      },
      {
        method: 'image.fashion',
        description: 'Generates a random fashion image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/fashion'",
      },
      {
        method: 'image.people',
        description: 'Generates a random people image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/people'",
      },
      {
        method: 'image.nature',
        description: 'Generates a random nature image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/nature'",
      },
      {
        method: 'image.sports',
        description: 'Generates a random sports image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/sports'",
      },
      {
        method: 'image.technics',
        description: 'Generates a random technics image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/technics'",
      },
      {
        method: 'image.transport',
        description: 'Generates a random transport image URL.',
        parameters: 'width?: number, height?: number, randomize?: boolean',
        example: "'https://loremflickr.com/640/480/transport'",
      },
    ],
  },
  {
    category: 'internet',
    description: 'Module to generate internet-related entries.',
    items: [
      {
        method: 'internet.avatar',
        description: 'Generates a random avatar URL.',
        parameters: '',
        example: "'https://cloudflare-ipfs.com/ipfs/.../315.jpg'",
      },
      {
        method: 'internet.email',
        description: "Generates an email address using a person's name as the base.",
        parameters: `{
            firstName?: string;
            lastName?: string;
            provider?: string;
            allowSpecialCharacters?: boolean;
          }`,
        example: "'Jeanne.Doe88@example.fakerjs.dev'",
      },
      {
        method: 'internet.exampleEmail',
        description: 'Generates an email address using an example mail provider.',
        parameters: `{
            firstName?: string;
            lastName?: string;
            allowSpecialCharacters?: boolean;
          }`,
        example: "'Jeanne.Doe96@example.net'",
      },
      {
        method: 'internet.userName',
        description: "Generates a username using a person's name as the base.",
        parameters: `{
            firstName?: string;
            lastName?: string;
          }`,
        example: "'Jeanne_Doe98'",
      },
      {
        method: 'internet.displayName',
        description: "Generates a display name using a person's name as the base.",
        parameters: `{
            firstName?: string;
            lastName?: string;
          }`,
        example: "'Hélene_Müller11'",
      },
      {
        method: 'internet.protocol',
        description: "Returns a random web protocol, either 'http' or 'https'.",
        parameters: '',
        example: "'https'",
      },
      {
        method: 'internet.httpMethod',
        description: 'Returns a random HTTP method such as GET, POST, or DELETE.',
        parameters: '',
        example: "'PATCH'",
      },
      {
        method: 'internet.httpStatusCode',
        description: 'Generates a random HTTP status code.',
        parameters: `{
            types?: ReadonlyArray<'informational' | 'success' | 'clientError' | 'serverError' | 'redirection'>;
          }`,
        example: '200',
      },
      {
        method: 'internet.url',
        description: 'Generates a random HTTP(S) URL.',
        parameters: `{
            appendSlash?: boolean;
            protocol?: 'http' | 'https';
          }`,
        example: "'https://remarkable-hackwork.info'",
      },
      {
        method: 'internet.domainName',
        description: 'Generates a random domain name.',
        parameters: '',
        example: "'slow-timer.info'",
      },
      {
        method: 'internet.domainSuffix',
        description: "Returns a random domain suffix such as 'com' or 'net'.",
        parameters: '',
        example: "'com'",
      },
      {
        method: 'internet.domainWord',
        description: 'Generates a random domain word.',
        parameters: '',
        example: "'close-reality'",
      },
      {
        method: 'internet.ip',
        description: 'Generates a random IPv4 or IPv6 address.',
        parameters: '',
        example: "'4e5:f9c5:4337:abfd:9caf:1135:41ad:d8d3'",
      },
      {
        method: 'internet.ipv4',
        description: 'Generates a random IPv4 address.',
        parameters: '',
        example: "'245.108.222.0'",
      },
      {
        method: 'internet.ipv6',
        description: 'Generates a random IPv6 address.',
        parameters: '',
        example: "'269f:1230:73e3:318d:842b:daab:326d:897b'",
      },
      {
        method: 'internet.port',
        description: 'Generates a random port number.',
        parameters: '',
        example: '9414',
      },
      {
        method: 'internet.userAgent',
        description: 'Generates a random user agent string.',
        parameters: '',
        example: "'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_8)...'",
      },
      {
        method: 'internet.color',
        description: 'Generates a random aesthetically pleasing CSS hex color.',
        parameters: `{
            redBase?: number;
            greenBase?: number;
            blueBase?: number;
          }`,
        example: "'#30686e'",
      },
      {
        method: 'internet.mac',
        description: 'Generates a random MAC address.',
        parameters: `{
            separator?: string;
          }`,
        example: "'32:8e:2e:09:c6:05'",
      },
      {
        method: 'internet.password',
        description: 'Generates a random password-like string.',
        parameters: `{
            length?: number;
            memorable?: boolean;
            pattern?: RegExp;
            prefix?: string;
          }`,
        example: "'89G1wJuBLbGziIs'",
      },
      {
        method: 'internet.emoji',
        description: 'Generates a random emoji.',
        parameters: `{
            types?: ReadonlyArray<'smiley' | 'body' | 'person' | 'nature' | 'food' | 'travel' | 'activity' | 'object' | 'symbol' | 'flag'>;
          }`,
        example: "'🥰'",
      },
    ],
  },
  {
    category: 'location',
    description: 'Module to generate addresses and locations.',
    items: [
      {
        method: 'location.zipCode',
        description: 'Generates a random zip code from the specified format or locale default.',
        parameters: `{
            state?: string;
            format?: string;
          }`,
        example: "'17839'",
      },
      {
        method: 'location.zipCodeByState',
        description: 'Generates a random zip code for the given state abbreviation.',
        parameters: `{
            state?: string;
          }`,
        example: "'99595'",
      },
      {
        method: 'location.city',
        description: 'Generates a random localized city name.',
        parameters: '',
        example: "'East Jarretmouth'",
      },
      {
        method: 'location.cityName',
        description: 'Returns a random city name from a list of real cities for the locale.',
        parameters: '',
        example: "'San Rafael'",
      },
      {
        method: 'location.buildingNumber',
        description: 'Generates a random building number.',
        parameters: '',
        example: "'379'",
      },
      {
        method: 'location.street',
        description: 'Generates a random localized street name.',
        parameters: '',
        example: "'Schroeder Isle'",
      },
      {
        method: 'location.streetName',
        description: 'Returns a random localized street name.',
        parameters: '',
        example: "'Cavill Avenue'",
      },
      {
        method: 'location.streetAddress',
        description: 'Generates a random localized street address.',
        parameters: `{
            useFullAddress?: boolean;
          }`,
        example: "'0917 O'Conner Estates'",
      },
      {
        method: 'location.secondaryAddress',
        description: 'Generates a random localized secondary address (e.g., Apt, Room number).',
        parameters: '',
        example: "'Apt. 861'",
      },
      {
        method: 'location.county',
        description: 'Returns a random localized county or equivalent second-level administrative entity.',
        parameters: '',
        example: "'Monroe County'",
      },
      {
        method: 'location.country',
        description: 'Returns a random country name.',
        parameters: '',
        example: "'Greece'",
      },
      {
        method: 'location.countryCode',
        description: 'Returns a random ISO 3166-1 country code.',
        parameters: `{
            variant?: 'alpha-2' | 'alpha-3' | 'numeric';
          }`,
        example: "'GA'",
      },
      {
        method: 'location.state',
        description: 'Returns a random localized state or equivalent first-level administrative entity.',
        parameters: `{
            abbreviated?: boolean;
          }`,
        example: "'Mississippi'",
      },
      {
        method: 'location.stateAbbr',
        description: "Returns a random localized state's abbreviated name.",
        parameters: '',
        example: "'ND'",
      },
      {
        method: 'location.latitude',
        description: 'Generates a random latitude within specified bounds.',
        parameters: `{
            max?: number;
            min?: number;
            precision?: number;
          }`,
        example: '-30.9501',
      },
      {
        method: 'location.longitude',
        description: 'Generates a random longitude within specified bounds.',
        parameters: `{
            max?: number;
            min?: number;
            precision?: number;
          }`,
        example: '-170.5953',
      },
      {
        method: 'location.direction',
        description: 'Returns a random direction (cardinal and ordinal).',
        parameters: `{
            abbreviated?: boolean;
          }`,
        example: "'Northeast'",
      },
      {
        method: 'location.cardinalDirection',
        description: 'Returns a random cardinal direction (north, east, south, west).',
        parameters: `{
            abbreviated?: boolean;
          }`,
        example: "'North'",
      },
      {
        method: 'location.ordinalDirection',
        description: 'Returns a random ordinal direction (northwest, southeast, etc.).',
        parameters: `{
            abbreviated?: boolean;
          }`,
        example: "'Northeast'",
      },
      {
        method: 'location.nearbyGPSCoordinate',
        description: 'Generates a random GPS coordinate within a specified radius from the given coordinate.',
        parameters: `{
            origin?: [latitude: number, longitude: number];
            radius?: number;
            isMetric?: boolean;
          }`,
        example: '[33.8475, -170.5953]',
      },
      {
        method: 'location.timeZone',
        description: 'Returns a random time zone.',
        parameters: '',
        example: "'Pacific/Guam'",
      },
    ],
  },
  {
    category: 'lorem',
    description: 'Module to generate random texts and words.',
    items: [
      {
        method: 'lorem.word',
        description: 'Generates a word of a specified length.',
        parameters: `{
            length?: number | { min: number; max: number };
            strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
          }`,
        example: "'temporibus'",
      },
      {
        method: 'lorem.words',
        description: 'Generates a space-separated list of words.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'qui praesentium pariatur'",
      },
      {
        method: 'lorem.sentence',
        description: 'Generates a sentence with a specified number of words.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'Voluptatum cupiditate suscipit autem eveniet aut dolorem aut officiis distinctio.'",
      },
      {
        method: 'lorem.slug',
        description: 'Generates a slugified text with the specified number of words.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'dolores-illo-est'",
      },
      {
        method: 'lorem.sentences',
        description: 'Generates a specified number of sentences.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'Iste molestiae incidunt aliquam possimus reprehenderit eum corrupti.'",
      },
      {
        method: 'lorem.paragraph',
        description: 'Generates a paragraph with a specified number of sentences.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'Non architecto nam unde sint. Ex tenetur dolor facere optio aut consequatur. Ea laudantium reiciendis repellendus.'",
      },
      {
        method: 'lorem.paragraphs',
        description: 'Generates a specified number of paragraphs.',
        parameters: `{
            min?: number;
            max?: number;
            separator?: string;
          }`,
        example: "'Beatae voluptatem dicta et assumenda fugit eaque quidem consequatur.\\nVoluptatibus quo pariatur est.'",
      },
      {
        method: 'lorem.text',
        description: 'Generates random text based on a random lorem method.',
        parameters: '',
        example: "'Doloribus autem non quis vero quia.'",
      },
      {
        method: 'lorem.lines',
        description: 'Generates the specified number of lorem lines separated by newlines.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'Rerum quia aliquam pariatur explicabo sint minima eos.\\nVoluptatem repellat consequatur deleniti.'",
      },
    ],
  },
  {
    category: 'music',
    description: 'Module to generate music-related entries.',
    items: [
      {
        method: 'music.genre',
        description: 'Returns a random music genre.',
        parameters: '',
        example: "'Reggae'",
      },
      {
        method: 'music.songName',
        description: 'Returns a random song name.',
        parameters: '',
        example: "'White Christmas'",
      },
    ],
  },
  {
    category: 'number',
    description: 'Module to generate numbers of any kind.',
    items: [
      {
        method: 'number.int',
        description: 'Returns a single random integer between zero and the given max value or the given range. The bounds are inclusive.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: '2900970162509863',
      },
      {
        method: 'number.float',
        description:
          'Returns a single random floating-point number, by default between 0.0 and 1.0. Additional options can limit the range, precision, or decimal places.',
        parameters: `{
            min?: number;
            max?: number;
            fractionDigits?: number;
            multipleOf?: number;
          }`,
        example: '0.5688541042618454',
      },
      {
        method: 'number.binary',
        description: 'Returns a binary number as a string. The bounds are inclusive.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'110101'",
      },
      {
        method: 'number.octal',
        description: 'Returns an octal number as a string. The bounds are inclusive.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'377'",
      },
      {
        method: 'number.hex',
        description: 'Returns a lowercase hexadecimal number as a string. The bounds are inclusive.',
        parameters: `{
            min?: number;
            max?: number;
          }`,
        example: "'af17'",
      },
      {
        method: 'number.bigInt',
        description: 'Returns a random BigInt number within the specified bounds. The bounds are inclusive.',
        parameters: `{
            min?: bigint | number | string | boolean;
            max?: bigint | number | string | boolean;
          }`,
        example: '55422n',
      },
    ],
  },
  {
    category: 'person',
    description: "Module to generate people's personal information such as names and job titles.",
    items: [
      {
        method: 'person.firstName',
        description: 'Returns a random first name.',
        parameters: `{
            sex?: "female" | "male";
          }`,
        example: "'Victoria'",
      },
      {
        method: 'person.lastName',
        description: 'Returns a random last name.',
        parameters: `{
            sex?: "female" | "male";
          }`,
        example: "'Grady'",
      },
      {
        method: 'person.middleName',
        description: 'Returns a random middle name.',
        parameters: `{
            sex?: "female" | "male";
          }`,
        example: "'Eloise'",
      },
      {
        method: 'person.fullName',
        description: 'Generates a random full name.',
        parameters: `{
            firstName?: string;
            lastName?: string;
            sex?: "female" | "male";
          }`,
        example: "'Mrs. Marcella Huels'",
      },
      {
        method: 'person.gender',
        description: 'Returns a random gender.',
        parameters: '',
        example: "'Trans*Man'",
      },
      {
        method: 'person.sex',
        description: 'Returns a random sex.',
        parameters: '',
        example: "'female'",
      },
      {
        method: 'person.sexType',
        description: 'Returns a random sex type to be used in parameters.',
        parameters: '',
        example: 'Sex.Female',
      },
      {
        method: 'person.bio',
        description: 'Returns a random short biography.',
        parameters: '',
        example: "'oatmeal advocate, veteran 🐠'",
      },
      {
        method: 'person.prefix',
        description: 'Returns a random person prefix.',
        parameters: `{
            sex?: "female" | "male";
          }`,
        example: "'Miss'",
      },
      {
        method: 'person.suffix',
        description: 'Returns a random person suffix.',
        parameters: '',
        example: "'DDS'",
      },
      {
        method: 'person.jobTitle',
        description: 'Generates a random job title.',
        parameters: '',
        example: "'Global Accounts Engineer'",
      },
      {
        method: 'person.jobDescriptor',
        description: 'Generates a random job descriptor.',
        parameters: '',
        example: "'Customer'",
      },
      {
        method: 'person.jobArea',
        description: 'Generates a random job area.',
        parameters: '',
        example: "'Brand'",
      },
      {
        method: 'person.jobType',
        description: 'Generates a random job type.',
        parameters: '',
        example: "'Assistant'",
      },
      {
        method: 'person.zodiacSign',
        description: 'Returns a random zodiac sign.',
        parameters: '',
        example: "'Pisces'",
      },
    ],
  },
  {
    category: 'phone',
    description: 'Module to generate phone-related data.',
    items: [
      {
        method: 'phone.number',
        description: 'Generates a random phone number.',
        parameters: `{
            format?: string;
          }`,
        example: "'961-770-7727'",
      },
      {
        method: 'phone.imei',
        description: 'Generates a random IMEI number.',
        parameters: '',
        example: "'13-850175-913761-7'",
      },
    ],
  },
  {
    category: 'random',
    description: 'Generates random values of different kinds.',
    items: [
      {
        method: 'random.word',
        description: 'Returns a random word.',
        parameters: '',
        example: "'Seamless'",
      },
      {
        method: 'random.words',
        description: 'Returns a string with a given number of random words.',
        parameters: `{
            count?: number | {
              min: number;
              max: number;
            };
          }`,
        example: "'copy Handcrafted bus client-server Point'",
      },
      {
        method: 'random.alpha',
        description: 'Generates a string consisting of letters in the English alphabet.',
        parameters: `{
            count?: number;
            casing?: 'upper' | 'lower' | 'mixed';
            bannedChars?: string[];
          }`,
        example: "'DTCIC'",
      },
      {
        method: 'random.alphaNumeric',
        description: 'Generates a string consisting of alpha characters and digits.',
        parameters: `{
            count?: number;
            casing?: 'upper' | 'lower';
            bannedChars?: string[];
          }`,
        example: "'xszlm'",
      },
      {
        method: 'random.numeric',
        description: 'Generates a given length string of digits.',
        parameters: `{
            length?: number;
            allowLeadingZeros?: boolean;
            bannedDigits?: string[];
          }`,
        example: "'943228'",
      },
    ],
  },
  {
    category: 'science',
    description: 'Module to generate science related entries.',
    items: [
      {
        method: 'science.chemicalElement',
        description: 'Returns a random periodic table element.',
        parameters: '',
        example: `{ symbol: 'H', name: 'Hydrogen', atomicNumber: 1 }`,
      },
      {
        method: 'science.unit',
        description: 'Returns a random scientific unit.',
        parameters: '',
        example: `{ name: 'meter', symbol: 'm' }`,
      },
    ],
  },
  {
    category: 'string',
    description: 'Module to generate string related entries.',
    items: [
      {
        method: 'string.fromCharacters',
        description: 'Generates a string from the given characters.',
        parameters: 'characters: string | Array<string>, length?: number | { min: number, max: number }',
        example: "'abc', 10 // 'cbbbacbacb'",
      },
      {
        method: 'string.alpha',
        description: 'Generates a string consisting of letters in the English alphabet.',
        parameters: "options?: number | { length?: number | { min: number, max: number }, casing?: 'upper' | 'lower' | 'mixed', exclude?: Array<string> }",
        example: "{ length: 5, casing: 'upper' } // 'DTCIC'",
      },
      {
        method: 'string.alphanumeric',
        description: 'Generates a string consisting of alpha characters and digits.',
        parameters: "options?: number | { length?: number | { min: number, max: number }, casing?: 'upper' | 'lower' | 'mixed', exclude?: Array<string> }",
        example: "{ length: 5, exclude: ['a'] } // 'x1Z7f'",
      },
      {
        method: 'string.binary',
        description: 'Returns a binary string.',
        parameters: 'options?: { length?: number | { min: number, max: number }, prefix?: string }',
        example: "{ length: 10, prefix: 'bin_' } // 'bin_1101011011'",
      },
      {
        method: 'string.octal',
        description: 'Returns an octal string.',
        parameters: 'options?: { length?: number | { min: number, max: number }, prefix?: string }',
        example: "{ length: 10, prefix: 'oct_' } // 'oct_1542153414'",
      },
      {
        method: 'string.hexadecimal',
        description: 'Returns a hexadecimal string.',
        parameters: "options?: { length?: number | { min: number, max: number }, casing?: 'upper' | 'lower' | 'mixed', prefix?: string }",
        example: "{ length: 10, casing: 'mixed', prefix: '0x' } // '0xAdE330a4D1'",
      },
      {
        method: 'string.numeric',
        description: 'Generates a given length string of digits.',
        parameters: 'options?: number | { length?: number | { min: number, max: number }, allowLeadingZeros?: boolean, exclude?: Array<string> }',
        example: "{ length: 6, exclude: ['0'] } // '943228'",
      },
      {
        method: 'string.sample',
        description: 'Returns a string containing UTF-16 chars between `!` and `}`.',
        parameters: 'length?: number | { min: number, max: number }',
        example: "10 // 'Zo!.:*e>wR'",
      },
      {
        method: 'string.uuid',
        description: 'Returns a UUID v4 string.',
        parameters: '',
        example: "// '4136cd0b-d90b-4af7-b485-5d1ded8db252'",
      },
      {
        method: 'string.nanoid',
        description: 'Generates a Nano ID string.',
        parameters: 'length?: number | { min: number, max: number }',
        example: "{ min: 13, max: 37 } // 'KIRsdEL9jxVgqhBDlm'",
      },
      {
        method: 'string.symbol',
        description: 'Returns a string containing only special characters.',
        parameters: 'length?: number | { min: number, max: number }',
        example: "{ min: 5, max: 10 } // ')|@*>^+'",
      },
    ],
  },
  {
    category: 'system',
    description: 'Generates fake data for many computer systems properties.',
    items: [
      {
        method: 'system.fileName',
        description: 'Returns a random file name with extensions.',
        parameters: 'options?: { extensionCount?: number | { min: number, max: number } }',
        example: "{ extensionCount: 2 } // 'times_after.swf.ntf'",
      },
      {
        method: 'system.commonFileName',
        description: 'Returns a random file name with a given or commonly used extension.',
        parameters: 'ext?: string',
        example: "'txt' // 'global_borders_wyoming.txt'",
      },
      {
        method: 'system.mimeType',
        description: 'Returns a random MIME type.',
        parameters: '',
        example: "// 'video/vnd.vivo'",
      },
      {
        method: 'system.commonFileType',
        description: 'Returns a commonly used file type.',
        parameters: '',
        example: "// 'audio'",
      },
      {
        method: 'system.commonFileExt',
        description: 'Returns a commonly used file extension.',
        parameters: '',
        example: "// 'gif'",
      },
      {
        method: 'system.fileType',
        description: 'Returns a file type.',
        parameters: '',
        example: "// 'message'",
      },
      {
        method: 'system.fileExt',
        description: 'Returns a file extension for a given MIME type.',
        parameters: 'mimeType?: string',
        example: "'application/json' // 'json'",
      },
      {
        method: 'system.directoryPath',
        description: 'Returns a directory path.',
        parameters: '',
        example: "// '/etc/mail'",
      },
      {
        method: 'system.filePath',
        description: 'Returns a file path.',
        parameters: '',
        example: "// '/usr/local/src/money.dotx'",
      },
      {
        method: 'system.semver',
        description: 'Returns a semantic version string.',
        parameters: '',
        example: "// '1.1.2'",
      },
      {
        method: 'system.networkInterface',
        description: 'Returns a random network interface name.',
        parameters: "options?: { interfaceType?: 'en' | 'wl' | 'ww', interfaceSchema?: 'index' | 'slot' | 'mac' | 'pci' }",
        example: "{ interfaceType: 'wl' } // 'wlo1'",
      },
      {
        method: 'system.cron',
        description: 'Returns a random cron expression.',
        parameters: 'options?: { includeYear?: boolean, includeNonStandard?: boolean }',
        example: "{ includeYear: true } // '45 23 * * 6 2067'",
      },
    ],
  },
  {
    category: 'vehicle',
    description: 'Generates vehicle-related fake data, including cars, motorcycles, and bicycles.',
    items: [
      {
        method: 'vehicle.vehicle',
        description: 'Returns a random vehicle name, combining manufacturer and model.',
        parameters: '',
        example: "// 'BMW Explorer'",
      },
      {
        method: 'vehicle.manufacturer',
        description: 'Returns a random vehicle manufacturer name.',
        parameters: '',
        example: "// 'Ford'",
      },
      {
        method: 'vehicle.model',
        description: 'Returns a random vehicle model.',
        parameters: '',
        example: "// 'Explorer'",
      },
      {
        method: 'vehicle.type',
        description: 'Returns a random vehicle type.',
        parameters: '',
        example: "// 'Coupe'",
      },
      {
        method: 'vehicle.fuel',
        description: 'Returns a random fuel type.',
        parameters: '',
        example: "// 'Electric'",
      },
      {
        method: 'vehicle.vin',
        description: 'Generates a random vehicle identification number (VIN).',
        parameters: '',
        example: "// 'YV1MH682762184654'",
      },
      {
        method: 'vehicle.color',
        description: 'Returns a random vehicle color.',
        parameters: '',
        example: "// 'red'",
      },
      {
        method: 'vehicle.vrm',
        description: 'Generates a random Vehicle Registration Mark (VRM).',
        parameters: '',
        example: "// 'MF56UPA'",
      },
      {
        method: 'vehicle.bicycle',
        description: 'Returns a type of bicycle.',
        parameters: '',
        example: "// 'Adventure Road Bicycle'",
      },
    ],
  },
  {
    category: 'word',
    description: 'Generates random words categorized into various types such as adjectives, nouns, verbs, etc.',
    items: [
      {
        method: 'word.adjective',
        description: 'Returns a random adjective. You can specify length and strategy for word selection.',
        parameters: 'options (length, strategy)',
        example: "// 'pungent' or 'slimy' with options",
      },
      {
        method: 'word.adverb',
        description: 'Returns a random adverb. You can specify length and strategy for word selection.',
        parameters: 'options (length, strategy)',
        example: "// 'quarrelsomely' or 'madly' with options",
      },
      {
        method: 'word.conjunction',
        description: 'Returns a random conjunction. You can specify length and strategy for word selection.',
        parameters: 'options (length, strategy)',
        example: "// 'since' or 'as long as' with options",
      },
      {
        method: 'word.interjection',
        description: 'Returns a random interjection. You can specify length and strategy for word selection.',
        parameters: 'options (length, strategy)',
        example: "// 'gah' or 'boohoo' with options",
      },
      {
        method: 'word.noun',
        description: 'Returns a random noun. You can specify length and strategy for word selection.',
        parameters: 'options (length, strategy)',
        example: "// 'external' or 'front' with options",
      },
      {
        method: 'word.preposition',
        description: 'Returns a random preposition. You can specify length and strategy for word selection.',
        parameters: 'options (length, strategy)',
        example: "// 'without' or 'given' with options",
      },
      {
        method: 'word.verb',
        description: 'Returns a random verb. You can specify length and strategy for word selection.',
        parameters: 'options (length, strategy)',
        example: "// 'act' or 'tinge' with options",
      },
      {
        method: 'word.sample',
        description: 'Returns a random word sample of specified or random length.',
        parameters: 'options (length, strategy)',
        example: "// 'incidentally' or 'fruit' with options",
      },
      {
        method: 'word.words',
        description: 'Generates a string of space-separated random words. You can specify the number of words.',
        parameters: 'options (count)',
        example: "// 'almost' or 'before hourly patiently' with options",
      },
    ],
  },
]
