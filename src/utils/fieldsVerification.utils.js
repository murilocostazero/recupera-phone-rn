export function newDeviceFieldsVerification(brand, model, mainColor, imei) {
  if (brand.length < 3) {
    return {
      success: false,
      message: 'Marca não pode ter menos de 3 caracteres',
    };
  } else if (model.length < 3) {
    return {
      success: false,
      message: 'Modelo não pode ter menos de 3 caracteres',
    };
  } else if (mainColor.length < 3) {
    return {success: false, message: 'Cor inválida'};
  } else if (imei.length > 17 || imei.length < 15) {
    return {success: false, message: 'Número de IMEI inválido'};
  } else {
    return {success: true};
  }
}

export function institutionalSingupFieldsVerification(name, email, password, address, phone){
  if(name.length < 3){
    return {message: 'O nome não pode ter menos de 3 caracteres', success: false};
  } else if(email.length < 3 || email.includes('@') == false){
    return {message: 'Email inválido', success: false};
  } else if(password.length < 8){
    return {message: 'A senha não pode ter menos de 8 caracteres', success: false};
  } else if(address.length < 8){
    return {message: 'Endereço não pode ter menos de 8 caracteres', success: false};
  } else if(phone.length < 11){
    return {message: 'Número de telefone inválido', success: false};
  } else {
    return {success: true}
  }
}
