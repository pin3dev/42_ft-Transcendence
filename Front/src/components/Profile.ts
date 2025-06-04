// src/components/profile-section.ts

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
    <div class="flex items-center space-x-6 mt-12">
        <div class="w-24 h-24 rounded-full border-4 border-neon-blue overflow-hidden">
          <img
            src="${userStats.avatar}"
            alt="${userStats.name}"
            class="w-full h-full object-cover"
          />
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
    </div>
    <div class="flex justify-center mt-6">
      <button
        class="play-button bg-neon-green text-black px-8 py-3 rounded-lg text-lg font-bold hover:bg-opacity-80 transition-all animate-pulse-neon"
      >
        PLAY
      </button>
    </div>
  `;

  // Adiciona o event listener ao botão
  const button = this.element.querySelector('.play-button');
  if (button) {
    button.addEventListener('click', onPlay);
  }
}
// ...existing code...

  public getElement(): HTMLElement {
    return this.element;
  }

  public update(newProps: Partial<ProfileSectionProps>): void {
    this.props = { ...this.props, ...newProps };
    this.render();
  }
}