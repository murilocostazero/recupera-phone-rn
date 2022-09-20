export default function accountImageArray(imageName) {
  if (imageName.toLowerCase() == 'agent') {
    return require('../assets/images/police.png');
  } else if (imageName.toLowerCase() == 'institution') {
    return require('../assets/images/office-building.png');
  }
}
