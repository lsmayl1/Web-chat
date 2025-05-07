export interface RegisterDto{
	email?:string,
	username?:string,
	first_name?:string,
	last_name?:string,
	password?:string,
	
}

export interface Error {
	data: {
	  message: string;
	};
  }

export interface FormErrors {
	email?:string,
	username?:string,
	first_name?:string,
	last_name?:string,
	password?:string,
	confirm_password?:string,
}

export interface LoginDto {
	username?:string,
	password?:string,
}

export interface Messages {
	id?:string,
	senderId?:string,
	receiverId?:string,
	content?:string,
	createdAt?:string | number,
}


export interface RequestMessageDto {
	receiver_id?:string,
	content?:string,
}

export interface ResponseMessageDto {
	success?:boolean,
	status?:boolean,
	message?:string,
	user:{
		user_id?:string,
		username?:string,
	},
	messages:Messages[],


}


export type Props = {
	className?: string;
  };