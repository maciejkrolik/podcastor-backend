const express = require('express');
const User = require('./../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/users/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }

});

router.get('/users/podcasts', auth, async (req, res) => {
    res.send(req.user.podcasts);
});

router.post('/users/addpodcast', auth, async (req, res) => {
    const podcast = {
        collectionId: req.body.collectionId,
        trackId: req.body.trackId,
        trackName: req.body.trackName,
        collectionName: req.body.collectionName,
        feedUrl: req.body.feedUrl,
        artworkUrl600: req.body.artworkUrl600
    };
    req.user.podcasts.push(podcast);
    await req.user.save();
    res.status(200).send();
});

router.delete('/users/podcasts/:id', auth, async (req, res) => {
    req.user.podcasts.pull({_id: req.params.id});
    await req.user.save();
    res.send();
});

router.get('/users/profile', auth, async (req, res) => {
    res.send(req.user)
});

router.post('/users/profile', auth, async (req, res) => {
    req.user.name = req.body.name;
    if (req.body.password !== '') {
        req.user.password = req.body.password;
    }
    await req.user.save();
    res.send();
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;