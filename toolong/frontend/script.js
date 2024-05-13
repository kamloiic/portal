document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayLinks();
});

function fetchAndDisplayLinks() {
    fetch('http://localhost:3000/links')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching links');
            }
            return response.json();
        })
        .then(links => {
            displayLinks(links);
        })
        .catch(error => {
            console.error('Error fetching links:', error);
        });
}

function deleteLink(linkId) {
    const listItem = document.getElementById(linkId);
    if (!listItem) {
        console.error('Error deleting link: Link not found on the webpage');
        return;
    }

    listItem.remove(); 
    saveDeletedLink(linkId); 
    console.log('Link deleted from webpage successfully');
}

function displayLinks(links) {
    const linkList = document.getElementById('linkList');
    linkList.innerHTML = '';

    links.forEach(link => {
        if (!isLinkDeleted(link._id)) {
            const listItem = document.createElement('li');
            listItem.id = link._id; 
            const titleLink = document.createElement('a');
            titleLink.textContent = link.title;
            titleLink.href = link.url;
            titleLink.target = "_blank";

            listItem.appendChild(titleLink);

            const spacer = document.createElement('span');
            spacer.textContent = ' ';

            listItem.appendChild(spacer); 

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                deleteLink(link._id);
            };

            listItem.appendChild(deleteButton);
            linkList.appendChild(listItem);
        }
    });
}

function addLink() {
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const type = document.getElementById('type').value;
    const tags = document.getElementById('tags').value.split(',');
    const author = document.getElementById('author').value;
    const duration = document.getElementById('duration').value;

    const link = {
        title: title,
        url: url,
        type: type,
        tags: tags,
        author: author,
        duration: duration
    };

    fetch('http://localhost:3000/links', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(link)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error adding link');
        }
        return response.json();
    })
    .then(data => {
        console.log('Link added successfully:', data);
        document.getElementById('title').value = '';
        document.getElementById('url').value = '';
        document.getElementById('type').value = '';
        document.getElementById('tags').value = '';
        document.getElementById('author').value = '';
        document.getElementById('duration').value = '';
        fetchAndDisplayLinks();
    })
    .catch(error => {
        console.error('Error adding link:', error);
    });
}

function saveDeletedLink(linkId) {
    const deletedLinks = getDeletedLinks();
    deletedLinks.push(linkId);
    localStorage.setItem('deletedLinks', JSON.stringify(deletedLinks));
}

function getDeletedLinks() {
    const deletedLinks = localStorage.getItem('deletedLinks');
    return deletedLinks ? JSON.parse(deletedLinks) : [];
}

function isLinkDeleted(linkId) {
    const deletedLinks = getDeletedLinks();
    return deletedLinks.includes(linkId);
}
