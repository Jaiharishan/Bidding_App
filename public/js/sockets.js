const socket = io('http://localhost:3001')
socket.on('connection')
socket.emit('new-user')


// create the sender message
socket.on('comment', (room, data, user, index) => {
    
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


    document.querySelector("#" + room).appendChild(fullcomment);
    let countt = fullcomment.parentElement.childElementCount - 1;
    fullcomment.dataset.commentuser = room + countt;
    console.log(countt);
})



// to send the room and message to server
const sendMessage = (room, id, user) => {
    let data = document.querySelector('#' + id).value;

    document.querySelector('#' + id).value = '';
    console.log(room, id, user);

    let index = document.querySelector('#' + room).childElementCount - 1;
    console.log(index);
    socket.emit("comment", room, data, user, index);

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

    // update
    let liUpdate = document.createElement('li');
    let updateDiv = document.createElement('div');
    updateDiv.setAttribute('class', 'dropdown-item update');
    updateDiv.setAttribute('onclick', 'updateComment(this)');
    updateDiv.innerHTML = 'update';
    liUpdate.appendChild(updateDiv);

    // finish update
    let liFinishUpdate = document.createElement('li');
    let finishUpdateDiv = document.createElement('div');
    finishUpdateDiv.setAttribute('class', 'dropdown-item finish');
    finishUpdateDiv.setAttribute('onclick', 'finishUpdate(this)');
    finishUpdateDiv.setAttribute('data-commentname', user);
    finishUpdateDiv.setAttribute('data-comment', commentData);
    finishUpdateDiv.innerHTML = 'finish update';
    liFinishUpdate.appendChild(finishUpdateDiv);

    // delete
    let liDelete = document.createElement('li');
    let deleteDiv = document.createElement('div');
    deleteDiv.setAttribute('class', 'dropdown-item delete');
    deleteDiv.setAttribute('onclick', 'deleteComment(this)');
    deleteDiv.setAttribute('data-commentname', user);
    deleteDiv.setAttribute('data-comment', commentData);

    deleteDiv.innerHTML = 'delete';
    liDelete.appendChild(deleteDiv);

    ulMenu.appendChild(liUpdate);
    ulMenu.appendChild(liFinishUpdate);
    ulMenu.appendChild(liDelete);

    dropdownDiv.appendChild(comment);
    dropdownDiv.appendChild(ulMenu);


    fullcomment.appendChild(myuser);
    fullcomment.appendChild(dropdownDiv);

    document.querySelector("#" + room).appendChild(fullcomment);
    fullcomment.dataset.index = fullcomment.parentElement.childElementCount - 1;
}



// to enable editing to update the content
const updateComment = (elem) => {
    let updatingComment = elem.parentElement.parentElement.parentElement.parentElement;
    let index = updatingComment.dataset.index;
    updatingComment.setAttribute('contenteditable', 'true')
    console.log(index);
}



// to send the edited content to the server
const finishUpdate = (elem) => {
    let updatingComment = elem.parentElement.parentElement.parentElement.parentElement;

    updatingComment.setAttribute('contenteditable', 'false');

    let parent = updatingComment.parentElement

    let updatedComment = elem.parentElement.parentElement.parentElement.children[0].innerText;
    let index = updatingComment.dataset.index;
    let commentname = elem.dataset.commentname;
    let comment = elem.dataset.comment;

    console.log(commentname, updatedComment, comment, parent.id, index);
    socket.emit('update', commentname, updatedComment, comment, parent.id, Number(index));

}



// when server broadcasts update function
socket.on('update', (commentname, updatedComment, comment, room, index) => {
    let reqComment = document.querySelector(`[data-commentuser="${room + index}"]`)
    console.log(reqComment.children[1]);
    reqComment.children[1].textContent = updatedComment;
    console.log(reqComment, comment + commentname + index);
})



// to delete the comment on the client side and send the same to server
const deleteComment = (elem) => {
    console.log('process started')
    let deletingComment = elem.parentElement.parentElement.parentElement.parentElement;
    let parent = deletingComment.parentElement;
    
    let index = deletingComment.dataset.index;
    console.log(index);
    parent.removeChild(deletingComment);
    console.log('process done');
    
    let commentname = elem.dataset.commentname;
    let comment = elem.dataset.comment;
    console.log(index);
    socket.emit('delete', commentname, comment, parent.id, Number(index))
}



// get the broadcast response and deleting the same comment for all the users
socket.on('delete', (commentname, comment, room, index) => {
    console.log('room' + room + index);
    let parent = document.querySelector("#" + room);
    let reqComment = document.querySelector(`[data-commentuser="${room + index}"]`)
    console.log(reqComment, comment + commentname + index);
    parent.removeChild(reqComment);

})



// to update the bid value in the card
const updateTextInput = (val) => {
    let textbox = document.querySelector('.text-input');
    textbox.innerHTML = val;
}



// to get the bidding amount and send the same to the server
const getBids = (id, user) => {
    console.log('click happening', id);
    let bid = document.getElementById(id).value;
    console.log(bid)
    socket.emit('bids', bid, id, user);
    let display = document.querySelector('.' + id);
    display.innerHTML = Number(bid).toLocaleString();
}



// getting the broadcasted response and changing the bidvalue to all the users
socket.on('bids', (bid, id, user) => {
    document.querySelector('.' + id).innerHTML = Number(bid).toLocaleString();
    let bids = document.querySelector('.' + id + 'bids');
    bids.innerHTML = Number(bids.innerHTML) + 1
    let highestBidder = document.querySelector('.' + id + 'highest');
    highestBidder.innerHTML = user
})



// to get the current rating an send it to the server
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



// sends the rating to all the other users and updating avg rating
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