import React, { useRef, useState } from 'react'
import { trpc } from '../utils/trpc';

interface ChatroomProps {
    uid: string,
    sid: string
}

const Chatroom = ({uid, sid}:ChatroomProps) => {
    const ctx = trpc.useContext();
    const [Message, setMessage] = useState('');
    const [MessageAlert, setMessageAlert] = useState('');
    const [MessageAlertClass, setMessageAlertClass] = useState(['','']);
    const MessageRef = useRef<HTMLInputElement>(null);
    const Messages = trpc.useQuery(['message.findAllMessages',{sid:sid}]);
    const CriarMessage = trpc.useMutation(['message.sendMessage'],{onSuccess: () => ctx.invalidateQueries(['message.findAllMessages'])});
    const handleSubmit = {
        CriarMessage: (e:React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
            e.preventDefault();
            if(Message !== ''){
                CriarMessage.mutate({
                    content: Message,
                    uid: uid,
                    sid: sid
                },{
                    onError: (error) => {
                        setTimeout(() => {
                            setMessageAlertClass(['',''])
                            setMessageAlert('');
                        },3000)
                        setMessageAlertClass(['alert alert-error shadow-lg', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                        setMessageAlert(error.message);
                        MessageRef.current?.focus();
                    },
                    onSuccess: (data) => {
                        setMessage('');
                    }
                })
            } else {
                setTimeout(() => {
                    setMessageAlertClass(['',''])
                    setMessageAlert('');
                },3000)
                setMessageAlertClass(['alert alert-error shadow-lg m-2', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z']);
                setMessageAlert('Mensagem não pode ser vazia.');
                setMessage('');
                MessageRef.current?.focus();
            }
            
        }
    }
    const handleChange = {
        Message: (e:React.ChangeEvent<HTMLInputElement>) => {
            setMessage(e.target.value);
        }
    }
    return (
        <div className='flex flex-col overflow-hidden justify-center items-center align-middle h-full w-full'>
            <div className='w-full h-full max-h-[36rem] max-w-xl border border-primary rounded overflow-y-auto'>
                {Messages.data && (
                    [...Messages.data].sort((a,b) => a.id - b.id).map((Message, Index) => 
                        <p key={Index} className={'ml-2 mt-2 p-1 w-fit max-w-[16rem] break-words rounded-lg bg-neutral' + (Message.sentFromUserId === uid? ' bg-primary' : '')}>{Message.sentFromUser.username}: {Message.content}</p>
                    )
                )}
            </div>
            <form className='form-control flex-row items-center w-full h-full max-h-[6rem] max-w-xl border border-primary rounded p-3' onSubmit={(e) => handleSubmit.CriarMessage(e)}>
                <input 
                    ref={MessageRef}
                    className='input input-bordered border-primary max-w-xs'
                    placeholder='Digite uma Messagem' 
                    value={Message}
                    onChange={(e) => handleChange.Message(e)}
                /> 
                <div className={MessageAlertClass[0]}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={MessageAlertClass[1]} /></svg>
                        <span>{MessageAlert}</span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Chatroom;