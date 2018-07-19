'use strict'

var Got = require('../models/got'),
    router = require('express').Router();

// api endpoints starts here---------------------------------------------------------------------

// list api
router.get('/api/list', (req, res) => {
    Got.find({ 'name': new RegExp('Battle', 'i') }, { 'region': 1 })
        .then((result) => { res.status(200).json(result); })
        .catch((err) => { console.error(err); res.status(500).json(err); })
});


// count api
router.get('/api/count', (req, res) => {
    Got.aggregate([
        { $match: { 'name': new RegExp('Battle', 'i') } },
        {
            $group: {
                _id: null,
                battle_count: { $sum: 1 }
            }
        }
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
                    { $sortByCount: "$attacker_outcome" }
                ],
                "battle_type": [
                    { $sortByCount: "$battle_type" }
                ],
            },
            // $group: {
            //     _id: null,
            //     name: { $max: '$name' },
            //     region: { $max: '$region' },
            //     attck_count: { $max: '$attacker_king' },
            //     defend_count: { $max: '$defender_king' },
            //     max: { $max: '$defender_size' },
            //     min: { $min: '$defender_size' },
            //     avg_count: { $avg: '$defender_size' }
            // }
        }
    ])
        .then((result) => { res.status(200).json(result); })
        .catch((err) => { console.error(err); res.status(500).json(err); })
});


// search api
router.get('/api/search', (req, res) => {

    let king = new RegExp(req.query.king, 'i');
    let region = new RegExp(req.query.location, 'i');
    Got.find({
        $and: [{ $or: [{ 'attacker_king': king }, { 'defender_king': king }] },
        { location: region }]
    }, { name: 1, attacker_king: 1, defender_king: 1, location: 1 })
        .then((result) => { res.status(200).json(result); })
        .catch((err) => { console.error(err); res.status(500).json(err); })
});


module.exports = router;