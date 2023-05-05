import bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string) =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (recivedPassword: string, actualPassowrd: string) => {
    return await bcrypt.compare(recivedPassword, actualPassowrd);
}