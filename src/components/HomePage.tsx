import Link from 'next/link'
import React from 'react'
import { trpc } from '../utils/trpc'

interface HomePageProps {
    Session: string | null
}

const HomePage = ({Session}:HomePageProps) => {
    if(!Session){
        return (
            <div className='hero h-full bg-base-200'>
                <div className='hero-content text-center'>
                    <div className='max-w-md'>
                        <h1 className='mb-5 text-5xl font-bold'>JustChatting</h1>
                        <Link href={Session ? `/server/${Session}` : '/Login'}>
                            <button className='btn btn-primary'>
                                Começar
                            </button>
                        </Link>
                    </div>
                </div>
            </div>   
        )
    }
    const Servers = trpc.useQuery(['user.findUserServers',{
        uid: Session
    }],{
        staleTime:Infinity,
        enabled:!!Session
    })
    console.log(Servers)
    return (
        <div className='grid grid-cols-[250px_500px] p-5'>
            <div className='flex flex-col h-full border border-primary rounded-lg items-center'>
                <ul className='w-full flex flex-col text-center p-2'>
                    Servers conectados:
                    {Servers.data && (
                        Servers.data.connectedToServers.map((Server,Index) => 
                            <div key={Index} className='bg-neutral rounded-lg m-1'>
                                <Link href={`server/${Server.belongsToUserId}`}>{Server.name}</Link>
                                <div className="dropdown">
                                    <label tabIndex={0} className="btn btn-circle btn-ghost btn-xs text-info">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </label>
                                    <div tabIndex={0} className="card compact dropdown-content shadow bg-base-100 rounded-box w-64">
                                        <div className="card-body">
                                             <p>Dono: {Server.belongsToUser.username}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default HomePage;