// src/componentes/Footer.js
import React from 'react';
import './footer.css';

import instagramIcon from '../assets/instagram.png';
import facebookIcon from '../assets/facebook.png';
import twitterIcon from '../assets/x.png';
import linkedinIcon from '../assets/linkedin.png';
import youtubeIcon from '../assets/youtube.png';
import tiktokIcon from '../assets/tiktok.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-social">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <img src={instagramIcon} alt="Instagram" />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <img src={facebookIcon} alt="Facebook" />
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
          <img src={twitterIcon} alt="x" />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <img src={linkedinIcon} alt="LinkedIn" />
        </a>
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
          <img src={youtubeIcon} alt="YouTube" />
        </a>
        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
          <img src={tiktokIcon} alt="TikTok" />
        </a>
      </div>

      <hr />

      <div className="footer-links">
        <div>
          <p>Sobre nosotros</p>
          <p>Trabaja con nosotros</p>
          <p>Primeros pasos</p>
          <p>Prueba un día</p>
          <p>FAQ - Preguntas frecuentes</p>
        </div>
        <div>
          <p>GW solidario</p>
          <p>GW sostenible</p>
          <p>Contáctanos</p>
          <p>Noticias</p>
          <p>Blog</p>
        </div>
        <div>
          <p>Condiciones del servicio</p>
          <p>Aviso legal</p>
          <p>Política de privacidad</p>
          <p>Política de cookies</p>
          <p>Canal denuncias</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Gimnasio online | Proyecto web</p>
      </div>
    </footer>
  );
}
