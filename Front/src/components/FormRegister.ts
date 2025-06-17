// src/components/FormLogin.ts
import { showToast } from '../utils/toast';

// Interface para tipagem do componente
interface FormRegisterConfig {
  parentElement?: HTMLElement;
  onRegisterSuccess?: () => void;
  onRegisterError?: (error: string) => void;
}

// Classe principal do componente
export class FormRegister {
  private formElement: HTMLDivElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private togglePasswordButton!: HTMLDivElement;
  private RegisterForm!: HTMLFormElement;

  constructor(private config: FormRegisterConfig = {}) {
    this.formElement = this.createFormStructure();
    this.setupEventListeners();
  }

  // Método para renderizar o formulário
  public render(): HTMLElement {
    return this.formElement;
  }

  // Cria a estrutura base do formulário
  private createFormStructure(): HTMLDivElement {
    const formContainer = document.createElement('div');
    formContainer.className = 'w-full max-w-md border-neon-blue bg-arcade-darker relative overflow-hidden rounded-md p-6';

    // Adiciona elementos decorativos
    this.addDecorativeElements(formContainer);

    // Adiciona título e subtítulo
    this.addFormHeader(formContainer);

    // Cria o formulário principal
    this.RegisterForm = this.createRegisterForm();
    formContainer.appendChild(this.RegisterForm);

    return formContainer;
  }

  // Adiciona elementos decorativos de fundo
  private addDecorativeElements(container: HTMLElement): void {
    const decorators = [
      { className: 'absolute inset-0 bg-arcade-grid opacity-20 pointer-events-none' },
      { className: 'absolute -top-24 -right-24 w-48 h-48 bg-neon-pink rounded-full filter blur-3xl opacity-20 animate-pulse-neon' },
      { className: 'absolute -bottom-24 -left-24 w-48 h-48 bg-neon-blue rounded-full filter blur-3xl opacity-20 animate-pulse-neon' }
    ];

    decorators.forEach(decor => {
      const element = document.createElement('div');
      element.className = decor.className;
      container.appendChild(element);
    });
  }

  // Adiciona cabeçalho do formulário
  private addFormHeader(container: HTMLElement): void {
    const headerContainer = document.createElement('div');
    headerContainer.className = 'relative mb-6';

    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold text-center text-white neon-text';
    title.textContent = 'Novo Jogador';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-center text-gray-300';
    subtitle.textContent = 'Preencha os dados';

    headerContainer.appendChild(title);
    headerContainer.appendChild(subtitle);
    container.appendChild(headerContainer);
  }

  // Cria o formulário de login
  private createRegisterForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.id = 'login-form';
    form.className = 'space-y-4';

    // Adiciona campo de email
    form.appendChild(this.createEmailInput());

    // Adiciona campo de senha
    form.appendChild(this.createPasswordInput());


    // Adiciona botão de submit
    form.appendChild(this.createSubmitButton());

    // Adiciona divisão "ou continue com"
    form.appendChild(this.createDivider());


    return form;
  }

  // Cria campo de email
  private createEmailInput(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'space-y-1';

    const label = document.createElement('label');
    label.htmlFor = 'email';
    label.className = 'text-sm text-gray-300';
    label.textContent = 'Email';

    const inputContainer = document.createElement('div');
    inputContainer.className = 'relative';

    // Ícone de email
    const emailIcon = this.createSvgIcon('email');
    inputContainer.appendChild(emailIcon);

    // Input de email
    this.emailInput = document.createElement('input');
    this.emailInput.id = 'email';
    this.emailInput.type = 'email';
    this.emailInput.placeholder = 'seu-email@exemplo.com';
    this.emailInput.className = 'flex h-10 w-full rounded-md border border-neon-blue bg-arcade-dark px-3 pl-9 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:border-neon-green disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-white';
    this.emailInput.required = true;

    inputContainer.appendChild(this.emailInput);
    container.appendChild(label);
    container.appendChild(inputContainer);

    return container;
  }

  // Cria campo de senha
  private createPasswordInput(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'space-y-1';

    const label = document.createElement('label');
    label.htmlFor = 'password';
    label.className = 'text-sm text-gray-300';
    label.textContent = 'Senha';

    const inputContainer = document.createElement('div');
    inputContainer.className = 'relative';

    // Ícone de cadeado
    const lockIcon = this.createSvgIcon('lock');
    inputContainer.appendChild(lockIcon);

    // Input de senha
    this.passwordInput = document.createElement('input');
    this.passwordInput.id = 'password';
    this.passwordInput.type = 'password';
    this.passwordInput.placeholder = '••••••••';
    this.passwordInput.className = 'flex h-10 w-full rounded-md border border-neon-blue bg-arcade-dark px-3 pl-9 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:border-neon-green disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-white';
    this.passwordInput.required = true;

    // Botão para mostrar/esconder senha
    this.togglePasswordButton = document.createElement('div');
    this.togglePasswordButton.className = 'absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer';
    this.togglePasswordButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 hover:text-white eye-icon">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;

    inputContainer.appendChild(this.passwordInput);
    inputContainer.appendChild(this.togglePasswordButton);
    container.appendChild(label);
    container.appendChild(inputContainer);

    return container;
  }

  private createSubmitButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'w-full bg-neon-blue hover:bg-neon-green text-black font-bold transition-all duration-300 py-2 rounded-md h-10';
    button.textContent = 'Registrar';
    
    // Adiciona evento de loading durante a requisição
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleRegister(button);
    });
    
    return button;
  }

  private async handleRegister(button: HTMLButtonElement): Promise<void> {
    const email = this.emailInput.value;
    const password = this.passwordInput.value;

    if (!email || !password) {
      showToast('Por favor, preencha todos os campos!', 'error');
      return;
    }

    // Mostra estado de loading
    button.disabled = true;
    button.innerHTML = '<span class="loading-spinner"></span>';

    try {
      // 1. Fazer login inicial
      const RegisterResponse = await this.sendRegisterRequest(email, password);
      
      // 2. Verificar se precisa de 2FA
      if (RegisterResponse) {
        this.config.onRegisterSuccess?.();
      } else {
        showToast('Não foi possível realizar o registro', 'error');
      }
    } catch (error) {
      // console.error('Erro no registro:', error);
      showToast(error instanceof Error ? error.message : 'Erro desconhecido', 'error');
    } finally {
      // Restaura o botão
      button.disabled = false;
      button.textContent = 'Entrar';
    }
  }

  private async sendRegisterRequest(email: string, password: string) {
    // //console.log('Enviando dados para registro:', { email, password });
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      // console.error('Erro recebido do backend:', error);
      if (error.error && error.error.includes("Email já cadastrado")) {
        throw new Error('Este e-mail já está registrado. Por favor, use outro.');
      }
      throw new Error(error.message || 'Erro ao registrar');
    }

    const data = await response.json();

    // //console.log('User ID:', data.user_id);
    // //console.log('Message:', data.message);
    // //console.log('QR Code:', data.qr_code);

    return data;
  }


  // Cria divisão
  private createDivider(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'relative flex items-center justify-center';

    const line1 = document.createElement('div');
    line1.className = 'h-px bg-gray-600 flex-grow';
    
    container.appendChild(line1);


    return container;
  }

  // Factory method para criar ícones SVG
  private createSvgIcon(type: 'email' | 'lock'): HTMLElement {
    const svgNS = 'http://www.w3.org/2000/svg';
    const container = document.createElement('div');
    container.className = 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none';

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('xmlns', svgNS);
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('class', 'text-gray-400');

    if (type === 'email') {
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('width', '20');
      rect.setAttribute('height', '16');
      rect.setAttribute('x', '2');
      rect.setAttribute('y', '4');
      rect.setAttribute('rx', '2');

      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7');

      svg.appendChild(rect);
      svg.appendChild(path);
    } else if (type === 'lock') {
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('width', '18');
      rect.setAttribute('height', '11');
      rect.setAttribute('x', '3');
      rect.setAttribute('y', '11');
      rect.setAttribute('rx', '2');
      rect.setAttribute('ry', '2');

      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'M7 11V7a5 5 0 0 1 10 0v4');

      svg.appendChild(rect);
      svg.appendChild(path);
    }

    container.appendChild(svg);
    return container;
  }

  // Configura os event listeners
  private setupEventListeners(): void {
    // Toggle password visibility
    this.togglePasswordButton.addEventListener('click', () => {
      const type = this.passwordInput.type === 'password' ? 'text' : 'password';
      this.passwordInput.type = type;
      
      const eyeIcon = this.togglePasswordButton.querySelector('.eye-icon');
      if (eyeIcon) {
        if (type === 'password') {
          eyeIcon.innerHTML = '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>';
        } else {
          eyeIcon.innerHTML = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line>';
        }
      }
    });

    // Form submission
    this.RegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Captura o botão de envio
      const submitButton = this.RegisterForm.querySelector('button[type="submit"]') as HTMLButtonElement;

      // Chama handleRegister com o botão
      if (submitButton) {
        this.handleRegister(submitButton);
    }
    });

  }

}

// Função utilitária para facilitar o uso do componente
export function renderRegisterForm(parentElement: HTMLElement, config?: FormRegisterConfig): FormRegister {
  const formRegister = new FormRegister(config);
  parentElement.appendChild(formRegister.render());
  return formRegister;
}