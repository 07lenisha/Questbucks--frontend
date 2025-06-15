import { useState } from "react"; 
import { isEmail } from 'validator';
import { useNavigate } from 'react-router-dom'; 
import axios from "../Config/axios";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [role, setRole] = useState(''); 
    const [clientErrors, setClientErrors] = useState({}); 
    const [serverErrors, setServerErrors] = useState([]); 
    
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        const errors = {}; 

        
        if (name.trim().length === 0) {
            errors.name = 'Name is required';
        }

        if (email.trim().length === 0) {
            errors.email = 'Email is required'; 
        } else if (!isEmail(email)) {
            errors.email = 'Email is invalid'; 
        }

        if (password.trim().length === 0) {
            errors.password = 'Password is required'; 
        } else if (password.trim().length < 8 || password.trim().length > 128) {
            errors.password = 'Password should be between 8 to 128 characters'; 
        }

        if (Object.keys(errors).length > 0) {
            setClientErrors(errors); 
        } else {
            const formData = {
                name,
                email,
                password,
                role
            };

            try {
                const response = await axios.post('/register', formData);
                console.log(response.data); 
                navigate('/login'); 
            } catch (err) {
                setServerErrors(err.response?.data?.errors ); 
                setClientErrors({}); 
            }
        }
    }
return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-3xl w-full max-w-lg bg-gray-200">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register with Us</h2>

                {serverErrors?.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                        <h3 className="font-semibold">These error(s) prohibited the form from being saved:</h3>
                        <ul className="list-disc list-inside">
                            {serverErrors.map((err, i) => (
                                <li key={i}>{err.msg || err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700">Enter Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            id="name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {clientErrors.name && <p className="text-sm text-red-600">{clientErrors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700">Enter Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            id="email"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {clientErrors.email && <p className="text-sm text-red-600">{clientErrors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700">Enter Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            id="password"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {clientErrors.password && <p className="text-sm text-red-600">{clientErrors.password}</p>}
                    </div>

                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id="user"
                                name="role"
                                checked={role === 'user'}
                                onChange={() => setRole("user")}
                                className="w-4 h-4 text-blue-500"
                            />
                            <span className="text-gray-700">User</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id="company"
                                name="role"
                                checked={role === 'company'}
                                onChange={() => setRole("company")}
                                className="w-4 h-4 text-blue-500"
                            />
                            <span className="text-gray-700">Company</span>
                        </label>
                    </div>
                    {clientErrors.role && <p className="text-sm text-red-600">{clientErrors.role}</p>}

                    <div>
                        <input
                            type="submit"
                            value="Register"
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
                        />
                    </div>
                </form>
            </div>
            </div>
        
    );
}
