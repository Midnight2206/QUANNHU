class HomeController {
    show (req, res, next)  {
        res.render('home.ejs')
    };
    signup (req, res, next)  {
        return res.send('đâsdasd')
    }
}

module.exports = new HomeController()