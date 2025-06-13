import { fetchWithAuth } from '../utils/fetchWithAuth';

export interface UserStats {
  name: string;
  wins: number;
  losses: number;
  score: number; 
  avatar: string;
  user_id?: string; // Campo opcional para manter compatibilidade com código existente
}

export interface ProfileSectionProps {
  userStats: UserStats;
  onPlay: () => void;
}

export class ProfileSection {
  private element: HTMLElement;
  private props: ProfileSectionProps;

  constructor(props: ProfileSectionProps) {
    this.props = props;
    this.element = document.createElement('div');
    this.render();
  }

  public async fetchUserStats(): Promise<void> {
    try {
      const headers: Record<string, string> = {};
      if (this.props.userStats.user_id) {
        headers['x-user-id'] = this.props.userStats.user_id;
      }

      const response = await fetchWithAuth('/tournament/ranking/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas do usuário');
      }
  
      const stats = await response.json();
  
      this.update({
        userStats: {
          ...this.props.userStats,
          wins: stats.total_wins,
          losses: stats.total_losses,
          score: stats.score, // Adiciona o score
        },
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error);
    }
  }
  
private render(): void {
  const { userStats, onPlay } = this.props;

  this.element.className = 'relative bg-arcade-darker border-2 border-neon-blue rounded-lg p-6 mb-8';
  this.element.innerHTML = `
  <div id="user-search-slot" class="relative w-full h-0"></div>
    <div class="flex items-center space-x-6 mt-12 relative">
      <div class="relative group w-24 h-24 rounded-full border-2 border-white/20 hover:border-neon-blue transition-all overflow-hidden">
        <img
          src="${userStats.avatar}"
          alt="${userStats.name}"
          class="w-full h-full object-cover"
        />
        <button
          class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
          id="edit-profile-btn"
          title="Editar perfil"
        >
          ✏️
        </button>
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl text-neon-blue">${userStats.name}</h2>
        <div class="flex space-x-6">
          <div class="text-center">
            <div class="text-neon-green text-xl">${userStats.wins}</div>
            <div class="text-neon-green text-sm">Win</div>
          </div>
          <div class="text-center">
            <div class="text-neon-pink text-xl">${userStats.losses}</div>
            <div class="text-neon-pink text-sm">Lose</div>
          </div>
          <div class="text-center">
            <div class="text-white text-xl font-semibold">${userStats.score}</div>
            <div class="text-white text-sm">Score</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-6">
      <button
        class="play-button bg-neon-green text-black px-8 py-3 rounded-lg text-lg font-bold shadow-[0_0_16px_#39FF14] animate-pulse"
      >
        PLAY
      </button>
    </div>
  `;

  // Criar modal e inserir no DOM
  const modal = document.createElement('div');
  modal.className = `
    fixed inset-0 bg-black/70 z-50 flex items-center justify-center hidden
  `;
  modal.innerHTML = `
    <div class="bg-arcade-darker p-6 rounded-xl border border-neon-blue w-full max-w-md text-white space-y-4">
      <h3 class="text-xl font-bold">Editar Perfil</h3>
      <input id="edit-name" type="text" class="w-full p-2 rounded text-black" placeholder="Novo nome de usuário" />
      <input id="edit-avatar" type="file" accept="image/*" class="w-full" />
      <div class="flex justify-end gap-4 mt-4">
        <button id="cancel-edit" class="text-red-500">Cancelar</button>
        <button id="save-edit" class="bg-neon-green text-black px-4 py-2 rounded">Salvar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const editBtn = this.element.querySelector('#edit-profile-btn');
  editBtn?.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  modal.querySelector('#cancel-edit')?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal.querySelector('#save-edit')?.addEventListener('click', async () => {
    const name = (modal.querySelector('#edit-name') as HTMLInputElement).value.trim();
    const fileInput = modal.querySelector('#edit-avatar') as HTMLInputElement;
    const file = fileInput.files?.[0];

    // Definir o botão de salvar no início da função
    const saveButton = modal.querySelector('#save-edit') as HTMLButtonElement;
    const originalText = saveButton.textContent || 'Salvar';
    saveButton.textContent = 'Salvando...';
    saveButton.disabled = true;

    try {
      let response;
  
      if (file) {
        // Caso tenha avatar, envia multipart com FormData
        const formData = new FormData();
  
        if (name) {
          // Envia o nome como string JSON — backend irá parsear
          formData.append('name', JSON.stringify({ value: name }));
        }
  
        formData.append('avatar', file);
        
        response = await fetchWithAuth('/user/profile', {
        method: 'PATCH',
        body: formData,
      });
      } else {
        const jsonBody: any = {};
        if (name) {
          jsonBody.name = { value: name };
        }

        response = await fetchWithAuth('/user/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonBody),
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar perfil');
      }

      const updated = await response.json();
      this.update({
        userStats: {
          ...this.props.userStats,
          name: updated.name,
          avatar: updated.avatar_url,
        },
      });

      modal.classList.add('hidden');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);

      // Mostrar mensagem de erro para o usuário
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-2';
    errorDiv.textContent = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
    
    // Adiciona a mensagem de erro abaixo dos inputs
    const inputsContainer = modal.querySelector('input[type="file"]')?.parentElement;
    inputsContainer?.appendChild(errorDiv);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => errorDiv.remove(), 5000);
  } finally {
    // Restaura o botão
    saveButton.textContent = originalText;
    saveButton.disabled = false;
    }
  });

  // Adiciona o event listener ao botão
  const button = this.element.querySelector('.play-button');
  if (button) {
    button.addEventListener('click', () => {
      // Esta linha navega para a rota /Game.
      // Lembre-se que isso causa um recarregamento da página.
      window.location.href = '/Game';
    });
  }
}

  public getElement(): HTMLElement {
    return this.element;
  }

public update(newProps: Partial<ProfileSectionProps>): void {
  this.props = { ...this.props, ...newProps };

  const nameElement = this.element.querySelector('h2');
  if (nameElement) {
    nameElement.textContent = this.props.userStats.name;
  }

  const avatarElement = this.element.querySelector('img');
  if (avatarElement) {
    avatarElement.src = this.props.userStats.avatar;
    avatarElement.alt = this.props.userStats.name;
  }

  const winsElement = this.element.querySelector('.text-neon-green.text-xl');
  if (winsElement) {
    winsElement.textContent = this.props.userStats.wins.toString();
  }

  const lossesElement = this.element.querySelector('.text-neon-pink.text-xl');
  if (lossesElement) {
    lossesElement.textContent = this.props.userStats.losses.toString();
  }

  const scoreElement = this.element.querySelector('.text-neon-yellow.text-xl');
  if (scoreElement) {
    scoreElement.textContent = this.props.userStats.score.toString();
  }
}
}