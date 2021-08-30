var express = require('express'); //phai require thu vien express moi chay
var app = express(); //khai bao server
app.use(express.static("public")); //can file js, css nen khai bao the nay de all file trong public la khach hang truy cap duoc het

app.set("view engine", "ejs"); //
app.set("views", "./views");
var server = require('http').Server(app); //dựng server
var io = require('socket.io')(server);
server.listen(3000);

var mangUsers = [];

io.on("connection", function(socket) {
    console.log("Co nguoi ket noi " + socket.id);

    socket.on("client-send-Username", function(data) {
        if (mangUsers.indexOf(data) >= 0) { //>=0 chứng tỏ là có tìm thấy data trong mảng
            socket.emit("server-send-dki-thatbai");
        } else {
            mangUsers.push(data); //push ten nguoi dang ky vao mang
            socket.Username = data;
            socket.emit("server-send-dki-thanhcong", data);
            io.sockets.emit("server-send-danhsach-Users", mangUsers);
        }
    });

    socket.on("logout", function() {
        mangUsers.splice(
            mangUsers.indexOf(socket.Username), 1 //di vao trong manguser tim thang muon xoa va xoa 1 thang. do la chinh no
            //splice la cat di cai mang
        );
        socket.broadcast.emit("server-send-danhsach-Users", mangUsers); //cap nhat ds user moi cho all mn tru thang logout
    });

    socket.on("user-send-message", function(data) {
        io.sockets.emit("server-send-mesage", { un: socket.Username, nd: data });
    });

    socket.on("toi-dang-go-chu", function() {
        var s = socket.Username + " dang go chu";
        io.sockets.emit("ai-do-dang-go-chu", s);
    });

    socket.on("toi-stop-go-chu", function() {
        io.sockets.emit("ai-do-STOP-go-chu");
    });


});

app.get('/', function(req, res) {
    res.render('trangchu');
});