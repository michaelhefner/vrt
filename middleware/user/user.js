// const getUserGroupUUID = (req, res, next) => {

//     const user = req.oidc.user;
//     if (user !== null && user !== undefined) {
//         const userMatch = dbhandler.select
//             .query('users', '*', `WHERE uuid='${user.sub}' and email='${user.email}'`);
//         userMatch.then(results => {
//             if (results.length === 0) {
//                 const userGroup = uuidv4();
//                 dbhandler.insert
//                     .user(user.nickname, user.email, user.sub, userGroup)
//                     .then(response => console.log(response));
//             }
//         });
//         res.render("index", {
//             title: "Regression Testing",
//             active: 'Home',
//             user: req.oidc.user,
//         });
//     } else {
//         res.render('index', { title: 'Visual Regression Testing' });
//     }
// }

// module.exports = {getUserGroupUUID}