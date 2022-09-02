import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import React from 'react'
import Header from '../components/Header';
import RegistrarPage from '../components/RegistrarPage';

interface RegistrarProps {

}

const Registrar = ({}:RegistrarProps) => {
    return (
        <div data-theme='forest' className='flex flex-col w-screen h-screen'>
            <Header Session={null} Page='Registrar'/>
            <RegistrarPage/>
        </div>
    );
}

export const getServerSideProps:GetServerSideProps = async ({req,res}) => {
    const Session = getCookie('sessionJustChatting',{
        req:req,
        res:res
    });
    if(Session){
       return {
            redirect: {
                destination: '/',
                permanent: false
            }
       } 
    }
    return {
        props: {},
    }
}

export default Registrar;