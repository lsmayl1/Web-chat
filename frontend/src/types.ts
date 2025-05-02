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