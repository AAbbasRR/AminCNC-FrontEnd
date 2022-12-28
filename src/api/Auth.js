export const RegisterAPI = (mobile_number, password, re_password) => ({
    method: 'post',
    url: 'user/api/register/',
    data: {
        mobile_number: mobile_number,
        password: password,
        re_password: re_password
    }
});

export const ActivateAccountAPI = (mobile_number, otp_code) => ({
    method: 'post',
    url: 'user/api/register/activate/',
    data: {
        mobile_number: mobile_number,
        otp_code: otp_code,
    }
});

export const ResendOTPCodeAPI = (mobile_number) => ({
    method: 'post',
    url: 'user/api/register/resend/',
    data: {
        mobile_number: mobile_number,
    }
});

export const LoginAPI = (mobile_number, password) => ({
    method: 'post',
    url: 'user/api/login/',
    data: {
        mobile_number: mobile_number,
        password:password
    }
});
