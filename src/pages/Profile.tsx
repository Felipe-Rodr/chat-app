import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import React from 'react'
import Header from '../components/Header'
import ProfilePage from '../components/ProfilePage';

interface ProfileProps {
    Session: string
}

const Profile = ({Session}:ProfileProps) => {
    return (
        <div data-theme='forest' className='flex flex-col h-screen w-screen'>
            <Header Session={Session} Page='Profile'/>
            <ProfilePage Session={Session}/>
        </div>
    );
}

export const getServerSideProps:GetServerSideProps = async ({req,res}) => {
    let Session = getCookie('sessionJustChatting',{
        req:req,
        res:res
    });
    if(Session){
        return {
            props: {
            Session: Session,
            },
        }
    }
    return {
        redirect: {
            destination:'/Login',
            permanent: false
        }
    }
}

export default Profile;