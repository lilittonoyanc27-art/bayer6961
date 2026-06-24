export interface Game1Question {
  id: number;
  infinitive: string;
  translation: string;
  subject: string;
  polarity: "affirmative" | "negative";
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface Game2Question {
  id: number;
  sentence: string; // e.g. "¡No ___ acuestes tarde!"
  meaning: string;  // Armenian translation
  pronoun: string;  // e.g. "te"
  position: "before" | "after"; // pronoun position
  options: { text: string; value: "before" | "after" }[];
  correctValue: "before" | "after";
  explanation: string;
}

export interface Game3Question {
  id: number;
  armenian: string;
  spanishWords: string[]; // Correct ordered words, e.g., ["No", "te", "preocupes"]
  meaning: string;
}

export interface Game4Question {
  id: number;
  verb: string;
  subject: string;
  polarity: "affirmative" | "negative";
  options: string[]; // e.g. ["siéntate", "sientate", "siéntate"]
  correctIdx: number;
  explanation: string;
}

export interface Game5Question {
  id: number;
  situationArm: string; // e.g. "Մայրիկն ասում է որդուն՝ 'Լվացիր ձեռքերդ'"
  correctSpanish: string; // "¡Lávate las manos!"
  correctArm: string; // "Լվա ձեռքերդ։"
  options: string[]; // Spanish distractors
}

export interface Game6Card {
  id: number;
  spanish: string;
  armenian: string;
  category: "tú" | "vosotros" | "usted" | "ustedes" | "nosotros";
  polarity: "affirmative" | "negative";
  breakdown: string; // Grammatical explanation in Armenian
}

export const Game1Questions: Game1Question[] = [
  {
    id: 1,
    infinitive: "levantarse",
    translation: "վեր կենալ",
    subject: "tú (դու)",
    polarity: "affirmative",
    options: ["levántate", "no te levantes", "levantate", "levántese"],
    correctIdx: 0,
    explanation: "Դրական հրամայականում 'tú'-ի հետ դերանունը (te) կպչում է բային վերջից (levántate) և ստանում է գրավոր շեշտ (ակցենտ) երրորդ վանկի վրա։"
  },
  {
    id: 2,
    infinitive: "sentarse",
    translation: "նստել (e -> ie)",
    subject: "usted (Դուք - հարգալից)",
    polarity: "affirmative",
    options: ["sientate", "siéntese", "no se siente", "sentaos"],
    correctIdx: 1,
    explanation: "Sentarse բայը անկանոն է (e -> ie): Usted ձևի դրական հրամայականում դերանունը (se) կպչում է վերջից, ստացվում է 'siéntese'՝ ակցենտով ie-ի վրա։"
  },
  {
    id: 3,
    infinitive: "acostarse",
    translation: "պառկել քնելու (o -> ue)",
    subject: "tú (դու)",
    polarity: "negative",
    options: ["no te acuestes", "acuéstate", "no se acueste", "no te acuestas"],
    correctIdx: 0,
    explanation: "Ժխտական հրամայականում դերանունը դրվում է No-ից հետո և բայից առաջ։ Acostarse-ն փոխում է o-ն ue-ի, իսկ tú ձևի վերջավորությունը դառնում է -es (ar խմբի բայերի համար)՝ 'no te acuestes':"
  },
  {
    id: 4,
    infinitive: "ducharse",
    translation: "լոգանք ընդունել",
    subject: "vosotros (դուք - ընկերական)",
    polarity: "affirmative",
    options: ["dúchate", "duchaos", "no os duchéis", "duchateos"],
    correctIdx: 1,
    explanation: "Vosotros ձևի դրական հրամայականում բայի -d վերջավորությունը ընկնում է, երբ միանում է 'os' դերանունը (duchad + os = duchaos)։ Այստեղ գրավոր շեշտ պետք չէ։"
  },
  {
    id: 5,
    infinitive: "lavarse",
    translation: "լվացվել",
    subject: "ustedes (դուք - հոգնակի)",
    polarity: "negative",
    options: ["lávense", "no se laven", "no os lavéis", "no se lavan"],
    correctIdx: 1,
    explanation: "Ustedes ձևի ժխտական հրամայականում դերանունը (se) դրվում է բայից առաջ, իսկ բայը ստանում է Subjuntivo-ի վերջավորություն՝ 'no se laven':"
  },
  {
    id: 6,
    infinitive: "prepararse",
    translation: "պատրաստվել",
    subject: "tú (դու)",
    polarity: "affirmative",
    options: ["no te prepares", "prepárate", "preparate", "prepárese"],
    correctIdx: 1,
    explanation: "Tú ձևի դրական հրամայականում դերանունը միանում է վերջից՝ 'prepárate' (ակցենտով e-ի վրա)։"
  },
  {
    id: 7,
    infinitive: "relajarse",
    translation: "հանգստանալ",
    subject: "nosotros (մենք)",
    polarity: "affirmative",
    options: ["relajémonos", "no nos relajemos", "relajamosnos", "relajemonos"],
    correctIdx: 0,
    explanation: "Nosotros ձևի դրական հրամայականում բայի վերջին -s տառն ընկնում է 'nos' դերանունը միանալիս (relajemos + nos = relajémonos) և ստանում է գրավոր շեշտ։"
  },
  {
    id: 8,
    infinitive: "vestirse",
    translation: "հագնվել (e -> i)",
    subject: "tú (դու)",
    polarity: "negative",
    options: ["vístete", "no te vistas", "no te vistes", "no te vistas tarde"],
    correctIdx: 1,
    explanation: "Vestirse բայը անկանոն է (e -> i): Ժխտական հրամայականում 'tú'-ի հետ վերջավորությունը դառնում է -as (ir խմբի համար), իսկ դերանունը դրվում է առաջ՝ 'no te vistas':"
  }
];

export const Game2Questions: Game2Question[] = [
  {
    id: 1,
    sentence: "¡No ___ preocupes!",
    meaning: "Մի՛ անհանգստացիր։ (tú)",
    pronoun: "te",
    position: "before",
    options: [
      { text: "No te preocupes (Բայից առաջ)", value: "before" },
      { text: "Preocúpate (Բային կպած վերջում)", value: "after" }
    ],
    correctValue: "before",
    explanation: "Ժխտական հրամայականում դերանունը միշտ դրվում է No-ի և բայի արանքում (No te preocupes)։"
  },
  {
    id: 2,
    sentence: "¡Siéntա___ aquí!",
    meaning: "Նստի՛ր այստեղ։ (tú)",
    pronoun: "te",
    position: "after",
    options: [
      { text: "No te sientes (Բայից առաջ)", value: "before" },
      { text: "Siéntate (Բային կպած վերջում)", value: "after" }
    ],
    correctValue: "after",
    explanation: "Դրական հրամայականում դերանունը (te) միանում է բային վերջից որպես մեկ բառ՝ 'Siéntate':"
  },
  {
    id: 3,
    sentence: "¡No ___ acuesten tarde!",
    meaning: "Ուշ մի՛ պառկեք քնելու։ (ustedes)",
    pronoun: "se",
    position: "before",
    options: [
      { text: "No se acuesten (Բայից առաջ)", value: "before" },
      { text: "Acuéstense (Բային կպած վերջում)", value: "after" }
    ],
    correctValue: "before",
    explanation: "Քանի որ նախադասությունը ժխտական է (No), դերանունը պետք է լինի բայից առաջ՝ 'No se acuesten'։"
  },
  {
    id: 4,
    sentence: "¡Láven___ las manos!",
    meaning: "Լվացե՛ք ձեր ձեռքերը։ (ustedes)",
    pronoun: "se",
    position: "after",
    options: [
      { text: "No se laven (Բայից առաջ)", value: "before" },
      { text: "Lávense (Բային կպած վերջում)", value: "after" }
    ],
    correctValue: "after",
    explanation: "Դրական հրաման է, ուստի դերանունը միանում է վերջից՝ 'Lávense las manos':"
  },
  {
    id: 5,
    sentence: "¡No ___ olvidéis de la llave!",
    meaning: "Չմոռանա՛ք բանալին։ (vosotros)",
    pronoun: "os",
    position: "before",
    options: [
      { text: "No os olvidéis (Բայից առաջ)", value: "before" },
      { text: "Olvidaos (Բային կպած վերջում)", value: "after" }
    ],
    correctValue: "before",
    explanation: "Ժխտական հրամայական 'vosotros' ձևում դերանունը 'os'-ն է, և այն դրվում է բայից առաջ՝ 'no os olvidéis'։"
  }
];

export const Game3Questions: Game3Question[] = [
  {
    id: 1,
    armenian: "Շուտ վեր կաց։",
    spanishWords: ["Levántate", "temprano."],
    meaning: "Levántate temprano."
  },
  {
    id: 2,
    armenian: "Ուշ մի պառկիր քնելու։",
    spanishWords: ["No", "te", "acuestes", "tarde."],
    meaning: "No te acuestes tarde."
  },
  {
    id: 3,
    armenian: "Մի անհանգստացեք, խնդրում եմ։",
    spanishWords: ["No", "se", "preocupe,", "por", "favor."],
    meaning: "No se preocupe, por favor."
  },
  {
    id: 4,
    armenian: "Լվացեք ձեր ձեռքերը։ (vosotros)",
    spanishWords: ["Lavaos", "las", "manos."],
    meaning: "Lavaos las hands."
  },
  {
    id: 5,
    armenian: "Այստեղ մի նստիր։",
    spanishWords: ["No", "te", "sientes", "aquí."],
    meaning: "No te sientes aquí."
  },
  {
    id: 6,
    armenian: "Պատրաստվեք քննությանը։ (ustedes)",
    spanishWords: ["Prepárense", "para", "el", "examen."],
    meaning: "Prepárense para el examen."
  }
];

export const Game4Questions: Game4Question[] = [
  {
    id: 1,
    verb: "levantarse",
    subject: "tú",
    polarity: "affirmative",
    options: ["levantate", "levántate", "levantáte"],
    correctIdx: 1,
    explanation: "Levántate-ն ունի ակցենտ, քանի որ դերանունը միանալով բառը դարձնում է Esdrújula (շեշտը երրորդ վանկի վրա վերջից), որոնք միշտ ունեն գրավոր շեշտ։"
  },
  {
    id: 2,
    verb: "sentarse",
    subject: "vosotros",
    polarity: "affirmative",
    options: ["sentaos", "séntaos", "sentáos"],
    correctIdx: 0,
    explanation: "Sentaos-ը չունի գրավոր շեշտ, քանի որ շեշտն ընկնում է վերջին 'o' տառի վրա, և այն համապատասխանում է սովորական արտասանության կանոնին։"
  },
  {
    id: 3,
    verb: "ducharse",
    subject: "tú",
    polarity: "affirmative",
    options: ["duchate", "ducháte", "dúchate"],
    correctIdx: 2,
    explanation: "Dúchate-ն ունի գրավոր շեշտ 'u' տառի վրա (dú-cha-te), որպեսզի պահպանվի բայի հիմնական արտասանությունը (dú-chas)։"
  },
  {
    id: 4,
    verb: "lavarse",
    subject: "usted",
    polarity: "affirmative",
    options: ["lávese", "lavese", "lavése"],
    correctIdx: 0,
    explanation: "Lávese-ն ունի գրավոր շեշտ 'a' տառի վրա, քանի որ այն esdrújula բառ է (lá-ve-se)։"
  },
  {
    id: 5,
    verb: "relajarse",
    subject: "nosotros",
    polarity: "affirmative",
    options: ["relajemonos", "relajémonos", "relajemonós"],
    correctIdx: 1,
    explanation: "Relajémonos-ը միշտ ստանում է գրավոր շեշտ 'o' տառի վրա (re-la-jé-mo-nos)։"
  }
];

export const Game5Questions: Game5Question[] = [
  {
    id: 1,
    situationArm: "Մայրիկն ասում է երեխային. «Շուտ պառկիր քնելու»:",
    correctSpanish: "¡Acuéstate temprano!",
    correctArm: "Շուտ պառկիր քնելու։",
    options: ["¡Acuéstate temprano!", "¡No te acuestes tarde!", "¡Acuéstese temprano!", "¡Levántate temprano!"]
  },
  {
    id: 2,
    situationArm: "Բժիշկը հիվանդին. «Մի՛ անհանգստացեք, ամեն ինչ լավ է»:",
    correctSpanish: "¡No se preocupe!",
    correctArm: "Մի՛ անհանգստացեք։",
    options: ["¡No te preocupes!", "¡No se preocupe!", "¡Preocúpate!", "¡No os preocupéis!"]
  },
  {
    id: 3,
    situationArm: "Ուսուցիչը աշակերտներին. «Նստե՛ք, խնդրում եմ»:",
    correctSpanish: "¡Siéntense, por favor!",
    correctArm: "Նստե՛ք, խնդրում եմ։",
    options: ["¡Siéntate, por favor!", "¡Siéntense, por favor!", "¡Sentaos, por favor!", "¡No se sienten!"]
  },
  {
    id: 4,
    situationArm: "Ընկերն ասում է ընկերոջը. «Մի՛ մոռացիր անձնագիրդ»:",
    correctSpanish: "¡No te olvides de tu pasaporte!",
    correctArm: "Մի՛ մոռացիր անձնագիրդ։",
    options: ["¡No se olvide de su pasaporte!", "¡No te olvides de tu pasaporte!", "¡Olvídate de tu pasaporte!", "¡No os olvidéis del pasaporte!"]
  },
  {
    id: 5,
    situationArm: "Մարզիչն ասում է թիմին. «Արագ լոգանք ընդունե՛ք»:",
    correctSpanish: "¡Duchaos rápido!",
    correctArm: "Արագ լոգանք ընդունե՛ք։",
    options: ["¡Dúchate rápido!", "¡No os duchéis rápido!", "¡Duchaos rápido!", "¡Dúchense rápido!"]
  }
];

export const Game6Cards: Game6Card[] = [
  {
    id: 1,
    spanish: "¡Levántate!",
    armenian: "Վեր կա՛ց։",
    category: "tú",
    polarity: "affirmative",
    breakdown: "levantarse բայ, tú (դու) ձև, դրական հրամայական։ Դերանունը միանում է վերջից (levanta + te), ավելանում է ակցենտ 'á' տառի վրա։"
  },
  {
    id: 2,
    spanish: "¡No te levantes!",
    armenian: "Վեր մի՛ կաց։",
    category: "tú",
    polarity: "negative",
    breakdown: "levantarse բայ, tú (դու) ձև, ժխտական հրամայական։ Դերանունը դրվում է առաջ (no + te + levantes [subjuntivo])։"
  },
  {
    id: 3,
    spanish: "¡Siéntate!",
    armenian: "Նստի՛ր։",
    category: "tú",
    polarity: "affirmative",
    breakdown: "sentarse բայ (e -> ie), tú (դու) ձև, դրական հրամայական։ Դերանունը միանում է վերջից (sienta + te), ավելանում է ակցենտ 'é' տառի վրա։"
  },
  {
    id: 4,
    spanish: "¡No te sientes!",
    armenian: "Մի՛ նստիր։",
    category: "tú",
    polarity: "negative",
    breakdown: "sentarse բայ, tú ձև, ժխտական հրամայական։ Դերանունը առաջ է գալիս (no + te + sientes)։"
  },
  {
    id: 5,
    spanish: "¡No se preocupe!",
    armenian: "Մի՛ անհանգստացեք (հարգալից)։",
    category: "usted",
    polarity: "negative",
    breakdown: "preocuparse բայ, usted (Դուք) ձև, ժխտական հրամայական։ Դերանունը 'se'-ն է և դրվում է առաջ՝ 'no se preocupe'։"
  },
  {
    id: 6,
    spanish: "¡Lavaos!",
    armenian: "Լվացվե՛ք (ընկերական)։",
    category: "vosotros",
    polarity: "affirmative",
    breakdown: "lavarse բայ, vosotros (դուք) ձև, դրական հրամայական։ lavad-ից -d-ն ընկնում է os միանալիս (lavad + os = lavaos)։"
  },
  {
    id: 7,
    spanish: "¡Prepárense!",
    armenian: "Պատրաստվե՛ք (հոգնակի)։",
    category: "ustedes",
    polarity: "affirmative",
    breakdown: "prepararse բայ, ustedes (դուք) ձև, դրական հրամայական։ Դերանունը վերջում է, ստանում է ակցենտ՝ 'prepárense':"
  },
  {
    id: 8,
    spanish: "¡Relajémonos!",
    armenian: "Հանգստանա՛նք։",
    category: "nosotros",
    polarity: "affirmative",
    breakdown: "relajarse բայ, nosotros (մենք) ձև, դրական հրամայական։ relajemos-ի -s տառն ընկնում է nos միանալիս, ավելանում է ակցենտ՝ 'relajémonos'։"
  },
  {
    id: 9,
    spanish: "¡Acuéstate!",
    armenian: "Պառկի՛ր քնելու։",
    category: "tú",
    polarity: "affirmative",
    breakdown: "acostarse բայ (o -> ue), tú (դու) ձև, դրական հրամայական։ Դերանունը վերջում է, ավելանում է ակցենտ 'é' տառի վրա։"
  },
  {
    id: 10,
    spanish: "¡No te olvides!",
    armenian: "Մի՛ մոռացիր։",
    category: "tú",
    polarity: "negative",
    breakdown: "olvidarse բայ, tú (դու) ձև, ժխտական հրամայական։ Դերանունը առջևում է՝ 'no te olvides':"
  }
];
