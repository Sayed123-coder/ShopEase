import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const userParam = searchParams.get('user');
    console.log('searchParams user:', userParam);
    console.log('Full URL:', window.location.href);

    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('userInfo', JSON.stringify(userData));
        updateUser(userData);
        navigate('/');
      } catch(e) {
        console.error('Parse error:', e);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Logging in with Google... ⏳</p>
    </div>
  );
};

export default GoogleSuccess;