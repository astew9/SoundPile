const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Account = require('../models/Account'),
    Sound = require('../models/Sound'),
    multer = require('multer'),
    mime = require('mime-types'),
    crypto = require('crypto'),
    fs = require('fs'),
    ObjectId = require('mongoose').Types.ObjectId;
;

const storage = multer.diskStorage({
  destination:  __dirname + './../public/uploads/',
  filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
       if (err) return cb(err);
       cb(null, raw.toString('hex') + '.' +  mime.extension(file.mimetype));
  });
}});

const uploading = multer(
    {
        storage: storage
    },
    {
        limits: {fileSize: 10000000, files:1}
    }
);

router.get('/', (req,res) => {
    return res.render('index', {
        user: req.user
    });
});
router.get('/login', (req, res) => {
    return res.render('login');
});
router.get('/register', (req,res) => {
    return res.render('register');
});

router.post('/register', uploading.single('profile_pic'), function(req, res) {
    Account.findOne({username:req.body.username}).then( (results) => {
        if(!results) {
            let newUser = new Account();
            newUser.username = req.body.username;
            newUser.password = newUser.generateHash(req.body.password);
            newUser.first_name = req.body.first_name;
            newUser.last_name = req.body.last_name;
            newUser.bio = req.body.bio;
            if(req.file) {
                newUser.profile_pic = "/uploads/"+req.file.filename;
            }
            newUser.save().then(() => {
                req.login(newUser, () => {
                    return res.redirect('/profile/' + newUser._id);
                });
            });
        } else {
            return res.send('Username already taken!');
        }
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.send(err);
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.send(err);
            }
            return res.redirect('/profile/' + user._id);
        })
    })(req, res, next);
});

router.get('/profile/:profileid', (req,res) => {
    if(!req.user) {
        return res.redirect('/login');
    }
    let id = req.params.profileid;
    Account
    .findOne({'_id': id})
    .populate('sounds')
    .then((profile) => {
        return res.render('profile', {
            user: req.user,
            profile: profile
        });
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/');
});

router.post('/add-sound', uploading.single('sound_file'), (req,res) => {
    if(!req.user) {
        return res.redirect('/login');
    }
    let newSound = new Sound({
        title: req.body.sound_title,
        soundURL: "/uploads/" + req.file.filename,
        uploader: req.user.id
    });
    newSound.save().then(() => {
        Account.findOne({_id: req.user.id}).then((acc) => {
            acc.sounds.push(newSound._id);
            acc.save().then(() => {
                return res.redirect('back');
            });
        });
    });
});
router.get('/remove/:soundid', (req,res) => {
    Sound
    .findOne({_id: req.params.soundid})
    .populate('uploader')
    .then((sound) => {
        if(req.user.id != sound.uploader._id) {
            return res.redirect('/');
        }
        fs.unlink(__dirname + '/../public'+ sound.soundURL, (err) => {
            if(err) {
                return res.send(err);
            }
            Account.findOne({_id: req.user.id}).then((acc) => {
                acc.sounds.remove(new ObjectId(req.params.soundid));
                acc.save().then(() => {
                    Sound
                    .remove({_id: req.params.soundid})
                    .then(() => {
                        return res.redirect('back');
                    })
                    .catch((err) => {
                        if(err) return res.send(err);
                    });
                });
            })
            .catch((err) => {
                if(err) return res.send(err);
            })
        });
    })
    .catch((err) => {
        if(err) return res.send(err);
    });
});

router.get('/browse', (req,res) => {
    if(!req.user) {
        return res.redirect('/login');
    }
    if(!req.query.search_field || req.query.search_field == "") {
        Sound
        .find({})
        .populate('uploader')
        .sort({'dateUploaded': -1})
        .then((sounds) => {
            return res.render('browse', {
                user: req.user,
                sounds: sounds
            });
        })
        .catch((err) => {
            return res.send(err);
        });
    } else {
        Sound
        .find({$text: {$search: req.query.search_field}})
        .populate('uploader')
        .sort({'dateUploaded': -1})
        .then((sounds) => {
            return res.render('browse', {
                user: req.user,
                sounds: sounds
            });
        })
        .catch((err) => {
            return res.send(err);
        })
    }

});
module.exports = router;
