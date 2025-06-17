/**
 * Define um cookie com nome, valor e opções.
 * @param name Nome do cookie
 * @param value Valor do cookie
 * @param options Opções como `expires`, `path`, etc.
 */
export function setCookie(name: string, value: string, options: { expires?: number | Date; path?: string } = {}): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
    if (options.expires) {
      const expires = options.expires instanceof Date
        ? options.expires.toUTCString()
        : new Date(Date.now() + options.expires * 1000).toUTCString();
      cookieString += `; expires=${expires}`;
    }
  
    if (options.path) {
      cookieString += `; path=${options.path}`;
    }
  
    document.cookie = cookieString;
  }
  
  /**
   * Obtém o valor de um cookie pelo nome.
   * @param name Nome do cookie
   * @returns Valor do cookie ou `null` se não encontrado.
   */
  export function getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === encodeURIComponent(name)) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  
  /**
   * Remove um cookie pelo nome.
   * @param name Nome do cookie
   * @param path Caminho do cookie (opcional).
   */
  export function deleteCookie(name: string, path?: string): void {
    setCookie(name, '', { expires: -1, path });
  }
  
  /**
   * Obtém o JWT token do cookie (mesmo sendo HTTP-only em alguns browsers pode ser acessível via JS)
   * @returns Token JWT ou null se não encontrado
   */
  export function getJWTFromCookie(): string | null {
    return getCookie('jwt');
  }
  
  /**
   * Decodifica um JWT token para extrair o payload (sem verificar assinatura)
   * ATENÇÃO: Esta função não verifica a validade ou assinatura do token!
   * @param token JWT token
   * @returns Payload decodificado ou null se inválido
   */
  export function decodeJWTPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const payload = parts[1];
      // Adiciona padding se necessário
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decoded = atob(paddedPayload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erro ao decodificar JWT:', error);
      return null;
    }
  }
  
  /**
   * Extrai e armazena dados de autenticação do JWT no localStorage
   * Esta função deve ser chamada após login bem-sucedido
   */
  export function extractAndStoreAuthData(): boolean {
    try {
      const jwtToken = getJWTFromCookie();
      if (!jwtToken) {
        console.warn('JWT não encontrado no cookie');
        return false;
      }
  
      const payload = decodeJWTPayload(jwtToken);
      if (!payload) {
        console.warn('Não foi possível decodificar o JWT');
        return false;
      }
  
      // Armazena o token e o user_id no localStorage
      localStorage.setItem('userToken', jwtToken);
      if (payload.user_id) {
        localStorage.setItem('user_id', payload.user_id.toString());
      }
  
      //console.logog('✅ Dados de autenticação extraídos e armazenados:', {
      //   user_id: payload.user_id,
      //   email: payload.email,
      //   hasToken: !!jwtToken
      // });
  
      return true;
    } catch (error) {
      console.error('Erro ao extrair dados de autenticação:', error);
      return false;
    }
  }