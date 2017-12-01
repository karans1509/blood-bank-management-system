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
        path: '/manager',
        handler: (request, reply) => {
            reply.view('manager');
        }
    },
    {
        method: 'GET',
        path: '/manager/stock',
        handler: (request, reply) => {
            connection.query('Select * from stock', (err, results, fields) => {
                reply.view('manager-stock', { stocks: results });
            })
        }
    },
    {
        method: 'GET',
        path: '/manager/employees',
        handler: (request, reply) => {
            connection.query('Select * from employee', (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('manager-employees', { employees: results });
            })
        }
    },
    {
        method: 'GET',
        path: '/manager/search',
        handler: (request, reply) => {
            employeeNames = [];
            connection.query('Select distinct(empName) as empName from employee', (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                results.forEach(element => {
                    let item = {
                        empName: element.empName
                    }
                    employeeNames.push(item);
                });
                reply.view('manager-search', { employees: employeeNames });
            })
        }
    },
    {
        method: 'POST',
        path: '/manager/search',
        handler: (request, reply) => {
            if (request.payload.empName != '') {
                let name = request.payload.empName.trim().toLowerCase();
                name = "%" + name + "%";
                connection.query('Select * from employee where empName like ?', [name], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    reply.view('manager-search', { employees: employeeNames, emp: results });
                })
            }
            else if (request.payload.position != '') {
                let position = request.payload.position.trim();
                if (position == 'All') {
                    connection.query('Select * from employee', (err, results, fields) => {
                        if (err) {
                            console.log(err);
                        }
                        reply.view('manager-search', { employees: employeeNames, emp: results });
                    })
                }
                else {
                    connection.query('Select * from employee where position=?', [position], (err, results, fields) => {
                        if (err) {
                            console.log(err);
                        }
                        reply.view('manager-search', { employees: employeeNames, emp: results });
                    })
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/manager/requests',
        handler: (request, reply) => {
            connection.query('Select requestedBy, requestedBloodType, Date_Format(orderDate, "%Y-%m-%d") as orderDate, requestedUnits from orders where issued="Pending"', (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('manager-requests', { requests: results });
            })
        }
    },
    {
        method: 'POST',
        path: '/manager/requests',
        handler: (request, reply) => {
            connection.query('Select units from stock where bno=1 and bloodType=?', [request.payload.requestedBloodType], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                console.log(request.payload.requestedUnits);
                let remaining = parseInt(results[0].units);
                if (results[0].units >= parseInt(request.payload.requestedUnits)) {
                    connection.query('UPDATE orders SET issued="Yes", issuedOn=NOW() WHERE requestedBy=? and requestedBloodType=? and orderDate=?', [request.payload.requestedBy, request.payload.requestedBloodType, request.payload.orderDate], (err, results, fields) => {
                        if (err) {
                            console.log(err);
                        }
                        reply.redirect().location('/manager/requests')
                    })
                }
                else {
                    alert("Not enough units in the stock!");
                    reply.redirect().location('/manager/requests');
                }
            })
        }

    },
    {
        method: 'GET',
        path: '/manager/edit/{empId}',
        handler: (request, reply) => {
            let id = request.params.empId;
            connection.query('Select * from employee where empId=?', [id], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('manager-edit', { employee: results });
            })
        }
    },
    {
        method: 'POST',
        path: '/manager/edit/{empId}',
        handler: (request, reply) => {
            let id = request.params.empId;
            connection.query('UPDATE employee SET empName=?, empAddress=?, empPhone=?, empEmail=? WHERE empId=?', [request.payload.empName, request.payload.empAddress, request.payload.empPhone, request.payload.empEmail, id], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                alert('Data Modified!');
                reply.redirect().location('/manager/search');
            })
        }
    }]

