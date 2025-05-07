import { useEffect } from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom"

export const Chat = ()=>{
	const {id} = useParams()
	const navigate = useNavigate()
	useEffect(() => {
		if (!id) {
		  const lastChatId = sessionStorage.getItem("lastChatId");
		  if (lastChatId) {
			navigate(`/chat/${lastChatId}`);
		  }
		} else {
		  sessionStorage.setItem("lastChatId", id);
		}
	  }, [id, navigate]);
	return id ? <Outlet/> :  <div className="bg-[#1B1B1B] flex-1 flex items-center max-md:hidden justify-center text-white text-2xl ">
	Welcome to Web Chat
  </div>
	
	
	
}