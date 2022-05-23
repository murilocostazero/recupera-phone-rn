import auth from '@react-native-firebase/auth';

export async function createUser(email, password) {
  let userCreated = null;
  await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      console.log('User account created & signed in!');
      userCreated = {
        success: true,
        message: 'Usuário criado e logado',
        user: user,
      };
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        userCreated = {success: false, message: 'Este email já está em uso'};
      } else if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        userCreated = {
          success: false,
          message: 'Este endereço de email é inválido',
        };
      } else if (error.code === 'auth/operation-not-allowed') {
        console.log('Email/password accounts are not enabled');
        userCreated = {
          success: false,
          message: 'Não é possível criar novas contas neste momento',
        };
      } else if (error.code === 'auth/weak-password') {
        console.log('Password is not strong enough');
        userCreated = {
          success: false,
          message: 'Esta senha não é forte o suficiente',
        };
      }
    });

  return userCreated;
}

export async function loginUser(email, password) {
  let loginResponse = null;
  await auth()
    .signInWithEmailAndPassword(email, password)
    .then(
      loginSuccess => (loginResponse = {success: true, response: loginSuccess}),
    )
    .catch(
      loginError =>
        (loginResponse = {
          success: false,
          message: 'Verifique os dados de login e tente novamente',
        }),
    );

  return loginResponse;
}
