import connect from '../configs/model'
import Criterion from '../configs/mongoDB/criterion'
class criterionController {
    async render(req, res, next) {
        let connection
        try {
            const data = await Criterion.findOne({year: req.query.year})
            const tableName = req.query.year
            connection = await connect.listquantrang.getConnection();
            const [tables] = (await connection.query("SHOW TABLES"))
            const tableNames = tables.map(table => table['Tables_in_listquantrang'])
            const [columns] = await connection.query(`DESCRIBE \`${tableName}\``);
            const columnNames = columns.map(column => column.Field);
            const [CCD] = await connection.query(`SELECT DISTINCT \`PH CCĐ\` FROM \`${tableName}\``);
            const listCCD = CCD.map(item => item['PH CCĐ'])
            
            res.status(200).json({tableNames, columnNames, listCCD, data})
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'})
        } finally {
            if (connection) {
                connection.release();
            }
        }

    }
    async create(req, res, next) {
        try {
            // Lấy dữ liệu từ body request và query string
            const { year } = req.query;
            const data = req.body;
    
            // Tạo mới bản ghi trong cơ sở dữ liệu
            const newRecord = new Criterion({
                year,
                data,
            });
    
            // Lưu vào cơ sở dữ liệu
            await newRecord.save();
    
            res.status(201).json({ message: 'Record created successfully' });
        } catch (error) {
            console.error('Error creating record:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async update(req, res, next) {
        try {
            // Lấy dữ liệu từ body request và query string
            const { year } = req.query;
            const data = req.body;
            // Update dữ liệu
            Criterion.findOneAndUpdate({ year: year }, { $set: { data: data } }, { new: true })
            .then(() => res.status(201).json({ message: 'Record updated successfully' }))
            .catch(() => res.status(500).json({ error: 'Internal Server Error' }))
        } catch (error) {
            console.error('Error creating record:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
module.exports = new criterionController()