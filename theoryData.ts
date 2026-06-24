export interface VerbConjugation {
  person: string;
  pronoun: string;
  spanish: string;
  armenian: string;
}

export interface VerbExample {
  spanish: string;
  armenian: string;
  note?: string;
}

export interface VerbDetail {
  infinitive: string;
  translation: string;
  isIrregular: boolean;
  irregularityNote?: string;
  afirmativo: VerbConjugation[];
  negativo: VerbConjugation[];
  examples: VerbExample[];
}

export const SpanishPronouns = [
  { person: "yo", pronoun: "me", armenian: "Ես (ինձ)" },
  { person: "tú", pronoun: "te", armenian: "Դու (քեզ)" },
  { person: "él / ella / usted", pronoun: "se", armenian: "Նա (իրեն) / Դուք (Ձեզ)" },
  { person: "nosotros/as", pronoun: "nos", armenian: "Մենք (մեզ)" },
  { person: "vosotros/as", pronoun: "os", armenian: "Դուք (ձեզ)" },
  { person: "ellos / ellas / ustedes", pronoun: "se", armenian: "Նրանք (իրենց) / Դուք (Ձեզ)" },
];

export const ReflexiveVerbsList = [
  { verb: "levantarse", armenian: "վեր կենալ" },
  { verb: "ducharse", armenian: "լոգանք ընդունել" },
  { verb: "lavarse", armenian: "լվացվել" },
  { verb: "sentarse", armenian: "նստել (e -> ie)" },
  { verb: "acostarse", armenian: "պառկել քնելու (o -> ue)" },
  { verb: "prepararse", armenian: "պատրաստվել" },
  { verb: "relajarse", armenian: "հանգստանալ" },
  { verb: "vestirse", armenian: "հագնվել (e -> i)" },
];

export const GrammarSections = [
  {
    title: "1. Ի՞նչ են վերադարձական բայերը",
    content: "Վերադարձական բայերը այն բայերն են, որոնք վերջանում են **-se**-ով։ Օրինակ՝ *levantarse* (վեր կենալ), *ducharse* (լոգանք ընդունել)։ Վերադարձական բայի հետ միշտ պետք է օգտագործել վերադարձական դերանուն՝ *me, te, se, nos, os, se*։",
  },
  {
    title: "2. Դրական imperativo (Afirmativo)",
    content: "Դրական հրամայականում վերադարձական դերանունը **կպչում է բային վերջից** որպես մեկ միասնական բառ։ Օրինակ՝ *levantarse → levántate* (վեր կաց), *sentarse → siéntate* (նստիր)։",
  },
  {
    title: "3. Ժխտական imperativo (Negativo)",
    content: "Ժխտական հրամայականում դերանունը դրվում է **առանձին՝ բայից առաջ** (No-ից հետո)։ Օրինակ՝ *No te levantes* (վեր մի կաց), *No te preocupes* (մի անհանգստացիր)։",
  },
  {
    title: "4. Շեշտադրման (ակցենտի) կանոնը",
    content: "Դրական հրամայականում, երբ դերանունը միանում է բային, բառի վանկերի քանակն ավելանում է։ Որպեսզի շեշտը մնա իր նախնական տեղում, հաճախ ավելանում է գրավոր շեշտ (accent mark / tilde)՝ *lávate*, *levántate*։ Սակայն *vosotros* ձևում շեշտ չի դրվում, քանի որ շեշտն ընկնում է վերջին վանկի վրա՝ *duchaos*, *sentaos* (այստեղ նաև -d վերջավորությունն է ընկնում՝ *levantad + os = levantaos*)։",
  },
];

export const VerbsDetailData: VerbDetail[] = [
  {
    infinitive: "levantarse",
    translation: "վեր կենալ",
    isIrregular: false,
    afirmativo: [
      { person: "tú", pronoun: "te", spanish: "levántate", armenian: "վեր կաց" },
      { person: "usted", pronoun: "se", spanish: "levántese", armenian: "վեր կացեք (հարգալից)" },
      { person: "nosotros/as", pronoun: "nos", spanish: "levantémonos", armenian: "վեր կենանք" },
      { person: "vosotros/as", pronoun: "os", spanish: "levantaos", armenian: "վեր կացեք" },
      { person: "ustedes", pronoun: "se", spanish: "levántense", armenian: "վեր կացեք (հոգնակի)" },
    ],
    negativo: [
      { person: "tú", pronoun: "te", spanish: "no te levantes", armenian: "վեր մի կաց" },
      { person: "usted", pronoun: "se", spanish: "no se levante", armenian: "վեր մի կացեք (հարգալից)" },
      { person: "nosotros/as", pronoun: "nos", spanish: "no nos levantemos", armenian: "վեր չկենանք" },
      { person: "vosotros/as", pronoun: "os", spanish: "no os levantéis", armenian: "վեր մի կացեք" },
      { person: "ustedes", pronoun: "se", spanish: "no se levanten", armenian: "վեր մի կացեք (հոգնակի)" },
    ],
    examples: [
      { spanish: "Levántate a las siete.", armenian: "Վեր կաց ժամը յոթին։" },
      { spanish: "No te levantes tarde.", armenian: "Ուշ վեր մի կաց։" },
      { spanish: "Levántese, por favor.", armenian: "Վեր կացեք, խնդրում եմ։" },
      { spanish: "Levantaos rápido.", armenian: "Արագ վեր կացեք։" },
      { spanish: "Levántense todos.", armenian: "Բոլորդ վեր կացեք։" },
    ]
  },
  {
    infinitive: "ducharse",
    translation: "լոգանք ընդունել",
    isIrregular: false,
    afirmativo: [
      { person: "tú", pronoun: "te", spanish: "dúchate", armenian: "լոգանք ընդունիր" },
      { person: "usted", pronoun: "se", spanish: "dúchese", armenian: "լոգանք ընդունեք (հարգալից)" },
      { person: "nosotros/as", pronoun: "nos", spanish: "duchémonos", armenian: "լոգանք ընդունենք" },
      { person: "vosotros/as", pronoun: "os", spanish: "duchaos", armenian: "լոգանք ընդունեք" },
      { person: "ustedes", pronoun: "se", spanish: "dúchense", armenian: "լոգանք ընդունեք (հոգնակի)" },
    ],
    negativo: [
      { person: "tú", pronoun: "te", spanish: "no te duches", armenian: "լոգանք մի ընդունիր" },
      { person: "usted", pronoun: "se", spanish: "no se duche", armenian: "լոգանք մի ընդունեք (հարգալից)" },
      { person: "nosotros/as", pronoun: "nos", spanish: "no nos duchemos", armenian: "լոգանք չընդունենք" },
      { person: "vosotros/as", pronoun: "os", spanish: "no os duchéis", armenian: "լոգանք մի ընդունեք" },
      { person: "ustedes", pronoun: "se", spanish: "no se duchen", armenian: "լոգանք մի ընդունեք (հոգնակի)" },
    ],
    examples: [
      { spanish: "Dúchate antes de salir.", armenian: "Լոգանք ընդունիր դուրս գալուց առաջ։" },
      { spanish: "No te duches con agua muy caliente.", armenian: "Շատ տաք ջրով լոգանք մի ընդունիր։" },
      { spanish: "Dúchese por la mañana.", armenian: "Առավոտյան լոգանք ընդունեք։" },
      { spanish: "Duchaos después del deporte.", armenian: "Սպորտից հետո լոգանք ընդունեք։" },
    ]
  },
  {
    infinitive: "sentarse",
    translation: "նստել",
    isIrregular: true,
    irregularityNote: "e -> ie հնչյունափոխություն",
    afirmativo: [
      { person: "tú", pronoun: "te", spanish: "siéntate", armenian: "նստիր" },
      { person: "usted", pronoun: "se", spanish: "siéntese", armenian: "նստեք (հարգալից)" },
      { person: "nosotros/as", pronoun: "nos", spanish: "sentémonos", armenian: "նստենք" },
      { person: "vosotros/as", pronoun: "os", spanish: "sentaos", armenian: "նստեք" },
      { person: "ustedes", pronoun: "se", spanish: "siéntense", armenian: "նստեք (հոգնակի)" },
    ],
    negativo: [
      { person: "tú", pronoun: "te", spanish: "no te sientes", armenian: "մի նստիր" },
      { person: "usted", pronoun: "se", spanish: "no se siente", armenian: "մի նստեք (հարգալից)" },
      { person: "nosotros/as", pronoun: "nos", spanish: "no nos sentemos", armenian: "չնստենք" },
      { person: "vosotros/as", pronoun: "os", spanish: "no os sentéis", armenian: "մի նստեք" },
      { person: "ustedes", pronoun: "se", spanish: "no se sienten", armenian: "մի նստեք (հոգնակի)" },
    ],
    examples: [
      { spanish: "Siéntate aquí.", armenian: "Այստեղ նստիր։" },
      { spanish: "No te sientes en el suelo.", armenian: "Գետնին մի նստիր։" },
      { spanish: "Siéntese, por favor.", armenian: "Նստեք, խնդրում եմ։" },
      { spanish: "Siéntense todos.", armenian: "Բոլորդ նստեք։" },
    ]
  },
  {
    infinitive: "acostarse",
    translation: "պառկել քնելու",
    isIrregular: true,
    irregularityNote: "o -> ue հնչյունափոխություն",
    afirmativo: [
      { person: "tú", pronoun: "te", spanish: "acuéstate", armenian: "պառկիր քնելու" },
      { person: "usted", pronoun: "se", spanish: "acuéstese", armenian: "պառկեք քնելու (հարգալից)" },
      { person: "nosotros/as", pronoun: "nos", spanish: "acostémonos", armenian: "պառկենք քնելու" },
      { person: "vosotros/as", pronoun: "os", spanish: "acostaos", armenian: "պառկեք քնելու" },
      { person: "ustedes", pronoun: "se", spanish: "acuéstense", armenian: "պառկեք քնելու (հոգնակի)" },
    ],
    negativo: [
      { person: "tú", pronoun: "te", spanish: "no te acuestes", armenian: "մի պառկիր քնելու" },
      { person: "usted", pronoun: "se", spanish: "no se acueste", armenian: "մի պառկեք քնելու (հարգալից)" },
      { person: "nosotros/as", pronoun: "nos", spanish: "no nos acostemos", armenian: "չպառկենք քնելու" },
      { person: "vosotros/as", pronoun: "os", spanish: "no os acostéis", armenian: "մի պառկեք քնելու" },
      { person: "ustedes", pronoun: "se", spanish: "no se acuesten", armenian: "մի պառկեք քնելու (հոգնակի)" },
    ],
    examples: [
      { spanish: "Acuéstate temprano.", armenian: "Շուտ պառկիր քնելու։" },
      { spanish: "No te acuestes tarde.", armenian: "Ուշ մի պառկիր քնելու։" },
      { spanish: "Acuéstese antes de midnight.", armenian: "Պառկեք քնելու կեսգիշերից առաջ։" },
    ]
  }
];

export const UsefulCommands = [
  { spanish: "Levántate temprano.", armenian: "Շուտ վեր կաց։" },
  { spanish: "No te levantes tarde.", armenian: "Ուշ վեր մի կաց։" },
  { spanish: "Dúchate antes de salir.", armenian: "Դուրս գալուց առաջ լոգանք ընդունիր։" },
  { spanish: "Lávate las manos.", armenian: "Լվա ձեռքերդ։" },
  { spanish: "Cepíllate los dientes.", armenian: "Մաքրի՛ր ատամներդ։" },
  { spanish: "Vístete rápido.", armenian: "Արագ հագնվիր։" },
  { spanish: "Siéntate aquí.", armenian: "Այստեղ նստիր։" },
  { spanish: "No te sientes allí.", armenian: "Այնտեղ մի նստիր։" },
  { spanish: "Prepárate para la clase.", armenian: "Պատրաստվիր դասին։" },
  { spanish: "No te preocupe.", armenian: "Մի անհանգստացիր (tú: No te preocupes; usted: No se preocupe)." },
  { spanish: "Relájate un poco.", armenian: "Մի քիչ հանգստացիր։" },
  { spanish: "Acuéstate temprano.", armenian: "Շուտ պառկիր քնելու։" },
  { spanish: "No te olvides de los documentos.", armenian: "Մի մոռացիր փաստաթղթերը։" },
  { spanish: "Quédate aquí.", armenian: "Մնա այստեղ։" },
  { spanish: "No te quedes solo.", armenian: "Մենակ մի մնա։" }
];

export const MistakesAvoid = [
  { incorrect: "Levanta te temprano.", correct: "Levántate temprano.", armenian: "Շուտ վեր կաց։" },
  { incorrect: "No levántate tarde.", correct: "No te levantes tarde.", armenian: "Ուշ վեր մի կաց։" },
  { incorrect: "Sienta te aquí.", correct: "Siéntate aquí.", armenian: "Նստիր այստեղ։" },
  { incorrect: "No siéntate aquí.", correct: "No te sientes aquí.", armenian: "Այստեղ մի նստիր։" },
  { incorrect: "Ducha te ahora.", correct: "Dúchate ahora.", armenian: "Հիմա լոգանք ընդունիր։" },
  { incorrect: "No ducha te ahora.", correct: "No te duches ahora.", armenian: "Հիմա լոգանք մի ընդունիր։" }
];
