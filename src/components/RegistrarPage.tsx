import React, { useEffect, useRef, useState } from 'react'
import { trpc } from '../utils/trpc';

interface RegistrarPageProps {

}

const RegistrarPage = ({}:RegistrarPageProps) => {
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmarPassword, setConfirmarPassword] = useState('');
    const [RegistrarMessage, setRegistrarMessage] = useState('');
    const [RegistrarMessageClass, setRegistrarMessageClass] = useState(['','']);
    const UsernameRef = useRef<HTMLInputElement>(null);
    const PasswordRef = useRef<HTMLInputElement>(null);
    const ConfirmarPasswordRef = useRef<HTMLInputElement>(null);
    const RegistrarUsuario = trpc.useMutation(['user.registerUser']);
    const regEx = /^[0-9a-zA-Z]+$/;
    useEffect(() => {
        UsernameRef.current?.focus();
    }, [])
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
        e.preventDefault();
        if(Username.match(regEx) && Password.match(regEx)){
            if(Password === ConfirmarPassword){
                RegistrarUsuario.mutate({
                    username: Username,
                    password: Password
                },{
                    onError: (error) => {
                        setTimeout(() => {
                            setRegistrarMessageClass(['',''])
                            setRegistrarMessage('');
                        },15000)
                        setRegistrarMessageClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                        setRegistrarMessage(error.message);
                        setUsername('');
                        UsernameRef.current?.focus();
                    },
                    onSuccess: (data) => {
                        setRegistrarMessageClass(['alert alert-success shadow-lg', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z']);
                        setRegistrarMessage(data);
                        setUsername('');
                        setPassword('');
                        setConfirmarPassword('');
                        setTimeout(() => {
                            window.location.reload();
                        },2000)
                    }
                })
            } else {
                setTimeout(() => {
                    setRegistrarMessageClass(['',''])
                    setRegistrarMessage('');
                },15000)
                setRegistrarMessageClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                setRegistrarMessage('Passwords diferentes!');
                setPassword('');
                setConfirmarPassword('');
            }
        } else {
            setTimeout(() => {
                setRegistrarMessageClass(['',''])
                setRegistrarMessage('');
            },15000)
            setRegistrarMessageClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
            setRegistrarMessage('Apenas letras e números!');
            setUsername('');
            setPassword('');
            setConfirmarPassword('');
        }
    }
    const handleChange = {
        Username : (e:React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.currentTarget.value)
        },
        Password : (e:React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.currentTarget.value)
        },
        ConfirmarPassword : (e:React.ChangeEvent<HTMLInputElement>) => {
            setConfirmarPassword(e.currentTarget.value)
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
            } else if(e.key === 'ArrowDown'){
                ConfirmarPasswordRef.current?.focus()
            }
        },
        ConfirmarPassword : (e:React.KeyboardEvent<HTMLInputElement>) => {
            if(e.key === 'ArrowUp'){
                PasswordRef.current?.focus()
            }
        }
    }
    return (
        <div className='hero-overlay overflow-hidden w-full h-full flex justify-center items-center bg-opacity-60'>
            <div className='card flex-shrink-0 items-center w-full max-w-sm shadow-2xl bg-base-100'>
                <div className='hero-content flex-col'>
                    <div className='text-center lg:text-left'>
                        <h1 className='text-5xl font-bold text-center'>Registrar</h1>
                        <p className='pt-3 text-center'>Registre-se, é necessário somente nome e senha!</p>
                    </div>
                </div>
                <form className='form-control w-full max-w-xs' onSubmit={(e) => handleSubmit(e)}>
                    <div className={RegistrarMessageClass[0]}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={RegistrarMessageClass[1]} /></svg>
                            <span>{RegistrarMessage}</span>
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
                        autoComplete='new-password' 
                        value={Password} 
                        placeholder='Digite a senha' 
                        className='input input-bordered w-full max-w-ws'
                        onChange={(e) => handleChange.Password(e)}
                        onKeyDown={(e) => handleKeydown.Password(e)}
                    />
                    <label className='label'>
                        <span className='label-text'>Confirmar Password:</span>
                    </label>
                    <input 
                        ref={ConfirmarPasswordRef}
                        type='password' 
                        autoComplete='new-password'
                        value={ConfirmarPassword} 
                        placeholder='Digite a senha novamente' 
                        className='input input-bordered w-full max-w-ws'
                        onChange={(e) => handleChange.ConfirmarPassword(e)}
                        onKeyDown={(e) => handleKeydown.ConfirmarPassword(e)}
                    />
                    <label className='label label-text-alt justify-center underline'>
                        <span className='label-text pt-1'>Apenas letras e números.</span>
                    </label>
                    <div className='flex flex-col mt-4'>
                        <button className='btn btn-primary mb-9' onSubmit={(e) => handleSubmit(e)}>
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegistrarPage;