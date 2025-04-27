import React from 'react';
import AuthLayout from '@components/Layout/AuthLayout';
import RegisterForm from '@components/Auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;