const {data, insertUser} = require('./dbhandler.js');
const {setUser, getUser} = require('./sessioninfo.js');

data().then(res => console.log(res));
insertUser('michaelhefner', 'password').then(res => {
    console.log(res);
    if (res.code === '23505') {
        console.log('Username already exists');
    } else {
        console.log('User successfully created');
        setUser(res.username);
    }
});
