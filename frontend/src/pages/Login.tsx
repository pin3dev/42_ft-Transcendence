import React from 'react';
import AuthLayout from '@components/Layout/AuthLayout';
import LoginForm from '@components/Auth/LoginForm';

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;