// Supondo que navigateTo e createProfileButtonWithDropdown estão corretamente importados ou globalmente disponíveis
import { navigateTo } from '../router/index'; // Seu import original
import { fetchWithAuth } from '../utils/fetchWithAuth'; // Importar fetchWithAuth
import { hasLocalToken, hasJWTCookie, clearAllAuthData } from '../utils/auth'; // Importar verificação de autenticação
import { userStatusSocket } from '../services/UserStatusSocket'; // Importa o socket de status

// Função para mostrar modal personalizado de logout
function showLogoutModal(): void {
  const logoutModal = document.createElement('div');
  logoutModal.className = 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center transition-opacity';
  logoutModal.innerHTML = `
    <div class="bg-arcade-darker p-6 rounded-xl border border-neon-blue w-full max-w-md text-white space-y-4">
      <h3 class="text-xl font-bold text-neon-blue">Tem certeza que deseja sair?</h3>
      <p class="text-sm text-white/80">Você será desconectado da sua conta.</p>
      <div class="flex justify-end gap-4 mt-4">
        <button id="cancel-logout" class="text-white border border-white px-4 py-2 rounded hover:bg-white/10">Cancelar</button>
        <button id="confirm-logout" class="bg-neon-blue px-4 py-2 rounded text-black font-bold hover:bg-neon-green">Sair</button>
      </div>
    </div>
  `;
  document.body.appendChild(logoutModal);

  // Event listeners para os botões do modal
  logoutModal.querySelector('#cancel-logout')?.addEventListener('click', () => {
    logoutModal.remove();
  });

  logoutModal.querySelector('#confirm-logout')?.addEventListener('click', async () => {
    const confirmButton = logoutModal.querySelector('#confirm-logout') as HTMLButtonElement;
    confirmButton.textContent = 'Saindo...';
    confirmButton.disabled = true;

    try {
      // Chamar a rota /auth/logout primeiro
      const response = await fetchWithAuth('/auth/logout', {
        method: 'POST'
      });

      if (response.ok) {
        //console.log('Logout realizado com sucesso no servidor');
      } else {
        console.warn('Erro no logout do servidor, mas continuando com logout local');
      }
    } catch (error) {
      console.warn('Erro ao chamar logout no servidor:', error);
    } finally {
      // Desconecta o socket de status ANTES de limpar dados
      //console.log('🔌 Desconectando socket de status durante logout');
      userStatusSocket.disconnect();
      
      // Limpar dados locais independentemente do resultado da API usando a nova função
      clearAllAuthData();
      
      // Dispara evento de logout para outros componentes
      document.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      // Força o reload da página para garantir que tudo seja resetado
      window.location.href = '/';
    }
  });

  // Fechar modal ao clicar fora
  logoutModal.addEventListener('click', (e) => {
    if (e.target === logoutModal) {
      logoutModal.remove();
    }
  });
}

// Função para mostrar modal personalizado de confirmação de exclusão
function showDeleteModal(): void {
  const deleteModal = document.createElement('div');
  deleteModal.className = 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center transition-opacity';
  deleteModal.innerHTML = `
    <div class="bg-arcade-darker p-6 rounded-xl border border-neon-pink w-full max-w-md text-white space-y-4">
      <h3 class="text-xl font-bold text-neon-pink">Tem certeza que deseja deletar seu perfil?</h3>
      <p class="text-sm text-white/80">Essa ação é irreversível e todos os seus dados serão apagados.</p>
      <div class="flex justify-end gap-4 mt-4">
        <button id="cancel-delete" class="text-white border border-white px-4 py-2 rounded hover:bg-white/10">Cancelar</button>
        <button id="confirm-delete" class="bg-red-600 px-4 py-2 rounded text-white font-bold hover:bg-red-700">Deletar</button>
      </div>
    </div>
  `;
  document.body.appendChild(deleteModal);

  // Event listeners para os botões do modal
  deleteModal.querySelector('#cancel-delete')?.addEventListener('click', () => {
    deleteModal.remove();
  });

  deleteModal.querySelector('#confirm-delete')?.addEventListener('click', async () => {
    const confirmButton = deleteModal.querySelector('#confirm-delete') as HTMLButtonElement;
    confirmButton.textContent = 'Deletando...';
    confirmButton.disabled = true;

    try {
      const response = await fetchWithAuth('/user/profile', {
        method: 'DELETE'
      });

      if (response.status === 204) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        window.location.href = '/';
      } else {
        throw new Error('Falha ao deletar o perfil');
      }
    } catch (error) {
      alert('Erro ao deletar perfil.');
      console.error(error);
    } finally {
      confirmButton.textContent = 'Deletar';
      confirmButton.disabled = false;
      deleteModal.remove();
    }
  });

  // Fechar modal ao clicar fora
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      deleteModal.remove();
    }
  });
}


function createProfileButtonWithDropdown(container: HTMLElement): void {
  if (!container) {
    console.error("Container para o botão de perfil não fornecido.");
    return;
  }
  container.style.position = 'relative';

  let isDropdownOpen = false;
  let dropdownElement: HTMLDivElement | null = null;

  // Dados do usuário - sempre mostrar "Configurações"
  const userName = 'Configurações';

  const profBtn = document.createElement('button');
  profBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker px-4 py-2 rounded border transition-all flex items-center gap-2';

  // Removido o avatar - apenas o nome do usuário
  const nameSpan = document.createElement('span');
  nameSpan.textContent = userName;

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
      // Corrigido o posicionamento - removido mt-2 e adicionado top-full para ficar logo abaixo do botão
      dropdownElement.className = 'profile-menu-dropdown absolute right-0 top-full w-48 bg-arcade-darker border border-neon-purple rounded-lg shadow-lg z-50';
      
      const menuItems = [
        { text: 'Meu Perfil', action: 'profile', href: '/Profile' },
        { text: 'Excluir Conta', action: 'delete', href: '#' },
        { text: 'Sair', action: 'logout', href: '#' },
      ];

      menuItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'block px-4 py-3 text-neon-blue hover:bg-neon-blue hover:text-arcade-darker transition-all cursor-pointer';
        link.textContent = item.text;
        
        link.addEventListener('click', async (e) => {
          e.preventDefault(); 
          //console.log(`Ação do menu: ${item.action}`);
          
          if (item.action === 'logout') {
            // Mostrar modal personalizado de logout
            showLogoutModal();
          } else if (item.action === 'delete') {
            // Criar e mostrar modal personalizado de confirmação
            showDeleteModal();
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

  // --- Lógica de exibição dos botões baseada na autenticação ---
  // Verificação mais simples e rápida para a navbar
  const hasLocal = hasLocalToken();
  const hasJWT = hasJWTCookie();
  
  // Para a navbar, usamos uma verificação básica
  // A validação real será feita quando necessário (ao acessar rotas protegidas)
  const isUserAuthenticated = hasLocal || hasJWT;
  
  if (!isUserAuthenticated) {
    //console.log('👤 Exibindo botões de Login/Registrar');
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
    //console.log('⚙️ Exibindo menu de configurações');
    // Botão de perfil com dropdown (desktop)
    createProfileButtonWithDropdown(authArea);

    // Mobile: perfil e logout
    const mobileProfileLink = document.createElement('a');
    mobileProfileLink.textContent = `Perfil (${localStorage.getItem('userName') || 'Configurações'})`;
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
      mobileMenu.classList.add('hidden');
      // Mostrar modal personalizado de logout
      showLogoutModal();
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


