const router = require("express").Router();
const { User, Blog, Comment } = require('../models');
const withAuth = require('../utils/auth');



//page rendering routes
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.findAll();
    res.render("homepage", blogs)
    }
    catch(err) {
        res.status(400).json(err);
    }
    
});




//login and logout
router.post('/api/user/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;

        }
        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are logged in!' });
        });
    } catch (err) {
        res.status(400).json(err);
    }
});


//user post, get
router.post('/api/user/', async (req, res) => {
    try {
        const dbUserData = await User.create({
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.loggedIn = true;

            res.status(200).json(dbUserData);
        });
    }
    catch (err) {

        res.status(500).json(err);
    }
});

//blog post, put, get, delete
router.post('/api/blog/', async (req, res) => {
    try {
        const dbBlogData = await Blog.create({
            user_id: req.body.user_id,
            textContent: req.body.textContent,
            title: req.body.title
        });

        res.status(200).json(dbBlogData);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/api/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [{ model: User }, { model: Comment}],
        });

        if (!blogData) {
            res.status(200).json(blogData);
        }
    }
        catch (err) {
            res.status(500).json(err);
        }
});

router.get('/api/blog/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            include: [{ model: User }, { model: Comment}],
        });
        res.status(200).json(blogData);
    }   catch (err) {
        res.status(500).json(err);

    }
});

router.put('/api/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.update({
            textContent: req.body.textContent,
            title: req.body.title    
        });
        
        res.status(200).json(blogData);
        
    }   catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/api/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id);
        
        if (!blogData) {
            res.status(404).json({message: "No blog found with that id"});
        }
        blogData.destroy();
        res.status(200).json(blogData);
    }   catch (err) {
        res.status(500).json(err);
    }
});

//comment post, put, get, delete
router.post('/api/comment/', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id);

        if (!commentData) {
            res.status(200).json(commentData);
        }
    }
        catch (err){
            res.status(500).json(err);   
        }
});

router.get('/api/comment/', async (req, res) => {
    try {
        const getAllComments = await Comment.findAll({
            include: [{ model: User }, { model: Blog}],
        });
        res.status(200).json(getAllComments);
    }
    catch (err){
        res.status(500).json(err);
    }
}
    )

router.get('/api/comment/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            include: [{ model: User }, { model: Blog}],
        });

        if (!commentData) {
            res.status(200).json(commentData);
        }
    }
        catch (err) {
            res.status(500).json(err);
        }
});

router.put('/api/comment/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id);

        if (!commentData) {
            res.status(200).json(commentData);
        }
    }
        catch (err) {
            res.status(500).json(err);
        }
});

router.delete('/api/comment/:id', async (req, res) => {
    try {
        const commentData = await Blog.findByPk(req.params.id);
        
        if (!commentData) {
            res.status(404).json({message: "No comment found with that id"});
        }
        commentData.destroy();
        res.status(200).json(commentData);
    }   catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;

