/*!
* Start Bootstrap - Freelancer v7.0.4 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
//

var fields = {};
var podcasts = {}
var podcasts_obj = {}
var baseItunesURL = 'https://itunes.apple.com/search?media=podcast'


async function get_clip_with_podcast_index(podcast_index,
  episode_index=-1, start_time=-1, duration=-1) {
  console.log('podcast '+String(podcast_index)+' episode '+String(episode_index)+' start:'+String(start_time)
  +' duration'+String(duration))

  episodes = await getPodcastEpisodes(podcast_index)

  if (episode_index === -1) {
    // get a random episode index
    episode_index = Math.floor(Math.random() * episodes.length);

  }

  // I need to pass episode
  let selectedURL = episodes[episode_index]['url']
  //let episode_name = episodes[episode_index]['title']

  let episode_name = selectedURL.split('/')[selectedURL.split('/').length-1]
  episode_name = episode_name.split('?')[0]
  let episode_title = episodes[episode_index]['title']
  let update_text = "<p>selected episode: " + episode_title + "</p><p>Now I'm processing a clip for you. Hang in there!</p>"
  document.getElementById("process_status").innerHTML = update_text

  console.log('url for extension:' + selectedURL)
  console.log('name for saving:' + episode_name)


  let clip_url = ''
  let form = new FormData();
  form.append('episode_url',selectedURL);
  form.append('episode_name',episode_name);
  if (start_time !== -1) {
    form.append('start_time',start_time);

  }
  if (duration !== -1) {
    form.append('duration',duration);

  }


  fetch('https://harvesting.ninja/process_rss', {
      method: 'POST',
      body: form
  })
      .then(function(response) {
          return response.text()
          document.getElementById("process_status").innerHTML = 'received clip'

      } )
      .catch(function(error) {

        document.getElementById("process_status").innerHTML = 'error! ' + error
        }
      )
      .then(function (text) {

        console.log(text)
        clip_url= text.replace(/\"/g, "")
        console.log(clip_url)
        document.getElementById("process_status")
        .innerHTML = '<a href="'+clip_url+'"" target="_blank">Click here for the clip!</a>'


      }).then(function () {
        window.open(clip_url, '_blank')
      })
}

function handleError() {
  return
}


async function getPodcastEpisodes(podcast_index, detail=false) {
  RSS_URL = podcasts_obj[podcast_index]['feedUrl']
  document.getElementById("process_status").innerHTML = 'getting ' + RSS_URL
  // for a random element
  //const randomElement = array[Math.floor(Math.random() * array.length)];
  // then I send that link to the server to give me a clip
  console.log(RSS_URL)

  wrapper_url = 'https://harvesting.ninja/cors_workaround?destination='
  final_url = wrapper_url + RSS_URL
  console.log(final_url)

  var episodes = await fetch(final_url)

  .then(response => response.text())
  .catch(function(error) {
                console.log(error)
                document.getElementById("process_status").innerHTML = 'error ' + error;
                throw error
              })
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);
    document.getElementById("process_status").innerHTML = 'got data'
    rssns = 'http://www.w3.org/2005/Atom'

    const rss = data.querySelector("rss")
    // I'm trying to get at the namespace in the rss target
    // but that itself means I need the namespace of xmlns
    // which isn't working!
    console.log(rss.hasAttributeNS(rssns, 'itunes' ))


    const channel = data.querySelector("channel")
    console.log('channel')
    //console.log(channel)
    const items = channel.querySelectorAll("item");
    console.log('items')
    //console.log(items)
    var episodes_inner = []
    var ns = 'http://www.itunes.com/dtds/podcast-1.0.dtd';

    items.forEach(el => {
      //console.log(el.querySelector("title"))
      console.log(el)
      console.log(el.hasAttributeNS(ns, 'duration' ))
          episodes_inner.push({url: el.querySelector("enclosure").getAttribute('url'),
                               title: el.querySelector("title").firstChild.nodeValue,
                               duration: el.getAttributeNS(ns, 'duration' )
                             })
        })


    return episodes_inner
  })
  console.log(episodes)
return episodes
}

function genlookalikes(podcast_index) {
  document.getElementById("process_status").innerHTML = 'getting your lookalikes, be right back!';

  let podcast_string = JSON.stringify(podcasts_obj[podcast_index])
  let podcasts_string = JSON.stringify(podcasts_obj)
  let form = new FormData();
  console.log('getting lookalikes for ' + podcast_string)
  form.append('podcasts_json',podcasts_string);
  form.append('podcast', podcast_string);

  fetch('https://harvesting.ninja/get_podcast_lookalikes', {
      method: 'POST',
      body: form
  })
      .then(function(response) {
          receipt = response.json()
          //console.log(receipt)
          return receipt

      } )
      .catch(function(error) {
        console.log("there was an error")
        console.log(error)
        }
      ).then(function(response) {
        podcasts_obj = response//JSON.parse(response)
        $('#modal1').modal('hide');
        showsModal()

      })



  }

async function getPodcasts(params) {

  return $.ajax({
      url: baseItunesURL + params,
      dataType: "jsonp",
      success: function( response ) {
          for (var member in podcasts_obj) delete podcasts_obj[member]

          podcasts_obj = response.results;
          console.log(podcasts_obj)
        }

      }
    );

}


async function savePodcasts() {

  console.log('saving podcasts')
  let form = new FormData();
  const podcasts_JSON = JSON.stringify(podcasts_obj);

  form.append('podcasts_json',podcasts_JSON);


  fetch('https://harvesting.ninja/receive_podcast_list', {
      method: 'POST',
      body: form
  })
      .then(function(response) {
          return response.text()
          console.log('sent the file')

      } )
      .catch(function(error) {
        console.log("there was an error")
        console.log(error)
        }
      )

}

async function searchPodcasts() {

      //https://itunes.apple.com/search?
      var term = '&term=' + document.getElementById("selected_podcast").value

      var limit = '&limit=10'
      term = term.replace(' ', '+')
      var params = term + limit
      console.log(baseItunesURL + params)

      //const myNode = document.getElementById("search results");
    //  while (myNode.firstChild) {
      //  myNode.removeChild(myNode.lastChild);
      //}

        await getPodcasts(params)
    }


function toggleText() {
  let buttonID = event.target.id;
  // Get all the elements from the page
  let targetID = elID + "_toggle_text"

  var showMoreText =
      document.getElementById(targetID);

  var buttonText =
      document.getElementById(elID);

  // to be displayed is already set to
  // 'none' (that is hidden) then this
  // section of code triggers
  if (showMoreText.style.display === "none") {

      // Change the text on button to
      // 'Show More'
      buttonText.innerHTML = "Show More";
  }

  // If the hidden portion is revealed,
  // we will change it back to be hidden
  else {

      // Show the text between the
      // span elements
      showMoreText.style.display = "inline";

      // Change the text on button
      // to 'Show Less'
      buttonText.innerHTML = "Show Less";
  }

}

async function episodesModal(podcast_index) {

  console.log('modal show function')
  //console.log(podcasts_obj);

  getPodcastEpisodes(podcast_index).then(episodesObj=>{

      document.getElementById("process_status").innerHTML = '';

      const myNode = document.getElementById("results_table_container");
      while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
      }

      let table = document.createElement("table");

      table.setAttribute("class","table")
      let tbody = document.createElement('tbody');
      let td = document.createElement('td')

      table.appendChild(tbody);
      //let insert_text = ''
      let thead = table.createTHead();

      //let row = thead.insertRow();
      let th = document.createElement("th");
      let text = document.createTextNode('Name');
      th.appendChild(text);
      thead.appendChild(th)

      th = document.createElement("th");
      text = document.createTextNode('Duration');
      th.appendChild(text);
      thead.appendChild(th)

      th = document.createElement("th");
      text = document.createTextNode('Try Clip');
      th.appendChild(text);
      thead.appendChild(th)

      th = document.createElement("th");
      text = document.createTextNode('Link');
      th.appendChild(text);
      thead.appendChild(th)


      for (let k = 0; k < episodesObj.length; k++) {

        row = tbody.insertRow();
        row.setAttribute('vertical-align', 'middle')
        episode_name = episodesObj[k]['title']

        td = document.createElement('td')
        td.setAttribute('align', 'left')

        text = document.createTextNode(episode_name);
        td.appendChild(text);

        br = document.createElement('br')
        td.appendChild(br);
        row.appendChild(td);

        td = document.createElement('td')
        td.setAttribute('align', 'left')
        text = document.createTextNode(episodesObj[k]['duration']);
        td.appendChild(text);
        row.appendChild(td);

        td = document.createElement('td')
        td.setAttribute("class","btn-secondary")
        newlink = document.createElement('button');
        onclickfn = 'get_clip_with_podcast_index('+podcast_index+','+k+')'
        newlink.setAttribute('onclick', onclickfn);
        text = document.createTextNode('Try a clip!');
        newlink.appendChild(text);
        newlink.setAttribute('data-bs-dismiss', 'modal');
        td.appendChild(newlink);
        row.appendChild(td);

        td = document.createElement('td')
        td.setAttribute("class","btn-secondary")
        newlink = document.createElement('button');
        newlink.setAttribute('href', episodesObj[k]['url']);
        newlink.setAttribute('target', '_blank');
        newlink.setAttribute('data-bs-dismiss', 'modal');
        text = document.createTextNode('Play it!');
        newlink.appendChild(text);
        td.appendChild(newlink);
        row.appendChild(td);


      }

      document.getElementById('results_table_container').appendChild(table)
      document.getElementById('above_text').innerHTML = '<br>'
    console.log('showing modal?')
    $('#modal1').modal('show');

  })
  }

  //$('#modal1').on('show.bs.modal', function (event) {
async function showsModal() {
        var term = '&term=' + document.getElementById("selected_podcast").value

        var limit = '&limit=10'
        term = term.replace(' ', '+')
        var params = term + limit
        console.log(baseItunesURL + params)

        //const myNode = document.getElementById("search results");
      //  while (myNode.firstChild) {
        //  myNode.removeChild(myNode.lastChild);
        //}
        console.log('modal show function')
        console.log(podcasts_obj);

        getPodcasts(params).then(result=>{
            document.getElementById("process_status").innerHTML = '';

            savePodcasts()
            console.log(podcasts_obj);

            //var button = $(event.relatedTarget) // Button that triggered the modal
            //var recipient = button.data('whatever') // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

            const myNode = document.getElementById("results_table_container");
            while (myNode.firstChild) {
              myNode.removeChild(myNode.lastChild);
            }

            let table = document.createElement("table");

            table.setAttribute("class","table")
            let tbody = document.createElement('tbody');
            let td = document.createElement('td')

            table.appendChild(tbody);
            //let insert_text = ''
            let thead = table.createTHead();

            //let row = thead.insertRow();
            let th = document.createElement("th");
            let text = document.createTextNode('Name');
            th.appendChild(text);
            thead.appendChild(th)

            th = document.createElement("th");
            text = document.createTextNode('Get Clip!');
            th.appendChild(text);
            thead.appendChild(th)

            th = document.createElement("th");
            text = document.createTextNode('Subscribe!');
            th.appendChild(text);
            thead.appendChild(th)

            th = document.createElement("th");
            text = document.createTextNode('Get More!');
            th.appendChild(text);
            thead.appendChild(th)

            th = document.createElement("th");
            text = document.createTextNode('Specify Episode!');
            th.appendChild(text);
            thead.appendChild(th)

            for (let i = 0; i < podcasts_obj.length; i++) {

              row = tbody.insertRow();
              row.setAttribute('vertical-align', 'middle')
              podcast_name = podcasts_obj[i]['collectionName']
              td = document.createElement('td')
              td.setAttribute('align', 'left')

              text = document.createTextNode(podcast_name);
              td.appendChild(text);

              br = document.createElement('br')
              td.appendChild(br);

              //"http://rss.acast.com/coffeebreakspanish"
              moreText = document.createElement('a')
              moreText.setAttribute('href', podcasts_obj[i]['collectionViewUrl']);
              moreText.setAttribute('target', '_blank');

              moreText.innerHTML = 'by: ' +podcasts_obj[i]['artistName']
              td.appendChild(moreText);
              //moreText.setAttribute('id', 'cast_text_id_'+i+'_toggle_text');
              //moreText.innerHTML =podcasts_obj[i]['description']
              //moreText.setAttribute('display', 'none')
              //td.appendChild(moreText);

              row.appendChild(td);
              // buttons

              td = document.createElement('td')
              td.setAttribute("class","btn-secondary")
              newlink = document.createElement('button');
              onclickfn = 'get_clip_with_podcast_index('+i+')'
              newlink.setAttribute('onclick', onclickfn);
              text = document.createTextNode('Try a clip!');
              newlink.appendChild(text);
              newlink.setAttribute('data-bs-dismiss', 'modal');
              td.appendChild(newlink);
              row.appendChild(td);

              td = document.createElement('td')
              td.setAttribute("class","btn-secondary")
              newlink = document.createElement('button');
              newlink.setAttribute('href', podcasts_obj[i]['collectionViewUrl']);
              newlink.setAttribute('target', '_blank');
              newlink.setAttribute('data-bs-dismiss', 'modal');
              text = document.createTextNode('Subscribe!');
              newlink.appendChild(text);
              td.appendChild(newlink);
              row.appendChild(td);


              td = document.createElement('td')
              td.setAttribute("class","btn-secondary")
              newlink = document.createElement('button');
              onclickfn = 'genlookalikes('+i+')'
              newlink.setAttribute('onclick', onclickfn);
              newlink.setAttribute('data-bs-dismiss', 'modal');

              text = document.createTextNode('Podcasts Like This!');
              newlink.appendChild(text);
              td.appendChild(newlink);
              row.appendChild(td);

              td = document.createElement('td')
              td.setAttribute("class","btn-secondary")
              newlink = document.createElement('button');
              onclickfn = 'episodesModal('+i+')'
              newlink.setAttribute('onclick', onclickfn);
              newlink.setAttribute('data-bs-dismiss', 'modal');

              text = document.createTextNode('See Episodes!');
              newlink.appendChild(text);
              td.appendChild(newlink);
              row.appendChild(td);


            }

            document.getElementById('results_table_container').appendChild(table)
            document.getElementById('above_text').innerHTML = '<br>'

          //})
          $('#modal1').modal('show');
      })
      }







function isNotEmpty(value) {
 if (value == null || typeof value == 'undefined' ) return false;
 return (value.length > 0);
}


function isEmail(email) {
 let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
 return regex.test(String(email).toLowerCase());
}


function fieldValidation(field, validationFunction) {
 if (field == null) return false;

 let isFieldValid = validationFunction(field.value)
 if (!isFieldValid) {

   // I have a different class for this

 field.className = 'placeholderRed';
 } else {
 field.className = '';
 }

 return isFieldValid;
}


function sendContact() {
if (isValid()) {
  // activate the successful element
  let form = new FormData();
  form.append('name',fields.name);
  form.append('email',fields.email);
  form.append('message',fields.message);

  fetch('https://harvesting.ninja/contact_form', {
      method: 'POST',
      body: form
  })
      .then(function(response) {
          return response.text()
          document.getElementById("process_status").innerHTML = 'received clip'

      } )
      .catch(function(error) {
        console.log(error)
        document.getElementById("process_status").innerHTML = 'error! ' + error
        }
      )
      .then(function (text) {

        console.log(text)
        clip_url= text.replace(/\"/g, "")

      }).then(function () {
        window.open(clip_url, '_blank')

      })


}

}


function isValid() {
  var valid = true;
  valid &= fieldValidation(fields.name, isNotEmpty);
  valid &= fieldValidation(fields.email, isEmail);
  valid &= fieldValidation(fields.message, isNotEmpty);

}


window.addEventListener('DOMContentLoaded', event => {

  // load up the form fields
  fields.name = document.getElementById('name');
  fields.email = document.getElementById('email');
  fields.phone = document.getElementById('phone');
  fields.message = document.getElementById('message');


    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 50,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
