import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-secondary">
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-primary">Welcome back</h1>
                        <p className="text-slate-600">
                            Enter your details to access your personal library.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Input
                            id="email"
                            label="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                            disabled={loading}
                        />

                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-slate-600">Don't have an account? </span>
                            <Link to="/signup" className="font-medium text-accent hover:text-accent-hover">
                                Sign up for free
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-900 opacity-90"></div>
                <div className="relative z-10 text-center px-12">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Your Personal Library, Reimagined.
                    </h2>
                    <p className="text-blue-100 text-lg max-w-md mx-auto">
                        Track your reading journey, discover new favorites, and build the collection of your dreams.
                    </p>
                </div>
                {/* Abstract decorative circles */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>
        </div>
    );
};

export default Login;
