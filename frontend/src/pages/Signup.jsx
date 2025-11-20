import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.signup(formData.username, formData.email, formData.password);
            if (data.token && data.user) {
                login(data.token, data.user);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-secondary">
                <div className="w-full max-w-md mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-primary">Create an account</h1>
                        <p className="text-slate-600">
                            Start your reading journey with Booklog today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Input
                            id="username"
                            label="Username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            required
                            disabled={loading}
                        />

                        <Input
                            id="email"
                            label="Email address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                            disabled={loading}
                        />

                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            required
                            disabled={loading}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign up'}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-slate-600">Already have an account? </span>
                            <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-900 opacity-90"></div>
                <div className="relative z-10 text-center px-12">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Join the Community
                    </h2>
                    <p className="text-blue-100 text-lg max-w-md mx-auto">
                        Connect with fellow book lovers and share your reading adventures.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>
        </div>
    );
};

export default Signup;
