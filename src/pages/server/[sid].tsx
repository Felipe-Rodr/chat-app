import { getCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react'
import Header from '../../components/Header';
import ServerPage from '../../components/ServerPage';

interface ServerProps {
  Session: string,
}

const Server = ({Session}:ServerProps) => {
  const router = useRouter();
  const { sid } = router.query as { sid:string }
  return (
    <div data-theme='forest' className='flex flex-col w-screen h-screen'>
      <Header Session={Session} Page={sid === Session ? 'MeuServer' : null}/>
      <ServerPage Session={Session} sid={sid} isServerOwner={Session === sid ? true : false}/>
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

export default Server;