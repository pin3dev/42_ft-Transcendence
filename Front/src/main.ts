import './css/style.css';
import { initializeRouter } from './router/index';

// Inicializar o roteador quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  initializeRouter();
});