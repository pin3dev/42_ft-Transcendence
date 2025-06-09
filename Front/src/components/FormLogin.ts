// src/components/FormLogin.ts
import { showToast } from '../utils/toast';
import { render2FAPage } from '../pages/2faPage';

// Interface para tipagem do componente
interface FormLoginConfig {
  parentElement?: HTMLElement;
  onLoginSuccess?: (response?: any) => void; // Permite um argumento opcional
  onLoginError?: (error: string) => void;
  //on2FASuccess?: (userId: number, qrCode?: string) => void;
}

// Classe principal do componente
export class FormLogin {
  private formElement: HTMLDivElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private togglePasswordButton!: HTMLDivElement;
  private loginForm!: HTMLFormElement;

  constructor(private config: FormLoginConfig = {}) {
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
    this.loginForm = this.createLoginForm();
    formContainer.appendChild(this.loginForm);

    // Adiciona footer com link para registro
    //this.addFormFooter(formContainer);

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
    title.textContent = 'Acessar sua Conta';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-center text-gray-300';
    subtitle.textContent = 'Entre com seus dados para acessar a arena';

    headerContainer.appendChild(title);
    headerContainer.appendChild(subtitle);
    container.appendChild(headerContainer);
  }

  // Cria o formulário de login
  private createLoginForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.id = 'login-form';
    form.className = 'space-y-4';

    // Adiciona campo de email
    form.appendChild(this.createEmailInput());

    // Adiciona campo de senha
    form.appendChild(this.createPasswordInput());

    // Adiciona botão de submit
    form.appendChild(this.createSubmitButton());

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
    button.textContent = 'Entrar';
    
    // Adiciona evento de loading durante a requisição
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleLogin(button);
    });
    
    return button;
  }

  private async handleLogin(button: HTMLButtonElement): Promise<void> {
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
      // Fazer login inicial
      const loginResponse = await this.sendLoginRequest(email, password);
      console.log('Resposta do login:', loginResponse);
  
      // Verificar se precisa de 2FA
      if (loginResponse.requires2FA) {
        render2FAPage(loginResponse.qr_code);
      } else {
        this.config.onLoginSuccess?.(loginResponse); // Passa o loginResponse como argumento
      }
    } catch (error) {
      console.error('Erro no login:', error);
      this.config.onLoginError?.(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      // Restaura o botão
      button.disabled = false;
      button.textContent = 'Entrar';
    }
  }

  private async sendLoginRequest(email: string, password: string): Promise<{ requires2FA: boolean; token?: string; qr_code?: string }> {
    console.log('Enviando requisição de login:', { email, password });
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    console.log('Resposta do servidor:', response);

    if (!response.ok) {
      throw new Error('Credenciais inválidas');
    }

    const data = await response.json();
    console.log('Dados retornados pelo servidor:', data);

    return data;
  }

  /*private show2FAPopup(): void {
    // Cria overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';

    // Cria popup
    const popup = document.createElement('div');
    popup.className = 'bg-arcade-darker border-neon-blue border-2 rounded-lg p-6 w-full max-w-md relative';

    // Título
    const title = document.createElement('h3');
    title.className = 'text-xl font-bold text-white neon-text mb-4';
    title.textContent = 'Verificação em Duas Etapas';

    // Input do código
    const codeInput = document.createElement('input');
    codeInput.type = 'text';
    codeInput.placeholder = 'Digite seu código 2FA';
    codeInput.className = 'w-full bg-arcade-dark border-neon-blue border rounded-md px-4 py-2 text-white mb-4';

    // Botão de enviar
    const submitButton = document.createElement('button');
    submitButton.className = 'w-full bg-neon-blue hover:bg-neon-green text-black font-bold py-2 rounded-md';
    submitButton.textContent = 'Enviar';

    // Evento de envio do código 2FA
    submitButton.addEventListener('click', async () => {
      const code = codeInput.value.trim();
      if (!code) {
        showToast('Por favor, digite o código 2FA', 'error');
        return;
      }

      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner"></span>';

      try {
        //await this.verify2FACode(code);
        overlay.remove();
        //this.config.on2FASuccess?.();
      } catch (error) {
        showToast('Código inválido', 'error');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar';
      }
    });

    // Monta a estrutura
    popup.appendChild(title);
    popup.appendChild(codeInput);
    popup.appendChild(submitButton);
    overlay.appendChild(popup);

    // Adiciona ao body
    document.body.appendChild(overlay);

    // Fecha ao clicar fora
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

private async verify2FACode(code: string): Promise<void> {
    const response = await :3000/auth/2fa/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Código inválido');
    }

    const data = await response.json();
    this.config.onLoginSuccess?.(data.token);
  }*/
  

  // Adiciona footer do formulário
  private addFormFooter(container: HTMLElement): void {
    // Footer removido - não há mais links extras
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
    this.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
        // Captura o botão de envio
      const submitButton = this.loginForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      this.handleLogin(submitButton);
    }
  });
  }

  // // Manipula o login normal
  // private handleLogin(): void {
  //   const email = this.emailInput.value;
  //   const password = this.passwordInput.value;
    
  //   if (email && password) {
  //     showToast('Login bem-sucedido!', 'success');
  //     this.config.onLoginSuccess?.();
  //   } else {
  //     showToast('Por favor, preencha todos os campos!', 'error');
  //     this.config.onLoginError?.('Campos obrigatórios não preenchidos');
  //   }
  // }

}

// Função utilitária para facilitar o uso do componente
export function renderLoginForm(parentElement: HTMLElement, config?: FormLoginConfig): FormLogin {
  const formLogin = new FormLogin(config);
  parentElement.appendChild(formLogin.render());
  return formLogin;
}