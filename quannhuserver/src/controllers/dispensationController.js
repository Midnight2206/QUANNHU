import Criterion from "../configs/mongoDB/criterion";
import fieldDisplayMapping from "../configs/mapping";

class dispensationController {
    async render(req, res, next) {
        
        try {
            const CCD = req.query.CCD
            const year = req.query.year
            Criterion.findOne({year})
                .then (criterion => {
                    res.status(200).json({ data: criterion.data[CCD], fieldDisplayMapping})
                })
                .catch (next)
           
        } catch (error) {
            console.log(error)
        } 

    }
}

module.exports = new dispensationController()