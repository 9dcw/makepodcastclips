/*!
* Start Bootstrap - Freelancer v7.0.4 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
//

var fields = {};

async function get_clip() {
  var elID = event.target.id;
  target_el = elID.replace('-button','')
  document.getElementById("process_status").innerHTML = elID;

  var RSS_URL = document.getElementById(target_el).value;
  console.log(RSS_URL)
  document.getElementById("process_status").innerHTML = 'getting ' + RSS_URL
  // for a random element
  //const randomElement = array[Math.floor(Math.random() * array.length)];
  // then I send that link to the server to give me a clip
  var episodes = [];

  fetch(RSS_URL)
  .then(response => response.text())
  .catch(function(error) {
                getElementById("process_status")
                .innerHTML = 'error ' + error;
                promise.reject(error)
              })
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);
    document.getElementById("process_status").innerHTML = 'got data'

    //console.log(data.querySelector("channel"))
    //console.log(data.querySelector("channel").querySelector("title"))
    //console.log(data.querySelector("channel").querySelector("description"))
    const items = data.querySelector("channel").querySelectorAll("item");

    items.forEach(el => {
      //console.log(el.querySelector("title"))
      episodes.push(el.querySelector("enclosure").getAttribute('url'))
      //console.log(el.querySelector("podcast: transcript").url)
        }
      )
    }).then(function () {

      var rndnum = Math.random()
      //console.log(rndnum)
      var rnd = Math.floor(Math.random() * episodes.length);
      let sel = episodes[rnd]
      clip_url = request_clip(sel)
      // then I need to pull up that clip!


    })
  }

function handleError() {
  return
}

var searchCounter;

function searchPodcasts() {

      //https://itunes.apple.com/search?
      var baseURL = 'https://itunes.apple.com/search?media=podcast&term='
      var params = document.getElementById("selected_podcast").value
      params = params.replace(' ', '+')
      console.log(baseURL + params)


      fetch(baseURL + params, {
          method: 'GET'

      })
          .then(function(response) {
              let json_response = response.text()
              console.log(json_response)

              return json_response

          } )
          .catch(function(error) {
            console.log(error)
            document.getElementById("process_status").innerHTML = 'error! ' + error
            }
          )
          .then(function (json) {

            console.log(json)

          })
        }

async function request_clip(download_url) {
  document.getElementById("process_status").innerHTML = 'selected episode'

  console.log(download_url)
  let clip_url = ''
  let form = new FormData();
  form.append('episode_url',download_url);

  fetch('https://harvesting.ninja/process_rss', {
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
        console.log(clip_url)
        document.getElementById("process_status")
        .innerHTML = '<a href="'+clip_url+'"" target="_blank">Click here for the clip!</a>'


      }).then(function () {
        window.open(clip_url, '_blank')
      })


  return clip_url
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
