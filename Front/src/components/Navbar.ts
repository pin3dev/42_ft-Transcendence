import { navigateTo } from '../router/index';

export function createNavbar(): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'border-b border-neon-blue bg-arcade-darker py-4 px-6';
  
  const container = document.createElement('div');
  container.className = 'container mx-auto flex justify-between items-center';
  
  // Logo
  const logo = document.createElement('a');
  logo.className = 'flex items-center gap-2 cursor-pointer';
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/');
  });
  
  const logoIcon = document.createElement('div');
  logoIcon.className = 'text-neon-pink';
  logoIcon.innerHTML = `<img src="../public/joystick.png" width="24" height="24" alt="Joystick Icon">`;
  
  const logoText = document.createElement('span');
  logoText.className = 'font-bold text-xl md:text-2xl text-white neon-text';
  logoText.innerHTML = 'Ping Pong';
  
  logo.appendChild(logoIcon);
  logo.appendChild(logoText);
  
  // Desktop navigation
  const desktopNav = document.createElement('div');
  desktopNav.className = 'hidden md:flex items-center gap-6';
  
  // const navItems = [
  //   { }
  // ];
  
  // navItems.forEach(item => {
  //   const navLink = document.createElement('a');
  //   navLink.className = 'text-white hover:text-neon-green transition-colors cursor-pointer';
  //   navLink.textContent = item.text;
  //   navLink.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     navigateTo(item.path);
  //   });
  //   desktopNav.appendChild(navLink);
  // });
  
  // Auth buttons
  const authButtons = document.createElement('div');
  authButtons.className = 'hidden md:flex gap-3';
  
  const loginBtn = document.createElement('button');
  loginBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker px-4 py-2 rounded border';
  loginBtn.textContent = 'Login';
  loginBtn.addEventListener('click', ()=> navigateTo('/Login'))
  
  const registerBtn = document.createElement('button');
  registerBtn.className = 'bg-neon-pink text-arcade-darker hover:bg-neon-purple hover:text-white px-4 py-2 rounded';
  registerBtn.textContent = 'Registrar';
  registerBtn.addEventListener('click', ()=> navigateTo('/Register'))
  
  authButtons.appendChild(loginBtn);
  authButtons.appendChild(registerBtn);
  
  // Mobile menu button
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'md:hidden text-white p-2';
  mobileMenuBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>`;
  
  // Mobile menu functionality
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'md:hidden absolute top-16 left-0 right-0 bg-arcade-dark border-b border-neon-blue z-50 hidden';
  
  const mobileNavContent = document.createElement('div');
  mobileNavContent.className = 'flex flex-col p-4 space-y-3';
  
  // navItems.forEach(item => {
  //   const mobileLink = document.createElement('a');
  //   mobileLink.className = 'text-white hover:text-neon-green p-2 transition-colors cursor-pointer';
  //   mobileLink.textContent = item.text;
  //   mobileLink.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     navigateTo(item.path);
  //     mobileMenu.classList.add('hidden');
  //   });
  //   mobileNavContent.appendChild(mobileLink);
  // });
  
  const mobileBtns = document.createElement('div');
  mobileBtns.className = 'pt-3 flex gap-2';
  
  const mobileLoginBtn = document.createElement('button');
  mobileLoginBtn.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker w-1/2 px-3 py-1 rounded border text-sm';
  mobileLoginBtn.textContent = 'Login';
  mobileLoginBtn.addEventListener('click', ()=> navigateTo('/Login'))
  
  const mobileRegisterBtn = document.createElement('button');
  mobileRegisterBtn.className = 'bg-neon-pink text-arcade-darker hover:bg-neon-purple hover:text-white w-1/2 px-3 py-1 rounded text-sm';
  mobileRegisterBtn.textContent = 'Registrar';
  mobileRegisterBtn.addEventListener('click', ()=> navigateTo('/Register'))
  
  mobileBtns.appendChild(mobileLoginBtn);
  mobileBtns.appendChild(mobileRegisterBtn);
  mobileNavContent.appendChild(mobileBtns);
  mobileMenu.appendChild(mobileNavContent);
  
  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  
  // Montar navbar
  container.appendChild(logo);
  container.appendChild(desktopNav);
  container.appendChild(authButtons);
  container.appendChild(mobileMenuBtn);
  
  nav.appendChild(container);
  nav.appendChild(mobileMenu);
  
  return nav;
}
