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
    this.element.className = 'bg-arcade-darker border-2 border-neon-green rounded-lg p-4';
    this.element.innerHTML = `
      <h3 class="text-neon-green text-xl mb-4 text-center">Seus amigos</h3>
      <div class="friends-container space-y-2 max-h-80 overflow-y-auto">
        ${this.renderFriendsList(this.props.friends)}
      </div>
    `;
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

  public update(newProps: Partial<FriendsListProps>): void {
    this.props = { ...this.props, ...newProps };
    const friendsContainer = this.element.querySelector('.friends-container');
    if (friendsContainer) {
      friendsContainer.innerHTML = this.renderFriendsList(this.props.friends);
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}