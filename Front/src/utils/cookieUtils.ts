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