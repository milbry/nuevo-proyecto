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
    petFriendly: false, // Peligro de marketing: ¡Advertir!
    marketingTag: 'Icono del Diseño Interior',
    image: 'https://images.unsplash.com/photo-1621262916172-e64903328e12?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'La Monstera, conocida por sus hojas grandes y fenestradas (agujeros), es un ícono de la decoración moderna. Requiere alta humedad para evitar que las puntas se pongan marrones. Ideal para darle un toque selvático a cualquier espacio.',
    tips: [
      "Limpia sus hojas para un brillo máximo.",
      "Usa un tutor de musgo para crecimiento vertical y aéreo.",
      "Fertiliza en primavera y verano con un NPK balanceado."
    ],
    accessories: ['101', '102'] // ID de productos relacionados
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
];

// --- Productos accesorios (Cross-selling) ---
export const ACCESSORIES = [
    { id: '101', name: 'Maceta Cerámica Premium', price: 25.00, desc: 'Diseño nórdico, mejora drenaje.', icon: '🏺' },
    { id: '102', name: 'Fertilizante NPK 10-10-10', price: 9.99, desc: 'Fórmula líquida para crecimiento general.', icon: '🧪' },
    { id: '103', name: 'Kit Medidor de Humedad 3 en 1', price: 15.00, desc: 'Mide pH, luz y humedad del sustrato.', icon: '💧' },
    { id: '104', name: 'Tijeras de Poda Esterilizadas', price: 12.00, desc: 'Esenciales para mantener la salud de la planta.', icon: '✂️' },
    { id: '105', name: 'Sustrato Drenante Especial', price: 14.50, desc: 'Mezcla aireada ideal para Sansevierias.', icon: '🌰' },
];