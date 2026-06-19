/**
 * SMARTICO PREMIUM LOADING COMPONENT
 *
 * Uso:
 *
 * 1. Mostrar loading:
 *    SmarticoLoading.show('Processando...');
 *
 * 2. Esconder loading:
 *    SmarticoLoading.hide();
 *
 * 3. Com callback:
 *    SmarticoLoading.show();
 *    setTimeout(() => SmarticoLoading.hide(), 3000);
 */

const SmarticoLoading = (() => {
  let loadingElement = null;
  let containerElement = null;
  let animationFrame = null;

  // Criar HTML do loading
  const createLoadingHTML = () => `
    <div class="smartico-loading-overlay">
      <div class="smartico-loading">
        <!-- PARTÍCULAS -->
        <div class="particles">
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
          <div class="particle"></div>
        </div>

        <!-- CARD PRINCIPAL -->
        <div class="loading-card">
          <div class="loading-content">
            <!-- RAIO SVG -->
            <div class="lightning-container">
              <svg class="lightning-bolt" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
                <path class="lightning-bolt-path" d="M 20 5 L 30 25 L 20 25 L 25 55 L 15 25 L 20 25 Z" />
              </svg>
            </div>

            <!-- ÍCONE BOLT -->
            <div class="icon-wrapper">
              <span class="icon">⚡</span>
            </div>

            <!-- TÍTULO PRINCIPAL -->
            <div class="loading-title">
              Encontrando onde seu dinheiro está escapando...
            </div>

            <!-- SUBTÍTULO ALTERNADO -->
            <div class="loading-subtitle">
              <span class="subtitle-text">Analisando seus gastos...</span>
            </div>

            <!-- CONTADOR DE ECONOMIA -->
            <div class="savings-counter">
              <div class="savings-label">Economia Potencial Identificada</div>
              <div class="savings-value">R$ 0</div>
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Criar CSS
  const createStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .smartico-loading-overlay {
        position: fixed;
        inset: 0;
        background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        animation: fadeIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .smartico-loading {
        position: relative;
        width: 100%;
        max-width: 500px;
      }

      .loading-card {
        background: rgba(15, 23, 41, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(22, 163, 74, 0.3);
        border-radius: 16px;
        padding: 48px 32px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .loading-card::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 16px;
        padding: 1px;
        background: linear-gradient(90deg, transparent, #16a34a, #2dd4bf, transparent);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: energy-border 3s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes energy-border {
        0%, 100% {
          opacity: 0.3;
          transform: translateX(-100%);
        }
        50% {
          opacity: 1;
          transform: translateX(100%);
        }
      }

      .loading-content {
        position: relative;
        z-index: 2;
      }

      .lightning-container {
        display: flex;
        justify-content: center;
        margin-bottom: 32px;
        height: 120px;
        perspective: 1000px;
      }

      svg.lightning-bolt {
        width: 80px;
        height: 120px;
        filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.6));
      }

      .lightning-bolt-path {
        stroke: #22c55e;
        stroke-width: 3;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.8));
        animation: lightning-strike 1.5s ease-in-out infinite;
      }

      @keyframes lightning-strike {
        0% {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          opacity: 0;
        }
        10% {
          stroke-dasharray: 200;
          stroke-dashoffset: 0;
          opacity: 1;
        }
        20% {
          opacity: 0.3;
        }
        30% {
          opacity: 1;
        }
        40% {
          opacity: 0;
        }
        100% {
          opacity: 0;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
        }
      }

      .icon-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, rgba(22, 163, 74, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%);
        border-radius: 12px;
        margin-bottom: 24px;
        font-size: 28px;
        color: #4ade80;
        animation: icon-pulse 2s ease-in-out infinite;
      }

      @keyframes icon-pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.7;
        }
        50% {
          transform: scale(1.1);
          opacity: 1;
        }
      }

      .loading-title {
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 16px;
        line-height: 1.4;
        letter-spacing: -0.3px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .loading-subtitle {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 32px;
        height: 20px;
        min-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .subtitle-text {
        animation: fade-in-out 1.5s ease-in-out infinite;
      }

      @keyframes fade-in-out {
        0% {
          opacity: 0;
          transform: translateY(5px);
        }
        15% {
          opacity: 1;
          transform: translateY(0);
        }
        85% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(-5px);
        }
      }

      .savings-counter {
        background: linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(20, 184, 166, 0.1) 100%);
        border: 1px solid rgba(22, 163, 74, 0.2);
        border-radius: 12px;
        padding: 20px;
        margin-top: 24px;
      }

      .savings-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
        margin-bottom: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .savings-value {
        font-size: 32px;
        font-weight: 700;
        color: #4ade80;
        font-family: 'Courier New', monospace;
        letter-spacing: -1px;
      }

      .progress-bar {
        width: 100%;
        height: 3px;
        background: rgba(22, 163, 74, 0.2);
        border-radius: 2px;
        margin-top: 20px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #16a34a 0%, #4ade80 50%, #2dd4bf 100%);
        border-radius: 2px;
        animation: progress-animate 2s ease-in-out infinite;
        box-shadow: 0 0 12px rgba(74, 222, 128, 0.6);
      }

      @keyframes progress-animate {
        0% { width: 0%; }
        50% { width: 100%; }
        100% { width: 0%; }
      }

      .particles {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 16px;
        overflow: hidden;
        z-index: 1;
        pointer-events: none;
      }

      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #4ade80;
        border-radius: 50%;
        opacity: 0;
      }

      .particle:nth-child(1) {
        left: 10%;
        animation: float-particle 3s ease-in-out infinite;
      }

      .particle:nth-child(2) {
        left: 30%;
        top: 20px;
        animation: float-particle 3.5s ease-in-out 0.5s infinite;
      }

      .particle:nth-child(3) {
        left: 60%;
        animation: float-particle 4s ease-in-out 1s infinite;
      }

      .particle:nth-child(4) {
        left: 85%;
        top: 15px;
        animation: float-particle 3.2s ease-in-out 0.3s infinite;
      }

      @keyframes float-particle {
        0% {
          opacity: 0;
          transform: translateY(0);
        }
        20% {
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(-60px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
        }
      }

      @media (max-width: 480px) {
        .loading-card {
          padding: 32px 20px;
        }

        .loading-title {
          font-size: 16px;
        }

        .savings-value {
          font-size: 28px;
        }
      }
    `;
    return style;
  };

  // Inicializar animações
  const initAnimations = () => {
    if (!loadingElement) return;

    const subtitles = [
      'Analisando seus gastos...',
      'Encontrando desperdícios invisíveis...',
      'Calculando economia potencial...',
      'Montando seu plano financeiro...'
    ];

    let subtitleIndex = 0;
    const subtitleElement = loadingElement.querySelector('.subtitle-text');

    // Mudar subtitle
    const subtitleInterval = setInterval(() => {
      if (!loadingElement) {
        clearInterval(subtitleInterval);
        return;
      }
      subtitleIndex = (subtitleIndex + 1) % subtitles.length;
      subtitleElement.textContent = subtitles[subtitleIndex];
    }, 1500);

    // Animar contador
    const savingsElement = loadingElement.querySelector('.savings-value');
    const targetSavings = 1500;
    const duration = 2000;

    const animateSavings = () => {
      if (!loadingElement) return;

      const startTime = Date.now();

      const update = () => {
        if (!loadingElement) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentSavings = Math.floor(targetSavings * progress);

        savingsElement.textContent = `R$ ${currentSavings.toLocaleString('pt-BR')}`;

        if (progress < 1) {
          animationFrame = requestAnimationFrame(update);
        }
      };

      update();
    };

    animateSavings();
    setInterval(animateSavings, 8000);
  };

  return {
    /**
     * Mostrar loading
     * @param {string} title - Título customizado (opcional)
     */
    show: (title = null) => {
      // Remover se já existe
      if (loadingElement) {
        loadingElement.remove();
      }

      // Criar container
      containerElement = document.createElement('div');
      containerElement.innerHTML = createLoadingHTML();

      // Injetar CSS
      if (!document.querySelector('style[data-smartico-loading]')) {
        const style = createStyles();
        style.setAttribute('data-smartico-loading', 'true');
        document.head.appendChild(style);
      }

      // Adicionar ao DOM
      loadingElement = containerElement.querySelector('.smartico-loading-overlay');
      document.body.appendChild(loadingElement);

      // Se title customizado, substituir
      if (title) {
        const titleElement = loadingElement.querySelector('.loading-title');
        titleElement.textContent = title;
      }

      // Inicializar animações
      initAnimations();
    },

    /**
     * Esconder loading
     */
    hide: () => {
      if (loadingElement) {
        loadingElement.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
          if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
          }
          loadingElement = null;
          if (animationFrame) {
            cancelAnimationFrame(animationFrame);
          }
        }, 300);
      }
    },

    /**
     * Verificar se loading está visível
     */
    isVisible: () => {
      return loadingElement !== null;
    }
  };
})();

// Exportar para uso global
window.SmarticoLoading = SmarticoLoading;
