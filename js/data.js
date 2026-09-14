const supermercadoCategories = [
  {
    icon: "🍞",
    iconClass: "icon-1",
    title: "Panadería y bollería",
    text: 'Pan de molde sin gluten, baguettes certificadas y bollería (Schär, Proceli, líneas "Sin Gluten" de supermercado).',
  },
  {
    icon: "🍝",
    iconClass: "icon-2",
    title: "Pasta y arroz",
    text: "Pasta de maíz y arroz, fideos sin gluten y arroces certificados para todo tipo de recetas.",
  },
  {
    icon: "🍿",
    iconClass: "icon-3",
    title: "Snacks y aperitivos",
    text: "Patatas fritas certificadas, palomitas naturales y frutos secos sin trazas de gluten.",
  },
  {
    icon: "🥣",
    iconClass: "icon-4",
    title: "Desayuno y cereales",
    text: "Avena certificada sin gluten, cereales de maíz o arroz y galletas de líneas sin gluten.",
  },
  {
    icon: "🧂",
    iconClass: "icon-5",
    title: "Salsas y condimentos",
    text: "Salsa de soja sin gluten (tamari), caldos certificados y especias puras sin aditivos.",
  },
  {
    icon: "🧊",
    iconClass: "icon-6",
    title: "Congelados",
    text: "Pizzas sin gluten, empanados de maíz y rebozados certificados listos para hornear.",
  },
  {
    icon: "🥤",
    iconClass: "icon-7",
    title: "Bebidas",
    text: "Cerveza sin gluten, horchata y batidos certificados aptos para celíacos.",
  },
  {
    icon: "🍫",
    iconClass: "icon-8",
    title: "Dulces y postres",
    text: "Chocolate sin gluten, bizcochos y turrones certificados en temporada.",
  },
  {
    icon: "🧀",
    iconClass: "icon-9",
    title: "Lácteos y alternativas",
    text: "Quesos naturales, yogures sin aditivos y bebidas vegetales (avena, soja, almendra) certificadas sin gluten.",
  },
  {
    icon: "🥫",
    iconClass: "icon-10",
    title: "Legumbres y conservas",
    text: "Legumbres cocidas al natural y conservas de pescado en aceite de oliva o al natural, sin aditivos con gluten.",
  },
  {
    icon: "🌾",
    iconClass: "icon-11",
    title: "Harinas y repostería",
    text: "Harina de arroz, maíz y almendra, y mezclas panificables certificadas para hornear en casa.",
  },
  {
    icon: "👶",
    iconClass: "icon-12",
    title: "Alimentación infantil",
    text: "Potitos, papillas y galletas de iniciación certificados sin gluten para bebés y niños.",
  },
];

const recetas = [
  {
    icon: "🍳",
    title: "Tortilla de patatas clásica",
    meta: "~320 kcal · 35 min",
    ingredientes: ["4 patatas medianas", "5 huevos", "1 cebolla", "Aceite de oliva virgen extra", "Sal"],
    pasos: [
      "Pelar y cortar las patatas y la cebolla en láminas finas.",
      "Freír a fuego lento en abundante aceite hasta que estén tiernas.",
      "Escurrir bien y mezclar con los huevos batidos.",
      "Cuajar en una sartén antiadherente por ambos lados.",
    ],
  },
  {
    icon: "🍗",
    title: "Pollo al horno con verduras",
    meta: "~410 kcal · 45 min",
    ingredientes: ["4 muslos de pollo", "1 calabacín", "1 pimiento rojo", "2 patatas", "Aceite de oliva y romero"],
    pasos: [
      "Cortar las verduras en trozos regulares.",
      "Colocar el pollo y las verduras en una bandeja de horno.",
      "Aliñar con aceite, sal y romero.",
      "Hornear 40 minutos a 200 °C, dando la vuelta a mitad de cocción.",
    ],
  },
  {
    icon: "🍤",
    title: "Arroz con verduras y gambas",
    meta: "~380 kcal · 30 min",
    ingredientes: ["300 g de arroz", "200 g de gambas peladas", "1 pimiento verde", "Guisantes", "Caldo de verduras sin gluten"],
    pasos: [
      "Sofreír el ajo y el pimiento en una cazuela.",
      "Añadir el arroz y el caldo caliente.",
      "Cocer 18 minutos a fuego medio.",
      "Incorporar las gambas los últimos 3 minutos.",
    ],
  },
  {
    icon: "🥑",
    title: "Ensalada de quinoa y aguacate",
    meta: "~340 kcal · 20 min",
    ingredientes: ["150 g de quinoa", "1 aguacate", "Tomates cherry", "Pepino", "Limón y aceite de oliva"],
    pasos: [
      "Cocer la quinoa siguiendo las instrucciones del paquete y dejar enfriar.",
      "Cortar el aguacate, los tomates y el pepino.",
      "Mezclar todos los ingredientes.",
      "Aliñar con zumo de limón, aceite de oliva y sal.",
    ],
  },
  {
    icon: "🎃",
    title: "Crema de calabaza",
    meta: "~210 kcal · 30 min",
    ingredientes: ["500 g de calabaza", "1 cebolla", "1 zanahoria", "Caldo de verduras sin gluten", "Un chorrito de nata ligera (opcional)"],
    pasos: [
      "Pochar la cebolla y la zanahoria en una olla.",
      "Añadir la calabaza troceada y el caldo.",
      "Cocer 20 minutos hasta que las verduras estén tiernas.",
      "Triturar hasta obtener una crema fina.",
    ],
  },
  {
    icon: "🐟",
    title: "Salmón a la plancha con puré de boniato",
    meta: "~430 kcal · 30 min",
    ingredientes: ["2 lomos de salmón", "2 boniatos", "Leche o bebida vegetal", "Aceite de oliva", "Eneldo"],
    pasos: [
      "Cocer los boniatos hasta que estén tiernos y triturarlos con un poco de leche.",
      "Marcar el salmón en una plancha caliente, 3-4 minutos por cada lado.",
      "Servir el salmón sobre el puré y espolvorear eneldo.",
    ],
  },
  {
    icon: "🍅",
    title: "Gazpacho andaluz",
    meta: "~150 kcal · 15 min",
    ingredientes: ["1 kg de tomates maduros", "1 pepino", "1 pimiento verde", "1 diente de ajo", "Aceite de oliva, vinagre y sal"],
    pasos: [
      "Trocear todas las verduras.",
      "Triturar junto con el aceite, el vinagre y la sal hasta que quede fino.",
      "Colar si se prefiere una textura más ligera y enfriar antes de servir.",
    ],
  },
  {
    icon: "🍖",
    title: "Albóndigas en salsa de tomate",
    meta: "~450 kcal · 50 min",
    ingredientes: ["500 g de carne picada", "1 huevo", "Pan rallado sin gluten", "Tomate triturado", "Ajo, perejil y aceite de oliva"],
    pasos: [
      "Mezclar la carne con el huevo, el pan rallado sin gluten, ajo y perejil picados.",
      "Formar las albóndigas y dorarlas en una sartén con aceite.",
      "Cubrir con el tomate triturado y cocer a fuego lento 25 minutos.",
    ],
  },
  {
    icon: "🥙",
    title: "Poke bowl de atún",
    meta: "~420 kcal · 25 min",
    ingredientes: ["200 g de atún fresco", "Arroz cocido", "Edamame", "Aguacate y zanahoria", "Salsa de soja sin gluten (tamari)"],
    pasos: [
      "Cortar el atún en dados y marinarlo unos minutos con tamari.",
      "Preparar el arroz y dejar enfriar ligeramente.",
      "Montar el bowl con el arroz, el atún y las verduras troceadas.",
    ],
  },
  {
    icon: "🥞",
    title: "Crepes de trigo sarraceno con fruta",
    meta: "~280 kcal · 20 min",
    ingredientes: [
      "150 g de harina de trigo sarraceno (naturalmente sin gluten)",
      "2 huevos",
      "250 ml de leche o bebida vegetal",
      "Fruta fresca al gusto",
      "Una pizca de sal",
    ],
    pasos: [
      "Batir la harina, los huevos, la leche y la sal hasta obtener una masa fina.",
      "Cocinar cada crepe en una sartén antiadherente a fuego medio.",
      "Rellenar o cubrir con fruta fresca al servir.",
    ],
  },
];

const dietas = [
  {
    icon: "🥗",
    title: "Mediterráneo ligero",
    meta: "~1.550 kcal aprox. · pescado, quinoa, verduras",
    comidas: [
      { label: "Desayuno", text: "Yogur natural sin gluten con avena certificada y arándanos (~280 kcal)." },
      { label: "Media mañana", text: "Un puñado de nueces y una manzana (~180 kcal)." },
      { label: "Comida", text: "Pescado blanco al horno con quinoa y verduras salteadas (~480 kcal)." },
      { label: "Merienda", text: "Hummus con bastones de zanahoria y pepino (~150 kcal)." },
      { label: "Cena", text: "Ensalada de tomate, aguacate y atún con aceite de oliva (~460 kcal)." },
    ],
  },
  {
    icon: "💪",
    title: "Alto en proteína",
    meta: "~1.600 kcal aprox. · pollo, salmón, requesón",
    comidas: [
      { label: "Desayuno", text: "Tortilla de 2 huevos con espinacas y pan sin gluten tostado (~350 kcal)." },
      { label: "Media mañana", text: "Requesón con nueces (~180 kcal)." },
      { label: "Comida", text: "Pechuga de pollo a la plancha con arroz integral y brócoli (~480 kcal)." },
      { label: "Merienda", text: "Batido de proteína con leche y plátano (~200 kcal)." },
      { label: "Cena", text: "Salmón al horno con espárragos trigueros (~390 kcal)." },
    ],
  },
  {
    icon: "🥩",
    title: "Bajo en carbohidratos",
    meta: "~1.450 kcal aprox. · huevo, solomillo, ensaladas",
    comidas: [
      { label: "Desayuno", text: "Huevos revueltos con aguacate (~320 kcal)." },
      { label: "Media mañana", text: "Queso curado en lonchas y aceitunas (~150 kcal)." },
      { label: "Comida", text: "Solomillo de cerdo con ensalada verde y aceite de oliva (~420 kcal)." },
      { label: "Merienda", text: "Yogur natural sin azúcar con un puñado de almendras (~180 kcal)." },
      { label: "Cena", text: "Ensalada de pollo, rúcula, tomate y queso feta (~380 kcal)." },
    ],
  },
  {
    icon: "🌱",
    title: "Vegetariano equilibrado",
    meta: "~1.500 kcal aprox. · lentejas, tofu, avena certificada",
    comidas: [
      { label: "Desayuno", text: "Porridge de avena certificada sin gluten con bebida vegetal y fresas (~300 kcal)." },
      { label: "Media mañana", text: "Hummus con tortitas de maíz (~170 kcal)." },
      { label: "Comida", text: "Lentejas estofadas con verduras y arroz (~430 kcal)." },
      { label: "Merienda", text: "Batido de tofu con frutos rojos (~180 kcal)." },
      { label: "Cena", text: "Tofu salteado con verduras y quinoa (~420 kcal)." },
    ],
  },
];

const dietasMusculo = [
  {
    icon: "🏋️",
    title: "Volumen limpio",
    meta: "~2.400 kcal aprox. · pollo, arroz, huevo",
    comidas: [
      { label: "Desayuno", text: "Tortilla de 3 huevos con avena certificada y plátano (~450 kcal)." },
      { label: "Media mañana", text: "Batido de proteína con leche y avena certificada (~350 kcal)." },
      { label: "Comida", text: "Pechuga de pollo con arroz basmati y verduras salteadas (~650 kcal)." },
      { label: "Merienda", text: "Yogur griego con nueces y miel (~300 kcal)." },
      { label: "Cena", text: "Pollo al horno con boniato y ensalada (~650 kcal)." },
    ],
  },
  {
    icon: "🥩",
    title: "Alto calórico",
    meta: "~2.700 kcal aprox. · ternera, pasta sin gluten, frutos secos",
    comidas: [
      { label: "Desayuno", text: "Porridge de avena certificada con leche entera, plátano y almendras (~550 kcal)." },
      { label: "Media mañana", text: "Batido de proteína con crema de cacahuete y leche (~450 kcal)." },
      { label: "Comida", text: "Solomillo de ternera con pasta sin gluten y salsa de tomate (~700 kcal)." },
      { label: "Merienda", text: "Puñado de frutos secos y queso curado (~400 kcal)." },
      { label: "Cena", text: "Ternera picada con arroz y verduras al wok (~600 kcal)." },
    ],
  },
  {
    icon: "🌱",
    title: "Vegetariano proteico",
    meta: "~2.300 kcal aprox. · tofu, legumbres, quinoa",
    comidas: [
      { label: "Desayuno", text: "Porridge de avena certificada con bebida de soja y frutos rojos (~450 kcal)." },
      { label: "Media mañana", text: "Batido de proteína vegetal con plátano (~300 kcal)." },
      { label: "Comida", text: "Tofu salteado con quinoa y verduras (~600 kcal)." },
      { label: "Merienda", text: "Hummus con tortitas de maíz y frutos secos (~350 kcal)." },
      { label: "Cena", text: "Lentejas estofadas con arroz y aguacate (~600 kcal)." },
    ],
  },
  {
    icon: "💥",
    title: "Post-entreno intenso",
    meta: "~2.500 kcal aprox. · salmón, boniato, batido de proteína",
    comidas: [
      { label: "Desayuno", text: "Huevos revueltos con pan sin gluten y aguacate (~450 kcal)." },
      { label: "Media mañana", text: "Batido de proteína con avena certificada y plátano (~400 kcal)." },
      { label: "Comida", text: "Salmón al horno con boniato y brócoli (~650 kcal)." },
      { label: "Merienda", text: "Yogur griego con nueces (~300 kcal)." },
      { label: "Cena", text: "Pechuga de pavo con arroz y verduras (~700 kcal)." },
    ],
  },
];
