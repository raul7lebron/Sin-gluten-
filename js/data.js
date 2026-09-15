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

const dietasMantenimiento = [
  {
    icon: "⚖️",
    title: "Equilibrio diario",
    meta: "~2.000 kcal aprox. · variado y equilibrado",
    comidas: [
      { label: "Desayuno", text: "Tostadas de pan sin gluten con aguacate y huevo poché (~420 kcal)." },
      { label: "Media mañana", text: "Una pieza de fruta y un puñado de almendras (~200 kcal)." },
      { label: "Comida", text: "Arroz con pollo y verduras variadas (~550 kcal)." },
      { label: "Merienda", text: "Yogur natural con granola sin gluten (~250 kcal)." },
      { label: "Cena", text: "Pescado a la plancha con patata asada y ensalada (~580 kcal)." },
    ],
  },
  {
    icon: "⚡",
    title: "Energía activa",
    meta: "~2.100 kcal aprox. · pensado para quien entrena",
    comidas: [
      { label: "Desayuno", text: "Porridge de avena certificada con plátano y miel (~450 kcal)." },
      { label: "Media mañana", text: "Batido de frutas con leche (~250 kcal)." },
      { label: "Comida", text: "Pasta sin gluten con pollo y verduras salteadas (~600 kcal)." },
      { label: "Merienda", text: "Barrita energética casera de frutos secos y dátiles (~250 kcal)." },
      { label: "Cena", text: "Tortilla de patatas con ensalada (~550 kcal)." },
    ],
  },
];

const dietasDigestion = [
  {
    icon: "🍵",
    title: "Intestino en calma",
    meta: "~1.600 kcal aprox. · suave y fácil de digerir",
    comidas: [
      { label: "Desayuno", text: "Yogur natural sin lactosa con plátano maduro (~250 kcal)." },
      { label: "Media mañana", text: "Infusión de manzanilla con compota de manzana (~120 kcal)." },
      { label: "Comida", text: "Arroz blanco con pechuga de pollo hervida y zanahoria cocida (~450 kcal)." },
      { label: "Merienda", text: "Puré de pera (~150 kcal)." },
      { label: "Cena", text: "Pescado blanco al vapor con calabacín cocido (~430 kcal)." },
    ],
  },
  {
    icon: "🌿",
    title: "Antiinflamatorio",
    meta: "~1.700 kcal aprox. · cúrcuma, jengibre, omega-3",
    comidas: [
      { label: "Desayuno", text: "Porridge de avena certificada con cúrcuma, canela y arándanos (~350 kcal)." },
      { label: "Media mañana", text: "Nueces y una naranja (~200 kcal)." },
      { label: "Comida", text: "Salmón al horno con boniato y brócoli al vapor (~500 kcal)." },
      { label: "Merienda", text: "Infusión de jengibre con un puñado de frutos rojos (~150 kcal)." },
      { label: "Cena", text: "Ensalada de quinoa, aguacate y aceite de oliva virgen extra (~500 kcal)." },
    ],
  },
];

// Restaurantes investigados vía búsqueda web (fuentes: Celicidad, Celiaquita, FACE y
// asociaciones territoriales, Glutiful, FindMeGlutenFree, TheFork, Restaurant Guru,
// webs oficiales). Notas de Google Maps tal y como se encontraron en el momento de la
// investigación: pueden cambiar con el tiempo. "aprox: true" marca notas tomadas de un
// agregador (no un pantallazo directo de Google Maps) o con cifras que variaban algo
// entre fuentes — trátalas con un margen de ±0.1-0.2.
const restaurantesPorCiudad = {
  madrid: {
    label: "Madrid",
    restaurantes: [
      { nombre: "Ardemos Burger", nota: 4.8, resenas: 7200, zona: "Chamberí", desc: "Hamburguesería 100% sin gluten, sin riesgo de contaminación cruzada." },
      { nombre: "Pizza Natura", nota: 4.8, resenas: 2340, zona: "Centro", desc: "Pizzería 100% sin gluten con masa de mijo y quinoa." },
      { nombre: "El Japo Carranza", nota: 4.7, resenas: 2784, zona: "Chamberí / Trafalgar", desc: "Restaurante japonés con cocina íntegramente sin gluten." },
      { nombre: "Okashi Sanda", nota: 4.7, resenas: null, zona: "Malasaña / Universidad", desc: "Primer japonés sin gluten de Madrid, certificado FACE." },
      { nombre: "Bastardi Ristorante", nota: 4.7, resenas: 30, zona: "Malasaña", desc: "Italiano 100% sin gluten, avalado por asociación de celíacos.", aprox: true },
      { nombre: "Solo de Croquetas", nota: 4.4, resenas: 3600, zona: "Centro / Salamanca", desc: "Especialista en croquetas 100% sin gluten y sin lactosa." },
      { nombre: "As de Bastos", nota: 4.3, resenas: null, zona: "Bellas Vistas / Tetuán", desc: "Menú mediterráneo 100% sin gluten." },
      { nombre: "LaLina Bravas y Tapas", nota: 4.3, resenas: 3645, zona: "La Latina", desc: "Bar de tapas y bravas prácticamente 100% sin gluten." },
      { nombre: "Llagar La Llobera", nota: 4.2, resenas: null, zona: "Chamberí", desc: "Asturiano 100% apto celíacos: fabada, cachopo, croquetas." },
    ],
  },
  barcelona: {
    label: "Barcelona",
    restaurantes: [
      { nombre: "Aruku Sushi Gluten Free", nota: 4.7, resenas: 1185, zona: "Eixample", desc: "Japonés 100% sin gluten (sushi, gyozas), cerveza sin gluten de barril." },
      { nombre: "Copasetic", nota: 4.6, resenas: 1300, zona: "Eixample", desc: "Café-restaurante con amplia carta sin gluten (crepes, hamburguesas, brunch)." },
      { nombre: "ApriBocca", nota: 4.5, resenas: null, zona: "Poblenou", desc: "Italiano avalado por ACELCAT, pasta fresca y pizza sin gluten.", aprox: true },
      { nombre: "Jansana", nota: 4.5, resenas: 3800, zona: "Eixample", desc: "Pastelería-café 100% sin gluten: panes, pizzas, bollería y tartas.", aprox: true },
      { nombre: "En Ville", nota: 4.5, resenas: 3500, zona: "Raval", desc: "Carta 100% sin gluten certificada por ACELCAT, cocina catalana/mediterránea.", aprox: true },
      { nombre: "Messié Pizza Gluten Free", nota: 4.5, resenas: 3060, zona: "Gràcia", desc: "Pizzería italiana 100% sin gluten, sin riesgo de contaminación cruzada.", aprox: true },
      { nombre: "Out of China", nota: 4.4, resenas: null, zona: "Eixample", desc: "Chino avalado por ACELCAT, +90% de la carta sin gluten.", aprox: true },
      { nombre: "L'Arrosseria Xàtiva", nota: 4.4, resenas: null, zona: "Sant Antoni", desc: "Especialistas en paella/arroces, variedades sin gluten certificadas ACELCAT.", aprox: true },
      { nombre: "Senza Glutine by Grosso Napoletano", nota: 4.2, resenas: null, zona: "Eixample", desc: "Pizzería napolitana 100% sin gluten (masa de arroz, maíz y trigo sarraceno)." },
    ],
  },
  valencia: {
    label: "Valencia",
    restaurantes: [
      { nombre: "Carlotes Café", nota: 4.9, resenas: 87, zona: "Ensanche / Extramurs", desc: "Cafetería 100% sin gluten certificada segura, personal formado en celiaquía." },
      { nombre: "Malkebien", nota: 4.7, resenas: 1446, zona: "Zona universitaria", desc: "Socio colaborador ACECOVA, pan y cerveza sin gluten." },
      { nombre: "Disidente", nota: 4.7, resenas: 431, zona: "Ensanche", desc: "Vegetariano con opciones sin gluten y gestión cuidadosa de alergias." },
      { nombre: "Civera Marisquería", nota: 4.6, resenas: 2000, zona: "Sant Francesc / centro", desc: "Marisquería histórica (desde los 60) incluida en el listado seguro de ACECOVA." },
      { nombre: "El Miracle", nota: 4.5, resenas: 2600, zona: "Pla del Remei / Gran Vía", desc: "Primer restaurante 100% sin gluten certificado por ACECOVA en la Comunidad Valenciana." },
      { nombre: "La Pappardella", nota: 4.5, resenas: 2200, zona: "La Seu", desc: "Italiana con carta asesorada por la asociación de celíacos." },
      { nombre: "Kuzina", nota: 4.5, resenas: 2000, zona: "Ciutat Vella, cerca de Ruzafa", desc: "Griega con amplia oferta sin gluten señalizada." },
      { nombre: "Casa Carmela", nota: 4.4, resenas: 8900, zona: "Malvarrosa", desc: "Icónica arrocería centenaria con acuerdo ACECOVA, pan sin gluten." },
      { nombre: "Al Pomodoro", nota: 4.4, resenas: 1300, zona: "La Xerea / Ciutat Vella", desc: "Pizzería italiana artesanal con opciones sin gluten, listada por Celicidad." },
      { nombre: "Mey Chen", nota: 4.3, resenas: 2700, zona: "Benimaclet", desc: "China avalada por ACECOVA, comanda diferenciada por plato." },
      { nombre: "LaLoLa Restaurante", nota: 4.3, resenas: 3150, zona: "La Seu, junto a la Catedral", desc: "Toda la carta de arroces y tapas es sin gluten (salvo el pan).", aprox: true },
      { nombre: "Mállalo X", nota: 4.1, resenas: 275, zona: "Mercado Central / Velluters", desc: "Acreditado por ACECOVA como local seguro." },
    ],
  },
  sevilla: {
    label: "Sevilla",
    restaurantes: [
      { nombre: "Restaurante Marroquí La Alcoba", nota: 4.8, resenas: 876, zona: "Santa Clara", desc: "Cocina marroquí con pastela y platos sin gluten, personal atento a intolerancias." },
      { nombre: "Barra Baja", nota: 4.7, resenas: 600, zona: "Casco Antiguo", desc: "Cocina de mercado andaluza de autor, miembro de la Red Sevilla Sin Gluten.", aprox: true },
      { nombre: "Acento - Social Eatery", nota: 4.7, resenas: 800, zona: "El Arenal / Casco Antiguo", desc: "Mediterráneo-internacional con atención específica a comensales celíacos." },
      { nombre: "Petit Comité", nota: 4.5, resenas: 2465, zona: "Casco Antiguo", desc: "Tapas de calidad, miembro de la Red Sevilla Sin Gluten-ASPROCESE." },
      { nombre: "Al Solito Posto", nota: 4.4, resenas: 4500, zona: "Alameda de Hércules", desc: "Italiano histórico homologado por la Asociación de Celíacos de Sevilla." },
      { nombre: "Señora Pan", nota: 4.4, resenas: null, zona: "Casco Antiguo", desc: "Restaurante 100% sin gluten, fusión español-venezolana." },
      { nombre: "Orfeo", nota: 4.2, resenas: 811, zona: "Casco Antiguo", desc: "Café-bar tranquilo, miembro de la Red Sevilla Sin Gluten-ASPROCESE." },
      { nombre: "Estragón", nota: 4.1, resenas: null, zona: "El Porvenir", desc: "Carta 100% sin gluten sin riesgo de contaminación cruzada, tapas y raciones." },
      { nombre: "Habanita", nota: 4.1, resenas: null, zona: "Casco Antiguo, junto a Plaza Alfalfa", desc: "Vegetariano/cubano con opciones sin gluten, más de 20 años de trayectoria." },
    ],
  },
  bilbao: {
    label: "Bilbao",
    restaurantes: [
      { nombre: "Casa Leotta – Pozas", nota: 4.7, resenas: null, zona: "Pozas / Abando", desc: "Pinsas y pasta 100% sin gluten, asesorados por EZE (Celíacos de Euskadi)." },
      { nombre: "Casa Leotta – Ajuriaguerra", nota: 4.6, resenas: 2192, zona: "Ajuriaguerra / Abando", desc: "Pinsas y pasta sin gluten dedicadas, avalado por EZE." },
      { nombre: "Kalí Órexi by Labocatorio", nota: 4.6, resenas: 1500, zona: "Abando (Fernández del Campo)", desc: "Gastrobar griego-mediterráneo con platos marcados sin gluten en carta." },
      { nombre: "Arraiz Asador", nota: 4.5, resenas: 1450, zona: "Arraiz (cerca de Artxanda)", desc: "Asador con certificación oficial FACE desde 2016.", aprox: true },
      { nombre: "Ahoan", nota: 4.2, resenas: null, zona: "Plaza Nueva / Casco Viejo", desc: "Bar de pintxos con cocina separada, dueños celíacos." },
      { nombre: "El Informal", nota: 4.2, resenas: 606, zona: "Indautxu / Ensanche", desc: "Mediterráneo-vasco con menú adaptado sin gluten y opciones vegetarianas." },
      { nombre: "Mandoya", nota: 4.1, resenas: null, zona: "Casco Viejo", desc: "Usa harina de garbanzo desde los años 90, amplio conocimiento de la celiaquía.", aprox: true },
      { nombre: "La Lonja de Olabeaga", nota: 4.0, resenas: null, zona: "Olabeaga", desc: "Cocina tradicional vasca a la brasa avalada por FACE desde 2024." },
      { nombre: "Larruzz", nota: 4.0, resenas: null, zona: "Uribitarte (junto al Guggenheim)", desc: "Certificado por EZE, protocolos anti-contaminación cruzada, arroces." },
    ],
  },
  malaga: {
    label: "Málaga",
    restaurantes: [
      { nombre: "Sushi Flower", nota: 4.8, resenas: 605, zona: "Perchel / Teatinos", desc: "Carta 98% sin gluten, extremo cuidado con la contaminación cruzada.", aprox: true },
      { nombre: "Reviv Café", nota: 4.8, resenas: 429, zona: "Centro Histórico", desc: "Cafetería 100% sin gluten y vegana, certificada por la Red Málaga Sin Gluten." },
      { nombre: "La Plancha Taberna", nota: 4.7, resenas: 140, zona: "El Perchel", desc: "Carta 100% sin gluten, certificada por la red Málaga Sin Gluten.", aprox: true },
      { nombre: "Mesón Mariano", nota: 4.7, resenas: 3000, zona: "Centro", desc: "Taberna tradicional desde 1988 que señala el gluten en cada plato." },
      { nombre: "Bibra Real Food Teatinos", nota: 4.6, resenas: 1098, zona: "Teatinos-Universidad", desc: "Red Málaga Sin Gluten, poke bowls y ensaladas sin contaminación cruzada." },
      { nombre: "El Taller de Larios 10", nota: 4.6, resenas: null, zona: "Centro (Calle Larios)", desc: "Restaurante en azotea con categoría sin gluten reconocida en TheFork." },
      { nombre: "Osteria Angelino dal 1899", nota: 4.6, resenas: 3659, zona: "Centro", desc: "Italiano con pasta sin gluten y alérgenos claramente marcados en carta." },
      { nombre: "Maldonado 21", nota: 4.5, resenas: 830, zona: "Ciudad Jardín", desc: "Especialista en fritura sin gluten con utensilios y platos separados." },
      { nombre: "El Tapeo de Cervantes", nota: 4.3, resenas: null, zona: "Centro", desc: "Bar de tapas de autor que marca el gluten en el menú." },
      { nombre: "Los Mellizos Soho", nota: 4.1, resenas: 2790, zona: "Soho", desc: "100% sin gluten certificado ACEMA, especializado en pescaíto frito y marisco.", aprox: true },
    ],
  },
  zaragoza: {
    label: "Zaragoza",
    restaurantes: [
      { nombre: "Labamba", nota: 4.8, resenas: 647, zona: "Casco Antiguo / Centro", desc: "Menú degustación de 6 pasos 100% sin gluten, cambia cada temporada." },
      { nombre: "Urbanita Gastrobar", nota: 4.8, resenas: null, zona: "Centro", desc: "Gastrobar 100% sin gluten con certificación oficial." },
      { nombre: "Restaurante Isla Sicilia (Con y Sin Gluten)", nota: 4.7, resenas: 1182, zona: "Casco Antiguo (Pl. del Pilar)", desc: "Italiano con dos cocinas separadas para evitar contaminación cruzada." },
      { nombre: "La Jaula de Grillos", nota: 4.6, resenas: null, zona: "Casco Antiguo", desc: "Primer establecimiento 100% sin gluten de Aragón (2016)." },
      { nombre: "Restaurante Baobab", nota: 4.6, resenas: 4079, zona: "Romareda", desc: "Vegetariano histórico (desde 2005) afiliado a la asociación de celíacos." },
      { nombre: "Mononoke Board Game Café", nota: 4.5, resenas: null, zona: "Centro / Delicias", desc: "Cafetería-ludoteca con carta de pizzas y cervezas artesanales sin gluten." },
      { nombre: "El Disfrutón", nota: 4.5, resenas: 690, zona: "Casco Histórico", desc: "Miembro de la Asociación Celíaca Aragonesa (ACA), carta mediterránea adaptada." },
      { nombre: "El Truco", nota: 4.4, resenas: 2000, zona: "El Tubo / Casco Antiguo", desc: "Bar de tapas 100% sin gluten, premiado varios años por sus croquetas." },
      { nombre: "Costa 8 Gastrobar", nota: 4.3, resenas: null, zona: "Centro", desc: "Certificado por la Asociación Celíaca de Aragón (ACA)." },
      { nombre: "La Antilla", nota: 4.3, resenas: 475, zona: "Varios locales", desc: "Pan sin gluten, muy recomendada avisando con antelación." },
      { nombre: "BuleBar Zentro", nota: 4.1, resenas: 1664, zona: "Centro", desc: "Arrocería/paellas con especialidades sin gluten bajo petición." },
    ],
  },
  alicante: {
    label: "Alicante",
    restaurantes: [
      { nombre: "Distópico", nota: 4.9, resenas: 380, zona: "Centro", desc: "Cocina mediterránea de fusión; sus croquetas llevan el sello de garantía ACECOVA." },
      { nombre: "Punto de Uva", nota: 4.8, resenas: null, zona: "Centro", desc: "Vinoteca/tapas de autor 100% sin gluten avalada por ACECOVA." },
      { nombre: "Kazoku Sushi Restaurant", nota: 4.7, resenas: 250, zona: "Cabo de las Huertas", desc: "Japonés con carta específica sin gluten y control de contaminación cruzada." },
      { nombre: "Vértice Cervecería Bulevar", nota: 4.6, resenas: 100, zona: "Bulevar / Ciudad de Asís", desc: "Más del 80% de la carta apta para celíacos." },
      { nombre: "La Taverna dell'Artista", nota: 4.5, resenas: 1700, zona: "Centro (Pl. San Cristóbal)", desc: "Pizzería italiana 100% sin gluten certificada por ACECOVA.", aprox: true },
      { nombre: "Rice&Bones", nota: 4.5, resenas: 100, zona: "Centro", desc: "Único arrocero de Alicante certificado 100% sin gluten por ACECOVA." },
      { nombre: "La Taverna del Racó del Pla", nota: 4.5, resenas: 650, zona: "Centro (C. San Mateo)", desc: "Taberna urbana de arroces y tapas; pan sin gluten y protocolos de seguridad." },
      { nombre: "Apache Burger Grill", nota: 4.4, resenas: 800, zona: "Playa de San Juan", desc: "Hamburguesería premiada, freidora y panes sin gluten separados.", aprox: true },
      { nombre: "Oz Gastroclub", nota: 4.4, resenas: 540, zona: "Playa de San Juan", desc: "Carta prácticamente 100% sin gluten certificada por ACECOVA." },
      { nombre: "Askuabarra Alicante", nota: 4.4, resenas: 200, zona: "Centro", desc: "Bar de pinchos/tapas con amplia oferta sin gluten." },
    ],
  },
  castellon: {
    label: "Castellón",
    restaurantes: [
      { nombre: "Can Celiac", nota: 4.8, resenas: 195, zona: "Centro", desc: "Panadería-café 100% sin gluten, elaboración diaria sin contaminación cruzada." },
      { nombre: "GoodFood Gastro Bar", nota: 4.8, resenas: 25, zona: "Centro", desc: "Gastrobar pequeño con toda la carta 100% sin gluten.", aprox: true },
      { nombre: "L'Etrusco", nota: 4.6, resenas: 1700, zona: "Centro", desc: "Italiano avalado por ACECOVA, elaboración y carta adaptadas.", aprox: true },
      { nombre: "Little Thai Castellón", nota: 4.6, resenas: null, zona: "Centro (Av. Rei En Jaume)", desc: "Cocina tailandesa con platos sin gluten marcados en carta." },
      { nombre: "Peltre Cuina Mexicana", nota: 4.6, resenas: 1060, zona: "Centro", desc: "Cocina mexicana muy bien valorada, con opciones sin gluten cuidadas." },
      { nombre: "Corpore Sano Duo", nota: 4.5, resenas: 183, zona: "Centro", desc: "Restaurante 100% sin gluten certificado por ACECOVA, cocina saludable." },
      { nombre: "Le Otto Sin Gluten", nota: 4.5, resenas: null, zona: "Centro", desc: "Pizzería 100% sin gluten, horno exclusivo sin riesgo de trazas." },
      { nombre: "El Colmado", nota: 4.4, resenas: 130, zona: "Junto al Mercado Central", desc: "Taberna con utensilios duplicados para evitar contaminación cruzada." },
      { nombre: "Lino Gastronomic", nota: 4.4, resenas: null, zona: "Casco histórico", desc: "Carta de arroces con opciones aptas para celíacos." },
    ],
  },
};
