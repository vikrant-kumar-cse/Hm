/*import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function VerifyRedirect() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      localStorage.setItem('verifiedEmail', email);
      navigate('/signup?step=2');
    }
  }, [email, navigate]);

  return <p>Verifying email... Redirecting to signup page 🔁</p>;
}

export default VerifyRedirect;*/
