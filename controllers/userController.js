var router		 = require('express').Router(),
		passport   = require('passport'),
		Doctor		 = require('../models/doctor.js'),
		Med				 = require('../models/med.js'),
		Pharmacy	 = require('../models/pharmacy.js'),
		User 	 		 = require('../models/users.js');



//SIGNIN
router.get('/', function(req,res){
	res.locals.login = req.isAuthenticated();
	User.find({}, function(err,data){
			res.render('users/index.ejs', {info: data});
		})
})

router.put('/:id/json/meds/:medid', function(req,res){
	// User.findByIdAndUpdate(req.params.id, req.body, function(err,data){
	// 	console.log('you this boolean worked.')
	// 	res.redirect('/users/' + req.params.id);
		console.log('this boolean worked.');
		console.log('this is req.body: ', req.body);
		console.log('this is req.body.taken: ', req.body.taken);
		console.log('this is req.params.id: ', req.params.id);
		console.log('this is req.params.medid', req.params.medid); 
		var toggled = req.body.taken;
		console.log('this is toggled: ', toggled);
	User.update({_id: req.params.id, 'meds._id': req.params.medid}, {$set:{'meds.$.taken': req.body.taken}}, {$inc: {'meds.$.pillNum': -1}}, function(err, data){
		console.log('this is data: ', data);
		res.send(data);
	});


})


//SHOW
router.get('/:id', isLoggedIn, function(req,res){
	req.params.id == req.user.id ? res.locals.usertrue = true : res.locals.usertrue = false;
	User.findById(req.params.id, function(err,data){
		res.render('users/show.ejs', {info: data});
	})
})

//PROFILE
router.get('/:id/myprofile', function(req,res){
	res.locals.login = req.isAuthenticated();
	User.find({}, function(err,data){
		res.render('users/myprofile.ejs', {info: data})
	})
})


//DELETE
router.delete('/:id/myprofile', function(req,res){
	User.findByIdAndRemove(req.params.id, function(err, data){
		res.redirect('/users/');
	})
});

//=================================================
// AUTHENTICATION
//=================================================
// --SIGNUP
router.post('/', passport.authenticate('local-signup', { 
    failureRedirect: '/users' }), function(req, res) {
    res.redirect('/users/' + req.user.id);
});

//LOGIN
router.post('/login', passport.authenticate('local-login', { 
    failureRedirect: '/users' }), function(req, res) {
    res.redirect('/users/' + req.user.id);
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/users');
}

// LOGOUT
router.get('/', function(req,res){
	req.logout();
	res.redirect('/');
})


//===================================================
//ADD MEDS
//!!!CURRENT ISSUE: need a different route 
//for adding doctor or else it will push into meds and won't work 
router.post('/:id', function(req,res){
	var newMed = new Med(req.body);
	// console.log("This is the newMed: " + newMed);
	User.findById(req.params.id, function(err,data){
		data.meds.push(newMed);
		console.log("this is data.meds: " + data.meds);
		console.log("this is data.meds.taken: " + data.meds.taken);
		data.save(function(err,data){
			res.redirect('/users/' + req.params.id);
		})		
	})
});


//EDIT MEDS
router.put('/:id', function(req,res){
	// Med.findByIdAndUpdate(req.body.id, req.body, function(err,data){

	User.update({_id: req.user.id, 'meds._id': req.body.id}, {$set:{'meds.$.dosage': req.body.dosage}}, function(){
		res.redirect('/users/' + req.params.id);
	});
		

	// })
});

router.get('/:id/json', function(req,res){
	User.findById(req.params.id, function(err,data){
		res.send(data);
	})
})


router.get('/:id/json/meds', function(req,res){
	User.findById(req.params.id, function(err,data){
		res.send(data.meds);
	})
})


//ADD INFO TO PROFILE
router.put('/:id/myprofile', function(req,res){
	console.log("router about you has been reached.");
	console.log('this is req.body: ', req.body);
	User.findByIdAndUpdate(req.params.id, req.body, function(err,data){
		console.log(data);
		res.redirect('/users/' + req.params.id + '/profile');
	})
});

router.post('/:id/myprofile', function(req,res){
	var newDoc = new Doctor(req.body);
	// console.log("This is the newDoc: " + newDoc);
	User.findById(req.params.id, function(err,data){
		data.doctor.push(newDoc);
		// console.log("this is data.doctor: " + data.doctor);
		data.save(function(err,data){
			res.redirect('/users/' + req.params.id);
		})		
	})
});





// router.get('/:id/', function(req,res){
// 	User.findById(req.params.id, function(err,data){
// 		var currentTime = Date.now.getTime();
// 		console.log(currentTime);
// 		var lastTimeTaken = data.meds.takenTimes[0];
// 		console.log(lastTimeTaken);
// 		var frequency = data.meds.frequency.parseInt();
// 		console.log(frequency);
// 		if(currentTime + frequency >= data.meds.getTimestap()){
// 			data.meds.taken = false;
// 		}
// 	})
// });



module.exports = router;





