import { notifications } from "@mantine/notifications";
import IUserData from "../../types/User";

function validateUser(user: IUserData) {
    const validateValueMap = {
    salary: {
        validate: user.salary > 2147483647 || user.salary < -2147483647,
        message: `Gaji tidak boleh lebih dari 2147483647`
    },
    name: {
        validate: user.name.length > 100,
        message: `Panjang karakter nama tidak boleh lebih dari 100`
    },
    position: {
        validate: user.position.length > 50,
        message: `Panjang karakter jabatan tidak boleh lebih dari 50`
    },
    phone: {
        validate: user.phone.length > 20,
        message: `Panjang karakter no telepon tidak boleh lebih dari 20`
    },
    address: {
        validate: user.address.length > 50,
        message: `Panjang karakter alamat tidak boleh lebih dari 65.535`
    }
    }
    
    let isError = false;
    Object.keys(validateValueMap).forEach((validationKey) => {
        const validation = validateValueMap[validationKey as keyof typeof validateValueMap];
        if(validation.validate) {
            notifications.show({
            title: 'Nilai yang dimasukkan melebihi batas',
            message: validation.message,
            })
            isError = true;
        }
    })

    return isError;
} 

export default validateUser;