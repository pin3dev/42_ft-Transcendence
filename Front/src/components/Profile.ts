import { fetchWithAuth } from '../utils/fetchWithAuth';

export interface UserStats {
  name: string;
  wins: number;
  losses: number;
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
  
private render(): void {
  const { userStats, onPlay } = this.props;

  this.element.className = 'relative bg-arcade-darker border-2 border-neon-purple rounded-lg p-6 mb-8';
  this.element.innerHTML = `
  <div id="user-search-slot" class="relative w-full h-0"></div>
    <div class="flex items-center space-x-6 mt-12 relative">
      <div class="relative group w-24 h-24 rounded-full border-4 border-neon-blue overflow-hidden">
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
        <h2 class="text-2xl text-neon-blue neon-text">${userStats.name}</h2>
        <div class="flex space-x-6">
          <div class="text-center">
            <div class="text-neon-green text-xl">${userStats.wins}</div>
            <div class="text-neon-green text-sm">Win</div>
          </div>
          <div class="text-center">
            <div class="text-neon-pink text-xl">${userStats.losses}</div>
            <div class="text-neon-pink text-sm">Lose</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-6">
      <button
        class="play-button bg-neon-green text-black px-8 py-3 rounded-lg text-lg font-bold hover:bg-opacity-80 transition-all animate-pulse-neon"
      >
        PLAY
      </button>
    </div>
    <div class="flex justify-center mt-4">
      <button
        class="bg-red-600 text-white px-6 py-2 rounded-lg text-md font-semibold hover:bg-red-700 transition-all border border-red-400 shadow-md hover:shadow-red-500/50 neon-text"
        id="delete-profile-btn"
        title="Deletar Perfil"
      >
        🗑️ Deletar Perfil
      </button>
    </div>
  `;

  // Criar modal e inserir no DOM
  const modal = document.createElement('div');
  modal.className = `
    fixed inset-0 bg-black/70 z-50 flex items-center justify-center hidden
  `;
  modal.innerHTML = `
    <div class="bg-arcade-darker p-6 rounded-xl border border-neon-purple w-full max-w-md text-white space-y-4">
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

  const deleteModal = document.createElement('div');
  deleteModal.className = 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center hidden';
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
        
        response = await fetchWithAuth('http://localhost:1025/user/profile', {
        method: 'PATCH',
        body: formData,
      });
      } else {
        const jsonBody: any = {};
        if (name) {
          jsonBody.name = { value: name };
        }

        response = await fetchWithAuth('http://localhost:1025/user/profile', {
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
    button.addEventListener('click', onPlay);
  }

  const deleteBtn = this.element.querySelector('#delete-profile-btn');
  deleteBtn?.addEventListener('click', () => {
    deleteModal.classList.remove('hidden');
  });

  deleteModal.querySelector('#cancel-delete')?.addEventListener('click', () => {
    deleteModal.classList.add('hidden');
  });

  deleteModal.querySelector('#confirm-delete')?.addEventListener('click', async () => {
    const confirmButton = deleteModal.querySelector('#confirm-delete') as HTMLButtonElement;
    confirmButton.textContent = 'Deletando...';
    confirmButton.disabled = true;

    try {
      const response = await fetchWithAuth('http://localhost:1025/user/profile', {
        method: 'DELETE'
      });

      if (response.status === 204) {
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
      deleteModal.classList.add('hidden');
    }
  });
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
}
}