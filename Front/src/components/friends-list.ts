// src/components/friends-list.ts

export interface Friend {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'pending';
  avatar: string;
}

interface FriendsListProps {
  friends: Friend[];
  title?: string; // Título opcional
  onAccept?: (friendId: string) => void;
  onReject?: (friendId: string) => void;
  onRemove?: (friendId: string) => void;
}

export class FriendsList {
  private element: HTMLElement;
  private props: FriendsListProps;
  private searchTerm: string = '';

  constructor(props: FriendsListProps) {
    this.props = props;
    this.element = document.createElement('div');
    this.render();
  }

  private renderFriendsList(friends: Friend[]): string {
    if (friends.length === 0) {
      return '<p class="text-gray-400 text-center">Nenhum item para exibir</p>';
    }
    return friends.map(friend => `
    <div class="friend-item flex items-center justify-between bg-arcade-dark p-2 rounded-lg transition-all hover:bg-arcade-darker">
      <div class="flex items-center gap-2">
        <div class="relative">
          <img src="${friend.avatar}" alt="${friend.name}" class="w-10 h-10 rounded-full border-2 ${friend.status === 'online' ? 'border-neon-green' : friend.status === 'pending' ? 'border-neon-orange' : 'border-gray-500'}">
          <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full ${
            friend.status === 'online' ? 'bg-neon-green' : 
            friend.status === 'pending' ? 'bg-neon-orange' : 'bg-gray-500'
          } border border-arcade-darker"></div>
        </div>
        <div>
          <p class="text-white font-medium">${friend.name}</p>
          <p class="text-xs ${
            friend.status === 'online' ? 'text-neon-green' : 
            friend.status === 'pending' ? 'text-neon-orange' : 'text-neon-pink/70'
          }">${friend.status === 'pending' ? 'Solicitação pendente' : friend.status}</p>
        </div>
      </div>
        
        ${friend.status === 'pending' ? `
          <div class="flex gap-2">
            <button class="accept-btn" data-friend-id="${friend.id}">
              <div class="bg-neon-green/20 hover:bg-neon-green/40 text-neon-green p-1 rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
            <button class="reject-btn" data-friend-id="${friend.id}">
              <div class="bg-red-500/20 hover:bg-red-500/40 text-red-500 p-1 rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          </div>
        ` : `
        ${this.props.onRemove ? `
          <button class="remove-btn" data-friend-id="${friend.id}">
            <div class="bg-gray-500/20 hover:bg-gray-500/40 text-gray-400 hover:text-red-500 p-1 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </button>
        ` : ''}
      `}
      </div>
    `).join('');
  }

  private setupEventListeners(): void {
    // Botões de aceitar solicitação
    this.element.querySelectorAll('.accept-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const friendId = (btn as HTMLElement).dataset.friendId;
        if (friendId && this.props.onAccept) {
          this.props.onAccept(friendId);
        }
      });
    });

    // Botões de rejeitar solicitação
    this.element.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const friendId = (btn as HTMLElement).dataset.friendId;
        if (friendId && this.props.onReject) {
          this.props.onReject(friendId);
        }
      });
    });

     // Botões de remover amizade
     this.element.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const friendId = (btn as HTMLElement).dataset.friendId;
        if (friendId && this.props.onRemove) {
          this.props.onRemove(friendId);
        }
      });
    });
  }

  private render(): void {
    this.element.className = 'bg-arcade-darker border border-neon-green rounded-xl p-5 shadow-lg shadow-neon-green/10';
    this.element.innerHTML = `
      <h3 class="text-neon-green text-lg mb-4 font-semibold text-center tracking-wide uppercase">${this.props.title || 'Seus amigos'}</h3>
      <div class="friends-container space-y-2 max-h-80 overflow-y-auto">
        ${this.renderFriendsList(this.props.friends)}
      </div>
    `;
    
    this.setupEventListeners();
  }

  public update(newProps: Partial<FriendsListProps>): void {
    this.props = { ...this.props, ...newProps };
    const friendsContainer = this.element.querySelector('.friends-container');
    if (friendsContainer) {
      friendsContainer.innerHTML = this.renderFriendsList(this.props.friends);
      this.setupEventListeners();
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}