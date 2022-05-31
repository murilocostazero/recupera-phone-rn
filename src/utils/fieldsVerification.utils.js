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
