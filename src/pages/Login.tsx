import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import React from 'react'
import Header from '../components/Header';
import LoginPage from '../components/LoginPage';

interface LoginProps {

}

const Login = ({}:LoginProps) => {
    return (
        <div data-theme='forest' className='flex flex-col h-screen w-screen'>
            <Header Session={null} Page='Login'/>
            <LoginPage/>
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
                destination: `/server/${Session}`,
                permanent: false
            }
       } 
    }
    return {
        props: {},
    }
}

export default Login;