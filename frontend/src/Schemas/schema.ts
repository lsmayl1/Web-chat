import * as yup from "yup";

export const shema = yup.object({
  first_name: yup.string().required("Ad mütləqdir."),
  last_name: yup.string().required("Soyad mütləqdir."),
  username: yup
	.string()
	.trim()
	.min(3, "İstifadəçi adı ən az 3 simvol olmalıdır.")
	.required("İstifadəçi adı mütləqdir."),
  email: yup
	.string()
	.email("Xahiş edirik, düzgün e-poçt ünvanı daxil edin.")
	.required("E-poçt ünvanı mütləqdir"),

  password: yup.string().required("Şifrə mütləqdir."),
  confirm_password: yup
	.string()
	.oneOf([yup.ref("password")], "Şifrələr uyğun gəlmir.")
	.required("Şifrə təkrarı mütləqdir."),
});

