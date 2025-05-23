
// Toast notification system
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Check if toast container exists, if not create it
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-md shadow-lg flex items-center max-w-xs animate-fade-in transition-all`;
    
    // Set color based on type
    switch (type) {
      case 'success':
        toast.classList.add('bg-neon-green', 'text-black');
        break;
      case 'error':
        toast.classList.add('bg-red-500', 'text-white');
        break;
      case 'info':
        toast.classList.add('bg-neon-blue', 'text-black');
        break;
    }
    
    // Add message
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Remove after timeout
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => {
        toastContainer?.removeChild(toast);
      }, 300);
    }, 3000);
  }
  