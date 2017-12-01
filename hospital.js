const mysql = require('mysql');
const alert = require('alert-node');

let position = '';
let employeeNames = [];
let donorNames = [];

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bloodbankmanagement'
})

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("connected as id : " + connection.threadId);
});

module.exports = [
    {
        method: 'GET',
        path: '/hospital',
        handler: (request, reply) => {
            reply.view('hospital');
        }
    },
    {
        method: 'GET',
        path: '/hospital/request',
        handler: (request, reply) => {
            reply.view('hospital-request');
        }
    },
    {
        method: 'POST',
        path: '/hospital/request',
        handler: (request, reply) => {
            connection.query('INSERT INTO orders(bno, requestedBy, requestedBloodType, orderDate, issued, requestedUnits) VALUES (1, "Hospital A", ?, NOW(), "Pending", ?)', [request.payload.bloodType, request.payload.units], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.redirect().location('/hospital/submitted');
            })

        }
    },
    {
        method: 'GET',
        path: '/hospital/submitted',
        handler: (request, reply) => {
            connection.query('Select b_name, requestedBloodType, Date_Format(orderDate, "%Y-%m-%d") as orderDate, issued, requestedUnits from orders inner join bloodBank on orders.bno=bloodbank.bno where requestedBy="Hospital A" order by orderDate desc', (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('hospital-submitted', { requests: results });
            })
        }
    }]

