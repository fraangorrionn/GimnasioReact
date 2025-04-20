// src/paginas/InicioPagina.js
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './InicioPagina.css';

import img1 from '../assets/carrusel1.png';
import img2 from '../assets/carrusel2.png';
import img3 from '../assets/carrusel3.png';
import img4 from '../assets/carrusel4.png';
import img5 from '../assets/carrusel5.png';
import img6 from '../assets/carrusel6.png';

const images = [img1, img2, img3, img4, img5, img6];

function InicioPagina() {
  return (
    <div className="inicio-container">
      <div className="swiper-container">
      <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            className="swiper"
        >
            {images.map((src, index) => (
                <SwiperSlide key={index}>
                <img src={src} alt={`carrusel-${index}`} className="carrusel-img" />
                </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}

export default InicioPagina;
