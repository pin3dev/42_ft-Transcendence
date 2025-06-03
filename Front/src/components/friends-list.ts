// src/components/friends-list.ts

export interface Friend {
  id: number;
  name: string;
  status: 'online' | 'offline';
  avatar: string;
}

interface FriendsListProps {
  friends: Friend[];
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
  private render(): void {
    const filteredFriends = this.props.friends.filter(friend =>
      friend.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.element.className = 'bg-arcade-darker border-2 border-neon-green rounded-lg p-4';
    this.element.innerHTML = `
      <h3 class="text-neon-green text-xl mb-4 text-center">Find Friend</h3>
      
      <div class="relative mb-4">
        <input
          type="text"
          placeholder="Search friends..."
          class="search-input w-full bg-arcade-darkPurple border border-neon-green rounded px-3 py-2 text-white text-sm pr-10"
        />
        <div class="search-icon absolute right-3 top-2.5 text-neon-green w-4 h-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
      </div>
      
      <div class="friends-container space-y-2 max-h-80 overflow-y-auto">
        ${this.renderFriendsList(filteredFriends)}
      </div>
    `;

    // Adiciona event listeners
    const searchInput = this.element.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = (e.target as HTMLInputElement).value;
        this.updateFriendsList();
      });
    }
  }

  private renderFriendsList(friends: Friend[]): string {
    if (friends.length > 0) {
      return friends.map(friend => `
        <div class="friend-item flex items-center justify-between bg-arcade-darkPurple p-3 rounded border border-neon-green" data-id="${friend.id}">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <img
                src="${friend.avatar}"
                alt="${friend.name}"
                class="w-8 h-8 rounded-full border border-neon-blue"
              />
              <div class="status-indicator absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-arcade-darker ${
                friend.status === 'online' ? 'bg-neon-green' : 'bg-gray-500'
              }"></div>
            </div>
            <span class="text-white text-sm">${friend.name}</span>
          </div>
          
          <div class="status-dot w-3 h-3 rounded-full ${
            friend.status === 'online' ? 'bg-neon-green' : 'bg-gray-500'
          }"></div>
        </div>
      `).join('');
    } else if (this.searchTerm) {
      return '<div class="text-center text-neon-green py-8">No friends found</div>';
    } else {
      return '<div class="text-center text-neon-green py-8">N/A</div>';
    }
  }

  private updateFriendsList(): void {
    const filteredFriends = this.props.friends.filter(friend =>
      friend.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    
    const friendsContainer = this.element.querySelector('.friends-container');
    if (friendsContainer) {
      friendsContainer.innerHTML = this.renderFriendsList(filteredFriends);
    }
  }

  public update(newProps: Partial<FriendsListProps>): void {
    this.props = { ...this.props, ...newProps };
    this.updateFriendsList();
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}