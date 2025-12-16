// --- src/data.js ---

export const PRODUCTS = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    category: 'Tropical',
    difficulty: 'Media',
    price: 45.99,
    stock: 5,
    light: 'Luz indirecta brillante',
    water: 'Secar el primer tercio del sustrato.',
    petFriendly: false, 
    marketingTag: 'Icono del Diseño Interior',
    image: 'https://images.unsplash.com/photo-1621262916172-e64903328e12?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'La Monstera, conocida por sus hojas grandes y fenestradas (agujeros), es un ícono de la decoración moderna. Requiere alta humedad para evitar que las puntas se pongan marrones. Ideal para darle un toque selvático a cualquier espacio.',
    tips: [
      "Limpia sus hojas para un brillo máximo.",
      "Usa un tutor de musgo para crecimiento vertical y aéreo.",
      "Fertiliza en primavera y verano con un NPK balanceado."
    ],
    accessories: ['101', '102', '103'] 
  },
  {
    id: '2',
    name: 'Sansevieria Trifasciata',
    category: 'Suculenta',
    difficulty: 'Fácil',
    price: 18.50,
    stock: 12,
    light: 'Tolera poca luz (Low Light Hero)',
    water: 'Regar solo cuando el sustrato esté completamente seco (1 vez/mes).',
    petFriendly: true, 
    marketingTag: 'Purificadora de Aire NASA',
    image: 'https://images.unsplash.com/photo-1601984288673-9a74c3d4a000?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'También conocida como Lengua de Suegra. Es indestructible, perfecta para principiantes. Es famosa por su capacidad de filtrar toxinas del aire, incluso de noche.',
    tips: [
      "El mayor peligro es el exceso de riego.",
      "Ideal para dormitorios u oficinas con poca luz.",
      "Se propaga fácilmente por división de rizomas."
    ],
    accessories: ['103', '105']
  },
  {
    id: '3',
    name: 'Pothos (Epipremnum aureum)',
    category: 'Colgante',
    difficulty: 'Muy fácil',
    price: 22.99,
    stock: 20,
    light: 'Luz indirecta, tolera sombra.',
    water: 'Cuando el sustrato superior esté seco al tacto.',
    petFriendly: false,
    marketingTag: 'Crecimiento Rápido y Flexible',
    image: 'https://images.unsplash.com/photo-1593452922152-4467d3e09841?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'El Pothos es increíblemente indulgente y de rápido crecimiento. Es ideal para estanterías, ya que sus tallos caen en cascada de forma hermosa.',
    tips: [
      "Elige un tiesto colgante para un efecto decorativo.",
      "Se propaga fácilmente con esquejes en agua.",
      "Si ves hojas amarillas, espera más para el próximo riego."
    ],
    accessories: ['104', '102']
  },
  {
    id: '4',
    name: 'Ficus Lyrata (Violín)',
    category: 'Árbol',
    difficulty: 'Difícil',
    price: 89.00,
    stock: 3,
    light: 'Mucha luz brillante, tolera sol directo suave.',
    water: 'Mantener el sustrato ligeramente húmedo.',
    petFriendly: false,
    marketingTag: 'Planta Statement de Lujo',
    image: 'https://images.unsplash.com/photo-1616235489873-10023cc25cc1?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Famoso por sus grandes hojas en forma de violín. Es una planta caprichosa que odia los cambios de ubicación y las corrientes de aire. Requiere atención, pero el resultado es espectacular.',
    tips: [
      "Rótala para que la luz le dé por igual.",
      "Es sensible a las cochinillas; revisa el envés.",
      "Necesita un ambiente estable y constante."
    ],
    accessories: ['101', '103']
  },
  {
    id: '5',
    name: 'Zamioculcas Zamiifolia (ZZ Plant)',
    category: 'Suculenta',
    difficulty: 'Muy fácil',
    price: 32.00,
    stock: 8,
    light: 'Poca luz a indirecta brillante.',
    water: 'Permitir que el sustrato se seque completamente entre riegos.',
    petFriendly: false,
    marketingTag: 'La Planta Indestructible',
    image: 'https://images.unsplash.com/photo-1619852233824-388a1005a74e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'La planta ZZ es famosa por su resiliencia. Tolera la negligencia, la poca luz y los riegos espaciados, lo que la hace perfecta para oficinas y principiantes.',
    tips: [
      "El peor enemigo de la ZZ es el exceso de agua.",
      "Sus hojas brillantes no necesitan pulverizado.",
      "Puede pasar meses sin ser regada."
    ],
    accessories: ['101', '103']
  },
];

// --- Productos accesorios (Cross-selling) ---
export const ACCESSORIES = [
    { 
        id: '101', 
        name: 'Maceta Cerámica Premium', 
        price: 25.00, 
        desc: 'Diseño nórdico y minimalista, optimiza el drenaje y la ventilación. Ideal para interiores.', 
        category: 'Macetería', // Nueva categoría
        stock: 50,
        image: 'https://images.unsplash.com/photo-1615462529272-a25e90d0b741?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        tips: ["Combina con cualquier estilo de decoración.", "Material resistente y duradero.", "Disponible en varios tamaños."],
    },
    { 
        id: '102', 
        name: 'Fertilizante NPK 10-10-10', 
        price: 9.99, 
        desc: 'Fórmula líquida balanceada para un crecimiento general vigoroso. Apto para la mayoría de plantas de interior y exterior.', 
        category: 'Nutrición', // Nueva categoría
        stock: 100,
        image: 'https://images.unsplash.com/photo-1594191370213-ed1231f2479e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        tips: ["Diluir según las instrucciones del envase.", "Aplicar durante la temporada de crecimiento (primavera-verano).", "No fertilizar plantas recién trasplantadas o estresadas."],
    },
    { 
        id: '103', 
        name: 'Kit Medidor de Humedad 3 en 1', 
        price: 15.00, 
        desc: 'Herramienta esencial para medir el pH, la intensidad de luz y la humedad del sustrato. ¡Evita errores de riego!', 
        category: 'Herramientas', // Nueva categoría
        stock: 30,
        image: 'https://images.unsplash.com/photo-1627932644265-f93504fb491d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        tips: ["Insertar la sonda en el sustrato, no en el agua.", "Limpiar la sonda después de cada uso.", "No es apto para medir líquidos."],
    },
    { 
        id: '104', 
        name: 'Tijeras de Poda Esterilizadas', 
        price: 12.00, 
        desc: 'Tijeras afiladas de acero inoxidable, esenciales para podar y propagar tus plantas sin riesgo de enfermedades.', 
        category: 'Herramientas', // Nueva categoría
        stock: 40,
        image: 'https://images.unsplash.com/photo-1616581977938-f1c5c1f0b0c6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        tips: ["Esterilizar antes y después de cada uso.", "Realizar cortes limpios y precisos.", "Ideal para eliminar hojas muertas o enfermas."],
    },
    { 
        id: '105', 
        name: 'Sustrato Drenante Especial', 
        price: 14.50, 
        desc: 'Mezcla de sustrato premium con alta aireación y drenaje. Perfecto para cactus, suculentas y Sansevierias.', 
        category: 'Sustratos', // Nueva categoría
        stock: 60,
        image: 'https://images.unsplash.com/photo-1629851759573-03310023a105?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        tips: ["Mejora la salud de las raíces.", "Previene el exceso de humedad.", "Renovar cada 1-2 años."],
    },
];