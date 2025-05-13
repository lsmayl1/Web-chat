export const setCookie = (name:string, value:string, days:number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (name:string) => {
  const match = document.cookie.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
};
export const saveTokenToCookie = (token:string) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);

  document.cookie = `access_token=${token}; expires=${expires.toUTCString()}; path=/`;
};
export const deleteTokenFromCookie = () => {
  document.cookie =
	"access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};

export const saveTokensToCookie = (accessToken:string, refreshToken:string) => {
  setCookie("access_token", accessToken, 1);
  setCookie("refresh_token", refreshToken, 30);
};

export const getAccessTokenFromCookie = () => {
  const token = getCookie("access_token");
  return token;
};

export const getRefreshTokenFromCookie = () => {
  const refreshToken = getCookie("refresh_token");
  return refreshToken;
};

const clearCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
	const eqPos = cookie.indexOf("=");
	const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
  });
};

export const deleteCookie = (
  refresh_token:string,
  access_token:string,
  redirectUrl = "/",
) => {
  try {
	if (access_token || refresh_token) {
	  document.cookie = `${access_token}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
	  document.cookie = `${refresh_token}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
	} else {
	  clearCookies();
	}

	if (redirectUrl) {
	  window.location.href = redirectUrl;
	} else {
	  window.location.reload();
	}
  } catch (error) {
	console.error("Cookie silinərkən səhv baş verdi:", error);
  }
};
