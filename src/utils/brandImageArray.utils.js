export default function brandImageArray(imageName) {
  if (imageName.toLowerCase() == 'apple') {
    return require('../assets/images/brands/apple.png');
  } else if (imageName.toLowerCase() == 'xiaomi' || imageName.toLowerCase() == 'redmi' || imageName.toLowerCase() == 'poco') {
    return require('../assets/images/brands/xiaomi.png');
  } else if (imageName.toLowerCase() == 'samsung') {
    return require('../assets/images/brands/samsung.png');
  } else if (imageName.toLowerCase() == 'motorola') {
    return require('../assets/images/brands/motorola.png');
  } else if (imageName.toLowerCase() == 'lg') {
    return require('../assets/images/brands/lg.png');
  } else {
    return require('../assets/images/brands/smarphone.png');
  }
}
