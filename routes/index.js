'use strict'

var Got = require('../models/got'),
    jwt    = require('jsonwebtoken'),
    config = require('../config'),
    router = require('express').Router();

// api endpoints starts here---------------------------------------------------------------------
// All apis starts with /api are secured by JWT token


// list api
router.get('/api/list', (req, res) => {
    Got.find({}, { _id: 0, location: 1 })
        .then((data) => {
            let result = data.map((obj) => { return obj.location });
            res.status(200).json(result);
        })
        .catch((err) => { console.error(err); res.status(500).json(err); })
});


// count api
router.get('/api/count', (req, res) => {
    Got.aggregate([
        { $group: { _id: null, battle_count: { $sum: 1 } } },
        { $project: { _id: 0, battle_count: 1 } }
    ])
        .then((result) => { res.status(200).json(result); })
        .catch((err) => { console.error(err); res.status(500).json(err); })
});


// stats api
router.get('/api/stats', (req, res) => {
    Got.aggregate([
        {
            $facet: {
                "attacker_outcome": [
                    { $sortByCount: "$attacker_outcome" },
                    { $project: { _id: 0, outcome: '$_id' , count: '$count'} }
                ],
                "battle_type": [
                    { $sortByCount: "$battle_type" },
                    { $project: { _id: 0, battle_type: '$_id' } }
                ],
                "most_active": [{
                    $group: {
                        _id: null,
                        name: { $max: '$name' },
                        region: { $max: '$region' },
                        attacker_king: { $max: '$attacker_king' },
                        defender_king: { $max: '$defender_king' }
                    }
                }, { $project: { _id: 0, name: 1, region: 1, attacker_king: 1, defender_king: 1 } }],
                "defender_size": [{
                    $group: {
                        _id: null,
                        max: { $max: '$defender_size' },
                        min: { $min: '$defender_size' },
                        average: { $avg: '$defender_size' }
                    }
                }, { $project: { _id: 0, max: 1 , min: 1, average: 1 } }]
            }
        }
    ])
        .then((result) => { res.status(200).json(result); })
        .catch((err) => { console.error(err); res.status(500).json(err); })
});


// search api
router.get('/api/search', (req, res) => {
    let query = [];
    let fields = { name: 1, attacker_king: 1, defender_king: 1, location: 1, battle_type: 1, _id: 0 };
    if (req.query.king) {
        let king = new RegExp(req.query.king, 'i');
        query.push({ $or: [{ 'attacker_king': king }, { 'defender_king': king }] });
    }
    if (req.query.location) {
        let location = new RegExp(req.query.location, 'i');
        query.push({ location: location });
    }
    if (req.query.type) {
        let type = new RegExp(req.query.type, 'i');
        query.push({ battle_type: type });
    }

    Got.find({ $and: query }, fields)
        .then((result) => { res.status(200).json(result); })
        .catch((err) => { console.error(err); res.status(500).json(err); })
});


//-------- JWT authentication written for single user only ------------//
// getToken api
router.post('/getToken', (req, res) => {
    let username = req.body.username, password = req.body.password;
    if (!username || !password) {
        res.json({ success: false, message: 'Authentication failed. User Details incomplete.' });
    }
    else if (username !== config.username || password !== config.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password and username.' });
    } 
    else {
        // create a token after correct credentials
        var payload = { username: config.username, password: config.password };
        var token = jwt.sign(payload, config.secret, {
            expiresIn: 3600
        });   // token expires in 1 hour
        res.json({
            success: true,
            message: 'Please use this token as Authorization header for APIs!',
            token: token
        });
    }
});



// module exports
module.exports = router;
