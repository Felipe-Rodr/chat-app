import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { trpc } from '../utils/trpc';

interface LoginPageProps {
    
}

const LoginPage = ({}:LoginPageProps) => {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [LoginMessage, setLoginMessage] = useState('');
    const [LoginMessageClass, setLoginMessageClass] = useState(['','']);
    const UsernameRef = useRef<HTMLInputElement>(null);
    const PasswordRef = useRef<HTMLInputElement>(null);
    const LoginUsuario = trpc.useMutation(['user.LoginUser']);
    useEffect(() => {
        UsernameRef.current?.focus();
    }, [])
    const handleSubmit = (e:React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();
        LoginUsuario.mutate({
            username: Username,
            password: Password
        },{
            onError: (error) => {
                setTimeout(() => {
                    setLoginMessageClass(['',''])
                    setLoginMessage('');
                },15000)
                setLoginMessageClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                setLoginMessage(error.message);
                setUsername('');
                setPassword('');
                UsernameRef.current?.focus();
            },
            onSuccess: (data) => {
                setLoginMessageClass(['alert alert-success shadow-lg', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z']);
                setLoginMessage(data);
                setTimeout(() => {
                    window.location.reload();
                },2000)
            }
        })
    }
    const handleChange = {
        Username : (e:React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.currentTarget.value)
        },
        Password : (e:React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.currentTarget.value)
        },
    }
    const handleKeydown = {
        Username : (e:React.KeyboardEvent<HTMLInputElement>) => {
            if(e.key === 'ArrowDown'){
                PasswordRef.current?.focus()
            }
        },
        Password : (e:React.KeyboardEvent<HTMLInputElement>) => {
            if(e.key === 'ArrowUp'){
                UsernameRef.current?.focus()
            }
        }
    }
    return (
        <div className='hero-overlay overflow-hidden w-full h-full flex justify-center items-center bg-opacity-60'>
            <div className='card flex-shrink-0 items-center w-full max-w-sm shadow-2xl bg-base-100'>
                <div className='hero-content flex-col'>
                    <div className='text-center lg:text-left'>
                        <h1 className='text-5xl font-bold text-center'>Login</h1>
                        <p className='pt-3'>Faça o login para começar</p>
                    </div>
                </div>
                <form className='form-control w-full max-w-xs' onSubmit={(e) => handleSubmit(e)}>
                    <div className={LoginMessageClass[0]}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={LoginMessageClass[1]} /></svg>
                            <span>{LoginMessage}</span>
                        </div>
                    </div>
                    <label className='label'>
                        <span className='label-text'>Username:</span>
                    </label>
                    <input 
                        ref={UsernameRef}
                        type='text'
                        autoComplete='username' 
                        value={Username} 
                        placeholder='Digite seu nome de usuário' 
                        className='input input-bordered w-full max-w-ws'
                        onChange={(e) => handleChange.Username(e)}
                        onKeyDown={(e) => handleKeydown.Username(e)}
                    />
                    <label className='label'>
                        <span className='label-text'>Password:</span>
                    </label>
                    <input 
                        ref={PasswordRef}
                        type='password'
                        autoComplete='current-password' 
                        value={Password} 
                        placeholder='Digite a senha' 
                        className='input input-bordered w-full max-w-ws'
                        onChange={(e) => handleChange.Password(e)}
                        onKeyDown={(e) => handleKeydown.Password(e)}
                    />
                    <label className='label'>
                        <span className='link label-text-alt hover:cursor-pointer'>Esqueceu a senha?</span>
                        <Link href='/Registrar'>
                            <label className='link label-text-alt hover:cursor-pointer'>
                                Registre-se
                            </label>
                        </Link>
                    </label>
                    <div className='flex flex-col mt-6'>
                        <button className='btn btn-primary mb-9' onSubmit={(e) => handleSubmit(e)}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default LoginPage;