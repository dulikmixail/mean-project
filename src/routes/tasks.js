const router = require('express').Router();
const mongojs = require('mongojs');
const db = mongojs('mongo-db', ['tasks']);

router.get('/tasks', (req, res, next) => {
    db.tasks.find((err, tasks) => {
        if (err) return next(err);
        res.json(tasks);
    });
});

router.get('/tasks/:id', (req, res, next) => {
    db.tasks.findOne({ _id: mongojs.ObjectID(req.params.id) }, (err, task) => {
        if (err) return next(err);
        res.json(task);
    });
});

router.post('/tasks', (req, res, next) => {
    const task = req.body;
    if (!task.title || !(task.isDone + '')) {
        res.statusCode(400).json({
            error: 'Bad request'
        })
    } else {
        db.tasks.save(task, (err, task) => {
            if (err) return next(err);
            res.json(task);
        })
    }
});

router.delete('/tasks/:id', (req, res, next) => {
    db.tasks.delete({ _id: mongojs.ObjectID(req.param.id) }, (err, result) => {
        if (err) return next(err);
        res.json(result);
    })
});

router.put('/tasks/:id', (req, res, next) => {
    const task = req.body;
    const updateTask = {};
    if (task.isDone) {
        updateTask.isDone = task.isDone;
    }

    if (task.title) {
        updateTask.title = task.title;
    }

    if (!updateTask) {
        res.status(400).json({
            error: 'Bad Request'
        })
    } else {
        db.tasks.update({ _id: mongojs.ObjectID(req.param.id) }, updateTask, (err, result) => {
            if (err) return next(err);
            res.json(result);
        })
    }
})

module.exports = router;