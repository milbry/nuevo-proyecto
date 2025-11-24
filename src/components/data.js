export const PLANTS = Array.from({ length: 60 }).map((_, i) => {
  const names = ['Monstera','Pothos','Ficus','ZZ Plant','Calathea','Sansevieria','Aglaonema','Begonia','Aloe','Echeveria','Tillandsia','Anubias'];
  const name = names[i % names.length] + (i >= names.length ? ` ${i}` : '');
  return {
    id: `p${i+1}`,
    name,
    category: ['Interior','Suculenta','Cactus','Aromatica','Medicinal'][i % 5],
    difficulty: ['Fácil','Intermedio','Avanzado'][i % 3],
    light: ['Sombra','Indirecta','Pleno sol'][i % 3],
    water: ['Baja','Media','Alta'][i % 3],
    image: `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80&sig=${i}`,
    desc: `${name} es una planta maravillosa. Requiere ${['poca agua','riego medio','riego frecuente'][i%3]}.`,
  };
});
