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

  // Dados do usuário (você precisará obter isso de algum lugar, ex: localStorage ou estado global)
  const userName = localStorage.getItem('userName') || 'Usuário'; // Exemplo
  const userAvatar = localStorage.getItem('userAvatar') || 'https://via.placeholder.com/32/FFFFFF/000000/?text=U'; // Exemplo

  const profBtn = document.createElement('button');
  // Estilo do botão de perfil como no seu código original, se preferir, ou o da função
  profBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker px-4 py-2 rounded border transition-all flex items-center gap-2'; 
  
  const avatarImg = document.createElement('img');
  avatarImg.src = userAvatar;
  avatarImg.alt = userName;
  avatarImg.className = 'w-6 h-6 rounded-full'; // Ajuste o tamanho conforme necessário

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
      dropdownElement.className = 'profile-menu-dropdown absolute right-0 mt-2 w-48 bg-arcade-darker border border-neon-purple rounded-lg shadow-lg z-50';
      
      const menuItems = [
        { text: 'Meu Perfil', action: 'profile', href: '/Profile' }, // Mantive href para consistência com seu código
        { text: 'Configurações', action: 'settings', href: '/Settings' },
        { text: 'Sair', action: 'logout', href: '#' }, // Para logout, a ação é mais importante que o href
      ];

      menuItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'block px-4 py-3 text-neon-blue hover:bg-neon-blue hover:text-arcade-darker transition-all cursor-pointer';
        link.textContent = item.text;
        
        link.addEventListener('click', (e) => {
          e.preventDefault(); 
          console.log(`Ação do menu: ${item.action}`);
          if (item.action === 'logout') {
            // Lógica de Logout:
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userAvatar');
            // Você precisaria de uma maneira de re-renderizar a navbar ou a página inteira
            // ou navegar para a página de login.
            // Exemplo simples:
            alert('Deslogado!');
            window.location.reload(); // Recarrega a página para refletir o estado de logout
          } else {
            navigateTo(item.href); // Usando navigateTo para outras ações
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
    navigateTo('/'); // Assumindo que navigateTo está disponível
  });
  
  const logoIcon = document.createElement('div');
  logoIcon.className = 'text-neon-pink';
  logoIcon.innerHTML = `<img src="/joystick.png" width="24" height="24" alt="Joystick Icon">`;
  
  const logoText = document.createElement('span');
  logoText.className = 'font-bold text-xl md:text-2xl text-white neon-text'; // Adicionei neon-text se você tiver esse estilo
  logoText.innerHTML = 'Ping Pong';
  
  logo.appendChild(logoIcon);
  logo.appendChild(logoText);
  
  // // Desktop navigation (links de navegação principais, se houver)
  // const desktopNav = document.createElement('div');
  // desktopNav.className = 'hidden md:flex items-center gap-6';
  // // Exemplo de como adicionar itens de navegação se precisar:
  // const navLinks = [
  //   { text: 'Jogos', path: '/games' },
  //   { text: 'Sobre', path: '/about' }
  // ];
  // navLinks.forEach(item => {
  //   const navLink = document.createElement('a');
  //   navLink.className = 'text-white hover:text-neon-green transition-colors cursor-pointer';
  //   navLink.textContent = item.text;
  //   navLink.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     navigateTo(item.path);
  //   });
  //   desktopNav.appendChild(navLink);
  // });
  
  // Auth buttons / Profile area
  const authArea = document.createElement('div');
  authArea.className = 'hidden md:flex items-center gap-3'; // Mantive items-center
  // O 'gap-3' pode precisar de ajuste dependendo se há múltiplos botões ou só o de perfil

  // Mobile menu button
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'md:hidden text-white p-2';
  mobileMenuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`;
  
  // Mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'md:hidden absolute top-full left-0 right-0 bg-arcade-darker border-b border-neon-blue z-40 hidden shadow-lg';
  // Usar top-full para posicionar abaixo da navbar. Ajuste 'top-16' se a altura da navbar for fixa.
  
  const mobileNavContent = document.createElement('div');
  mobileNavContent.className = 'flex flex-col p-4 space-y-3';
  
  // // Adicionar links de navegação ao menu mobile também
  // navLinks.forEach(item => {
  //   const mobileLink = document.createElement('a');
  //   mobileLink.className = 'text-white hover:text-neon-green p-2 transition-colors cursor-pointer block'; // 'block' para ocupar largura
  //   mobileLink.textContent = item.text;
  //   mobileLink.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     navigateTo(item.path);
  //     mobileMenu.classList.add('hidden'); // Fecha o menu após clicar
  //   });
  //   mobileNavContent.appendChild(mobileLink);
  // });
      
  const mobileAuthContainer = document.createElement('div'); // Container para botões de auth no mobile
  mobileAuthContainer.className = 'pt-3 border-t border-gray-700 mt-3'; // Divisor visual

  mobileMenu.appendChild(mobileNavContent);
  mobileNavContent.appendChild(mobileAuthContainer); // Adiciona o container de auth


  
  if (!localStorage.getItem('userToken')) {
    // Usuário LOGADO: Mostrar botão de perfil com dropdown
    // O `authArea` (para desktop) servirá como container para o botão de perfil.
    // Nossa função `createProfileButtonWithDropdown` vai popular este `authArea`.
    createProfileButtonWithDropdown(authArea);

    // Para mobile, também adicionaríamos um botão de perfil ou opções de menu
    const mobileProfileOptions = document.createElement('div'); // Exemplo
    // Poderia replicar o botão de perfil aqui ou apenas ter links de menu
    const mobileProfileLink = document.createElement('a');
    mobileProfileLink.textContent = `Perfil (${localStorage.getItem('user_id') || 'Usuário'})`;
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

  } else {
    // Usuário DESLOGADO: Mostrar botões de Login e Registrar
    const loginBtn = document.createElement('button');
    loginBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker px-4 py-2 rounded border';
    loginBtn.textContent = 'Login';
    loginBtn.addEventListener('click', ()=> navigateTo('/Login'));

    const registerBtn = document.createElement('button');
    registerBtn.className = 'bg-neon-pink text-arcade-darker hover:bg-neon-purple hover:text-white px-4 py-2 rounded';
    registerBtn.textContent = 'Registrar';
    registerBtn.addEventListener('click', ()=> navigateTo('/Register'));
    
    authArea.appendChild(loginBtn);
    authArea.appendChild(registerBtn);

    // Botões de login/registro para mobile
    const mobileLoginBtn = loginBtn.cloneNode(true) as HTMLButtonElement; // Clona para não mover o original
    mobileLoginBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker w-full px-3 py-2 rounded border text-sm';
    mobileLoginBtn.addEventListener('click', ()=> { navigateTo('/Login'); mobileMenu.classList.add('hidden'); });

    const mobileRegisterBtn = registerBtn.cloneNode(true) as HTMLButtonElement;
    mobileRegisterBtn.className = 'bg-neon-pink text-arcade-darker hover:bg-neon-purple hover:text-white w-full px-3 py-2 rounded text-sm';
    mobileRegisterBtn.addEventListener('click', ()=> { navigateTo('/Register'); mobileMenu.classList.add('hidden'); });

    const mobileBtnsFlex = document.createElement('div');
    mobileBtnsFlex.className = 'flex flex-col space-y-2'; // Ou 'flex gap-2' se preferir lado a lado
    mobileBtnsFlex.appendChild(mobileLoginBtn);
    mobileBtnsFlex.appendChild(mobileRegisterBtn);
    mobileAuthContainer.appendChild(mobileBtnsFlex);
  }
  
  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Montar navbar
  container.appendChild(logo);
  //container.appendChild(desktopNav); // Adiciona os links de navegação desktop
  container.appendChild(authArea);   // Adiciona a área de autenticação/perfil desktop
  container.appendChild(mobileMenuBtn);
  
  nav.appendChild(container);
  nav.appendChild(mobileMenu); // Menu mobile é filho direto da nav para posicionamento absoluto
  
  return nav;
}


