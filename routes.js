const Joi = require('joi');
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

module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.view('index');
    }
},
{
    method: 'POST',
    path: '/',
    handler: (request, reply) => {
        position = request.payload.position;
        reply.redirect().location('/' + position);
    }
},
{
    method: 'GET',
    path: '/receptionist',
    handler: (request, reply) => {
        if (position != '') {
            connection.query('Select * from employee where position=?', [position], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('reception', { name: results[0].empName });
            })
        }
        else reply.redirect().location('/');
    }
},
{
    method: 'GET',
    path: '/receptionist/register',
    handler: (request, reply) => {
        // alert('Donor Added');
        reply.view('receptionist-register');
    }
},
{
    method: 'POST',
    path: '/receptionist/register',
    handler: (request, reply) => {
        connection.query('INSERT INTO donor(d_name, d_address, d_gender,bloodType, d_age, d_phone) VALUES (?, ?, ?, ?, ?, ?)', [request.payload.d_name, request.payload.d_address, request.payload.d_gender, request.payload.bloodType, request.payload.d_age, request.payload.d_phone], (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            alert('Donor added');
            reply.view('receptionist-register');
        })
    }
},
{
    method: 'GET',
    path: '/receptionist/add-donation',
    handler: (request, reply) => {
        let names = [];
        connection.query('Select concat(d_name, ", ", d_address) as d_name from donor', (err, results, fields) => {
            results.forEach(element => {
                let item = {
                    d_name: element.d_name
                }
                names.push(item);
            });
            reply.view('receptionist-add-donation', { donorNames: names });
        })
    }
},
{
    method: 'POST',
    path: '/receptionist/add-donation',
    handler: (request, reply) => {

        let str = request.payload.d_name.split(',');
        let name = str[0].trim();
        let address = str[1].trim();
        let bloodType = '';

        connection.query('Select donorId,bloodType from donor where d_name=? and d_address=?', [name, address], (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            console.log(results[0].donorId);
            bloodType = results[0].bloodType;
            console.log(bloodType);
            connection.query('INSERT INTO donation(donorId, donationDate, bloodType, units) VALUES (?, NOW(), ?, ?)', [results[0].donorId, results[0].bloodType, request.payload.units], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                connection.query('Update stock set units=units+? where bloodType=?', [request.payload.units, bloodType], (err, results, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    alert('Data Added!')
                    reply.redirect().location('/receptionist/previous-donations');
                })

            })
        })
    }
},
{
    method: 'GET',
    path: '/receptionist/previous-donations',
    handler: (request, reply) => {
        let donations = [];
        connection.query('SELECT don.donorId, d.d_name, Date_Format(don.donationDate, "%Y-%m-%d") as donationDate, don.bloodType, don.units  FROM donor d INNER JOIN donation don ON don.donorId = d.donorId Order by don.donationDate desc', (err, results, fields) => {
            results.forEach(donation => {
                let item = {
                    donorId: donation.donorId,
                    d_name: donation.d_name,
                    donationDate: donation.donationDate,
                    bloodType: donation.bloodType,
                    units: donation.units
                }

                donations.push(item);
            });
            reply.view('receptionist-previous-donations', { donationData: donations });
        })
    }
},
{
    method: 'GET',
    path: '/receptionist/donors',
    handler: (request, reply) => {
        donorNames = [];
        connection.query('Select distinct(d_name) as d_name from donor', (err, results, fields) => {
            results.forEach(element => {
                let item = {
                    d_name: element.d_name
                }
                donorNames.push(item);
            });
            reply.view('receptionist-donors', { donors: donorNames });
        })
    }
},
{
    method: 'POST',
    path: '/receptionist/donors',
    handler: (request, reply) => {

        let name = request.payload.d_name.trim();
        let bloodType = request.payload.bloodType.trim();
        let age = request.payload.d_age.trim();
        console.log(name + ','+bloodType+','+age);
        if(name == "") {
            name = 'null';
        }
        if(age == '') {
            age = -1000;
        }

        if (request.payload.option1.toLowerCase() == 'or' && request.payload.option2.toLowerCase() == 'or') {
           
            connection.query('Select * from donor where d_name like ? or bloodType=? or d_age=?', ["%" + name + "%", bloodType, age], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('receptionist-donors', { don: results });
            })
        }
        else if (request.payload.option1.toLowerCase() == 'or' && request.payload.option2.toLowerCase() == 'and') {
            connection.query('Select * from donor where d_name like ? or bloodType=? and d_age=?', ["%" + name + "%", bloodType, age], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('receptionist-donors', { don: results });
            })
        }
        else if (request.payload.option1.toLowerCase() == 'and' && request.payload.option2.toLowerCase() == 'or') {
            connection.query('Select * from donor where d_name like ? and bloodType=? or d_age=?', ["%" + name + "%", bloodType, age], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('receptionist-donors', { don: results });
            })

        }
        else if (request.payload.option1.toLowerCase() == 'and' && request.payload.option2.toLowerCase() == 'and') {
            connection.query('Select * from donor where d_name like ? and bloodType=? and d_age=?', ["%" + name + "%", bloodType, age], (err, results, fields) => {
                if (err) {
                    console.log(err);
                }
                reply.view('receptionist-donors', { don: results });
            })

        }
    }
},
{
    method: 'GET',
    path: '/receptionist/edit/{donorId}',
    handler: (request, reply) => {
        let id = request.params.donorId;
        connection.query('Select * from donor where donorId=?', [id], (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            reply.view('receptionist-edit', { donorId: id, d_name: results[0].d_name, d_address: results[0].d_address, d_phone: results[0].d_phone });
        })
    }
},
{
    method: 'POST',
    path: '/receptionist/edit/{donorId}',
    handler: (request, reply) => {
        let id = request.params.donorId;
        connection.query('UPDATE donor SET d_name=?, d_address=?, d_phone=? WHERE donorId=?', [request.payload.d_name, request.payload.d_address, request.payload.d_phone, id], (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            alert('Data Modified!');
            reply.redirect().location('/receptionist/donors');
        })
    }
},
{
    method: 'GET',
    path: '/receptionist/delete/{donorId}',
    handler: (request, reply) => {
        let id = request.params.donorId;
        connection.query('DELETE from donor WHERE donorId=?', [id], (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            alert('Doner Deleted!');
            reply.view('receptionist-delete', { message: "Donor with id = " + id + " deleted" });
        })
    }

},
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
},
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

