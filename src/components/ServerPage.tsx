import { createNextApiHandler } from '@trpc/server/adapters/next';
import React, { useRef, useState } from 'react'
import { trpc } from '../utils/trpc';
import Chatroom from './Chatroom';

interface ServerPageProps {
    Session: string,
    sid: string,
    isServerOwner: boolean
}

const ServerPage = ({Session, sid, isServerOwner}:ServerPageProps) => {
    const ctx = trpc.useContext();
    const [ServerName, setServerName] = useState('');
    const [ServerMessage, setServerMessage] = useState('');
    const [ServerMessageClass, setServerMessageClass] = useState(['','']);
    const [Username, setUsername] = useState('');
    const [UsernameMessage, setUsernameMessage] = useState('');
    const [UsernameMessageClass, setUsernameMessageClass] = useState(['','']);
    const ServerNameRef = useRef<HTMLInputElement>(null);
    const User = trpc.useQuery(['user.FindUserById',{
        uid: Session
    }],{
        staleTime: Infinity,
        enabled: !!Session
    });
    const Server = trpc.useQuery(['server.findServerById',{
        sid:sid
    }],{
        staleTime: Infinity,
        enabled: !!sid
    });
    const CriarServer = trpc.useMutation(['server.createServerForOwnerUser'], {onSuccess:() => ctx.invalidateQueries(['server.findServerById'])});
    const AdicionarUserNoServer = trpc.useMutation(['server.AddUserToServer'], 
        {
            onSuccess: () => {
                ctx.invalidateQueries(['server.findServerById']);
                ctx.invalidateQueries(['user.findUserServers']);
            }
        }
    );
    const regEx = /^[0-9a-zA-Z]+$/;
    const handleSubmit = {
        CriarServer: (e:React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
            e.preventDefault();
            if(ServerName.match(regEx) && ServerName !== ''){
                CriarServer.mutate({
                    uid: Session,
                    name: ServerName
                },{
                    onError: (error) => {
                        setTimeout(() => {
                            setServerMessageClass(['',''])
                            setServerMessage('');
                        },15000)
                        setServerMessageClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                        setServerMessage(error.message);
                        setServerName('');
                        ServerNameRef.current?.focus();
                    },
                    onSuccess: (data) => {
                        if(User.data){
                            AdicionarUserNoServer.mutate({
                                sid: sid,
                                name: User.data.username
                            });
                        }
                        setServerMessageClass(['alert alert-success shadow-lg', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z']);
                        setServerMessage(data);
                        setServerName('');
                    }
                })
            } else {
                setTimeout(() => {
                    setServerMessageClass(['',''])
                    setServerMessage('');
                },15000)
                setServerMessageClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                setServerMessage('Digite um nome válido.');
                setServerName('');
            }
        },
        AdicionarUser: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if(Username !== ''){
                AdicionarUserNoServer.mutate({
                    sid: sid,
                    name: Username
                },{
                    onError: (error) => {
                        setTimeout(() => {
                            setUsernameMessageClass(['',''])
                            setUsernameMessage('');
                        },5000)
                        setUsernameMessageClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                        setUsernameMessage(error.message);
                        setUsername('');
                    },
                    onSuccess: (data) => {
                        setTimeout(() => {
                            setUsernameMessageClass(['',''])
                            setUsernameMessage('');
                        },5000)
                        setUsernameMessageClass(['alert alert-success shadow-lg', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z']);
                        setUsernameMessage(data);
                        setUsername('');
                    }
                });
            } else {
                setTimeout(() => {
                    setUsernameMessageClass(['',''])
                    setUsernameMessage('');
                },5000)
                setUsernameMessageClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                setUsernameMessage('Digite um nome válido.');
                setUsername('');
            }
        }
    }
    const handleClick = {

    }
    const handleChange = {
        ServerName: (e:React.ChangeEvent<HTMLInputElement>) => {
            setServerName(e.target.value);
        },
        Username: (e:React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
        }
    }
    if(!Server.data){
        return (
            <div className='hero h-full overflow-hidden bg-base-200'>
                <div className='hero-content break-words lg:min-w-fit text-center'>
                    <div className='flex flex-col items-center'>
                        {isServerOwner && (
                            <>
                                <h1 className='text-5xl font-bold lg:min-w-max'>Meu servidor ainda não existe...</h1>
                                <form className='form-control items-center w-full max-w-xs' onSubmit={(e) => handleSubmit.CriarServer(e)}>
                                    <input ref={ServerNameRef} value={ServerName} type='text' placeholder='Digite o nome do servidor' className='input input-bordered w-full max-w-xs mt-3' onChange={(e) => handleChange.ServerName(e)}/>
                                    <button className='btn btn-primary max-w-fit m-3' onSubmit={(e) => handleSubmit.CriarServer(e)}>Criar meu servidor</button>
                                </form>
                                <div className={ServerMessageClass[0]}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={ServerMessageClass[1]} /></svg>
                                        <span>{ServerMessage}</span>
                                    </div>
                                </div>
                            </>
                        )}
                        {!isServerOwner && (
                            <h1 className='text-5xl min-w-max font-bold'>Servidor não encontrado!</h1>
                        )}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='flex flex-row-reverse overflow-hidden h-full w-full'>
            <div className='w-[15rem] h-full flex flex-col bg-neutral'>
                <ul className='w-full overflow-y-auto flex-1 text-center p-2'>
                    Usuários conectados:
                    {Server.data.connectedUsers.map((User, Index) => 
                        <li key={Index} className='p-1 break-all'>{User.username}</li>
                    )}
                </ul>
                {isServerOwner && (
                    <form className='form-control flex-none p-5' onSubmit={(e) => handleSubmit.AdicionarUser(e)}>
                        <div className={UsernameMessageClass[0] + ' mb-2'}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={UsernameMessageClass[1]} /></svg>
                                <span>{UsernameMessage}</span>
                            </div>
                        </div>
                        <input className='input' type='text' value={Username} placeholder='nome' onChange={(e) => handleChange.Username(e)}/>
                        <label className='label label-text-alt justify-center'>Adicionar usuário ao server</label>
                    </form>
                )}
            </div>
            <Chatroom uid={Session} sid={sid}/>
        </div>
        
    );
}

export default ServerPage;