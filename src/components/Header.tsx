import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { trpc } from '../utils/trpc';

interface HeaderProps {
    Session: string | null,
    Page: "Login" | "Registrar" | "Home" | "Profile" | "MeuServer" | null
}

const Header = ({Session, Page}:HeaderProps) => {
    const DesconectarUsuario = trpc.useMutation(['user.disconnectUser']);
    const handleClick = {
        DesconectarUsuario: (e:React.MouseEvent<HTMLButtonElement>) => {
            DesconectarUsuario.mutate(undefined,{
                onSuccess: () => {
                    window.location.reload();
                }
            })
        }
    }   
    return (
        <div className='navbar bg-base-300'>
            <div className="flex-1">
                <Link href='/' >
                    <button className="btn btn-ghost normal-case text-xl">
                        JustChatting
                    </button>
                </Link>
            </div>
            {!Session && (
                    <div className="flex-none">
                    <ul className="menu menu-horizontal p-0">
                        {Page !== 'Login' && (
                            <li><Link href='/Login'>Login</Link></li>
                        )}
                        {Page !== 'Registrar' && (
                            <li><Link href='/Registrar'>Registrar</Link></li>
                        )}
                    </ul>
                </div>
            )}
            {Session && (
                <div className="flex-none gap-2">
                    <div className="form-control">
                        <input type="text" placeholder="Search" className="input input-bordered" />
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <Image alt="" src="https://placeimg.com/80/80/people" height={40} width={40}/>
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                            {Page !== 'Profile' && (
                                <li>
                                    <Link href='/Profile'>Profile</Link>
                                </li>
                            )}
                            {Page !== 'MeuServer' && (
                                <li>
                                    <Link href={`server/${Session}`}>Meu server</Link>
                                </li>
                            )}
                            <li><button onClick={(e) => handleClick.DesconectarUsuario(e)}>Desconectar</button></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;