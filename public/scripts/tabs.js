function openVersion(evt, version) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
	tabcontent[i].style.display = "none"
    }
  
    tablinks = document.getElementsByClassName("tablinks");
    for (i=0; i < tablinks.length; i++) {
	tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(version).style.display = "block";
    evt.currentTarget.className += " active";
}

function todayNews(evt, version) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
	tabcontent[i].style.display = "none"
    }
  
    tablinks = document.getElementsByClassName("tablinks");
    for (i=0; i < tablinks.length; i++) {
	tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(version).style.display = "block";
    evt.currentTarget.className += " active";
}
