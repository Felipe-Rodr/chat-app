import { getCookie, setCookie } from 'cookies-next'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React from 'react'
import Chatroom from '../components/Chatroom'
import Header from '../components/Header'
import HomePage from '../components/HomePage'

interface HomeProps {
  Session: string | null
}

const Home = ({Session}:HomeProps) => {
  
  return (
    <div data-theme='forest' className='flex flex-col w-screen h-screen'>
      <Header Session={Session} Page='Home'/>
      <HomePage Session={Session}/>
    </div>
  )
}

export const getServerSideProps:GetServerSideProps = async ({req,res}) => {
  let Session = getCookie('sessionJustChatting',{
    req:req,
    res:res
  });
  if(Session){
    return {
      props: {
        Session: Session
      },
    }
  }
  return {
    props:{

    }
  } 
}

export default Home
