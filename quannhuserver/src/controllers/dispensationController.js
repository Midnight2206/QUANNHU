import Criterion from "../configs/mongoDB/criterion";

class dispensationController {
    async render(req, res, next) {
        
        try {
            const CCD = req.query.CCD
            const year = req.query.year
            Criterion.findOne({year})
                .then (criterion => {
                    res.status(200).json(criterion.data[CCD])
                    console.log(criterion.data[CCD])
                })
                .catch (next)
           
        } catch (error) {
            console.log(error)
        } 

    }
}

module.exports = new dispensationController()