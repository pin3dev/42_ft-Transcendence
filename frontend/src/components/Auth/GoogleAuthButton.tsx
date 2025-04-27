import React from 'react';

const GoogleAuthButton: React.FC = () => {
  const handleGoogleLogin = () => {
    // Simulação de login com Google
    // Na implementação real, integraria com a API do Google
    console.log('Attempting Google login');
    // window.location.href = 'API_ENDPOINT/auth/google';
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="#EA4335" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
        </svg>
        Continuar com Google
      </button>
    </div>
  );
};

export default GoogleAuthButton;