const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

const highlightMenu = () => {
  const elem = document.querySelector('.highlight');
  const homeMenu = document.querySelector('#home-page');
  const businessrulesMenu = document.querySelector('#businessrules-page');
  const inqueryMenu = document.querySelector('#inquery-page');
  const myordersMenu = document.querySelector('#myorders-page');
  const registerloginMenu = document.querySelector('#registerlogin-page');
  let scrollPos = window.scrollY;

  // adds 'highlight' class to my menu items
  if (window.innerWidth > 960 && scrollPos < 600) {
    homeMenu.classList.add('highlight');
    registerloginMenu.classList.remove('highlight');
    return;
  } 
   else if (window.innerWidth > 960 && scrollPos < 2345) {
    businessrulesMenu.classList.add('highlight');
    registerloginMenu.classList.remove('highlight');
    return;
  }
  else if (window.innerWidth > 960 && scrollPos < 1400) {
    registerloginMenu.classList.add('highlight');
    homeMenu.classList.remove('highlight');
    businessrulesMenu.classList.remove('highlight');
    return; }

  if ((elem && window.innerWIdth < 960 && scrollPos < 600) || elem) {
    elem.classList.remove('highlight');
  }
};
  
window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);
  
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

function register(event) {

    event.preventDefault();
    var form = event.target;

    var username = form.username.value;
    var password = form.password.value;
    var confirmPassword = form.confirmPassword.value;
    var firstName = form.firstName.value;
    var lastName = form.lastName.value;
    var email = form.email.value;
    var phone = form.phone.value;

    var registerInfo = {
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone

    };
    //Send the registration data to an API            
    fetch("http://localhost:32655/account/register", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerInfo)
    })
        .then((response) => response.json())
        .then(() => {

            swal("Successfuly registered! Please Login");
            location.reload();

        })
        .catch((error) => {

            console.log(error);

        });

}
function login(event) {
    event.preventDefault();

    var form = event.target;

    var username = form.username.value;
    var password = form.password.value;

    var loginInfo = {
        username: username,
        password: password
    };

    //Send the signIn Info to an API
    fetch("http://localhost:32655/account/signIn", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
    })
        .then((response) => response.json())
        .then((result) => {           
            localStorage.setItem("token", result.token);
            localStorage.setItem("username", result.userName);
            alert("Successfuly logged in! , Welcome " + result.userName);
            window.location.href = "/index.html";
        })
        .catch((error) => {
            console.log(error);
        });
}
function postOrder(event) {
    var form = event.target;
    event.preventDefault();
    var from = form.from.value;
    var to = form.to.value;
    var distance = form.distance.value;
    var livingarea = form.livingArea.value;
    var attic = form.attic.value;
    var basement = form.basement.value; 
    var piano = document.getElementById('piano').checked;   

    var orderInfo = {
        from: from,
        to: to,
        distance: distance,
        livingArea: livingarea,
        atticArea: attic,
        basement: basement,
        piano: piano
    }  

    fetch("http://localhost:32655/order", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(orderInfo)
    })
        .then((response) => response.json())
        .then((result) => {    
            
            var piano;            
            if (result.piano == 0)
                piano = 'Without Piano';
            else
                piano = 'With Piano';
           
            $('#orderId').text(result.orderId);
            $('#from').text(result.from);
            $('#to').text(result.to);
            $('#distance').text(result.distance);
            $('#livingArea').text(result.livingArea);
            $('#atticArea').text(result.atticArea);
            $('#basement').text(result.basement);
            $('#pianoStatus').text(piano);           
            $('.modal-footer').html("");
            $('.modal-footer').append('<button type="button" class="btn btn-default" onclick="acceptOrder(' + result.orderId+')">Accept</button>');
            $('.modal-footer').append('<button type="button" class="btn btn-default" onclick="rejectOrder(' + result.orderId + ')">Reject</button>');
            $('.modal-footer').append('<button type="button" class="btn btn-default" onclick="dismissModal()">Close</button>');
            $('#myModal').modal('toggle');
            alert("You made your order... The price is " + result.price + "!");           
        })
        .catch((error) => {           
            console.log(error);
        });
}
function getOrders() {
    fetch("http://localhost:32655/order", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    })
        .then((response) => response.json())
        .then((result) => {                     
            $.each(result, function (index, value) {
                var status;
                if (value["status"] == 0)
                    status = 'Pending';
                else if (value["status"] == 1)
                    status = 'Accepted';
                else
                    status = 'Rejected';
                $("tbody").append($("<tr>"));
                appendElement = $("tbody tr").last();
                appendElement.append($("<td>").html(value["orderId"]));
                appendElement.append($("<td>").html(value["price"]));
                appendElement.append($("<td>").html(status));
                appendElement.append($("<td>").html('<button type="button" class="btn btn-default" onclick="getOrderById(' + value["orderId"] + ')">Details</button>'));               
            });            
        })
        .catch((error) => {           
            console.log(error);
        });
}
function getOrderById(id) {
    fetch("http://localhost:32655/order/getById/" + id, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    })
        .then((response) => response.json())
        .then((result) => {           
            var status;
            var piano;
            if (result.Status == 0)
                status = 'Pending';
            else if (result.Status == 1)
                status = 'Accepted';
            else
                status = 'Rejected';
            if (result.Piano == 0)
                piano = 'Without Piano';
            else
                piano = 'With Piano';

            $('#orderId').text(result.OrderId);
            $('#from').text(result.From);
            $('#to').text(result.To);
            $('#distance').text(result.Distance);
            $('#livingArea').text(result.LivingArea);
            $('#atticArea').text(result.AtticArea);
            $('#basement').text(result.Basement);
            $('#piano').text(piano);
            $('#status').text(status);
            $('#firstName').text(result.Customer.FirstName);
            $('#lastName').text(result.Customer.LastName);
            $('#email').text(result.Customer.Email);
            $('#phone').text(result.Customer.Phone);
            $('.modal-footer').html("");          
            if (result.Status == 0) {
                $('.modal-footer').append('<button type="button" class="btn btn-default" onclick="acceptOrder(' + result.OrderId + ')">Accept</button>');
                $('.modal-footer').append('<button type="button" class="btn btn-default" onclick="rejectOrder(' + result.OrderId + ')">Reject</button>');
            }
            $('.modal-footer').append('<button type="button" class="btn btn-default" onclick="deleteOrder(' + result.OrderId + ')">Delete</button>');
            $('.modal-footer').append('<button type="button" class="btn btn-default" onclick="dismissModal()">Close</button>');
            $('#orderModal').modal('toggle');           
        })
        .catch((error) => {           
            console.log(error);
        });
}
function acceptOrder(id) {
    fetch("http://localhost:32655/order/confirmOrder?id=" + id + "&accepted=true", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => response.json())
        .then((result) => {                
            alert("You accepted the inquery offer , our team is coming to your address !!!");       
            dismissModal();     
            location.reload();
        })
        .catch((error) => {          
            console.log(error);
        });
}
function rejectOrder(id) {
    fetch("http://localhost:32655/order/confirmOrder?id=" + id + "&accepted=false", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => response.json())
        .then((result) => {                  
            alert("You rejected the inquery offer !!!");      
            dismissModal();    
            location.reload();
        })
        .catch((error) => {         
            console.log(error);
        });
}
function deleteOrder(id) {
    fetch("http://localhost:32655/order/" + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then((response) => response.json())
        .then((result) => {
            alert("You deleted the inquery offer !!!");
            dismissModal();
            location.reload();
        })
        .catch((error) => {
            console.log(error);
        });
}
function dismissModal() {
    $('#myModal').modal('hide');
    $('#orderModal').modal('hide');
}
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    alert("Successfuly Logged Out , Please Log In again to use our product !!!");
    window.location.href = "/index.html";
}
function getUsername() {
    if (localStorage.getItem("username") != null) {
        $('#navbar__logo').text('Hello ' + localStorage.getItem("username"));
        $("#navbar-menu").append('<li class="navbar__item"><a href="#" class="navbar__links" onclick="logout()">Logout</a></li>');
        $('#registerlogin-page').remove();
    }
    else {
        $('#inquery-page').remove();
        $('#myorders-page').remove();
    }
}


    

  