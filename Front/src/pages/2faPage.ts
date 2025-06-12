import { createFooter } from '../components/Footer';
import { createNavbar } from '../components/Navbar';
import { showToast } from '../utils/toast';

export function render2FAPage(qrCode?: string | null): void {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col bg-arcade-dark';

  container.appendChild(createNavbar());

  const main = document.createElement('main');
  main.className = 'flex-grow container mx-auto px-4 py-8 flex justify-center items-center';

  const contentContainer = document.createElement('div');
  contentContainer.className = 'w-full max-w-lg text-center';

  if (qrCode) {
    const qrImage = document.createElement('img');
    qrImage.src = qrCode;
    qrImage.alt = 'QR Code para configurar 2FA';
    qrImage.className = 'mx-auto mb-4';

    const instructions = document.createElement('p');
    instructions.className = 'text-gray-300 mb-4';
    instructions.textContent = 'Escaneie o QR Code com o Google Authenticator ou Microsoft Authenticator.';

    const nextButton = document.createElement('button');
    nextButton.className = 'w-full bg-neon-blue hover:bg-neon-green text-black font-bold py-2 rounded-md';
    nextButton.textContent = 'Seguinte';
    nextButton.addEventListener('click', () => render2FAInput());

    contentContainer.appendChild(qrImage);
    contentContainer.appendChild(instructions);
    contentContainer.appendChild(nextButton);
  } else {
    render2FAInput(contentContainer);
  }

  main.appendChild(contentContainer);
  container.appendChild(main);
  container.appendChild(createFooter());
  root.appendChild(container);
}

function render2FAInput(container?: HTMLElement): void {
  if (!container) {
    container = document.querySelector('.w-full.max-w-lg.text-center') as HTMLElement;
    if (!container) throw new Error('Container não encontrado para renderizar o campo de 2FA.');
    container.innerHTML = '';
  }

  container.innerHTML = '';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Digite o código 2FA';
  input.className = 'w-full bg-arcade-dark border-neon-blue border rounded-md px-4 py-2 text-white mb-4';

  const submitButton = document.createElement('button');
  submitButton.className = 'w-full bg-neon-blue hover:bg-neon-green text-black font-bold py-2 rounded-md';
  submitButton.textContent = 'Enviar';

  submitButton.addEventListener('click', async () => {
    const token = input.value.trim();
    if (!token) {
      showToast('Por favor, insira o código 2FA.', 'error');
      return;
    }

    try {
      const user_id = localStorage.getItem('user_id');
      if (!user_id) throw new Error('ID do usuário não encontrado. Faça login novamente.');

      const response = await fetch('auth/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Fundamental para aceitar o cookie JWT do backend
        body: JSON.stringify({ user_id: parseInt(user_id, 10), otp: token }),
      });

      if (!response.ok) {
        throw new Error('Código inválido.');
      }

      // Após autenticação bem-sucedida, buscar dados do usuário para salvar no localStorage
      try {
        const profileResponse = await fetch('/user/profile', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          // Salvar dados do usuário no localStorage para a navbar detectar
          localStorage.setItem('userName', profileData.name);
          if (profileData.avatar_url) {
            localStorage.setItem('userAvatar', profileData.avatar_url);
          }
          console.log('✅ Dados do usuário salvos no localStorage:', profileData);
        }
      } catch (profileError) {
        console.warn('Não foi possível carregar dados do perfil, mas login foi bem-sucedido:', profileError);
      }

      showToast('Autenticação concluída com sucesso!', 'success');
      localStorage.removeItem('user_id');
      window.location.href = '/Profile';
    } catch (error) {
      console.error('Erro ao verificar o código 2FA:', error);
      showToast(error instanceof Error ? error.message : 'Erro desconhecido.', 'error');
    }
  });

  container.appendChild(input);
  container.appendChild(submitButton);
}
