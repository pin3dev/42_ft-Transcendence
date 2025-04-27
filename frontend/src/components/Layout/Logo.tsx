import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <span className="text-2xl font-bold text-primary">Pong</span>
    </div>
  );
};

export default Logo;