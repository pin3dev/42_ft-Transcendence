// Supondo que navigateTo e createProfileButtonWithDropdown estão corretamente importados ou globalmente disponíveis
import { navigateTo } from '../router/index'; // Seu import original


function createProfileButtonWithDropdown(container: HTMLElement): void {
  if (!container) {
    console.error("Container para o botão de perfil não fornecido.");
    return;
  }
  container.style.position = 'relative';

  let isDropdownOpen = false;
  let dropdownElement: HTMLDivElement | null = null;

  const userName = localStorage.getItem('userName') || 'Usuário';
  const userAvatar = localStorage.getItem('userAvatar') || 'https://via.placeholder.com/32/FFFFFF/000000/?text=U';

  const profBtn = document.createElement('button');
  profBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker px-4 py-2 rounded border transition-all flex items-center gap-2';

  const avatarImg = document.createElement('img');
  avatarImg.src = userAvatar;
  avatarImg.alt = userName;
  avatarImg.className = 'w-6 h-6 rounded-full';

  const nameSpan = document.createElement('span');
  nameSpan.textContent = userName;

  profBtn.appendChild(avatarImg);
  profBtn.appendChild(nameSpan);

  const toggleDropdown = () => {
    if (isDropdownOpen && dropdownElement) {
      dropdownElement.remove();
      dropdownElement = null;
      isDropdownOpen = false;
      document.removeEventListener('click', handleClickOutside);
    } else {
      const existing = container.querySelector('.profile-menu-dropdown');
      if (existing) existing.remove();

      dropdownElement = document.createElement('div');
      // Corrige a posição: top-full + mt-2 para ficar logo abaixo do botão
      dropdownElement.className = 'profile-menu-dropdown absolute right-0 top-full mt-2 w-48 bg-arcade-darker border border-neon-purple rounded-lg shadow-lg z-50';

      const menuItems = [
        { text: 'Meu Perfil', action: 'profile', href: '/Profile' },
        { text: 'Configurações', action: 'settings', href: '/Settings' },
        { text: 'Sair', action: 'logout', href: '#' },
      ];

      menuItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'block px-4 py-3 text-neon-blue hover:bg-neon-blue hover:text-arcade-darker transition-all cursor-pointer';
        link.textContent = item.text;

        link.addEventListener('click', (e) => {
          e.preventDefault();
          if (item.action === 'logout') {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userAvatar');
            alert('Deslogado!');
            window.location.reload();
          } else {
            navigateTo(item.href);
          }
          toggleDropdown();
        });
        dropdownElement!.appendChild(link);
      });

      container.appendChild(dropdownElement);
      isDropdownOpen = true;
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownElement &&
      !profBtn.contains(event.target as Node) &&
      !dropdownElement.contains(event.target as Node)) {
      toggleDropdown();
    }
  };

  profBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleDropdown();
  });

  container.appendChild(profBtn);
}
// --------- Fim do código createProfileButtonWithDropdown ---------


export function createNavbar(): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'border-b border-neon-blue bg-arcade-darker py-4 px-6';

  const container = document.createElement('div');
  container.className = 'container mx-auto flex justify-between items-center';

  // Logo
  const logo = document.createElement('a');
  logo.className = 'flex items-center gap-2 cursor-pointer';
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/');
  });

  const logoIcon = document.createElement('div');
  logoIcon.className = 'text-neon-pink';
  logoIcon.innerHTML = `<img src="/joystick.png" width="24" height="24" alt="Joystick Icon">`;

  const logoText = document.createElement('span');
  logoText.className = 'font-bold text-xl md:text-2xl text-white neon-text';
  logoText.innerHTML = 'Ping Pong';

  logo.appendChild(logoIcon);
  logo.appendChild(logoText);

  const authArea = document.createElement('div');
  authArea.className = 'hidden md:flex items-center gap-3';

  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'md:hidden text-white p-2';
  mobileMenuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`;

  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'md:hidden absolute top-full left-0 right-0 bg-arcade-darker border-b border-neon-blue z-40 hidden shadow-lg';

  const mobileNavContent = document.createElement('div');
  mobileNavContent.className = 'flex flex-col p-4 space-y-3';

  const mobileAuthContainer = document.createElement('div');
  mobileAuthContainer.className = 'pt-3 border-t border-gray-700 mt-3';

  mobileMenu.appendChild(mobileNavContent);
  mobileNavContent.appendChild(mobileAuthContainer);

  // --- Lógica de exibição dos botões conforme rota ---
  const path = window.location.pathname;
  const showAuthButtons =
    path === '/' ||
    path.toLowerCase() === '/login' ||
    path.toLowerCase() === '/registro' ||
    path.toLowerCase() === '/register';

  if (showAuthButtons) {
    // Botões de Login e Registrar (desktop)
    const loginBtn = document.createElement('button');
    loginBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker px-4 py-2 rounded border';
    loginBtn.textContent = 'Login';
    loginBtn.addEventListener('click', () => navigateTo('/Login'));

    const registerBtn = document.createElement('button');
    registerBtn.className = 'bg-neon-pink text-arcade-darker hover:bg-neon-purple hover:text-white px-4 py-2 rounded';
    registerBtn.textContent = 'Registrar';
    registerBtn.addEventListener('click', () => navigateTo('/Register'));

    authArea.appendChild(loginBtn);
    authArea.appendChild(registerBtn);

    // Botões para mobile
    const mobileLoginBtn = loginBtn.cloneNode(true) as HTMLButtonElement;
    mobileLoginBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker w-full px-3 py-2 rounded border text-sm';
    mobileLoginBtn.addEventListener('click', () => { navigateTo('/Login'); mobileMenu.classList.add('hidden'); });

    const mobileRegisterBtn = registerBtn.cloneNode(true) as HTMLButtonElement;
    mobileRegisterBtn.className = 'bg-neon-pink text-arcade-darker hover:bg-neon-purple hover:text-white w-full px-3 py-2 rounded text-sm';
    mobileRegisterBtn.addEventListener('click', () => { navigateTo('/Register'); mobileMenu.classList.add('hidden'); });

    const mobileBtnsFlex = document.createElement('div');
    mobileBtnsFlex.className = 'flex flex-col space-y-2';
    mobileBtnsFlex.appendChild(mobileLoginBtn);
    mobileBtnsFlex.appendChild(mobileRegisterBtn);
    mobileAuthContainer.appendChild(mobileBtnsFlex);

  } else {
    // Botão de perfil com dropdown (desktop)
    createProfileButtonWithDropdown(authArea);

    // Mobile: perfil e logout
    const mobileProfileLink = document.createElement('a');
    mobileProfileLink.textContent = `Perfil (${localStorage.getItem('userName') || 'Usuário'})`;
    mobileProfileLink.className = 'text-white hover:text-neon-green p-2 transition-colors cursor-pointer block';
    mobileProfileLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/Profile');
      mobileMenu.classList.add('hidden');
    });
    const mobileLogoutLink = document.createElement('a');
    mobileLogoutLink.textContent = 'Sair';
    mobileLogoutLink.className = 'text-neon-pink hover:underline p-2 transition-colors cursor-pointer block';
    mobileLogoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userAvatar');
      alert('Deslogado!');
      window.location.reload();
      mobileMenu.classList.add('hidden');
    });
    mobileAuthContainer.appendChild(mobileProfileLink);
    mobileAuthContainer.appendChild(mobileLogoutLink);
  }

  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  container.appendChild(logo);
  container.appendChild(authArea);
  container.appendChild(mobileMenuBtn);

  nav.appendChild(container);
  nav.appendChild(mobileMenu); // Menu mobile é filho direto da nav para posicionamento absoluto

  return nav;
}


