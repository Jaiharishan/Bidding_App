const socket = io('http://localhost:3001')
socket.on('connection')
socket.emit('new-user')

// create the sender message
socket.on('comment', (room, data, user) => {
    
    let fullcomment = document.createElement('div');
    fullcomment.setAttribute('class', 'm-1 align-self-start d-flex flex-column');

    let myuser = document.createElement('p');
    myuser.innerHTML = user; 
    myuser.setAttribute('class', 'm-0 align-self-start mx-2 mb-1');

    let comment = document.createElement('div');
    comment.setAttribute('class', 'btn btn-primary text-light');
    comment.innerHTML = data;

    fullcomment.appendChild(myuser)
    fullcomment.appendChild(comment)

    fullcomment.dataset.commentuser = comment.innerHTML + user;
    document.querySelector("#" + room).appendChild(fullcomment);
})


// to send the room and message to server
const sendMessage = (room, id, user) => {
    let data = document.querySelector('#' + id).value;

    document.querySelector('#' + id).value = '';
    console.log(room, id, user);

    socket.emit("comment", room, data, user);

}

// the message copy of the user
const createMessage = (room, id, user) => {
    console.log('execution works')
    let commentData = document.querySelector('#' + id).value;

    let fullcomment = document.createElement('div');
    fullcomment.setAttribute('class', 'm-1 align-self-end d-flex flex-column');

    let myuser = document.createElement('p');
    myuser.innerHTML = 'you'; 
    myuser.setAttribute('class', 'm-0 align-self-end mx-2 mb-1');


    // dropdown which contains all data
    let dropdownDiv = document.createElement('div');
    dropdownDiv.setAttribute('class', 'dropdown');

    let comment = document.createElement('button');
    comment.setAttribute('class', 'm-0 btn btn-primary text-light dropdown-toggle')
    comment.setAttribute('type', 'button');
    comment.setAttribute('data-bs-toggle', 'dropdown')
    comment.innerHTML = commentData;
    
    let ulMenu = document.createElement('ul');
    ulMenu.setAttribute('class', 'dropdown-menu');

    let liUpdate = document.createElement('li');
    let updateDiv = document.createElement('div');
    updateDiv.setAttribute('class', 'dropdown-item update');
    updateDiv.setAttribute('onclick', 'updateComment()');
    updateDiv.innerHTML = 'update';
    liUpdate.appendChild(updateDiv);

    let liDelete = document.createElement('li');
    let deleteDiv = document.createElement('div');
    deleteDiv.setAttribute('class', 'dropdown-item delete');
    deleteDiv.setAttribute('onclick', 'deleteComment(this, this.dataset.commentname, this.dataset.comment)');
    deleteDiv.setAttribute('data-commentname', user);
    deleteDiv.setAttribute('data-comment', commentData);

    deleteDiv.innerHTML = 'delete';
    liDelete.appendChild(deleteDiv);

    ulMenu.appendChild(liUpdate);
    ulMenu.appendChild(liDelete);

    dropdownDiv.appendChild(comment);
    dropdownDiv.appendChild(ulMenu);


    fullcomment.appendChild(myuser);
    fullcomment.appendChild(dropdownDiv);
    // fullcomment.appendChild(mycomment)


    document.querySelector("#" + room).appendChild(fullcomment);
}


// we need to create both update and delete functionality to our comment
const updateComment = () => {

}

const deleteComment = (elem, commentname, comment) => {
    console.log('process started')
    let deletingComment = elem.parentElement.parentElement.parentElement.parentElement;
    let parent = deletingComment.parentElement
    console.log('order is' + deletingComment.style.order);
    parent.removeChild(deletingComment);
    console.log('process done')
    socket.emit('delete', commentname, comment, parent.id)
}

socket.on('delete', (commentname, comment, room) => {
    let parent = document.querySelector("#" + room);
    let reqComment = document.querySelector(`[data-commentuser="${comment + commentname}"]`)
    parent.removeChild(reqComment);

})


const changeBid = () => {

}


const updateTextInput = (val) => {
    let textbox = document.querySelector('.text-input');
    textbox.innerHTML = val;
}

// bidding amounts
const getBids = (id, user) => {
    console.log('click happening', id);
    let bid = document.getElementById(id).value;
    console.log(bid)
    socket.emit('bids', bid, id, user);
    let display = document.querySelector('.' + id);
    display.innerHTML = Number(bid).toLocaleString();
}


socket.on('bids', (bid, id, user) => {
    document.querySelector('.' + id).innerHTML = Number(bid).toLocaleString();
    let bids = document.querySelector('.' + id + 'bids');
    bids.innerHTML = Number(bids.innerHTML) + 1
    let highestBidder = document.querySelector('.' + id + 'highest');
    highestBidder.innerHTML = user
})


// ratings
const getRating = (id, user, item) => {
    console.log('click happening', id);
    let rating = document.getElementById(id).value;
    console.log(rating)
    socket.emit('ratings', rating, id, user, item);
    let display = document.querySelector('.' + id);
    let allDisplay = document.querySelector('.' + id + 'all');

    let r5 = document.querySelector('.' + id + 'r5');
    let r4 = document.querySelector('.' + id + 'r4');
    let r3 = document.querySelector('.' + id + 'r3');
    let r2 = document.querySelector('.' + id + 'r2');
    let r1 = document.querySelector('.' + id + 'r1');
    let r0 = document.querySelector('.' + id + 'r0')

    if (rating == 5) {
        r5.innerHTML = Number(r5.innerHTML) + 1; 
    }else if (rating == 4) {
        r4.innerHTML = Number(r4.innerHTML) + 1;
    }else if (rating == 3) {
        r3.innerHTML = Number(r3.innerHTML) + 1; 
    }else if (rating == 2) {
        r2.innerHTML = Number(r2.innerHTML) + 1; 
    }else if (rating == 1) {
        r1.innerHTML = Number(r1.innerHTML) + 1; 
    }else if (rating == 0) {
        r0.innerHTML = Number(r0.innerHTML) + 1; 
    }else {
        r0.innerHTML = Number(r0.innerHTML) + 1;
    }

    let rat5 = Number(r5.innerHTML);
    let rat4 = Number(r4.innerHTML);
    let rat3 = Number(r3.innerHTML);
    let rat2 = Number(r2.innerHTML);
    let rat1 = Number(r1.innerHTML);
    let rat0 = Number(r0.innerHTML);

    let avgRating = (5 * rat5 + 4 * rat4 + 3 * rat3 + 2 * rat2 + 1 * rat1 + 0 * rat0) / (rat5 + rat4 + rat3 + rat2 + rat1 + rat0);

    avgRating = Math.round(avgRating * 10) / 10;

    console.log(avgRating);

    if (avgRating >= 4) {
        display.setAttribute('class', id + ' mt-2 h4 btn btn-success text-light')
        allDisplay.setAttribute('class', id + 'all' + ' h4 btn btn-success text-light')
    }else if (avgRating > 2.5) {
        display.setAttribute('class', id + ' mt-2 h4 btn btn-warning text-light')
        allDisplay.setAttribute('class', id + 'all' + ' h4 btn btn-warning text-light')
    }else {
        display.setAttribute('class', id + ' mt-2 h4 btn btn-danger text-light')
        allDisplay.setAttribute('class', id + 'all' + ' h4 btn btn-danger text-light')
    }

    display.innerHTML = avgRating + '/5';
    allDisplay.innerHTML = avgRating + '/5';
    
    console.log(display.innerHTML, id);
}



socket.on('ratings', (rating, id) => {

    let display = document.querySelector('.' + id);
    let allDisplay = document.querySelector('.' + id + 'all');
    
    let r5 = document.querySelector('.' + id + 'r5');
    let r4 = document.querySelector('.' + id + 'r4');
    let r3 = document.querySelector('.' + id + 'r3');
    let r2 = document.querySelector('.' + id + 'r2');
    let r1 = document.querySelector('.' + id + 'r1');
    let r0 = document.querySelector('.' + id + 'r0')

    if (rating == 5) {
        
        r5.innerHTML = Number(r5.innerHTML) + 1; 
    }else if (rating == 4) {
        
        r4.innerHTML = Number(r4.innerHTML) + 1;
    }else if (rating == 3) {
        
        r3.innerHTML = Number(r3.innerHTML) + 1; 
    }else if (rating == 2) {
        
        r2.innerHTML = Number(r2.innerHTML) + 1; 
    }else if (rating == 1) {
        
        r1.innerHTML = Number(r1.innerHTML) + 1; 
    }else if (rating == 0) {
        
        r0.innerHTML = Number(r0.innerHTML) + 1; 
    }else {

        r0.innerHTML = Number(r0.innerHTML) + 1;
    }

    let rat5 = Number(r5.innerHTML);
    let rat4 = Number(r4.innerHTML);
    let rat3 = Number(r3.innerHTML);
    let rat2 = Number(r2.innerHTML);
    let rat1 = Number(r1.innerHTML);
    let rat0 = Number(r0.innerHTML);

    let avgRating = (5 * rat5 + 4 * rat4 + 3 * rat3 + 2 * rat2 + 1 * rat1 + 0 * rat0) / (rat5 + rat4 + rat3 + rat2 + rat1 + rat0);

    avgRating = Math.round(avgRating * 10) / 10;

    if (avgRating >= 4) {
        display.setAttribute('class', id + ' mt-2 h4 btn btn-success text-light')
        allDisplay.setAttribute('class', id + 'all' + ' mt-2 h4 btn btn-success text-light')
    }else if (avgRating > 2.5) {
        display.setAttribute('class', id + ' mt-2 h4 btn btn-warning text-light')
        allDisplay.setAttribute('class', id + 'all' + ' mt-2 h4 btn btn-warning text-light')
    }else {
        display.setAttribute('class', id + ' mt-2 h4 btn btn-danger text-light')
        allDisplay.setAttribute('class', id + 'all' + ' mt-2 h4 btn btn-danger text-light')
    }

    display.innerHTML = avgRating + '/5';
    allDisplay.innerHTML = avgRating + '/5';
    console.log(display.innerHTML);
})