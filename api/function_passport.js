//-LOGIN
function postLogin (req, res) {
  //var user = req.user;
  res.sendFile(process.cwd() + '/public/index.html');
}
function postLogin (req, res) {
  let { username } = req.body
  req.session.username = username
  res.sendFile(process.cwd() + '/public/index.html');
}

function getLogin(req, res) {  
  if (req.isAuthenticated()) {
    //console.log('user logueado',req.user);
    res.render('tablas', {
      nombre: req.user.username
    });
  }
  else {
    console.log('user NO logueado');
    res.sendFile(process.cwd() + '/public/login.html');
  }
}


function getFaillogin (req, res) {
  console.log('error en login');
  res.render('login-error', {
  });
}

//-SIGNUP
function postSignup (req, res) {
  var user = req.user;
  res.sendFile(process.cwd() + '/public/signup.html');
}

function getSignup(req, res) {
    res.sendFile(process.cwd() + '/public/signup.html');
}

function getFailsignup (req, res) {
  console.log('error en signup');
  res.render('signup-error', {
  });
}

function getSignupSucessfull (req, res) {
  req.logout();
  res.sendFile(process.cwd() + '/public/login.html');

}

//-LOGOUT
function getLogout (req, res) {
  //let nombre = req.user.username;
  let { displayName} = req.user;
  //console.log('sssssssssaaa', displayName)
  let nombre = displayName//req.user.displayName
  req.logout();
  res.render("logout", {nombre})
}

module.exports = {
    getLogin,
    postLogin,
    getFaillogin,
    getLogout,
    getSignup,
    postSignup,
    getFailsignup,
    getSignupSucessfull
}
