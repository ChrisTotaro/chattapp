const title = document.getElementsByClassName('table-title')[0].textContent.trim();
const anchorTags = document.getElementsByTagName('li');

for (let i = 0; i < anchorTags.length; i++) {

    anchorTags[i].classList.remove('active');

    if (anchorTags[i].textContent == title)
    {
        anchorTags[i].classList.add('active');
    }
}

