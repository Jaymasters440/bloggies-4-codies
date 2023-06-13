const router = require("express").Router();
const session = require("express-session");
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

        //const blogs = await Blog.findAll({plain: true});

        const blogData = await Blog.findAll({
            include: [{ model: User }, { model: Comment }],
            //raw:true
        });
        const blogs = blogData.map((blog) => blog.get({ plain: true }));

        //res.status(200).json(blogs);
        res.render('homepage', { blogs, logged_in: req.session.logged_in });
    }
    catch (err) {
        res.status(400).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    try {

        //const blogs = await Blog.findAll({plain: true});

        const blogData = await Blog.findAll({
            include: [{ model: User }, { model: Comment }],
            where: {
                user_id: req.session.user_id
            }
            //raw:true
        });
        const blogs = blogData.map((blog) => blog.get({ plain: true }));

        //res.status(200).json(blogs);
        res.render('dashboard', { blogs, logged_in: req.session.logged_in });
    }
    catch (err) {
        res.status(400).json(err);
    }
});


router.get('/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: { all: true, nested: true }
        });

        const blog = blogData.get({ plain: true });

        //if logged in user is author of blog, render page edit-blog
        if (req.session.logged_in && req.session.user_id == blog.user_id) {
            res.render('edit-blog', {
                ...blog,
                logged_in: req.session.logged_in
            });
        } else {
            res.render('view-blog', {
                ...blog,
                logged_in: req.session.logged_in
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/blog', async (req, res) => {
    try {


        // const blogs = await Blog.findByPk(req.params.id,{plain: true});
        //res.status(200).json(blogs);
        res.redirect('/');
    }
    catch (err) {
        res.status(400).json(err);
    }
});

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

router.get('/create', withAuth, (req, res) => {
    //authorization
    res.render('create-blog');
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

router.post('api/user/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.get('/api/user/' , async (req, res) => {
    try {
        const userData =await User.findAll({
            insclude: [{model: Blog}, {model: Comment }],
        });
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
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
            user_id: req.session.user_id,
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
            include: { all: true, nested: true },
        });

        if (!blogData) {
            res.status(404).json({ message: "No blog with that ID" });
        }
        res.status(200).json(blogData);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/api/blog/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            include: [{ model: User }, { model: Comment }],
        });
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);

    }
});

router.put('/api/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.update(req.body, {
            //textContent: req.body.textContent,
            where: { id: req.params.id },
            //title: req.body.title
        });

        res.status(200).json(blogData);

    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/api/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id);

        if (!blogData) {
            res.status(404).json({ message: "No blog found with that id" });
        }
        blogData.destroy();
        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//comment post, put, get, delete
router.post('/api/comment/', async (req, res) => {
    try {
        const dbCommentData = await Comment.create({
            user_id: req.session.user_id,
            content: req.body.textContent,
            blog_id: req.body.blog_id
        }

        );


        res.status(200).json(dbCommentData);

    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get('/api/comment/', async (req, res) => {
    try {
        const getAllComments = await Comment.findAll({
            include: [{ model: User }, { model: Blog }],
        });
        res.status(200).json(getAllComments);
    }
    catch (err) {
        res.status(500).json(err);
    }
}
)

router.get('/api/comment/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            include: [{ model: User }, { model: Blog }],
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
            res.status(404).json({ message: "No comment found with that id" });
        }
        commentData.destroy();
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;

