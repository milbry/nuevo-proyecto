import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion } from 'framer-motion';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

export default function Hero() {
  const images = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60',
    'https://images.unsplash.com/photo-1483794344563-d27a8d38d2d5?auto=format&fit=crop&w=1200&q=60'
  ];

  const categories = ['Guías', 'Comunidad', 'Consejos', 'Zona VIP'];
  const leaves = ['🍃', '🍂', '🍁', '🌿'];

  return (
    <div className="relative w-full overflow-hidden">

      {/* Slider de fondo */}
      <Swiper
        loop
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="relative w-full"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <motion.img
              src={src}
              alt={`hero-${idx}`}
              className="w-full h-[300px] md:h-[380px] object-cover brightness-50"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* Contenido central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4 md:px-0">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-emerald-200 drop-shadow-xl mb-4"
        >
          Revista de Plantas — Inspírate y cuida
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-6 drop-shadow-md"
        >
          Guías, comunidad, consejos y una zona VIP con contenido exclusivo para miembros.
        </motion.p>

        {/* Botones de categorías */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0] }}
              className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300 text-black px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 relative"
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Partículas de hojas animadas */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(20)].map((_, i) => {
          const leaf = leaves[Math.floor(Math.random() * leaves.length)];
          const left = Math.random() * 100;
          const duration = 15 + Math.random() * 10;
          const delay = Math.random() * 5;
          const size = 3 + Math.random() * 4;

          return (
            <motion.div
              key={i}
              initial={{ y: -10, x: `${left}%`, opacity: 0 }}
              animate={{ y: '100vh', opacity: 1, rotate: Math.random() * 360 }}
              transition={{
                repeat: Infinity,
                duration: duration,
                delay: delay,
                ease: 'linear',
              }}
              className="absolute pointer-events-none text-xl md:text-2xl"
              style={{ fontSize: `${size}vh` }}
            >
              {leaf}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
