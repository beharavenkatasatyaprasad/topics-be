const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { topics, userPreferences, userTypes, users } = require('../models');

const tokenForUser = (u) =>
  jwt.sign({ userId: u.id }, 'jshdafvbaskdjbvjksdab', {
    expiresIn: '1 day',
    mutatePayload: true,
  });

router.post('/register', async (req, res) => {
  try {
    let { name, userTypeId, email, phone, dob, gender, password } = req.body;

    if (!name || !userTypeId || !email || !gender || !phone || !dob || !password) {
      res.json({
        success: false,
        message: 'all fields are required!',
      });
      return;
    }

    let alreadyExists = await users.findOne({
      where: {
        email,
      },
    });

    if (alreadyExists) {
      res.json({
        success: false,
        message: `user already exists with ${email}!`,
      });
      return;
    }

    let created = await users.create({
      name,
      userTypeId,
      email,
      phone,
      dob,
      gender,
      password,
    });

    const token = tokenForUser(created);

    res.json({
      success: true,
      user: created,
      token,
    });
  } catch (error) {
    console.trace(error);
    res.json({
      success: false,
      error,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      res.json({
        success: false,
        message: 'all fields are required!',
      });
      return;
    }

    let alreadyExists = await users.findOne({
      where: {
        email,
      },
    });

    if (!alreadyExists) {
      res.json({
        success: false,
        message: `no user exists with ${email}!`,
      });
      return;
    }

    let validPassword = password === alreadyExists.password;
    if (!validPassword) {
      res.json({
        success: false,
        message: 'password incorrect!',
      });
      return;
    }
    alreadyExists = JSON.parse(JSON.stringify(alreadyExists));

    res.json({
      success: true,
      user: alreadyExists,
      token,
    });
  } catch (error) {
    console.trace(error);
    res.json({
      success: false,
      error,
    });
  }
});

router.get('/userTypes', async (req, res) => {
  try {
    let usertypes = await userTypes.findAll({});
    res.json({
      success: true,
      userTypes: usertypes,
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

router.get('/topics', async (req, res) => {
  try {
    res.json({
      success: true,
      topics: await topics.findAll({}),
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

router.post('/topics', async (req, res) => {
  try {
    let { label, description } = req.body;

    if (!label || !description) {
      res.json({
        success: false,
        message: 'all fields are required!',
      });
      return;
    }

    let alreadyExists = await topics.findOne({
      where: {
        label,
      },
    });

    if (alreadyExists) {
      res.json({
        success: false,
        message: 'topic already exists!',
      });
      return;
    }

    let created = await topics.create({
      name: label.toLowerCase().replaceAll(' ', '-'),
      label,
      description,
    });

    res.json({
      success: true,
      topics: await topics.findAll({}),
      newTopic: created,
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

router.post('/groupsForUser/:userId', async (req, res) => {
  try {
    let { userId } = req.params;

    let currentUser = await users.findOne({
      where: {
        id: userId,
      },
    });
    currentUser = JSON.parse(JSON.stringify(currentUser));

    let currentUserPreferences = await userPreferences.findAll({
      where: {
        userId,
      },
    });

    let usersWithPreferencesInJoinWithCurrentUser = await userPreferences.findAll({
      where: {
        topicId: { [Op.in]: currentUserPreferences.map((s) => s.topicId) },
        group: ['userId'],
      },
    });

    let usersWithPreferencesInJoin = [];
    for (let eachUser of usersWithPreferencesInJoinWithCurrentUser) {
      let userDetails = await users.findOne({
        where: {
          id: eachUser.userId,
        },
      });

      userDetails = JSON.parse(JSON.stringify(userDetails));

      if (userDetails.userTypeId === currentUser.userTypeId) continue;

      let userPreferences_ = await userPreferences.findAll({ where: { userId: userDetails.id } });
      userPreferences_ = JSON.parse(JSON.stringify(userPreferences_));

      let preferenceDetails = await topics.findAll({
        where: {
          id: { [Op.in]: userPreferences_.map((a) => a.topicId) },
        },
      });

      preferenceDetails = JSON.parse(JSON.stringify(preferenceDetails));

      usersWithPreferencesInJoin.push({ ...userDetails, preferenceDetails });
    }

    res.json({
      usersWithPreferencesInJoin,
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

router.post('/preferences/:userId', async (req, res) => {
  try {
    let { preferences } = req.body;
    let { userId } = req.params;

    await userPreferences.destory({ where: { userId } });

    for (let eachTopic of preferences) {
      await userPreferences.create({ topicId: eachTopic.id, userId });
    }

    res.json({
      success: true,
      preferences: await userPreferences.findAll({ where: { userId } }),
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

router.get('/preferences/:userId', async (req, res) => {
  try {
    let { userId } = req.params;
    res.json({
      success: true,
      preferences: await userPreferences.findAll({ where: { userId } }),
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

module.exports = router;
